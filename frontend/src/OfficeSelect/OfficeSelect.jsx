/* eslint-disable react/prop-types */
function OfficeSelect({ offices, selectedOffice, onSelectOffice }) {
  return (
    <div>
      <label>Выберите офис:</label>
      <select value={selectedOffice || ''} onChange={(e) => onSelectOffice(e.target.value)}>
        <option value="">-- Выберите офис --</option>
        {offices.map((office) => (
          <option key={office.id} value={office.id}>
            {office.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OfficeSelect;