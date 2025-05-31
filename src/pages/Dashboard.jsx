import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Button } from 'react-bootstrap';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <Container className="mt-5">
      <h2>Bienvenido, {user.name} ({user.role})</h2>
      <Button variant="danger" onClick={logout} className="mt-3">
        Cerrar sesión
      </Button>
    </Container>
  );
}

export default Dashboard;