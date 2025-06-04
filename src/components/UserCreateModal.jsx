import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const UserCreateModal = ({
  show,
  onHide,
  newUserCreate,
  setNewUserCreate,
  onCreate,
}) => {
  console.log(newUserCreate, "Nuevo usuarioaa");
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={newUserCreate.name}
              onChange={(e) =>
                setNewUserCreate({ ...newUserCreate, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={newUserCreate.email}
              onChange={(e) =>
                setNewUserCreate({ ...newUserCreate, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              value={newUserCreate.role}
              onChange={(e) =>
                setNewUserCreate({ ...newUserCreate, role: e.target.value })
              }
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={newUserCreate.password}
              onChange={(e) =>
                setNewUserCreate({ ...newUserCreate, password: e.target.value })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onCreate}>
          Crear
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserCreateModal;
