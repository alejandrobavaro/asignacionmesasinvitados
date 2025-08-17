import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsList, BsHouseDoor, BsTable } from "react-icons/bs";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const guestLinks = [
    { path: "/", icon: <BsHouseDoor />, label: "Inicio" },
    { path: "/contacto", icon: <BsHouseDoor />, label: "Contacto" },
    { path: "/asignacion-mesas", icon: <BsTable />, label: "Asignación de Mesas" }
  ];

  return (
    <header className="app-header">
      <div className="header-decoration-top"></div>
      <Navbar expand="lg" className="header-navbar">
        <Container className="header-container">
          <Navbar.Brand as={Link} to="/" className="header-logo-left">
         
          <img src="../../img/02-logos/logoasignacionmesasinvitados1.png" alt="Logo Boda" className="logo-image" />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={handleToggleMobileMenu}
            className="menu-toggle"
          >
            <BsList className="menu-icon" />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav" className={`navbar-menu ${isMobileMenuOpen ? "open" : ""}`}>
            <Nav className="nav-links">
              {guestLinks.map((link) => (
                <Link
                  key={link.path}import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsList, BsHouseDoor, BsTable } from "react-icons/bs";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const guestLinks = [
    { 
      path: "/", 
      icon: <BsHouseDoor />, 
      label: "Inicio",
      shortLabel: "Inicio",
      tooltip: "Volver a la página principal"
    },
    { 
      path: "/contacto", 
      icon: <BsHouseDoor />, 
      label: "Contacto con los Novios",
      shortLabel: "Contacto",
      tooltip: "Escríbenos si tienes alguna duda o necesitas información adicional"
    },
    { 
      path: "/asignacion-mesas", 
      icon: <BsTable />, 
      label: "Asignación de Mesas",
      shortLabel: "Tu Mesa",
      tooltip: "Descubre en qué mesa estarás sentado durante el banquete"
    }
  ];

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      {/* Decoración superior */}
      <div className="header-decoration-top"></div>

      {/* Barra de navegación principal */}
      <Navbar expand="lg" className="header-navbar" expanded={isMobileMenuOpen}>
        <Container className="header-container">
          {/* Logo izquierdo */}
          <Navbar.Brand as={Link} to="/" className="header-logo-left">
            <img 
              src="../../img/02-logos/logoasignacionmesasinvitados1.png" 
              alt="Logo Boda" 
              className="logo-image" 
            />
          </Navbar.Brand>

          {/* Botón hamburguesa para móvil */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="menu-toggle"
            onClick={handleToggleMobileMenu}
          >
            <BsList className="menu-icon" />
          </Navbar.Toggle>

          {/* Menú de navegación */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="quick-access-buttons">
              {guestLinks.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`nav-button ${
                    location.pathname === link.path ? "active" : ""
                  }`}
                  title={link.tooltip}
                  data-label={link.label}
                >
                  <span className="icon">{link.icon}</span>
                  <span className="nav-label">
                    {window.innerWidth < 768 ? link.label : link.shortLabel}
                  </span>
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>

          {/* Logo derecho */}
          <Navbar.Brand as={Link} to="/" className="header-logo-right">
            <img 
              src="../../img/02-logos/logo-bodaaleyfabi1d.png" 
              alt="Logo Asignación" 
              className="logo-image" 
            />
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Decoración inferior */}
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                </Link>
              ))}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Brand as={Link} to="/" className="header-logo-right">
          <img src="../../img/02-logos/logo-bodaaleyfabi1d.png" alt="Logo Asignación" className="logo-image" />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;
