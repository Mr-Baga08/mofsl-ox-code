import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const Dashboard = () => {
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/client-info`, {
          withCredentials: true
        });
        
        if (response.data && response.data.status === 'SUCCESS') {
          setClientInfo(response.data.client);
        }
      } catch (err) {
        console.error('Failed to fetch client info:', err);
        setError('Failed to load client information.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientInfo();
  }, []);

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>Novazen MOFSL</h1>
          <p className="lead text-muted">Manage Your MOFSL Data With Us</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header as="h5">Your Information</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading client information...</p>
              ) : clientInfo ? (
                <>
                  <p><strong>Client ID:</strong> {clientInfo.client_id}</p>
                  <p><strong>User ID:</strong> {clientInfo.userid}</p>
                  <p><strong>PAN Card:</strong> {clientInfo.two_fa}</p>
                  <hr />
                  <Button 
                    as={Link} 
                    to="/settings" 
                    variant="outline-primary"
                    className="w-100"
                  >
                    Update Credentials
                  </Button>
                </>
              ) : (
                <p>No client information available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header as="h5">API Status</Card.Header>
            <Card.Body>
              <p><strong>Status:</strong> <span className="text-success">Connected</span></p>
              <p><strong>Last Auth:</strong> {new Date().toLocaleString()}</p>
              <p><strong>API Version:</strong> 1.1.0</p>
              <hr />
              <Button as={Link} to="/api-status" variant="outline-primary" className="w-100">
                View API Status
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header as="h5">Quick Actions</Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/market-data" variant="primary">
                  Access Market Data
                </Button>
                <Button as={Link} to="/orders" variant="primary">
                  Manage Orders
                </Button>
                <Button as={Link} to="/positions" variant="primary">
                  View Positions
                </Button>
                <Button as={Link} to="/reports" variant="primary">
                  Generate Reports
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>

      {/* <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header as="h5">Recent Activity</Card.Header>
            <Card.Body>
              <p className="text-muted">No recent activity to display.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </Container>
  );
};

export default Dashboard;