/* eslint-disable react/prop-types */
function WorkplaceTable({ workplaces }) {
    console.log("Загруженные рабочие места:", workplaces);  // Отображаем рабочие места в консоли для проверки
  
    return (
      <table>
        <thead>
          <tr>
            <th>Рабочее место</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {workplaces.map((workplace) => (
            <tr key={workplace.id}>
              <td>Workplace {workplace.number}</td>
              <td style={{ color: workplace.is_occupied ? 'red' : 'green' }}>
                {workplace.is_occupied ? 'Занято' : 'Свободно'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  
  export default WorkplaceTable;  