import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <Alert variant="warning">
            <h4>Page Not Found</h4>
            <p>The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn btn-primary">Go to Dashboard</Link>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;