import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./assets/scss/_01-General/_App.scss";
import Header from "./componentes/Header";
import Footer from "./componentes/Footer";
import PublicidadSlider from "./componentes/PublicidadSlider";
import Contacto from "./componentes/Contacto";
import AsignacionMesas from "./componentes/AsignacionMesas";
import BuscarMesaInvitado from "./componentes/BuscarMesaInvitado";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="app-container">
        <Header />
        <main className="main-content">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<BuscarMesaInvitado />} />
              <Route path="/buscar-mesa" element={<BuscarMesaInvitado />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/asignacion-mesas" element={<AsignacionMesas />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        <hr className="border border-0 opacity-20" />
        <PublicidadSlider />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
