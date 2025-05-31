import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import UserDataForm from './UserDataForm';
import { getUserData, saveUserData } from '../../mockService';

function UserDataManager() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadData = () => {
    const userData = getUserData(user.id);
    setData(userData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setSelected("Nuevo");
    setShowModal(true);
  };

  const handleSave = (newEntry) => {
    saveUserData(user.id, newEntry);
    setShowModal(false);
    loadData();
  };

  return (
    <Container className="mt-5">
      <h3>Mis Estudios y Direcciones</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.type}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={handleAdd}>Agregar Nuevo</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selected ? 'Editar' : 'Nuevo'} Dato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserDataForm initialData={selected} onSave={handleSave} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default UserDataManager;
