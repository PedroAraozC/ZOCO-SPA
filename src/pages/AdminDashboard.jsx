// pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Container, Alert, Button, Row, Col } from "react-bootstrap";
import {
  getAllUsers,
  getUserData,
  saveUserData,
  deleteUserData,
  createUser,
} from "../../mockService";
import CardProfile from "../components/CardProfile";
import UserList from "../components/UserList";
import UserDetails from "../components/UserDetails";
import UserCreateModal from "../components/UserCreateModal";
import ModalEliminacion from "../components/ModalEliminacion";
import "../styles/AdminDashboard.css";
import { FaPlus } from "react-icons/fa6";

const AdminDashboard = () => {
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
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserCreate, setNewUserCreate] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  useEffect(() => {
    try {
      const allUsers = getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Error al cargar la lista de usuarios");
    }
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === updatedUser.id ? { ...u, ...updatedUser } : u
      )
    );
    setSelectedUser((prev) =>
      prev && prev.id === updatedUser.id ? { ...prev, ...updatedUser } : prev
    );
  };

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

  const openUserModal = () => {
    setNewUserCreate({ name: "", email: "", role: "user", password: "" });
    setShowUserModal(true);
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

  const handleDelete = (itemId) => {
    const item = userData.find((data) => data.id === itemId);
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
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

  const handleCreateUser = () => {
    try {
      const created = createUser(newUserCreate);
      setUsers((prev) => [...prev, created]);
      setNewUserCreate({ name: "", email: "", role: "user", password: "" });
      setShowUserModal(false);
    } catch (err) {
      setError("Error al crear el usuario");
    }
  };

  return (
    <Container fluid className="mt-3 px-2 px-md-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row className="gy-4 gx-4">
        <Col xs={12} md={4} lg={3}>
          <CardProfile />
        </Col>

        <Col xs={12} md={8} lg={9}>
          <div className="d-flex mb-3 align-items-center justify-content-between flex-wrap">
            <h4 className="m-0 ms-md-4">Gestión de Usuarios</h4>
            <Button
              variant="outline"
              style={{ color: "#2563eb", borderColor: "#2563eb" }}
              onClick={openUserModal}
              className="rounded px-3 py-2 py-1 border-1 mt-2 mt-md-0 me-md-4"
            >
              <FaPlus />
            </Button>
          </div>

          <Row className="">
            <Col xs={12} lg={6}>
              <UserList
                users={users}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
            </Col>

            <Col xs={12} lg={6}>
              <UserDetails
                loading={loading}
                user={selectedUser}
                userData={userData}
                onAdd={() => {
                  setSelected({ type: "estudio" });
                  setShowModal(true);
                }}
                onEdit={(item) => {
                  setSelected({ ...item });
                  setShowModal(true);
                }}
                onDelete={handleDelete}
                onSave={handleSave}
                showModal={showModal}
                setShowModal={setShowModal}
                selected={selected}
                setSelected={setSelected}
                actionLoading={actionLoading}
                onUpdateUser={handleUpdateUser}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <UserCreateModal
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        newUserCreate={newUserCreate}
        setNewUserCreate={setNewUserCreate}
        onCreate={handleCreateUser}
      />

      <ModalEliminacion
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        loading={actionLoading}
        item={itemToDelete}
      />
    </Container>
  );
};

export default AdminDashboard;
