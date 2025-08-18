import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MesaVisual from './MesaVisual';
import '../assets/scss/_03-Componentes/_AsignacionMesas.scss';

const LOCAL_STORAGE_KEY = 'weddingTablesData';

function AsignacionMesas() {
  // Estados
  const [invitadosData, setInvitadosData] = useState(null);
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [nuevaMesa, setNuevaMesa] = useState({ nombre: '', capacidad: 10, vip: false });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroConfirmados, setFiltroConfirmados] = useState('todos');

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/invitados.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setInvitadosData(data);
        const savedTables = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTables) {
          setTables(JSON.parse(savedTables));
        } else {
          const initialTables = Array.from({ length: 5 }, (_, i) => ({
            id: `table-${i + 1}`,
            name: i === 0 ? 'Mesa Principal' : `Mesa ${i + 1}`,
            capacity: i === 0 ? 10 : 8,
            guests: [],
            vip: i === 0,
          }));
          setTables(initialTables);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setInvitadosData({
          novios: { novia: "Novia", novio: "Novio" },
          grupos: [
            {
              nombre: "Familia Novia",
              invitados: [
                { id: 1, nombre: "Padre Novia", relacion: "Padre", pendiente: false },
                { id: 2, nombre: "Madre Novia", relacion: "Madre", pendiente: false },
              ],
            },
            {
              nombre: "Familia Novio",
              invitados: [
                { id: 3, nombre: "Padre Novio", relacion: "Padre", pendiente: false },
                { id: 4, nombre: "Madre Novio", relacion: "Madre", pendiente: false },
              ],
            },
          ],
        });
      }
    };
    loadData();
  }, []);

  // Guardar en LocalStorage cuando cambian las mesas
  useEffect(() => {
    if (tables.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tables));
    }
  }, [tables]);

  // Obtiene todos los invitados organizados por grupos
  const getAllGuests = useCallback(() => {
    if (!invitadosData) return [];
    return invitadosData.grupos.map((grupo) => ({
      id: `group-${grupo.nombre}`,
      nombre: grupo.nombre,
      pendiente: grupo.pendiente || false,
      invitados: grupo.invitados.map((invitado) => ({
        ...invitado,
        id: `${invitado.id}-${grupo.nombre.replace(/\s+/g, '-')}`,
        grupo: grupo.nombre,
        pendiente: invitado.pendiente || grupo.pendiente || false,
      })),
    }));
  }, [invitadosData]);

  // Filtra grupos según el término de búsqueda
  const filteredGroups = useCallback(() => {
    const allGroups = getAllGuests();
    if (!searchTerm) return allGroups;
    return allGroups
      .map((group) => ({
        ...group,
        invitados: group.invitados.filter((guest) =>
          guest.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.invitados.length > 0);
  }, [searchTerm, getAllGuests]);

  // Maneja el final del arrastre (drop) de un invitado
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Mover entre mesas
    if (source.droppableId.startsWith('table-') && destination.droppableId.startsWith('table-')) {
      const sourceTableIndex = tables.findIndex((t) => t.id === source.droppableId);
      const destTableIndex = tables.findIndex((t) => t.id === destination.droppableId);
      if (sourceTableIndex === -1 || destTableIndex === -1) return;
      if (tables[destTableIndex].guests.length >= tables[destTableIndex].capacity) {
        alert('La mesa de destino está llena');
        return;
      }
      const newTables = [...tables];
      const [movedGuest] = newTables[sourceTableIndex].guests.splice(source.index, 1);
      newTables[destTableIndex].guests.splice(destination.index, 0, movedGuest);
      setTables(newTables);
      return;
    }

    // Mover de lista a mesa
    if (source.droppableId.startsWith('group-') && destination.droppableId.startsWith('table-')) {
      const group = getAllGuests().find((g) => g.id === source.droppableId);
      if (!group) return;
      const guest = group.invitados[source.index];
      if (!guest) return;
      const tableIndex = tables.findIndex((t) => t.id === destination.droppableId);
      if (tableIndex === -1) return;
      if (tables[tableIndex].guests.length >= tables[tableIndex].capacity) {
        alert(`La mesa ${tables[tableIndex].name} está llena (${tables[tableIndex].capacity} personas)`);
        return;
      }
      const isAlreadyAssigned = tables.some((table) =>
        table.guests.some((g) => g.id === guest.id)
      );
      if (isAlreadyAssigned) {
        alert('Este invitado ya está asignado a otra mesa');
        return;
      }
      const guestForTable = { ...guest, grupo: group.nombre };
      const newTables = [...tables];
      newTables[tableIndex].guests.splice(destination.index, 0, guestForTable);
      setTables(newTables);
    }
  }, [tables, getAllGuests]);

  // Reiniciar la ubicación de las mesas
  const reiniciarUbicacionMesas = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar la ubicación de todas las mesas?')) {
      const reiniciarMesas = tables.map((table) => ({ ...table, guests: [] }));
      setTables(reiniciarMesas);
    }
  }, [tables]);

  // Agrega una nueva mesa
  const agregarMesa = useCallback((e) => {
    e.preventDefault();
    const id = `table-${tables.length + 1}`;
    setTables([...tables, { ...nuevaMesa, id, guests: [] }]);
    setNuevaMesa({ nombre: '', capacidad: 8, vip: false });
    setMostrarFormulario(false);
  }, [tables, nuevaMesa]);

  // Elimina una mesa
  const eliminarMesa = useCallback((tableId) => {
    if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
      setTables(tables.filter((table) => table.id !== tableId));
      if (selectedTable === tableId) setSelectedTable(null);
    }
  }, [tables, selectedTable]);

  // Asigna un grupo completo a una mesa
  const assignGroupToTable = useCallback((groupName, tableId) => {
    const group = getAllGuests().find((g) => g.nombre === groupName);
    const table = tables.find((t) => t.id === tableId);
    if (!group || !table) return;
    if (group.invitados.length > table.capacity - table.guests.length) {
      alert(`No hay suficiente espacio en la mesa para todo el grupo ${groupName}`);
      return;
    }
    setTables((prevTables) =>
      prevTables.map((t) => {
        if (t.id === tableId) {
          const newGuests = group.invitados.filter(
            (guest) => !prevTables.some(
              (table) => table.id !== t.id && table.guests.some((g) => g.id === guest.id)
            )
          );
          return { ...t, guests: [...t.guests, ...newGuests] };
        }
        return t;
      })
    );
  }, [tables, getAllGuests]);

  // Remueve un invitado de una mesa
  const removeGuestFromTable = useCallback((tableId, guestId) => {
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id === tableId) {
          return { ...table, guests: table.guests.filter((guest) => guest.id !== guestId) };
        }
        return table;
      })
    );
    setSelectedGuest(null);
  }, []);

  // Obtiene los invitados que no han sido asignados a ninguna mesa
  const getUnassignedGuests = useCallback(() => {
    const allGuests = getAllGuests().flatMap((group) => group.invitados);
    const assignedGuests = tables.flatMap((table) => table.guests);
    return allGuests.filter(
      (guest) => !assignedGuests.some((assigned) => assigned.id === guest.id)
    );
  }, [tables, getAllGuests]);

  // Sugiere una organización automática de mesas
  const sugerirOrganizacionAutomatica = useCallback(() => {
    if (!invitadosData) return;
    const nuevasMesas = tables.map((table) => ({ ...table, guests: [] }));
    const grupos = getAllGuests();
    const gruposOrdenados = [...grupos].sort((a, b) => b.invitados.length - a.invitados.length);
    gruposOrdenados.forEach((grupo) => {
      const mesaAdecuada = nuevasMesas.find(
        (mesa) => mesa.guests.length === 0 && mesa.capacity >= grupo.invitados.length
      );
      if (mesaAdecuada) mesaAdecuada.guests = [...grupo.invitados];
    });
    gruposOrdenados.forEach((grupo) => {
      const yaAsignados = nuevasMesas.some((mesa) =>
        mesa.guests.some((invitado) => invitado.grupo === grupo.nombre)
      );
      if (!yaAsignados) {
        for (let mesa of nuevasMesas) {
          const espacioDisponible = mesa.capacity - mesa.guests.length;
          if (espacioDisponible >= grupo.invitados.length) {
            mesa.guests.push(...grupo.invitados);
            break;
          }
        }
      }
    });
    const invitadosSinAsignar = getUnassignedGuests();
    invitadosSinAsignar.forEach((invitado) => {
      for (let mesa of nuevasMesas) {
        const espacioDisponible = mesa.capacity - mesa.guests.length;
        if (espacioDisponible > 0 && mesa.guests.some((g) => g.grupo === invitado.grupo)) {
          mesa.guests.push(invitado);
          break;
        }
      }
    });
    setTables(nuevasMesas);
  }, [tables, invitadosData, getAllGuests, getUnassignedGuests]);

  // Exporta la distribución de mesas a un archivo de texto
  const exportTables = useCallback(() => {
    if (!invitadosData) return;
    const novios = `Novios: ${invitadosData.novios.novia} & ${invitadosData.novios.novio}`;
    const tableList = tables
      .filter((table) => table.guests.length > 0)
      .map((table) => {
        const guestList = table.guests
          .map((guest) => `  - ${guest.nombre} (${guest.relacion}) [${guest.grupo}]`)
          .join('\n');
        return `${table.name} (${table.guests.length}/${table.capacity}):\n${guestList}`;
      })
      .join('\n\n');
    const blob = new Blob([`${novios}\n\n${tableList}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `distribucion_mesas_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  }, [tables, invitadosData]);

  // Alternar estado VIP de una mesa
  const toggleMesaVip = useCallback((tableId) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, vip: !table.vip } : table
      )
    );
  }, []);

  // Filtrar invitados por estado de confirmación
  const filtrarPorConfirmacion = useCallback((grupo) => {
    if (filtroConfirmados === 'todos') return grupo.invitados;
    return grupo.invitados.filter((invitado) =>
      filtroConfirmados === 'confirmados' ? !invitado.pendiente : invitado.pendiente
    );
  }, [filtroConfirmados]);

  // Mostrar loading si los datos no están cargados
  if (!invitadosData) {
    return (
      <div className="asignacion-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos de invitados...</p>
      </div>
    );
  }

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={() => {
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }}
      onDragUpdate={() => {
        const draggables = document.querySelectorAll('[data-rbd-draggable-id]');
        draggables.forEach((el) => (el.style.transform = 'none'));
      }}
    >
      <div className="asignacion-container">
        {/* Encabezado */}
        <header className="asignacion-header">
          <h1 className="asignacion-titulo">Organización de Mesas</h1>
          <div className="asignacion-controls">
            <div className="asignacion-busqueda">
              <input
                type="text"
                placeholder="Buscar invitado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar invitado"
              />
              <span className="search-icon">🔍</span>
            </div>
            <button
              className="asignacion-nueva-mesa"
              onClick={() => setMostrarFormulario(true)}
              aria-label="Crear nueva mesa"
            >
              <span className="plus-icon">+</span> Nueva Mesa
            </button>
          </div>
        </header>

        {/* Formulario de nueva mesa */}
        {mostrarFormulario && (
          <div className="asignacion-formulario-mesa">
            <h3>Crear Nueva Mesa</h3>
            <form onSubmit={agregarMesa}>
              <div className="formulario-grupo">
                <label htmlFor="nombre-mesa">Nombre de la Mesa</label>
                <input
                  id="nombre-mesa"
                  type="text"
                  value={nuevaMesa.nombre}
                  onChange={(e) => setNuevaMesa({ ...nuevaMesa, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="formulario-grupo">
                <label htmlFor="capacidad-mesa">Capacidad</label>
                <select
                  id="capacidad-mesa"
                  value={nuevaMesa.capacidad}
                  onChange={(e) => setNuevaMesa({ ...nuevaMesa, capacidad: parseInt(e.target.value) })}
                >
                  {[6, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} personas
                    </option>
                  ))}
                </select>
              </div>
              <div className="formulario-botones">
                <button type="submit" className="boton-guardar">
                  Guardar
                </button>
                <button
                  type="button"
                  className="boton-cancelar"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtro de confirmación */}
        <div className="filtro-confirmacion">
          <label>Filtrar por:</label>
          <select
            value={filtroConfirmados}
            onChange={(e) => setFiltroConfirmados(e.target.value)}
          >
            <option value="todos">Todos los invitados</option>
            <option value="confirmados">Solo confirmados</option>
            <option value="pendientes">Pendientes</option>
          </select>
        </div>

        {/* Estadísticas */}
        <div className="asignacion-estadisticas">
          <div className="estadistica-tarjeta">
            <span className="estadistica-numero">{tables.length}</span>
            <span className="estadistica-etiqueta">Mesas</span>
          </div>
          <div className="estadistica-tarjeta">
            <span className="estadistica-numero">
              {tables.reduce((total, mesa) => total + mesa.guests.length, 0)}
            </span>
            <span className="estadistica-etiqueta">Asignados</span>
          </div>
          <div className="estadistica-tarjeta">
            <span className="estadistica-numero">
              {tables.reduce((total, mesa) => total + mesa.capacity, 0)}
            </span>
            <span className="estadistica-etiqueta">Capacidad</span>
          </div>
          <div className="estadistica-tarjeta">
            <span className="estadistica-numero">{getUnassignedGuests().length}</span>
            <span className="estadistica-etiqueta">Sin Asignar</span>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="asignacion-contenido">
          {/* Sección de invitados */}
          <section className="asignacion-invitados">
            <h2 className="asignacion-subtitulo">Lista de Invitados</h2>
            <div className="asignacion-grupos">
              {filteredGroups().map((group) => (
                <div key={group.id} className="grupo-item">
                  <div
                    className="grupo-cabecera"
                    onClick={() => setActiveGroup(activeGroup === group.nombre ? null : group.nombre)}
                    aria-expanded={activeGroup === group.nombre}
                  >
                    <span className="grupo-nombre">
                      {group.nombre} <span className="grupo-contador">({group.invitados.length})</span>
                    </span>
                    <button
                      className="grupo-asignar"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedTable) assignGroupToTable(group.nombre, selectedTable);
                      }}
                      disabled={!selectedTable}
                      aria-label={`Asignar grupo ${group.nombre} a mesa seleccionada`}
                    >
                      ➔
                    </button>
                  </div>
                  {activeGroup === group.nombre && (
                    <Droppable droppableId={group.id} isDropDisabled={false}>
                      {(provided, snapshot) => (
                        <ul
                          className={`grupo-lista ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {filtrarPorConfirmacion(group).map((guest, index) => (
                            <Draggable key={guest.id} draggableId={guest.id} index={index}>
                              {(provided, snapshot) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`invitado-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                                  }}
                                >
                                  <span className="invitado-nombre">{guest.nombre}</span>
                                  {!snapshot.isDragging && (
                                    <>
                                      <span className="invitado-info">
                                        {guest.relacion} • {guest.grupo}
                                      </span>
                                      {tables.some((t) => t.guests.some((g) => g.id === guest.id)) && (
                                        <span className="invitado-asignado">✓</span>
                                      )}
                                    </>
                                  )}
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Sección de mesas */}
          <section className="asignacion-mesas">
            <h2 className="asignacion-subtitulo">Mesas</h2>
            <div className="asignacion-controls-mesas">
              <button onClick={sugerirOrganizacionAutomatica} className="boton-automatico">
                🪄 Sugerir Organización Automática
              </button>
              <button onClick={reiniciarUbicacionMesas} className="boton-reiniciar">
                🔄 Reiniciar Ubicación
              </button>
            </div>
            <div className="mesas-grid">
              {tables.map((table) => (
                <Droppable key={table.id} droppableId={table.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`mesa-container ${table.id === selectedTable ? 'mesa-seleccionada' : ''}`}
                      onClick={() => {
                        setSelectedTable(table.id);
                        setSelectedGuest(null);
                      }}
                    >
                      <div className="mesa-header">
                        <h3>{table.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMesaVip(table.id);
                          }}
                          className={`boton-vip ${table.vip ? 'activo' : ''}`}
                        >
                          {table.vip ? '★ VIP' : 'Marcar VIP'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarMesa(table.id);
                          }}
                          className="boton-eliminar-mesa"
                        >
                          ❌
                        </button>
                      </div>
                      <MesaVisual
                        mesa={table}
                        isVip={table.vip}
                        onSillaClick={(invitado) => setSelectedGuest(invitado)}
                        selectedGuest={selectedGuest}
                      />
                      {provided.placeholder}
                      {selectedGuest && table.guests.some((g) => g.id === selectedGuest.id) && (
                        <div className="invitado-detalle-mesa">
                          <h4>{selectedGuest.nombre}</h4>
                          <p>
                            {selectedGuest.relacion} • {selectedGuest.grupo}
                          </p>
                          <button
                            onClick={() => removeGuestFromTable(table.id, selectedGuest.id)}
                            className="boton-remover"
                          >
                            Quitar de la mesa
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </section>
        </div>

        {/* Pie de página */}
        <footer className="asignacion-pie">
          <button
            className="asignacion-exportar"
            onClick={exportTables}
            aria-label="Exportar distribución de mesas"
          >
            📥 Exportar Distribución
          </button>
        </footer>
      </div>
    </DragDropContext>
  );
}

export default AsignacionMesas;
