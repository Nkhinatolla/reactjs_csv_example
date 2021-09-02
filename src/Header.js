import { Link, useHistory } from 'react-router-dom';
import './header.css';

export const Header = () => {
  const history = useHistory();
  const username = localStorage.getItem('username');

  const onLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return <div className="header">
    <p className="header__logo">FakeCSV</p>
    <Link to="/" className="header__link">Schemas</Link>
    <div className="profile">
      <p>Hello <strong>{username || 'User'}</strong></p>
      <p className="logout" onClick={onLogout}>Logout</p>
    </div>
  </div>
};
