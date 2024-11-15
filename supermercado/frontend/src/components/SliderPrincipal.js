// SliderPrincipal.js
import React from 'react';
import Slider from 'react-slick';
import './SliderPrincipal.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Librería de iconos
// Import images
import slide1 from './images/slide1.png';
import slide2 from './images/slide2.png';
import slide3 from './images/slide3.png';
import slide4 from './images/slide4.png';


// Botón de la izquierda
function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 text-white p-2 rounded-full z-10"
      style={{ left: '10px' }}
    >
      <FaChevronLeft size={20} />
    </button>
  );
}

// Botón de la derecha
function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 text-white p-2 rounded-full z-10"
      style={{ right: '10px' }}
    >
      <FaChevronRight size={20} />
    </button>
  );
}

function SliderPrincipal() {
  // Lista de imágenes que deseas mostrar en el slider-
  const imagenes = [slide1, slide2, slide3, slide4];

  // Configuración del slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,  // Flecha personalizada para retroceder
    nextArrow: <NextArrow />   // Flecha personalizada para avanzar
  };

  return (
    <div className="my-8 relative rounded-lg overflow-hidden">
      <Slider {...settings}>
        {imagenes.map((imagen, index) => (
          <div key={index} className="text-center">
            <img src={imagen} alt={`Slide ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SliderPrincipal;
