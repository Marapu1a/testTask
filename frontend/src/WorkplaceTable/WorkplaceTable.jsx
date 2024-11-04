import { useState } from 'react';
import WorkplaceDetails from '../WorkplaceDetails/WorkplaceDetails';

/* eslint-disable react/prop-types */
function WorkplaceTable({ workplaces }) {
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);

  const handleClick = (workplace) => {
    setSelectedWorkplace(workplace);  // Сохраняем выбранное рабочее место
  };

  return (
    <div>
      {selectedWorkplace ? (
        <WorkplaceDetails 
          workplace={selectedWorkplace}  // Передаем объект workplace
          onClose={() => setSelectedWorkplace(null)} 
        />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Рабочее место</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {workplaces.map((workplace) => (
              <tr 
                key={workplace.id} 
                onClick={() => handleClick(workplace)}  // Делаем строку кликабельной
                style={{ cursor: 'pointer' }}
              >
                <td>Workplace {workplace.number}</td>
                <td style={{ color: workplace.is_occupied ? 'red' : 'green' }}>
                  {workplace.is_occupied ? 'Занято' : 'Свободно'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkplaceTable;