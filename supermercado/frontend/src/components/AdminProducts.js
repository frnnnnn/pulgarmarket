import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin'; // Importamos SidebarAdmin

function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Producto seleccionado para eliminar
  const [modalAbierto, setModalAbierto] = useState(false); // Estado del modal para eliminar
  const [modalFormulario, setModalFormulario] = useState(false); // Estado del modal para formulario
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    imagen: null,
    descripcion: '',
    slug: '',
  }); // Estado para manejar los datos del formulario

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/products/');
        setProductos(response.data);
      } catch (err) {
        setError('Error al cargar los productos.');
      }
    };

    fetchProductos();
  }, []);

  const generarSlug = (nombre, precio) => {
    return `${nombre}-${precio}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Reemplaza caracteres no válidos con guiones
      .replace(/(^-|-$)/g, '');    // Elimina guiones al inicio y final
  };

  const abrirFormulario = (producto = null) => {
    if (producto) {
      setNuevoProducto({
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        imagen: null, // No prellenamos imagen, ya que es un archivo
        descripcion: producto.descripcion,
        slug: producto.slug,
      });
      setProductoSeleccionado(producto);
    } else {
      setNuevoProducto({
        nombre: '',
        precio: '',
        stock: '',
        imagen: null,
        descripcion: '',
        slug: '',
      });
      setProductoSeleccionado(null);
    }
    setModalFormulario(true);
  };

  const cerrarFormulario = () => {
    setNuevoProducto({
      nombre: '',
      precio: '',
      stock: '',
      imagen: null,
      descripcion: '',
      slug: '',
    });
    setProductoSeleccionado(null);
    setModalFormulario(false);
  };

  const abrirModalEliminar = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModalEliminar = () => {
    setProductoSeleccionado(null);
    setModalAbierto(false);
  };

  const handleFileChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, imagen: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedProducto = { ...nuevoProducto, [name]: value };

    if (name === 'nombre' || name === 'precio') {
      updatedProducto.slug = generarSlug(updatedProducto.nombre, updatedProducto.precio);
    }

    setNuevoProducto(updatedProducto);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nuevoProducto.nombre);
    formData.append('precio', nuevoProducto.precio);
    formData.append('stock', nuevoProducto.stock);
    if (nuevoProducto.imagen) {
      formData.append('imagen', nuevoProducto.imagen);
    }
    formData.append('descripcion', nuevoProducto.descripcion);
    formData.append('slug', nuevoProducto.slug);
    if (nuevoProducto.stock > 0) {
      formData.append('disponible', true);
    } else {
      formData.append('disponible', false);
    }

    try {
      if (productoSeleccionado) {
        // Actualizar producto
        const response = await axios.patch(
          `http://127.0.0.1:8000/products/${productoSeleccionado.slug}/update/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert('Producto actualizado exitosamente');
        setProductos(
          productos.map((producto) =>
            producto.slug === productoSeleccionado.slug ? response.data : producto
          )
        );
      } else {
        // Crear producto
        const response = await axios.post(
          'http://127.0.0.1:8000/products/admin-create-product/',
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert('Producto creado exitosamente');
        setProductos([...productos, response.data]);
      }
      cerrarFormulario();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('No se pudo guardar el producto');
    }
  };

  const handleConfirmDelete = async () => {
    if (!productoSeleccionado) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/products/${productoSeleccionado.slug}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      alert('Producto eliminado exitosamente');
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto.slug !== productoSeleccionado.slug)
      );
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('No se pudo eliminar el producto');
    } finally {
      cerrarModalEliminar();
    }
  };

  const renderProducts = () => {
    if (productos.length === 0) {
      return <p>No hay productos disponibles.</p>;
    }

    return productos.map((producto) => (
      <div
        key={producto.slug}
        className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
      >
        <div>
          <h3 className="font-bold text-lg">{producto.nombre}</h3>
          <p className="text-gray-600">Precio: ${producto.precio}</p>
          <p className="text-gray-600">Stock: {producto.stock}</p>
          <p className="text-gray-600">Descripción: {producto.descripcion}</p>
        </div>
        <div>
          <button
            onClick={() => abrirModalEliminar(producto)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Eliminar
          </button>
          <button
            onClick={() => abrirFormulario(producto)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ml-2"
          >
            Editar
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarAdmin /> {/* Aquí insertamos el Sidebar */}

      <div className="p-6 w-full ml-64">
        <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={() => abrirFormulario()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-4"
        >
          Agregar Producto
        </button>
        <div className="grid grid-cols-1 gap-4">{renderProducts()}</div>

        {/* Modal de confirmación para eliminar */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">¿Estás seguro?</h2>
              <p className="text-gray-700 mb-4">
                Vas a eliminar el producto <strong>{productoSeleccionado?.nombre}</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cerrarModalEliminar}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para formulario */}
        {modalFormulario && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                {productoSeleccionado ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={nuevoProducto.nombre}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="precio" className="block text-gray-700">Precio</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={nuevoProducto.precio}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="stock" className="block text-gray-700">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={nuevoProducto.stock}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="descripcion" className="block text-gray-700">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={nuevoProducto.descripcion}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="imagen" className="block text-gray-700">Imagen</label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    onChange={handleFileChange}
                    className="mt-2 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  {productoSeleccionado ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </form>
              <button
                onClick={cerrarFormulario}
                className="bg-gray-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
