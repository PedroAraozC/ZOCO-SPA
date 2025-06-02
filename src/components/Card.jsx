import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Card.css"; // Assuming you have a CSS file for styling
import profile from "../assets/placeholder.jpg"; // Adjust the path as necessary
const Card = () => {
  const { user, logout } = useAuth();
  return (
    <div className="card">
      <div className=" imgPerfil">

      <img
        src={profile}
        
        alt="Profile"
        />
      <p className="text-center fs-4">{user.name}</p>
        </div>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <p>Email</p>
        <p>{user.email}</p>
      </div>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <p>Rol</p>
        <p>{user.role}</p>
      </div>
    </div>
  );
};

export default Card;
