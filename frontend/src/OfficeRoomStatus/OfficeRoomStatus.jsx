import { useState, useEffect } from 'react';
import { getOffices, getRooms, getWorkplaces } from '../api';
import OfficeSelect from '../OfficeSelect/OfficeSelect';
import RoomSelect from '../RoomSelect/RoomSelect';
import WorkplaceTable from '../WorkplaceTable/WorkplaceTable';

function OfficeRoomStatus() {
  const [offices, setOffices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [workplaces, setWorkplaces] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    async function loadOffices() {
      const officesData = await getOffices();
      setOffices(officesData);
    }
    loadOffices();
  }, []);

  useEffect(() => {
    if (selectedOffice) {
      async function loadRooms() {
        const roomsData = await getRooms(selectedOffice);
        setRooms(roomsData);
      }
      loadRooms();
    } else {
      setRooms([]);
      setWorkplaces([]);
    }
  }, [selectedOffice]);

  useEffect(() => {
    if (selectedRoom) {
      async function loadWorkplaces() {
        const workplacesData = await getWorkplaces(selectedRoom);
        setWorkplaces(workplacesData);
      }
      loadWorkplaces();
    } else {
      setWorkplaces([]);
    }
  }, [selectedRoom]);

  return (
    <div>
      <h2>Статус рабочих мест</h2>
      <OfficeSelect offices={offices} selectedOffice={selectedOffice} onSelectOffice={setSelectedOffice} />
      <RoomSelect rooms={rooms} selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} disabled={!selectedOffice} />
      {workplaces.length > 0 && <WorkplaceTable workplaces={workplaces} />}
    </div>
  );
}

export default OfficeRoomStatus;