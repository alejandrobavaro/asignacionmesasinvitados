import React, { useState, useEffect } from 'react';
import MesaVisual from './MesaVisual';
import '../assets/scss/_03-Componentes/_AsignacionMesas.scss';

// ==================================================
// CONSTANTES DE CONFIGURACIÓN
// ==================================================
const LOCAL_STORAGE_KEY = 'weddingTablesData'; // Clave para almacenamiento local

function AsignacionMesas() {
  // ==================================================
  // ESTADOS DEL COMPONENTE
  // ==================================================
  const [invitadosData, setInvitadosData] = useState(null); // Datos de invitados desde JSON
  const [tables, setTables] = useState([]); // Array de mesas con sus invitados
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda para filtrar
  const [selectedGuest, setSelectedGuest] = useState(null); // Invitado seleccionado para asignar
  const [nuevaMesa, setNuevaMesa] = useState({ nombre: '', capacidad: 10, vip: false }); // Datos para nueva mesa
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Control de visibilidad del formulario

  // ==================================================
  // EFECTO: CARGAR DATOS INICIALES AL MONTAR EL COMPONENTE
  // ==================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos de invitados desde archivo JSON público
        const response = await fetch('/invitados.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setInvitadosData(data);
        
        // Intentar cargar mesas guardadas en localStorage
        const savedTables = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTables) {
          setTables(JSON.parse(savedTables));
        } else {
          // Crear mesas iniciales por defecto si no hay guardadas
          const initialTables = [
            { id: 'table-1', name: 'Mesa Principal', capacity: 10, guests: [], vip: true },
            { id: 'table-2', name: 'Mesa 2', capacity: 10, guests: [], vip: false },
            { id: 'table-3', name: 'Mesa 3', capacity: 10, guests: [], vip: false },
            { id: 'table-4', name: 'Mesa 4', capacity: 10, guests: [], vip: false },
            { id: 'table-5', name: 'Mesa 5', capacity: 10, guests: [], vip: false }
          ];
          setTables(initialTables);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        // Datos de prueba en caso de error
        setInvitadosData({
          novios: { novia: "Fabiola Lutrario", novio: "Alejandro Bavaro" },
          invitados: [
            { id: 1, nombre: "Ana Maria Lutrario", relacion: "Tía paterna", grupo: "Familia Novia" },
            { id: 2, nombre: "Mario Vincenzo Lutrario", relacion: "Padre de la novia", grupo: "Familia Novia" },
            { id: 3, nombre: "Norma Perez", relacion: "Amiga de la tía Ana", grupo: "Familia Novia" },
            { id: 4, nombre: "Monica Tetamantti", relacion: "Amiga de la tía Ana", grupo: "Familia Novia" }
          ],
        });
      }
    };
    loadData();
  }, []);

  // ==================================================
  // EFECTO: GUARDAR EN LOCALSTORAGE CUANDO CAMBIAN LAS MESAS
  // ==================================================
  useEffect(() => {
    if (tables.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tables));
    }
  }, [tables]);

  // ==================================================
  // FUNCIÓN: OBTENER TODOS LOS INVITADOS DESDE LOS DATOS
  // ==================================================
  const getAllGuests = () => {
    if (!invitadosData || !invitadosData.invitados) return [];
    return invitadosData.invitados.map(invitado => ({
      ...invitado,
      id: `guest-${invitado.id}` // ID único para cada invitado
    }));
  };

  // ==================================================
  // FUNCIÓN: FILTRAR INVITADOS SEGÚN TÉRMINO DE BÚSQUEDA
  // ==================================================
  const filteredGuests = () => {
    const allGuests = getAllGuests();
    if (!searchTerm) return allGuests;
    return allGuests.filter(guest =>
      guest.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // ==================================================
  // FUNCIÓN: SELECCIONAR INVITADO PARA ASIGNAR A MESA
  // ==================================================
  const selectGuestForAssignment = (guest) => {
    // Verificar si el invitado ya está asignado a alguna mesa
    const isAssigned = tables.some(table => 
      table.guests.some(g => g.id === guest.id)
    );
    
    // Solo permitir seleccionar invitados no asignados
    if (!isAssigned) {
      setSelectedGuest(guest);
    }
  };

  // ==================================================
  // FUNCIÓN: ASIGNAR INVITADO SELECCIONADO A UNA MESA
  // ==================================================
  const assignGuestToTable = (tableId) => {
    if (!selectedGuest) return;

    const newTables = tables.map(table => {
      if (table.id === tableId) {
        // Verificar si hay espacio disponible en la mesa
        if (table.guests.length < table.capacity) {
          return {
            ...table,
            guests: [...table.guests, selectedGuest] // Agregar invitado a la mesa
          };
        }
      }
      return table;
    });

    setTables(newTables);
    setSelectedGuest(null); // Limpiar selección después de asignar
  };

  // ==================================================
  // FUNCIÓN: QUITAR INVITADO DE UNA MESA
  // ==================================================
  const removeGuestFromTable = (tableId, guestId) => {
    const newTables = tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          guests: table.guests.filter(guest => guest.id !== guestId) // Filtrar invitado a eliminar
        };
      }
      return table;
    });

    setTables(newTables);
  };

  // ==================================================
  // FUNCIÓN: REINICIAR TODAS LAS MESAS (VACIAR INVITADOS)
  // ==================================================
  const resetTables = () => {
    if (window.confirm('¿Estás seguro de reiniciar todas las mesas?')) {
      const resetTables = tables.map(table => ({
        ...table,
        guests: [] // Vaciar array de invitados
      }));
      setTables(resetTables);
      setSelectedGuest(null);
    }
  };

  // ==================================================
  // FUNCIÓN: AGREGAR NUEVA MESA AL LAYOUT
  // ==================================================
  const addNewTable = (e) => {
    e.preventDefault();
    const newTable = {
      id: `table-${tables.length + 1}`,
      name: nuevaMesa.nombre || `Mesa ${tables.length + 1}`,
      capacity: 10, // Capacidad fija de 10 sillas
      guests: [],
      vip: nuevaMesa.vip
    };
    setTables([...tables, newTable]);
    setNuevaMesa({ nombre: '', capacidad: 10, vip: false }); // Resetear formulario
    setMostrarFormulario(false); // Ocultar formulario
  };

  // ==================================================
  // FUNCIÓN: ELIMINAR MESA DEL LAYOUT
  // ==================================================
  const deleteTable = (tableId) => {
    if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
      setTables(tables.filter(table => table.id !== tableId));
    }
  };

  // ==================================================
  // FUNCIÓN: EXPORTAR DATOS DE MESAS A ARCHIVO JSON
  // ==================================================
  const exportData = () => {
    const dataStr = JSON.stringify(tables, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mesas-data.json';
    link.click();
  };

  // ==================================================
  // CALCULAR INVITADOS SIN ASIGNAR PARA ESTADÍSTICAS
  // ==================================================
  const unassignedGuests = getAllGuests().filter(guest => 
    !tables.some(table => table.guests.some(g => g.id === guest.id))
  );

  // ==================================================
  // RENDERIZADO DE CARGA MIENTRAS SE OBTIENEN DATOS
  // ==================================================
  if (!invitadosData) {
    return (
      <div className="asignacion-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos de invitados...</p>
      </div>
    );
  }

  // ==================================================
  // RENDER PRINCIPAL DEL COMPONENTE
  // ==================================================
  return (
    <div className="asignacion-container">
      
      {/* ENCABEZADO CON BÚSQUEDA Y CONTROLES */}
      <header className="asignacion-header">
        <h1>Organización de Mesas</h1>
        <div className="asignacion-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar invitado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setMostrarFormulario(true)} className="btn-primary">
            + Nueva Mesa
          </button>
        </div>
      </header>

      {/* MODAL PARA CREAR NUEVA MESA */}
      {mostrarFormulario && (
        <div className="modal">
          <div className="modal-content">
            <h3>Crear Nueva Mesa</h3>
            <form onSubmit={addNewTable}>
              <input
                type="text"
                placeholder="Nombre de la mesa"
                value={nuevaMesa.nombre}
                onChange={(e) => setNuevaMesa({...nuevaMesa, nombre: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="submit">Crear</button>
                <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER DE INVITADO SELECCIONADO */}
      {selectedGuest && (
        <div className="selected-guest-banner">
          <span>Seleccionado: <strong>{selectedGuest.nombre}</strong></span>
          <button onClick={() => setSelectedGuest(null)}>X</button>
        </div>
      )}

      {/* ESTADÍSTICAS DE MESAS E INVITADOS */}
      <div className="stats">
        <div className="stat-card">
          <h3>{tables.length}</h3>
          <p>Mesas</p>
        </div>
        <div className="stat-card">
          <h3>{tables.reduce((total, table) => total + table.guests.length, 0)}</h3>
          <p>Asignados</p>
        </div>
        <div className="stat-card">
          <h3>{unassignedGuests.length}</h3>
          <p>Sin asignar</p>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: LISTA DE INVITADOS + MESAS */}
      <div className="content">
        
        {/* SECCIÓN IZQUIERDA: LISTA DE INVITADOS */}
        <div className="guests-section">
          <h2>Invitados</h2>
          <div className="guests-list">
            {filteredGuests().map(guest => {
              const isAssigned = tables.some(table => 
                table.guests.some(g => g.id === guest.id)
              );
              
              return (
                <div
                  key={guest.id}
                  className={`guest-item ${isAssigned ? 'assigned' : ''} ${selectedGuest?.id === guest.id ? 'selected' : ''}`}
                  onClick={() => !isAssigned && selectGuestForAssignment(guest)}
                >
                  <div className="guest-info-compact">
                    <span className="guest-name">{guest.nombre}</span>
                    <span className="guest-details">{guest.relacion} • {guest.grupo}</span>
                  </div>
                  {isAssigned && <span className="assigned-badge">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN DERECHA: VISUALIZACIÓN DE MESAS */}
        <div className="tables-section">
          <h2>Mesas</h2>
          <div className="tables-grid">
            {tables.map(table => (
              <div key={table.id} className="table-card">
                <div className="table-header">
                  <h3>{table.name}</h3>
                  <button onClick={() => deleteTable(table.id)} className="delete-btn">X</button>
                </div>
                
                {/* COMPONENTE VISUAL DE LA MESA */}
                <MesaVisual
                  mesa={table}
                  onAssign={() => assignGuestToTable(table.id)}
                  onRemoveGuest={(guestId) => removeGuestFromTable(table.id, guestId)}
                  isSelected={!!selectedGuest}
                />
                
                {/* INFO Y BOTÓN DE ASIGNACIÓN */}
                <div className="table-info">
                  <span>{table.guests.length}/{table.capacity} invitados</span>
                  {selectedGuest && table.guests.length < table.capacity && (
                    <button 
                      onClick={() => assignGuestToTable(table.id)}
                      className="assign-btn"
                    >
                      Asignar aquí
                    </button>
                  )}
                </div>

                {/* LISTA DE INVITADOS ASIGNADOS A ESTA MESA - SIEMPRE VISIBLE */}
                {table.guests.length > 0 && (
                  <div className="table-guests-list">
                    <div className="guests-list-title">
                      Invitados en esta mesa ({table.guests.length}):
                    </div>
                    <div className="guests-in-table">
                      {table.guests.map(guest => (
                        <div key={guest.id} className="guest-in-table-item">
                          <span className="guest-table-name">{guest.nombre}</span>
                          <span className="guest-table-details">{guest.relacion}</span>
                          <button 
                            className="remove-guest-btn"
                            onClick={() => removeGuestFromTable(table.id, guest.id)}
                            title="Quitar de la mesa"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PIE DE PÁGINA CON BOTONES DE ACCIÓN */}
      <footer className="footer">
        <button onClick={resetTables} className="btn-secondary">Reiniciar Todo</button>
        <button onClick={exportData} className="btn-primary">Exportar Datos</button>
      </footer>
    </div>
  );
}

export default AsignacionMesas;