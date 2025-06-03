import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Card.css";
import profile from "../assets/placeholder.jpg";
import { FaPencil } from "react-icons/fa6";
import { FaSave, FaTimes } from "react-icons/fa";
import { updateUserProfile, getUserInfo } from "../../mockService";

const CardProfile = () => {
  const { user, updateUserContext } = useAuth(); // Necesitas agregar updateUserContext al contexto
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
  });
  const [loading, setSaving] = useState(false);

  // Sincronizar el estado local cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Actualizar en mockUsers
      const success = updateUserProfile(user.id, editedUser);
      
      if (success) {
        // Obtener los datos actualizados
        const updatedUser = getUserInfo(user.id);
        
        // Actualizar el contexto de autenticación
        if (updateUserContext && updatedUser) {
          updateUserContext(updatedUser);
        }
        
        console.log("Perfil actualizado exitosamente:", updatedUser);
        setIsEditing(false);
      } else {
        console.error("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error guardando cambios:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({ 
      name: user.name, 
      email: user.email, 
      role: user.role 
    });
    setIsEditing(false);
  };

  // Mostrar loading si no hay usuario
  if (!user) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {!isEditing ? (
        <FaPencil className="lapiz" onClick={() => setIsEditing(true)} />
      ) : (
        <div className="lapiz d-flex gap-2">
          <FaSave
            onClick={handleSave}
            style={{ 
              cursor: loading ? "not-allowed" : "pointer", 
              color: loading ? "#ccc" : "#2563eb",
              opacity: loading ? 0.6 : 1
            }}
          />
          <FaTimes
            onClick={() => !loading && handleCancel()}
            style={{ 
              cursor: loading ? "not-allowed" : "pointer", 
              color: loading ? "#ccc" : "#2563eb",
              opacity: loading ? 0.6 : 1
            }}
          />
        </div>
      )}
      <div className="imgPerfil">
        <img src={profile} alt="Profile" />
        {!isEditing ? (
          <p className="text-center fs-4 mb-0">{user.name}</p>
        ) : (
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleChange}
            className="form-control inputName"
            disabled={loading}
            placeholder="Nombre completo"
          />
        )}
        <p className="text-muted">{user.role}</p>
      </div>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <p>Email</p>
        {!isEditing ? (
          <p>{user.email}</p>
        ) : (
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleChange}
            className="form-control mt-0 inputEmail"
            disabled={loading}
            placeholder="email@ejemplo.com"
          />
        )}
      </div>
      
      {loading && (
        <div className="text-center mt-2">
          <small className="text-muted">Guardando cambios...</small>
        </div>
      )}
    </div>
  );
};

export default CardProfile;