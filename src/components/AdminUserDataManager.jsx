import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import UserDataForm from '../../UserDataForm';
import { getUserData, saveUserData, mockUsers } from '../../mockService';

function AdminUserDataManager() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelectUser = (e) => {
    const id = parseInt(e.target.value);
    setSelectedUserId(id);
    const data = getUserData(id);
    setUserData(data);
  };

  const handleAdd = () => {
    setSelected(null);
    setShowModal(true);
  };

  const handleSave = (newEntry) => {
    saveUserData(selectedUserId, newEntry);
    const updated = getUserData(selectedUserId);
    setUserData(updated);
    setShowModal(false);
  };

  return (
    <Container className="mt-5">
      <h4>Gestión de Datos por Usuario</h4>
      <Form.Select onChange={handleSelectUser} className="mb-3">
        <option value="">Seleccionar Usuario</option>
        {mockUsers.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </Form.Select>

      {selectedUserId && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((item) => (
                <tr key={item.id}>
                  <td>{item.type}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="primary" onClick={handleAdd}>Agregar Dato</Button>
        </>
      )}

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

export default AdminUserDataManager;