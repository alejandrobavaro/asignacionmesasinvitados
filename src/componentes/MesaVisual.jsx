import React from 'react';
import '../assets/scss/_03-Componentes/_MesaVisual.scss';

/**
 * Componente MesaVisual - Muestra una mesa redonda con sillas alrededor
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.mesa - Datos de la mesa a mostrar
 * @param {Function} props.onSillaClick - Maneja el click en una silla
 * @param {Object} props.selectedGuest - Invitado seleccionado actualmente
 * @param {boolean} props.isVip - Indica si la mesa es VIP
 */
const MesaVisual = ({ mesa, onSillaClick, selectedGuest, isVip }) => {
  // Crear array combinado de sillas ocupadas y vacías
  const sillas = [];
  
  // Añadir sillas ocupadas con su número de posición
  mesa.guests.forEach((invitado, index) => {
    sillas.push({
      id: `silla-${invitado.id}`,
      ocupada: true,
      invitado,
      numero: index + 1
    });
  });

  // Añadir sillas vacías con su número de posición
  for (let i = 0; i < mesa.capacity - mesa.guests.length; i++) {
    sillas.push({
      id: `silla-vacia-${i}`,
      ocupada: false,
      numero: mesa.guests.length + i + 1
    });
  }

  // Ordenar sillas para distribución circular uniforme
  const sillasOrdenadas = [];
  const anguloPorSilla = 360 / mesa.capacity;
  
  for (let i = 0; i < mesa.capacity; i++) {
    const angulo = i * anguloPorSilla;
    const sillaIndex = Math.round(angulo / 360 * (sillas.length - 1));
    if (sillas[sillaIndex]) {
      sillasOrdenadas.push({
        ...sillas[sillaIndex],
        angulo
      });
    }
  }

  return (
    <div className="mesa-visual">
      {/* Mesa circular central */}
      <div className={`mesa-circular ${isVip ? 'mesa-vip' : ''}`}>
        <div className="mesa-nombre">
          {mesa.name}<br />
          <span className="mesa-capacidad-indicador">
            {mesa.guests.length}/{mesa.capacity}
          </span>
        </div>
      </div>
      
      {/* Renderizar todas las sillas con posicionamiento circular */}
      {sillasOrdenadas.map((silla) => (
        <div
          key={silla.id}
          className={`silla ${silla.ocupada ? 'silla-ocupada' : 'silla-vacia'} ${silla.invitado?.pendiente ? 'silla-pendiente' : ''}`}
          style={{
            backgroundColor: silla.ocupada && selectedGuest?.id === silla.invitado.id ? '#FFD700' : 
                            silla.ocupada ? '#8B4513' : '#DDD',
            // Posicionamiento dinámico basado en el ángulo
            transform: `rotate(${silla.angulo}deg) translate(85px) rotate(-${silla.angulo}deg)`,
            position: 'absolute',
            top: '50%',
            left: '50%'
          }}
          onClick={() => silla.ocupada && onSillaClick(silla.invitado)}
          data-tooltip={silla.ocupada ? `${silla.invitado.nombre} (${silla.invitado.relacion})` : "Silla vacía"}
        >
          {silla.numero}
        </div>
      ))}
    </div>
  );
};

export default MesaVisual;