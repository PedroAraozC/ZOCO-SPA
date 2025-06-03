import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Table, Button, Badge, Card, Row, Col, Alert } from "react-bootstrap";
import UserDataForm from "./UserDataForm";
import { getUserData, saveUserData, deleteUserData, getDataDescription } from "../../mockService";
import { FaPlus, FaEdit, FaTrash, FaGraduationCap, FaMapMarkerAlt, FaUser, FaRedo } from "react-icons/fa";
import "../styles/UserDataManager.css";

function UserDataManager() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const userData = getUserData(user.id);
      setData([...userData]); // Crear nueva referencia para forzar re-render
      console.log('Datos cargados para usuario', user.id, userData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Función para refrescar datos manualmente
  const handleRefresh = () => {
    loadData();
  };

  const handleAdd = () => {
    setSelected({ type: "estudio" }); // Valor por defecto
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelected({ ...item }); // Crear copia para evitar mutaciones
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
      setActionLoading(true);
      try {
        const success = deleteUserData(user.id, itemId);
        if (success) {
          // Actualizar estado local inmediatamente
          setData(prevData => prevData.filter(item => item.id !== itemId));
          console.log('Elemento eliminado:', itemId);
        } else {
          throw new Error('Error al eliminar el elemento');
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        setError("Error al eliminar el elemento");
        // Recargar datos en caso de error
        await loadData();
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (newEntry) => {
    setActionLoading(true);
    try {
      const savedEntry = saveUserData(user.id, newEntry);
      console.log('Elemento guardado:', savedEntry);
      
      // Actualizar estado local inmediatamente
      if (newEntry.id) {
        // Actualización de elemento existente
        setData(prevData => 
          prevData.map(item => 
            item.id === newEntry.id ? savedEntry : item
          )
        );
      } else {
        // Nuevo elemento
        setData(prevData => [...prevData, savedEntry]);
      }
      
      setShowModal(false);
      setSelected(null);
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Error al guardar el elemento");
      // Recargar datos en caso de error
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelected(null);
  };

  const getTypeIcon = (type) => {
    return type === "estudio" ? (
      <FaGraduationCap className="text-primary" />
    ) : (
      <FaMapMarkerAlt className="text-danger" />
    );
  };

  const getTypeBadge = (type) => {
    return type === "estudio" ? (
      <Badge bg="primary" className="type-badge">
        <FaGraduationCap className="me-1" />
        Estudio
      </Badge>
    ) : (
      <Badge bg="danger" className="type-badge">
        <FaMapMarkerAlt className="me-1" />
        Dirección
      </Badge>
    );
  };

  const getDetailedDescription = (item) => {
    if (item.type === "estudio") {
      const { institution, degree, status } = item.data;
      return (
        <div className="detailed-description">
          <div className="degree-title">{degree}</div>
          <div className="institution-info">{institution}</div>
          <Badge 
            bg={status === "completado" ? "success" : status === "en_curso" ? "info" : "warning"}
            className="status-badge"
          >
            {status === "completado" ? "Completado" : 
             status === "en_curso" ? "En Curso" : 
             status === "pausado" ? "Pausado" : "Abandonado"}
          </Badge>
        </div>
      );
    } else {
      const { street, city, province, addressType } = item.data;
      return (
        <div className="detailed-description">
          <div className="address-title">{street}</div>
          <div className="location-info">{city}, {province}</div>
          <Badge bg="secondary" className="status-badge">
            {addressType === "personal" ? "Personal" : 
             addressType === "laboral" ? "Laboral" : 
             addressType === "familiar" ? "Familiar" : "Otro"}
          </Badge>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <Container className="loading-container">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando datos del usuario...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          No se pudo cargar la información del usuario.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 user-data-container">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {data.length > 0 && (
        <Row className="stats-row">
          <Col md={6}>
            <Card className="stats-card estudios">
              <Card.Body className="stats-card-body">
                <FaGraduationCap size={32} className="text-primary stats-icon" />
                <h4 className="text-primary stats-number">
                  {data.filter(item => item.type === "estudio").length}
                </h4>
                <small className="stats-label">Estudios registrados</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="stats-card direcciones">
              <Card.Body className="stats-card-body">
                <FaMapMarkerAlt size={32} className="text-danger stats-icon" />
                <h4 className="text-danger stats-number">
                  {data.filter(item => item.type === "direccion").length}
                </h4>
                <small className="stats-label">Direcciones registradas</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Card className="user-data-card">
        <Card.Header className="user-data-header bg-gradient text-white">
          <Row className="align-items-center text-dark">
            <Col>
              <h3 className="user-data-title">
                <FaUser className="me-3" />
                Mi Información Personal
              </h3>
              <p className="user-data-subtitle">
                Gestiona tus estudios y direcciones
              </p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="refresh-button"
                >
                  <FaRedo className={loading ? "fa-spin" : ""} />
                </Button>
                <Button
                  variant="light"
                  className="add-button"
                  onClick={handleAdd}
                  disabled={actionLoading}
                >
                  <FaPlus size={20} className="text-primary" />
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">
          {data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FaGraduationCap size={64} />
              </div>
              <h5 className="empty-state-title">No tienes información registrada</h5>
              <p className="empty-state-text">
                Comienza agregando tus estudios o direcciones
              </p>
              <Button 
                variant="primary" 
                onClick={handleAdd}
                className="add-info-button"
                disabled={actionLoading}
              >
                <FaPlus className="me-2" />
                Agregar Información
              </Button>
            </div>
          ) : (
            <div className="data-table-container table-responsive">
              <Table hover className="data-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Información</th>
                    <th className="actions-column">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className="type-column">
                        {getTypeBadge(item.type)}
                      </td>
                      <td>
                        {getDetailedDescription(item)}
                      </td>
                      <td className="actions-column">
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="action-button"
                            onClick={() => handleEdit(item)}
                            disabled={actionLoading}
                          >
                            <FaEdit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="action-button"
                            onClick={() => handleDelete(item.id)}
                            disabled={actionLoading}
                          >
                            <FaTrash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <UserDataForm
        setShow={handleClose}
        showModal={showModal}
        initialData={selected}
        setInitialData={setSelected}
        onSave={handleSave}
      />
      
      {actionLoading && (
        <div className="position-fixed bottom-0 end-0 p-3">
          <div className="bg-primary text-white p-2 rounded">
            <small>Procesando...</small>
          </div>
        </div>
      )}
    </Container>
  );
}

export default UserDataManager;