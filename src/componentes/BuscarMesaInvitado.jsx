import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MesaVisual from './MesaVisual';
import '../assets/scss/_03-Componentes/_BuscarMesaInvitado.scss';

// ============================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================
const LOCAL_STORAGE_KEY = 'weddingTablesData'; // Misma clave que en AsignacionMesas

// ============================================================
// COMPONENTE BUSCAR MESA INVITADO - BÚSQUEDA PÚBLICA
// ============================================================
const BuscarMesaInvitado = () => {
  // ============================================================
  // ESTADOS DEL COMPONENTE
  // ============================================================
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda actual
  const [foundGuest, setFoundGuest] = useState(null); // Invitado encontrado
  const [guestTable, setGuestTable] = useState(null); // Mesa del invitado encontrado
  const [tableGuests, setTableGuests] = useState([]); // Compañeros de mesa
  const [loading, setLoading] = useState(false); // Estado de carga durante búsqueda
  const [tablesData, setTablesData] = useState([]); // Datos de mesas desde localStorage
  const [invitadosData, setInvitadosData] = useState({ invitados: [] }); // Datos de invitados desde JSON
  const [suggestions, setSuggestions] = useState([]); // Sugerencias de búsqueda
  const [showSuggestions, setShowSuggestions] = useState(false); // Visibilidad de sugerencias

  const location = useLocation(); // Hook para acceso a estado de navegación

  // ============================================================
  // EFECTOS PARA CARGAR DATOS
  // ============================================================

  // Efecto: Cargar datos iniciales al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. CARGAR DATOS DE INVITADOS desde archivo JSON público
        const response = await fetch('/invitados.json');
        if (!response.ok) throw new Error('Error al cargar invitados');
        const data = await response.json();
        setInvitadosData(data);
        
        // 2. CARGAR MESAS desde localStorage (donde se guarda la asignación)
        const savedTables = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTables) {
          setTablesData(JSON.parse(savedTables));
        }
      } catch (error) {
        // 3. MANEJO DE ERRORES en carga de datos
        console.error("Error al cargar datos:", error);
        // Datos de prueba con nueva estructura
        setInvitadosData({
          novios: { novia: "Novia", novio: "Novio" },
          invitados: [
            { id: 1, nombre: "Padre Novia", relacion: "Padre", grupo: "Familia Novia" },
            { id: 2, nombre: "Madre Novia", relacion: "Madre", grupo: "Familia Novia" },
            { id: 3, nombre: "Padre Novio", relacion: "Padre", grupo: "Familia Novio" },
            { id: 4, nombre: "Madre Novio", relacion: "Madre", grupo: "Familia Novio" },
          ],
        });
      }
    };
    loadData();
  }, []);

  // Efecto: Manejar búsqueda automática desde estado de navegación
  useEffect(() => {
    if (location.state?.guestData) {
      setSearchTerm(location.state.guestData.nombre);
      handleSearch(location.state.guestData.nombre);
    }
  }, [location.state]);

  // Efecto: Generar sugerencias de búsqueda mientras se escribe
  useEffect(() => {
    if (searchTerm.length > 1 && invitadosData.invitados) {
      const term = searchTerm.toLowerCase();
      const matches = [];
      
      // BUSCAR COINCIDENCIAS en todos los invitados
      invitadosData.invitados.forEach(invitado => {
        if (invitado.nombre.toLowerCase().includes(term)) {
          matches.push({
            id: invitado.id.toString(),
            nombre: invitado.nombre,
            grupo: invitado.grupo,
            relacion: invitado.relacion
          });
        }
      });

      // LIMITAR SUGERENCIAS a 5 resultados máximo
      setSuggestions(matches.slice(0, 5));
      setShowSuggestions(matches.length > 0);
    } else {
      // LIMPIAR SUGERENCIAS si no hay término de búsqueda
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, invitadosData]);

  // ============================================================
  // FUNCIONES PRINCIPALES
  // ============================================================

  // Función: Realizar búsqueda de invitado
  const handleSearch = (term) => {
    setLoading(true);
    setFoundGuest(null);
    setGuestTable(null);
    setTableGuests([]);
    setShowSuggestions(false);

    if (!term.trim()) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const lowerTerm = term.toLowerCase();
      let guestFound = false;
      
      // BUSCAR EN MESAS ASIGNADAS (nueva estructura sin sillas individuales)
      if (tablesData && tablesData.length > 0) {
        for (const table of tablesData) {
          // Buscar en el array de guests de cada mesa
          const guestInTable = table.guests.find(guest => 
            guest.nombre.toLowerCase().includes(lowerTerm)
          );
          
          if (guestInTable) {
            setFoundGuest(guestInTable);
            setGuestTable(table);
            // Obtener otros invitados en la misma mesa (excluyendo el encontrado)
            setTableGuests(table.guests.filter(g => g.id !== guestInTable.id));
            guestFound = true;
            break;
          }
        }
      }
      
      // BUSCAR EN LISTA COMPLETA si no se encontró en mesas
      if (!guestFound && invitadosData.invitados) {
        const invitado = invitadosData.invitados.find(i => 
          i.nombre.toLowerCase().includes(lowerTerm)
        );
        
        if (invitado) {
          setFoundGuest({
            ...invitado,
            id: invitado.id.toString(),
            grupo: invitado.grupo
          });
        }
      }
      
      setLoading(false);
    }, 300);
  };

  // Función: Manejar clic en sugerencia de búsqueda
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.nombre);
    handleSearch(suggestion.nombre);
  };

  // ============================================================
  // RENDER DEL COMPONENTE
  // ============================================================
  return (
    <div className="buscar-mesa-container">
      
      {/* ENCABEZADO CON BÚSQUEDA */}
      <div className="buscar-mesa-header">
        <h1>Encuentra tu mesa</h1>
        <p className="subtitle">Ingresa tu nombre para descubrir en qué mesa estarás sentado</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Escribe tu nombre completo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            aria-label="Buscar mi mesa por nombre"
          />
          <button 
            onClick={() => handleSearch(searchTerm)}
            disabled={!searchTerm.trim() || loading}
            aria-label="Iniciar búsqueda"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          
          {/* LISTA DE SUGERENCIAS DE BÚSQUEDA */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  aria-label={`Seleccionar ${item.nombre}`}
                >
                  <strong>{item.nombre}</strong> ({item.relacion}) - {item.grupo}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* INDICADOR DE CARGA */}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}

      {/* RESULTADOS DE BÚSQUEDA */}
      {!loading && foundGuest && (
        <div className="result-container">
          {guestTable ? (
            // INVITADO ENCONTRADO CON MESA ASIGNADA
            <>
              <div className="guest-info">
                <h2>¡Hola {foundGuest.nombre}!</h2>
                <p>Estarás sentado en la <strong>{guestTable.name}</strong></p>
                
                <div className="table-visual-container">
                  <MesaVisual 
                    mesa={guestTable} 
                    isVip={guestTable.vip}
                    selectedGuest={foundGuest}
                  />
                </div>
              </div>

              {/* COMPAÑEROS DE MESA */}
              {tableGuests.length > 0 && (
                <div className="companions-info">
                  <h3>Compañeros de mesa:</h3>
                  <ul>
                    {tableGuests.map((guest) => (
                      <li key={guest.id}>
                        <strong>{guest.nombre}</strong> ({guest.relacion})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            // INVITADO ENCONTRADO PERO SIN MESA ASIGNADA
            <div className="guest-not-assigned">
              <h2>¡Hola {foundGuest.nombre}!</h2>
              <p>Aún no tienes asignada una mesa.</p>
              <p>Por favor contacta a los novios para confirmar tu asistencia.</p>
              <div className="contact-info">
                <p><strong>Contacto:</strong></p>
                <p>Contacta a los novios directamente</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* INVITADO NO ENCONTRADO */}
      {!loading && !foundGuest && searchTerm && (
        <div className="not-found-message">
          <p>No encontramos a "{searchTerm}" en nuestra lista.</p>
          <p>Por favor verifica que escribiste correctamente tu nombre o contacta a los novios.</p>
          <div className="contact-info">
            <p><strong>Contacto:</strong></p>
            <p>Contacta a los novios directamente</p>
          </div>
        </div>
      )}

      {/* SECCIÓN COMPARTIR (solo para invitados con mesa) */}
      {guestTable && (
        <div className="share-section">
          <p>¿Quieres compartir tu ubicación?</p>
          <button 
            className="share-button"
            onClick={() => {
              // API de compartir nativa del navegador
              if (navigator.share) {
                navigator.share({
                  title: 'Mi mesa en la boda',
                  text: `Estaré en la ${guestTable.name} en la boda de ${invitadosData.novios?.novia || 'la novia'} y ${invitadosData.novios?.novio || 'el novio'}. ¡Nos vemos allí!`,
                  url: window.location.href,
                }).catch(err => console.log('Error sharing:', err));
              } else {
                // Fallback: copiar al portapapeles
                const text = `Estaré en la ${guestTable.name} en la boda de ${invitadosData.novios?.novia || 'la novia'} y ${invitadosData.novios?.novio || 'el novio'}. ¡Nos vemos allí!`;
                navigator.clipboard.writeText(text);
                alert('¡Copiado al portapapeles! Puedes pegarlo donde quieras compartirlo.');
              }
            }}
            aria-label="Compartir información de mi mesa"
          >
            Compartir mi mesa
          </button>
        </div>
      )}
    </div>
  );
};

export default BuscarMesaInvitado;