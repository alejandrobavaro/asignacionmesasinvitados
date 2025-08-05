// =========================================================
// IMPORTS
// =========================================================

// React principal
import React from "react";

// Componente Link de react-router-dom para la navegación interna
import { Link } from "react-router-dom";

// Estilos específicos del Footer
import "../assets/scss/_03-Componentes/_Footer.scss";

// Iconos de redes sociales desde react-icons
import { BsInstagram, BsYoutube, BsFacebook } from "react-icons/bs";

// =========================================================
// COMPONENTE Footer
// =========================================================

function Footer() {
  // Función para hacer scroll suave al top de la página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">
      
      {/* Botón de contacto */}
      <div className="contact-btn-container">
        <Link 
          to="/contacto" 
          className="contact-btn"
          onClick={scrollToTop}
        >
          CONTACTO
        </Link>
      </div>
     
      {/* Contenido principal del Footer */}
      <div className="footer-content">
        
        {/* Logo decorativo izquierdo */}
        <div className="footer-logo-container">
          <img 
            src="/img/02-logos/logofooter1a.png"
            alt="Logo decorativo" 
            className="footer-logo"
          />
        </div>
        
        {/* Redes sociales */}
        <div className="social-links-container">
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <BsInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <BsYoutube className="social-icon" />
              <span>YouTube</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <BsFacebook className="social-icon" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
        
        {/* Logo decorativo derecho */}
        <div className="footer-logo-container">
          <img 
            src="/img/02-logos/logofooter1a.png"
            alt="Logo decorativo" 
            className="footer-logo"
          />
        </div>
      </div>
      
      {/* Línea barroca animada inferior */}
      <div className="baroque-line-bottom"></div>
      
      {/* Créditos / Copyright */}
      <div className="copyright-container">
        <div className="copyright-content">
          <a 
            href="https://alejandrobavaro.github.io/gondraworld-dev/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span className="copyright-icon">✧</span>
            <span>Gondra World Dev</span>
            <span className="copyright-icon">✧</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
