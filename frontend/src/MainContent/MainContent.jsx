import OfficeRoomStatus from "../OfficeRoomStatus/OfficeRoomStatus";

// eslint-disable-next-line react/prop-types
function MainContent({ onLogout }) {
  return (
    <div>
      <h1>Добро пожаловать!</h1>
      <button onClick={onLogout}>Выйти</button>
      <OfficeRoomStatus />  {/* Вставляем компонент статуса рабочих мест */}
    </div>
  );
}

export default MainContent;