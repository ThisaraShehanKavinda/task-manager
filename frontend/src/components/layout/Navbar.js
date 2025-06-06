import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Task Manager
        </Link>

        <div className="navbar-menu">
          {user && (
            <>
              <Link to="/" className="navbar-link">
                Dashboard
              </Link>
              <div className="navbar-user">
                <FaUserCircle className="user-icon" />
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt className="logout-icon" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;