import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Badge,
  Alert,
} from "react-bootstrap";
import { getUserData, saveUserData, deleteUserData } from "../../mockService";
import { useAuth } from "../context/AuthContext";
import UserDataForm from "../components/UserDataForm";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaGraduationCap,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ModalEliminacion from "./ModalEliminacion";
import { toast } from "react-toastify";

const UserDataManager = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    try {
      const data = getUserData(user.id);
      setUserData(data);
    } catch (err) {
      console.error("Error al cargar datos del usuario:", err);
      setError("Error al cargar los datos del usuario");
    }
  }, [user.id]);

  const handleAdd = () => {
    setSelected({ type: "estudio" });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelected({ ...item });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setActionLoading(true);
    try {
      const success = deleteUserData(user.id, itemToDelete.id);
      if (success) {
        toast.success(`${itemToDelete.type} Se eliminó correctamente`, {
          autoClose: 2000,
        });
        setUserData((prev) =>
          prev.filter((item) => item.id !== itemToDelete.id)
        );
      } else {
        throw new Error();
      }
    } catch {
      setError("Error al eliminar el elemento");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleSave = (newEntry) => {
    setActionLoading(true);
    try {
      const saved = saveUserData(user.id, newEntry);
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

  return (
    <Container className="mt-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h5 className="m-0">Mis Datos ({userData.length} elementos)</h5>
        <Button
          variant="outline"
          style={{ color: "#2563eb", borderColor: "#2563eb" }}
          onClick={handleAdd}
          className="rounded px-3 py-2 py-1 border-1"
        >
          <FaPlus />
        </Button>
      </div>

      {userData.length === 0 ? (
        <div className="text-center py-5">
          <FaGraduationCap size={48} className="text-muted mb-3" />
          <h6>No tienes datos registrados</h6>
          <p className="text-muted">
            Usa el botón para agregar estudios o direcciones
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
                  <Badge bg={item.type === "estudio" ? "primary" : "danger"}>
                    {item.type === "estudio" ? (
                      <FaGraduationCap className="me-1" />
                    ) : (
                      <FaMapMarkerAlt className="me-1" />
                    )}
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                </td>
                <td>{renderDescription(item)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setItemToDelete(item);
                        setShowDeleteModal(true);
                      }}
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

      <UserDataForm
        initialData={selected}
        onSave={handleSave}
        showModal={showModal}
        setShow={() => setShowModal(false)}
        setInitialData={setSelected}
      />

      <ModalEliminacion
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDelete}
        loading={actionLoading}
        item={itemToDelete}
      />
    </Container>
  );
};

export default UserDataManager;
