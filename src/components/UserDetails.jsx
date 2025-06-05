import React, { useState } from "react";
import { Card, Row, Col, Button, Spinner, Table, Badge } from "react-bootstrap";
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import UserDataForm from "./UserDataForm";
import { FaPencil } from "react-icons/fa6";
import RenderDescripcion from "./RenderDescripcion";
import ModalEditUser from "./ModalEditUser";
import { updateUserProfile } from "../../mockService";

const UserDetails = ({
  loading,
  user,
  userData,
  onAdd,
  onEdit,
  onDelete,
  onSave,
  showModal,
  setShowModal,
  selected,
  setSelected,
  actionLoading,
  onUpdateUser,
}) => {
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  const handleSaveUser = async (updatedUser) => {
    try {
      console.log(updatedUser);
      const updated = await updateUserProfile(user.id, updatedUser);
      await updateUserProfile(user.id, updatedUser);
      alert("Usuario actualizado correctamente");
      setShowEditUserModal(false);
      if (typeof onUpdateUser === "function") {
        onUpdateUser(updated);
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      alert("Hubo un error al guardar los cambios");
    }
  };

  return (
    <Col>
      {!user ? (
        <Card style={{ height: "auto" }}>
          <Card.Body className="d-flex align-items-center justify-content-center">
            <div className="text-center">
              <FaEye size={64} className="text-muted mb-3" />
              <h5 className="text-muted">Selecciona un usuario</h5>
              <p className="text-muted">
                Haz clic en un usuario de la lista para ver y gestionar sus
                datos
              </p>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card className="user-data-section">
          <Card.Header
            className="bg-white text-dark"
            style={{ borderBottom: "none" }}
          >
            <Row className="align-items-center">
              <Col xs={12} sm={8}>
                <h6 className="mb-0">
                  <FaEye className="me-2" /> Datos de {user?.name}
                </h6>
                <small>
                  {user?.email} - {user?.role}
                </small>
              </Col>
              <Col
                xs={12}
                sm={4}
                className="text-sm-end mt-2 mt-sm-0 d-flex align-items-center"
              >
                <Button
                  variant="light"
                  size="sm"
                  onClick={onAdd}
                  disabled={actionLoading}
                  className="w-50 w-sm-auto"
                >
                  <FaPlus className="me-2" /> Agregar Dato
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  className="w-50"
                  onClick={() => setShowEditUserModal(true)}
                >
                  <FaPencil className=" me-2" />
                  Editar Usuario
                </Button>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="p-2 p-md-3">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 mb-0">Cargando datos del usuario...</p>
              </div>
            ) : userData.length === 0 ? (
              <div className="text-center py-5">
                <FaGraduationCap size={48} className="text-muted mb-3" />
                <h6>No hay datos registrados para este usuario</h6>
                <p className="text-muted mb-0">
                  Puedes agregar estudios o direcciones usando el botón superior
                </p>
              </div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th style={{ width: "120px" }}>Tipo</th>
                    <th>Información</th>
                    <th style={{ width: "120px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Badge
                          bg={item.type === "estudio" ? "primary" : "danger"}
                        >
                          {item.type === "estudio" ? (
                            <FaGraduationCap className="me-1" />
                          ) : (
                            <FaMapMarkerAlt className="me-1" />
                          )}
                          {item.type.charAt(0).toUpperCase() +
                            item.type.slice(1)}
                        </Badge>
                      </td>
                      <td>{RenderDescripcion(item)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => onEdit(item)}
                            disabled={actionLoading}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(item.id)}
                            disabled={actionLoading}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
          <ModalEditUser
            show={showEditUserModal}
            onHide={() => setShowEditUserModal(false)}
            user={user}
            onSave={handleSaveUser}
          />
          <UserDataForm
            initialData={selected}
            onSave={onSave}
            showModal={showModal}
            setShow={() => setShowModal(false)}
            setInitialData={setSelected}
          />
        </Card>
      )}
    </Col>
  );
};

export default UserDetails;
