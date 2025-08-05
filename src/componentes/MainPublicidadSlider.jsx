// Importaciones necesarias
import React from "react";
import Slider from "react-slick"; // Importa el componente de slider/carousel de la librería react-slick
import "slick-carousel/slick/slick.css"; // Estilos base del slider
import "slick-carousel/slick/slick-theme.css"; // Tema visual por defecto del slider
import "../assets/scss/_03-Componentes/_MainPublicidadSlider.scss"; // Importación de los estilos SCSS específicos del componente

// Componente funcional: MainPublicidadSlider
const MainPublicidadSlider = () => {
  // Configuración de comportamiento del slider
  const sliderSettings = {
    dots: false,          // No muestra los indicadores de posición (puntos)
    infinite: true,       // El slider es infinito (loop)
    speed: 500,           // Velocidad de transición en milisegundos
    slidesToShow: 1,      // Cuántas slides mostrar a la vez
    slidesToScroll: 1,    // Cuántas slides avanza por scroll automático
    autoplay: true,       // Activa el autoplay
    autoplaySpeed: 3000,  // Tiempo entre cada slide automático
    arrows: false         // Oculta flechas de navegación manual
  };

  // Array de imágenes que se muestran en el slider
  const banners = [
    "/img/03-img-banners/banner1.png",
    "/img/03-img-banners/banner2.png",
    "/img/03-img-banners/banner3.png",
    "/img/03-img-banners/banner4.png",
    "/img/03-img-banners/banner5.png",
  ];

  // Render
  return (
    <div className="advertisement-container">
      <div className="advertisement-content">

        {/* Contenedor para los 2 sliders */}
        <div className="slider-row">

          {/* Primer slider en orden normal */}
          <div className="slider-wrapper">
            <Slider {...sliderSettings}>
              {banners.map((banner, index) => (
                <div key={`banner-${index}`} className="slider-item">
                  <img
                    src={banner}
                    alt={`Banner ${index + 1}`} // Texto alternativo accesible
                    className="advertisement-image"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Segundo slider en orden invertido */}
          <div className="slider-wrapper">
            <Slider {...sliderSettings}>
              {[...banners].reverse().map((banner, index) => (
                <div key={`reverse-banner-${index}`} className="slider-item">
                  <img
                    src={banner}
                    alt={`Banner ${banners.length - index}`} // Texto alternativo accesible
                    className="advertisement-image"
                  />
                </div>
              ))}
            </Slider>
          </div>

        </div>
      </div>
    </div>
  );
};

// Exportación del componente
export default MainPublicidadSlider;
