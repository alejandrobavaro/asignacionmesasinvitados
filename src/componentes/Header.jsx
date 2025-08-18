import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsList, BsHouseDoor, BsTable, BsSearch } from "react-icons/bs";
import { Navbar, Nav, Container, Modal, Button, Form } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const guestLinks = [
    // { 
    //   path: "/", 
    //   icon: <BsHouseDoor />, 
    //   label: "Inicio",
    //   shortLabel: "Inicio",
    //   tooltip: "Volver a la página principal"
    // },
    { 
      path: "/buscar-mesa", 
      icon: <BsSearch />, 
      label: "Buscar mi Mesa",
      shortLabel: "Buscar",
      tooltip: "Consulta tu mesa asignada"
    },
    { 
      path: "/asignacion-mesas", 
      icon: <BsTable />, 
      label: "Asignación de Mesas",
      shortLabel: "Tu Mesa",
      tooltip: "Organización de mesas para el banquete (acceso restringido)",
      protected: true
    }
  ];

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (link) => {
    setIsMobileMenuOpen(false);
    
    if (link.protected) {
      setShowPasswordModal(true);
    } else {
      navigate(link.path);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "boda") {
      setShowPasswordModal(false);
      setPassword("");
      setError("");
      navigate("/asignacion-mesas");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <header className="app-header">
      <div className="header-decoration-top"></div>
      
      <Navbar expand="lg" className="header-navbar" expanded={isMobileMenuOpen}>
        <Container className="header-container">
          <Navbar.Brand as={Link} to="/" className="header-logo-left">
            <img 
          
              src="../../img/02-logos/logo-bodaaleyfabi1d.png" 
              alt="Logo Boda" 
              className="logo-image" 
            />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="menu-toggle"
            onClick={handleToggleMobileMenu}
          >
            <BsList className="menu-icon" />
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav" className={`navbar-menu ${isMobileMenuOpen ? "open" : ""}`}>
            <Nav className="nav-links">
              {guestLinks.map((link) => (
                <div
                  key={link.path}
                  onClick={() => handleLinkClick(link)}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  data-tooltip={link.tooltip}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">
                    {window.innerWidth < 768 ? link.label : link.shortLabel}
                  </span>
                </div>
              ))}
            </Nav>
          </Navbar.Collapse>

          <Navbar.Brand as={Link} to="/" className="header-logo-right">
            <img 
               src="../../img/02-logos/logoasignacionmesasinvitados1.png" 
              alt="Logo Asignación" 
              className="logo-image" 
            />
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div className="header-decoration-bottom"></div>

      {/* Modal para contraseña */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Acceso Restringido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ingresa la contraseña:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoFocus
              />
              {error && <div className="text-danger mt-2">{error}</div>}
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Ingresar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;