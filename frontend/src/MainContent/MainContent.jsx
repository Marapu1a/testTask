import OfficeRoomStatus from "../OfficeRoomStatus/OfficeRoomStatus";
import './MainContent.css';

// eslint-disable-next-line react/prop-types
function MainContent({ onLogout }) {
  return (
    <div className="main-content">
      <div className="walking-container">
        <div className="walking-person">
          <div className="head"></div>
          <div className="body"></div>
          <div className="leg left-leg"></div>
          <div className="leg right-leg"></div>
          <div className="arm left-arm"></div>
          <div className="arm right-arm"></div>
        </div>
      </div>
      <OfficeRoomStatus />
      <button onClick={onLogout}>Выйти</button>
    </div>
  );
}

export default MainContent;