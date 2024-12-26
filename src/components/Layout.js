import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaMoon, FaSun } from 'react-icons/fa';

const Layout = ({ theme, setTheme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // API isteği burada yapılacak
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`app ${theme}`}>
      <Navbar bg={theme} variant={theme} expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/dashboard">URL Kısaltıcı</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <NavDropdown 
                title={<FaUser size={20} />} 
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => navigate('/profile')}>
                  Profil
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/subscription')}>
                  Abonelik
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                  {theme === 'light' ? <FaMoon className="me-2" /> : <FaSun className="me-2" />}
                  {theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Çıkış Yap
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout; 