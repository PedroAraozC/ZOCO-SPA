import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button } from 'react-bootstrap';
import UserDataManager from '../components/UserDataManager';

function UserProfile() {
  const { user, logout } = useAuth();
console.log(user)
  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title>Mi Perfil</Card.Title>
          <Card.Text><strong>Nombre:</strong> {user.name}</Card.Text>
          <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
          <Card.Text><strong>Rol:</strong> {user.role}</Card.Text>
          <Button variant="primary" className="me-2">Editar Datos</Button>
          <Button variant="secondary">Estudios / Direcciones</Button>
          <UserDataManager />
        </Card.Body>
      </Card>
      <Button variant="danger" onClick={logout} className="mt-3">Cerrar sesión</Button>
    </Container>
  );
}

export default UserProfile;