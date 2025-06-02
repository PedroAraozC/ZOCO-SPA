import React, { use, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Card.css"; // Assuming you have a CSS file for styling
import profile from "../assets/placeholder.jpg"; // Adjust the path as necessary
import { FaPencil } from "react-icons/fa6";
import { FaSave, FaTimes } from "react-icons/fa";
import { updateUserProfile } from "../../mockService";

const CardProfile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    updateUserProfile(user.id, editedUser);
    console.log("Guardado:", editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({ name: user.name, email: user.email, role: user.role });
    setIsEditing(false);
  };

  return (
    <div className="card">
      {!isEditing ? (
        <FaPencil className="lapiz" onClick={() => setIsEditing(true)} />
      ) : (
        <div className="lapiz d-flex gap-2">
          <FaSave
            onClick={() => handleSave()}
            style={{ cursor: "pointer", color: "#2563eb" }}
          />
          <FaTimes
            onClick={() => handleCancel()}
            style={{ cursor: "pointer", color: "#2563eb" }}
          />
        </div>
      )}
      <div className=" imgPerfil">
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
          />
        )}
        <p className="text-muted ">{user.role}</p>
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
          />
        )}
      </div>
      {/* <div className="d-flex flex-row justify-content-between align-items-center">
        <p>Rol</p>
        <p>{user.role}</p>
      </div> */}
    </div>
  );
};

export default CardProfile;
