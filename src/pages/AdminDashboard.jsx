import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Table, Button } from 'react-bootstrap';
import AdminUserDataManager from '../components/AdminUserDataManager';
import { mockUsers } from '../../mockService';
import Card from '../components/Card';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  return (
    <Container className="mt-5">
      <Card/>
      <h2 className='text-dark'>Panel Admin - Usuarios</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">Editar</Button>
                <Button variant="secondary" size="sm">Datos</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button>+</Button>
      <AdminUserDataManager />
      <Button variant="danger" onClick={logout} className="mt-3">Cerrar sesión</Button>
    </Container>
  );
}

export default AdminDashboard;