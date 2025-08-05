import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Importación de estilos generales
import "./assets/scss/_01-General/_App.scss";
import "./assets/scss/_01-General/_Toastify.scss";
import "./assets/scss/_01-General/_SweetAlert.scss";
// Componentes que forman parte del layout general de la aplicación
import Header from "./componentes/Header";
import Footer from "./componentes/Footer";
import MainPublicidadSlider from "./componentes/MainPublicidadSlider";
// Componentes accesibles para cualquier usuario sin autenticación
import PPublicoContacto from "./componentes/PPublicoContacto";
import PPublicoContactoForm from "./componentes/PPublicoContactoForm";
import POrgAsignacionMesas from "./componentes/POrgAsignacionMesas";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<POrgAsignacionMesas />} />
              <Route
                path="/contacto"
                element={
                  <div className="contacto-container">
                    <PPublicoContacto />
                    <PPublicoContactoForm />
                  </div>
                }
              />
              <Route path="/asignacion-mesas" element={<POrgAsignacionMesas />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        <hr className="border border-0 opacity-20" />
        <MainPublicidadSlider />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
