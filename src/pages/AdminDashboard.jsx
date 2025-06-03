import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { getUserData, saveUserData, deleteUserData, getAllUsers, getDataDescription } from '../../mockService';
import UserDataForm from "../components/UserDataForm";
import { FaEdit, FaTrash, FaPlus, FaGraduationCap, FaMapMarkerAlt, FaRedo } from 'react-icons/fa';

function AdminUserDataManager() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar lista de usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const allUsers = getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar la lista de usuarios');
    }
  };

  const handleSelectUser = (e) => {
    const id = parseInt(e.target.value);
    setSelectedUserId(id);
    
    if (id) {
      loadUserData(id);
    } else {
      setUserData([]);
    }
  };

  const loadUserData = (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = getUserData(userId);
      setUserData([...data]); // Crear nueva referencia
      console.log('Datos cargados para usuario admin:', userId, data);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedUserId) {
      loadUserData(selectedUserId);
    }
    loadUsers(); // También refrescar lista de usuarios
  };

  const handleAdd = () => {
    setSelected({ type: "estudio" }); // Valor por defecto
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelected({ ...item }); // Crear copia
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
      setActionLoading(true);
      try {
        const success = deleteUserData(selectedUserId, itemId);
        if (success) {
          // Actualizar estado local inmediatamente
          setUserData(prevData => prevData.filter(item => item.id !== itemId));
          console.log('Elemento eliminado por admin:', itemId);
        } else {
          throw new Error('Error al eliminar el elemento');
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        setError("Error al eliminar el elemento");
        // Recargar datos en caso de error
        loadUserData(selectedUserId);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (newEntry) => {
    setActionLoading(true);
    try {
      const savedEntry = saveUserData(selectedUserId, newEntry);
      console.log('Elemento guardado por admin:', savedEntry);
      
      // Actualizar estado local inmediatamente
      if (newEntry.id) {
        // Actualización de elemento existente
        setUserData(prevData => 
          prevData.map(item => 
            item.id === newEntry.id ? savedEntry : item
          )
        );
      } else {
        // Nuevo elemento
        setUserData(prevData => [...prevData, savedEntry]);
      }
      
      setShowModal(false);
      setSelected(null);
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Error al guardar el elemento");
      // Recargar datos en caso de error
      loadUserData(selectedUserId);
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeBadge = (type) => {
    return type === "estudio" ? (
      <Badge bg="primary">
        <FaGraduationCap className="me-1" />
        Estudio
      </Badge>
    ) : (
      <Badge bg="danger">
        <FaMapMarkerAlt className="me-1" />
        Dirección
      </Badge>
    );
  };

  const getDetailedDescription = (item) => {
    if (item.type === "estudio") {
      const { institution, degree, status } = item.data;
      return (
        <div>
          <div><strong>{degree}</strong></div>
          <div className="text-muted">{institution}</div>
          <Badge 
            bg={status === "completado" ? "success" : 
                status === "en_curso" ? "info" : "warning"}
            className="mt-1"
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
        <div>
          <div><strong>{street}</strong></div>
          <div className="text-muted">{city}, {province}</div>
          <Badge bg="secondary" className="mt-1">
            {addressType === "personal" ? "Personal" : 
             addressType === "laboral" ? "Laboral" : 
             addressType === "familiar" ? "Familiar" : "Otro"}
          </Badge>
        </div>
      );
    }
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestión de Datos por Usuario (Admin)</h4>
        <Button variant="outline-secondary" size="sm" onClick={handleRefresh}>
          <FaRedo className={loading ? "fa-spin" : ""} />
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="row mb-3">
        <div className="col-md-6">
          <Form.Select 
            onChange={handleSelectUser} 
            value={selectedUserId || ''}
            disabled={loading}
          >
            <option value="">Seleccionar Usuario</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email}) - {u.role}
              </option>
            ))}
          </Form.Select>
        </div>
        {selectedUser && (
          <div className="col-md-6">
            <div className="alert alert-info mb-0">
              <strong>Usuario seleccionado:</strong> {selectedUser.name}<br />
              <small>{selectedUser.email} - {selectedUser.role}</small>
            </div>
          </div>
        )}
      </div>

      {selectedUserId && (
        <>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando datos del usuario...</p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Datos del Usuario ({userData.length} elementos)</h5>
                <Button 
                  variant="primary" 
                  onClick={handleAdd}
                  disabled={actionLoading}
                >
                  <FaPlus className="me-2" />
                  Agregar Dato
                </Button>
              </div>

              {userData.length === 0 ? (
                <div className="text-center py-5">
                  <FaGraduationCap size={48} className="text-muted mb-3" />
                  <h6>No hay datos registrados para este usuario</h6>
                  <p className="text-muted">Puedes agregar estudios o direcciones usando el botón superior</p>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th style={{width: '120px'}}>Tipo</th>
                      <th>Información</th>
                      <th style={{width: '120px'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((item) => (
                      <tr key={item.id}>
                        <td>{getTypeBadge(item.type)}</td>
                        <td>{getDetailedDescription(item)}</td>
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
              )}
            </>
          )}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selected?.id ? 'Editar' : 'Nuevo'} Dato - {selectedUser?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserDataForm 
            initialData={selected} 
            onSave={handleSave}
            showModal={showModal}
            setShow={() => setShowModal(false)}
            setInitialData={setSelected}
          />
        </Modal.Body>
      </Modal>

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

export default AdminUserDataManager;