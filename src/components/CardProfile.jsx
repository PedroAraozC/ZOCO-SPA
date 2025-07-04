import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Card.css";
import profile from "../assets/placeholder.jpg";
import { FaEye, FaEyeSlash, FaPencil } from "react-icons/fa6";
import { FaSave, FaTimes } from "react-icons/fa";
import { updateUserProfile, getUserInfo } from "../../mockService";
import { Form, FormControl } from "react-bootstrap";
import { toast } from "react-toastify";

const CardProfile = () => {
  const { user, updateUserContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password || "",
    role: user?.role || "",
  });
  const [loading, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        email: user.email,
        password: user.password,
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
      const success = updateUserProfile(user.id, editedUser);

      if (success) {
        const updatedUser = getUserInfo(user.id);

        if (updateUserContext && updatedUser) {
          updateUserContext(updatedUser);
        }

        // console.log("Perfil actualizado exitosamente:", updatedUser);
        toast.success(`Perfil actualizado correctamente!`, {
          autoClose: 2000,
        });
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
      password: user.password,
      role: user.role,
    });
    setIsEditing(false);
  };
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
              opacity: loading ? 0.6 : 1,
            }}
          />
          <FaTimes
            onClick={() => !loading && handleCancel()}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              color: loading ? "#ccc" : "#2563eb",
              opacity: loading ? 0.6 : 1,
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
      <div className="d-flex flex-row justify-content-between align-items-center">
        <p>Password</p>
        {!isEditing ? (
          <p>*********</p>
        ) : (
          <div
            className="position-relative "
            style={{
              width: "60%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={editedUser.password ?? ""}
              onChange={handleChange}
              className="form-control mt-0 inputPassword pe-5"
              disabled={loading}
              placeholder="********"
            />
            <span
              className="password-toggle-icon ms-2"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                color: "#5a4563",
                position: "absolute",
                top: "30%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 10,
                color: "#6c757d",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProfile;
