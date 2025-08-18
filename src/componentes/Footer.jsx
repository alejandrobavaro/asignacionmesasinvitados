import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BsEnvelope } from "react-icons/bs";
import "../assets/scss/_03-Componentes/_Footer.scss";

function Footer() {
  const location = useLocation();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo decorativo izquierdo con enlace */}
        <div className="footer-logo-container">
          <a 
            href="https://noscasamos-aleyfabi.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="/img/02-logos/logofooter1a.png"
              alt="Logo decorativo" 
              className="footer-logo"
            />
          </a>
        </div>
        
        {/* Botón de contacto con icono */}
        <div className="contact-btn-container">
          <Link
            to="/Contacto"
            className={`contact-btn ${
              location.pathname === '/Contacto' ? 'active' : ''
            }`}
            onClick={scrollToTop}
          >
            <BsEnvelope className="icon" />
            <span>Contacto</span>
          </Link>
        </div>

        {/* Logo decorativo derecho con enlace */}
        <div className="footer-logo-container">
          <a 
            href="https://noscasamos-aleyfabi.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="/img/02-logos/logofooter1a.png"
              alt="Logo decorativo" 
              className="footer-logo"
            />
          </a>
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