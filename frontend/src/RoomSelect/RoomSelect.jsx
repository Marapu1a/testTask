/* eslint-disable react/prop-types */
function RoomSelect({ rooms, selectedRoom, onSelectRoom, disabled }) {
  return (
    <div>
      <label>Выберите комнату:</label>
      <select value={selectedRoom || ''} onChange={(e) => onSelectRoom(e.target.value)} disabled={disabled}>
        <option value="">-- Выберите комнату --</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            Room {room.number}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RoomSelect;