import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MesaVisual from './MesaVisual';
import '../assets/scss/_03-Componentes/_BuscarMesaInvitado.scss';

const LOCAL_STORAGE_KEY = 'weddingTablesData';

const BuscarMesaInvitado = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundGuest, setFoundGuest] = useState(null);
  const [guestTable, setGuestTable] = useState(null);
  const [tableGuests, setTableGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tablesData, setTablesData] = useState([]);
  const [invitadosData, setInvitadosData] = useState({ grupos: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();

  // Cargar datos de invitados y mesas al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos de invitados desde JSON
        const response = await fetch('/invitados.json');
        if (!response.ok) throw new Error('Error al cargar invitados');
        const data = await response.json();
        setInvitadosData(data);
        
        // Cargar mesas desde LocalStorage
        const savedTables = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTables) {
          setTablesData(JSON.parse(savedTables));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    loadData();
  }, []);

  // Manejar búsqueda desde state de navegación
  useEffect(() => {
    if (location.state?.guestData) {
      setSearchTerm(location.state.guestData.nombre);
      handleSearch(location.state.guestData.nombre);
    }
  }, [location.state]);

  // Generar sugerencias al escribir
  useEffect(() => {
    if (searchTerm.length > 1 && invitadosData.grupos) {
      const term = searchTerm.toLowerCase();
      const matches = [];
      
      invitadosData.grupos.forEach(grupo => {
        grupo.invitados.forEach(invitado => {
          if (invitado.nombre.toLowerCase().includes(term)) {
            matches.push({
              id: invitado.id.toString(),
              nombre: invitado.nombre,
              grupo: grupo.nombre,
              relacion: invitado.relacion
            });
          }
        });
      });

      setSuggestions(matches.slice(0, 5));
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, invitadosData]);

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
      
      // Buscar en mesas cargadas desde LocalStorage
      if (tablesData && tablesData.length > 0) {
        for (const table of tablesData) {
          const guest = table.guests.find(g => 
            g.nombre.toLowerCase().includes(lowerTerm)
          );
          
          if (guest) {
            setFoundGuest(guest);
            setGuestTable(table);
            setTableGuests(table.guests.filter(g => g.id !== guest.id));
            guestFound = true;
            break;
          }
        }
      }
      
      // Si no se encontró en mesas, buscar en lista completa de invitados
      if (!guestFound && invitadosData.grupos) {
        for (const grupo of invitadosData.grupos) {
          const invitado = grupo.invitados.find(i => 
            i.nombre.toLowerCase().includes(lowerTerm)
          );
          
          if (invitado) {
            setFoundGuest({
              ...invitado,
              id: invitado.id.toString(),
              grupo: grupo.nombre
            });
            break;
          }
        }
      }
      
      setLoading(false);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.nombre);
    handleSearch(suggestion.nombre);
  };

  return (
    <div className="buscar-mesa-container">
      {/* Header y búsqueda */}
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
          />
          <button 
            onClick={() => handleSearch(searchTerm)}
            disabled={!searchTerm.trim() || loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          
          {/* Sugerencias */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                >
                  <strong>{item.nombre}</strong> ({item.relacion}) - {item.grupo}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Resultados */}
      {loading && <div className="loading-indicator"><div className="spinner"></div></div>}

      {!loading && foundGuest && (
        <div className="result-container">
          {guestTable ? (
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
            <div className="guest-not-assigned">
              <h2>¡Hola {foundGuest.nombre}!</h2>
              <p>Aún no tienes asignada una mesa.</p>
              <p>Por favor contacta a los novios para confirmar tu asistencia.</p>
              <div className="contact-info">
                <p><strong>Contacto:</strong></p>
                <p>Teléfono: {invitadosData.novios?.contacto?.telefono || 'No disponible'}</p>
                <p>Email: {invitadosData.novios?.contacto?.email || 'No disponible'}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !foundGuest && searchTerm && (
        <div className="not-found-message">
          <p>No encontramos a "{searchTerm}" en nuestra lista.</p>
          <p>Por favor verifica que escribiste correctamente tu nombre o contacta a los novios.</p>
          {invitadosData.novios?.contacto && (
            <div className="contact-info">
              <p><strong>Contacto:</strong></p>
              <p>Teléfono: {invitadosData.novios.contacto.telefono}</p>
              <p>Email: {invitadosData.novios.contacto.email}</p>
            </div>
          )}
        </div>
      )}

      {/* Compartir - Solo si está asignado a mesa */}
      {guestTable && (
        <div className="share-section">
          <p>¿Quieres compartir tu ubicación?</p>
          <button 
            className="share-button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Mi mesa en la boda',
                  text: `Estaré en la ${guestTable.name} en la boda de ${invitadosData.novios?.novia || 'la novia'} y ${invitadosData.novios?.novio || 'el novio'}. ¡Nos vemos allí!`,
                  url: window.location.href,
                }).catch(err => console.log('Error sharing:', err));
              } else {
                const text = `Estaré en la ${guestTable.name} en la boda de ${invitadosData.novios?.novia || 'la novia'} y ${invitadosData.novios?.novio || 'el novio'}. ¡Nos vemos allí!`;
                navigator.clipboard.writeText(text);
                alert('¡Copiado al portapapeles! Puedes pegarlo donde quieras compartirlo.');
              }
            }}
          >
            Compartir mi mesa
          </button>
        </div>
      )}
    </div>
  );
};

export default BuscarMesaInvitado;