import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin';  // Importamos SidebarAdmin

function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);  // Estado para las categorías
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
    categoria: '',  // Agregamos el campo categoria
  }); // Estado para manejar los datos del formulario
  const [imagePreview, setImagePreview] = useState(null); // Estado para la previsualización de la imagen

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/products/');
        setProductos(response.data);
      } catch (err) {
        setError('Error al cargar los productos.');
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/products/categorias/');
        setCategorias(response.data);
      } catch (err) {
        setError('Error al cargar las categorías.');
      }
    };

    fetchProductos();
    fetchCategorias();
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
        categoria: producto.categoria.id,  // Prellenamos la categoría seleccionada
      });
      setImagePreview(producto.imagen ? `http://127.0.0.1:8000${producto.imagen}` : null); // Previsualización existente
      setProductoSeleccionado(producto);
    } else {
      setNuevoProducto({
        nombre: '',
        precio: '',
        stock: '',
        imagen: null,
        descripcion: '',
        slug: '',
        categoria: '',  // Dejar vacío inicialmente
      });
      setImagePreview(null);
      setProductoSeleccionado(null);
    }
    setModalFormulario(true);
    // Evitar que el fondo se desplace cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  };

  const cerrarFormulario = () => {
    setNuevoProducto({
      nombre: '',
      precio: '',
      stock: '',
      imagen: null,
      descripcion: '',
      slug: '',
      categoria: '',  // Dejar vacío
    });
    setImagePreview(null);
    setProductoSeleccionado(null);
    setModalFormulario(false);
    // Restaurar el desplazamiento del fondo cuando el modal se cierra
    document.body.style.overflow = 'auto';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNuevoProducto({ ...nuevoProducto, imagen: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
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
    formData.append('categoria', nuevoProducto.categoria);  // Enviar categoría seleccionada

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

        {/* Modal para formulario */}
        {modalFormulario && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {productoSeleccionado ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primera columna: Campos del formulario */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="nombre" className="block text-gray-700">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={nuevoProducto.nombre}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="precio" className="block text-gray-700">Precio</label>
                      <input
                        type="number"
                        id="precio"
                        name="precio"
                        value={nuevoProducto.precio}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-gray-700">Stock</label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={nuevoProducto.stock}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="descripcion" className="block text-gray-700">Descripción</label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        value={nuevoProducto.descripcion}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                        rows="4"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="categoria" className="block text-gray-700">Categoría</label>
                      <select
                        id="categoria"
                        name="categoria"
                        value={nuevoProducto.categoria}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                        required
                      >
                        <option value={nuevoProducto.categoria}>Selecciona una categoría</option>
                        {categorias.map(categoria => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Segunda columna: Subida de imagen y previsualización */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="imagen" className="block text-gray-700">Imagen</label>
                      <input
                        type="file"
                        id="imagen"
                        name="imagen"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-gray-700 mb-2">Previsualización de la Imagen:</p>
                        <img
                          src={imagePreview}
                          alt="Previsualización"
                          className="w-full max-h-64 object-contain rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    {productoSeleccionado ? 'Actualizar Producto' : 'Crear Producto'}
                  </button>
                  <button
                    type="button"
                    onClick={cerrarFormulario}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
