import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/scss/_03-Componentes/_Contacto.scss";

const Contacto = () => {
  // Configuración del slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    cssEase: 'linear',
    pauseOnHover: true
  };

  // Fotos de los novios
  const couplePhotos = [
    "/img/03-img-banners/banner1.png",
    "/img/03-img-banners/banner2.png",
    "/img/03-img-banners/banner3.png",
    "/img/03-img-banners/banner4.png",
    "/img/03-img-banners/banner5.png"
  ];

  return (
    <div className="contacto-container">
      {/* Sección de contacto con logo y redes sociales */}
      <section className="contact-logo-section">
        <div className="unified-contact-container">
          <div className="unified-logo-social">
            <div className="unified-logo">
              <img
                src="/img/02-logos/logo-bodaaleyfabi1d.png"
                alt="Logo Boda Alejandro y Fabiola"
                className="unified-logo-img"
              />
            </div>

            <div className="unified-social">
              {/* Nueva sección de hashtag y redes sociales */}
              <div className="hashtag-container">
                <h3 className="hashtag-title">
                  <i className="bi bi-heart-fill" /> Boda de Ale Fabi
                </h3>
                <p className="hashtag-subtitle">Etiquétanos en tus fotos y videos</p>
              </div>

              <div className="couple-social-links">
                <a
                  href="https://www.instagram.com/fabiolalutrario/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <i className="bi bi-instagram" /> @fabiolalutrario
                </a>
                <a
                  href="https://www.instagram.com/alegondramusic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <i className="bi bi-instagram" /> @alegondramusic
                </a>
              </div>
            </div>
          </div>

          <div className="unified-contact-banner">
            <img
              src="/img/03-img-banners/banner2.png"
              alt="Boda Alejandro y Fabiola"
              className="unified-banner-img"
            />
          </div>
        </div>
      </section>

      {/* Sección de formulario de contacto (se mantiene igual) */}
      <section className="compact-contact-section">
        <div className="compact-form-container">
          <h2 className="compact-form-title">
            <i className="bi bi-envelope-heart" /> Escríbenos{" "}
            <i className="bi bi-envelope-heart" />
          </h2>
          
          <form
            className="compact-contact-form"
            action="https://formspree.io/f/xbjnlgzz"
            target="_blank"
            method="post"
          >
            <div className="compact-form-group">
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                required
                className="compact-input"
              />
            </div>
            
            <div className="compact-form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo electrónico"
                required
                className="compact-input"
              />
            </div>
            
            <div className="compact-form-group">
              <textarea
                id="mensaje"
                name="mensaje"
                rows={3}
                placeholder="Tu mensaje para nosotros..."
                required
                className="compact-textarea"
              />
            </div>
            
            <button type="submit" className="compact-submit-btn">
              Enviar <i className="bi bi-send" />
            </button>
          </form>

          <div className="couple-slider-container">
            <Slider {...sliderSettings} className="couple-slider">
              {couplePhotos.map((photo, index) => (
                <div key={index} className="slider-item">
                  <img 
                    src={photo} 
                    alt={`Alejandro y Fabiola ${index + 1}`} 
                    className="couple-photo"
                  />
                  <div className="photo-overlay"></div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;