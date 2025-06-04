import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import {
  getUserData,
  saveUserData,
  deleteUserData,
  getAllUsers,
} from "../../mockService";
import UserDataForm from "../components/UserDataForm";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaEye,
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import CardProfile from "../components/CardProfile";
import "../styles/AdminDashboard.css"; // Asegúrate de tener este archivo para estilos personalizados

const AdminUserDataManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    try {
      const allUsers = getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Error al cargar la lista de usuarios");
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      setLoading(true);
      try {
        const data = getUserData(selectedUserId);
        setUserData([...data]);
        const user = users.find((u) => u.id === selectedUserId);
        setSelectedUser(user || null);
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Error al cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    } else {
      setUserData([]);
      setSelectedUser(null);
    }
  }, [selectedUserId, users]);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  const handleAdd = () => {
    setSelected({ type: "estudio" });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelected({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    const item = userData.find((data) => data.id === itemId);
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setActionLoading(true);
    try {
      const success = deleteUserData(selectedUserId, itemToDelete.id);
      if (success) {
        setUserData((prev) =>
          prev.filter((item) => item.id !== itemToDelete.id)
        );
        setShowDeleteModal(false);
        setItemToDelete(null);
      } else {
        throw new Error();
      }
    } catch {
      setError("Error al eliminar el elemento");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleSave = (newEntry) => {
    setActionLoading(true);
    try {
      const saved = saveUserData(selectedUserId, newEntry);
      setUserData((prev) => {
        const exists = prev.some((item) => item.id === newEntry.id);
        return exists
          ? prev.map((item) => (item.id === newEntry.id ? saved : item))
          : [...prev, saved];
      });
      setShowModal(false);
      setSelected(null);
    } catch {
      setError("Error al guardar el elemento");
    } finally {
      setActionLoading(false);
    }
  };

  const renderDescription = (item) => {
    if (item.type === "estudio") {
      const { institution, degree, status } = item.data;
      return (
        <>
          <div>
            <strong>{degree}</strong>
          </div>
          <div className="text-muted">{institution}</div>
          <Badge
            bg={
              status === "completado"
                ? "success"
                : status === "en_curso"
                ? "info"
                : "warning"
            }
            className="mt-1"
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
          </Badge>
        </>
      );
    } else {
      const { street, city, province, addressType } = item.data;
      return (
        <>
          <div>
            <strong>{street}</strong>
          </div>
          <div className="text-muted">
            {city}, {province}
          </div>
          <Badge bg="secondary" className="mt-1">
            {addressType.charAt(0).toUpperCase() + addressType.slice(1)}
          </Badge>
        </>
      );
    }
  };

  const UserCard = ({ user, isSelected, onSelect }) => (
    <Card
      className={`mb-2 user-card ${
        isSelected ? "border-primary bg-light" : ""
      }`}
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(user.id)}
    >
      <Card.Body className="py-2">
        <Row className="align-items-center">
          <Col xs={12} sm={6} md={4}>
            <div className="d-flex align-items-center">
              <FaUser className="me-2 text-primary" />
              <div>
                <strong className="d-block">{user.name}</strong>
                <small className="text-muted d-sm-none">ID: {user.id}</small>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} className="mt-1 mt-sm-0">
            <div className="d-flex align-items-center">
              <FaEnvelope className="me-2 text-secondary d-none d-md-inline" />
              <small className="text-break">{user.email}</small>
            </div>
          </Col>
          <Col xs={12} md={3} className="mt-1 mt-md-0">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FaUserTag className="me-2 text-info d-none d-md-inline" />
                <Badge bg="info">{user.role}</Badge>
              </div>
              {isSelected && (
                <FaEye className="text-primary d-none d-md-inline" />
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="mt-3 px-2 px-md-4">
      <CardProfile />
      <h4 className="mb-3">Gestión de Usuarios</h4>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        {/* Panel de Usuarios */}
        <Col lg={5} xl={4} className="mb-4">
         <Card className="user-list-section">
            <Card.Header
              className=" text-dark "
              style={{ borderBottom: "none", background: "transparent" }}
            >
              {" "}
              <h6 className="mb-0">
                <FaUser className="me-2" />
                Lista de Usuarios ({users.length})
              </h6>
            </Card.Header>
            <Card.Body
              className="p-2"
              style={{ maxHeight: "600px", overflowY: "auto" }}
            >
              {users.length === 0 ? (
                <div className="text-center py-4">
                  <FaUser size={32} className="text-muted mb-2" />
                  <p className="text-muted mb-0">No hay usuarios disponibles</p>
                </div>
              ) : (
                users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={selectedUserId === user.id}
                    onSelect={handleSelectUser}
                  />
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Panel de Datos del Usuario */}
        <Col lg={7} xl={8}>
          {!selectedUserId ? (
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <FaUser size={64} className="text-muted mb-3" />
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
                      <FaEye className="me-2" />
                      Datos de {selectedUser?.name}
                    </h6>
                    <small>
                      {selectedUser?.email} - {selectedUser?.role}
                    </small>
                  </Col>
                  <Col xs={12} sm={4} className="text-sm-end mt-2 mt-sm-0">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={handleAdd}
                      disabled={actionLoading}
                      className="w-100 w-sm-auto"
                    >
                      <FaPlus className="me-2" /> Agregar Dato
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
                      Puedes agregar estudios o direcciones usando el botón
                      superior
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Vista de tabla para pantallas grandes */}
                    <div className="d-none d-lg-block">
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
                                  bg={
                                    item.type === "estudio"
                                      ? "primary"
                                      : "danger"
                                  }
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
                              <td>{renderDescription(item)}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    disabled={actionLoading}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
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
                    </div>

                    {/* Vista de cards para pantallas pequeñas/medianas */}
                    <div className="d-lg-none user-data-cards-container">
                      {userData.map((item) => (
                         <Card key={item.id} className="mb-3 user-data-card">
                          <Card.Body>
                            <Row className="align-items-start">
                              <Col xs={12} className="mb-2">
                                <Badge
                                  bg={
                                    item.type === "estudio"
                                      ? "primary"
                                      : "danger"
                                  }
                                  className="mb-2"
                                >
                                  {item.type === "estudio" ? (
                                    <FaGraduationCap className="me-1" />
                                  ) : (
                                    <FaMapMarkerAlt className="me-1" />
                                  )}
                                  {item.type.charAt(0).toUpperCase() +
                                    item.type.slice(1)}
                                </Badge>
                              </Col>
                              <Col xs={12} sm={8} className="mb-2 mb-sm-0">
                                {renderDescription(item)}
                              </Col>
                              <Col xs={12} sm={4}>
                                <div className="d-flex gap-2 justify-content-sm-end">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    disabled={actionLoading}
                                    className="flex-fill flex-sm-grow-0"
                                  >
                                    <FaEdit className="me-1" />
                                    <span className="d-sm-none">Editar</span>
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                    disabled={actionLoading}
                                    className="flex-fill flex-sm-grow-0"
                                  >
                                    <FaTrash className="me-1" />
                                    <span className="d-sm-none">Eliminar</span>
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <UserDataForm
        initialData={selected}
        onSave={handleSave}
        showModal={showModal}
        setShow={() => setShowModal(false)}
        setInitialData={setSelected}
      />

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        show={showDeleteModal}
        onHide={cancelDelete}
        centered
        size="sm"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <div className="text-danger mb-2">
              <FaExclamationTriangle size={48} />
            </div>
            <h5 className="text-dark mb-0">Confirmar Eliminación</h5>
          </Modal.Title>
          <Button
            variant="link"
            className="position-absolute top-0 end-0 mt-2 me-2 p-1 text-muted"
            onClick={cancelDelete}
            style={{ fontSize: "1.2rem", textDecoration: "none" }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>

        <Modal.Body className="text-center px-4">
          <p className="mb-3">
            ¿Estás seguro de que quieres eliminar este elemento?
          </p>

          {itemToDelete && (
            <div className="bg-light p-3 rounded mb-3">
              <Badge
                bg={itemToDelete.type === "estudio" ? "primary" : "danger"}
                className="mb-2"
              >
                {itemToDelete.type === "estudio" ? (
                  <FaGraduationCap className="me-1" />
                ) : (
                  <FaMapMarkerAlt className="me-1" />
                )}
                {itemToDelete.type.charAt(0).toUpperCase() +
                  itemToDelete.type.slice(1)}
              </Badge>
              <div className="mt-2">
                {itemToDelete.type === "estudio" ? (
                  <>
                    <div>
                      <strong>{itemToDelete.data.degree}</strong>
                    </div>
                    <div className="text-muted small">
                      {itemToDelete.data.institution}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>{itemToDelete.data.street}</strong>
                    </div>
                    <div className="text-muted small">
                      {itemToDelete.data.city}, {itemToDelete.data.province}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <p className="text-muted small mb-0">
            Esta acción no se puede deshacer.
          </p>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 justify-content-center">
          <div className="d-flex gap-2 w-100">
            <Button
              variant="outline-secondary"
              onClick={cancelDelete}
              disabled={actionLoading}
              className="flex-fill"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={actionLoading}
              className="flex-fill"
            >
              {actionLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Eliminando...
                </>
              ) : (
                <>
                  <FaTrash className="me-2" />
                  Eliminar
                </>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {actionLoading && (
        <div className="position-fixed bottom-0 end-0 p-3">
          <div className="bg-primary text-white p-2 rounded">
            <small>Procesando...</small>
          </div>
        </div>
      )}

      <style jsx>{`
        .user-card {
          transition: all 0.2s ease;
        }
        .user-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .user-card.border-primary {
          border-width: 2px !important;
        }
        @media (max-width: 576px) {
          .container-fluid {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
      `}</style>
    </Container>
  );
};

export default AdminUserDataManager;
