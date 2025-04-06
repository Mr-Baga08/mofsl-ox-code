import React from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import UpdateCredentials from './UpdateCredentials';
import { useNavigate, useLocation } from 'react-router-dom';

const ClientSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Account Settings</h2>
          <p className="text-muted">Manage your account settings and credentials</p>
        </Col>
      </Row>
      
      <Row>
        <Col md={3} className="mb-4">
          <Card>
            <Card.Header>Settings Menu</Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                <Nav.Link 
                  active={currentPath === '/settings/credentials'} 
                  onClick={() => handleNavClick('/settings/credentials')}
                  className="ps-3 py-2"
                >
                  Credentials
                </Nav.Link>
                <Nav.Link 
                  active={currentPath === '/settings/profile'} 
                  onClick={() => handleNavClick('/settings/profile')}
                  className="ps-3 py-2"
                >
                  Profile
                </Nav.Link>
                <Nav.Link 
                  active={currentPath === '/settings/preferences'} 
                  onClick={() => handleNavClick('/settings/preferences')}
                  className="ps-3 py-2"
                >
                  Preferences
                </Nav.Link>
                <Nav.Link 
                  active={currentPath === '/settings/security'} 
                  onClick={() => handleNavClick('/settings/security')}
                  className="ps-3 py-2"
                >
                  Security
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          {currentPath === '/settings' || currentPath === '/settings/credentials' ? (
            <UpdateCredentials />
          ) : currentPath === '/settings/profile' ? (
            <Card>
              <Card.Header as="h5">Profile</Card.Header>
              <Card.Body>
                <p>Profile settings will be implemented in a future update.</p>
              </Card.Body>
            </Card>
          ) : currentPath === '/settings/preferences' ? (
            <Card>
              <Card.Header as="h5">Preferences</Card.Header>
              <Card.Body>
                <p>Preference settings will be implemented in a future update.</p>
              </Card.Body>
            </Card>
          ) : currentPath === '/settings/security' ? (
            <Card>
              <Card.Header as="h5">Security</Card.Header>
              <Card.Body>
                <p>Security settings will be implemented in a future update.</p>
              </Card.Body>
            </Card>
          ) : (
            <UpdateCredentials />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ClientSettings;