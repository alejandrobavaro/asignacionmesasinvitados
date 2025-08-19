import React from 'react';
import '../assets/scss/_03-Componentes/_MesaVisual.scss';

const MesaVisual = ({ mesa, onAssign, onRemoveGuest, isSelected }) => {
  const handleSeatClick = (guest, index) => {
    if (guest && onRemoveGuest) {
      onRemoveGuest(guest.id);
    }
  };

  return (
    <div className="mesa-visual">
      <div className={`mesa-circle ${mesa.vip ? 'vip' : ''}`}>
        <div className="mesa-info">
          <div className="mesa-name">{mesa.name}</div>
          <div className="mesa-count">{mesa.guests.length}/{mesa.capacity}</div>
        </div>
      </div>

      {/* Sillas alrededor de la mesa */}
      {Array.from({ length: mesa.capacity }, (_, index) => {
        const guest = mesa.guests[index];
        const angle = (index * (360 / mesa.capacity)) - 90; // -90 para empezar en la parte superior
        const radius = 70;
        
        const x = radius * Math.cos(angle * Math.PI / 180);
        const y = radius * Math.sin(angle * Math.PI / 180);

        return (
          <div
            key={index}
            className={`silla ${guest ? 'occupied' : 'empty'} ${isSelected && !guest ? 'available' : ''}`}
            style={{
              transform: `translate(${x}px, ${y}px)`
            }}
            onClick={() => handleSeatClick(guest, index)}
            title={guest ? `${guest.nombre} (${guest.relacion})` : 'Silla vacía'}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(MesaVisual);