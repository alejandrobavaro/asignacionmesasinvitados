import React, { useMemo } from 'react';
import '../assets/scss/_03-Componentes/_MesaVisual.scss';

/**
 * Componente visual de una mesa con sillas asignables
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.mesa - Datos de la mesa (id, name, capacity, guests)
 * @param {Function} props.onSillaClick - Maneja clic en una silla ocupada
 * @param {Object} props.selectedGuest - Invitado seleccionado actualmente
 * @param {Boolean} props.isVip - Indica si la mesa es VIP
 */
const MesaVisual = ({ mesa, onSillaClick, selectedGuest, isVip }) => {
  // Genera IDs únicos y estables para las sillas
  const sillasOrdenadas = useMemo(() => {
    const generarIdSilla = (mesaId, sillaNumero, invitadoId = null) => {
      return `silla-${mesaId}-${sillaNumero}${invitadoId ? `-${invitadoId}` : ''}`;
    };
    // Sillas ocupadas
    const sillasOcupadas = mesa.guests.map((invitado, index) => ({
      id: generarIdSilla(mesa.id, index + 1, invitado.id),
      ocupada: true,
      invitado,
      numero: index + 1,
    }));
    // Sillas vacías
    const sillasVacias = Array.from(
      { length: Math.max(0, mesa.capacity - mesa.guests.length) },
      (_, i) => ({
        id: generarIdSilla(mesa.id, mesa.guests.length + i + 1),
        ocupada: false,
        numero: mesa.guests.length + i + 1,
      })
    );
    // Combina y ordena las sillas en círculo
    const todasLasSillas = [...sillasOcupadas, ...sillasVacias];
    const anguloPorSilla = 360 / mesa.capacity;

    return Array.from({ length: mesa.capacity }, (_, i) => {
      const angulo = i * anguloPorSilla;
      const sillaIndex = Math.round((angulo / 360) * (todasLasSillas.length - 1));
      return {
        ...todasLasSillas[sillaIndex],
        angulo,
      };
    });
  }, [mesa.id, mesa.capacity, mesa.guests]);

  return (
    <div className="mesa-visual">
      <div className={`mesa-circular ${isVip ? 'mesa-vip' : ''}`}>
        <div className="mesa-nombre">
          {mesa.name}
          <br />
          <span className="mesa-capacidad-indicador">
            {mesa.guests.length}/{mesa.capacity}
          </span>
        </div>
      </div>

      {sillasOrdenadas.map((silla) => (
        <div
          key={silla.id}
          className={`silla ${silla.ocupada ? 'silla-ocupada' : 'silla-vacia'} ${silla.invitado?.pendiente ? 'silla-pendiente' : ''}`}
          style={{
            backgroundColor: silla.ocupada && selectedGuest?.id === silla.invitado.id
              ? '#FFD700'
              : silla.ocupada
              ? '#8B4513'
              : '#DDD',
            transform: `rotate(${silla.angulo}deg) translate(85px) rotate(-${silla.angulo}deg)`,
            position: 'absolute',
            top: '50%',
            left: '50%',
          }}
          onClick={() => silla.ocupada && onSillaClick(silla.invitado)}
          data-tooltip={silla.ocupada ? `${silla.invitado.nombre} (${silla.invitado.relacion})` : 'Silla vacía'}
          aria-label={silla.ocupada ? `Silla ocupada por ${silla.invitado.nombre}` : 'Silla vacía'}
        >
          {silla.numero}
        </div>
      ))}
    </div>
  );
};

export default React.memo(MesaVisual);
