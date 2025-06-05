import React from "react";
import { Card, Col, Row, Badge } from "react-bootstrap";
import { FaUser, FaEnvelope, FaUserTag, FaEye } from "react-icons/fa";
import "../styles/UserList.css";
import UserCard from "./UserCard";

const UserList = ({ users, selectedUserId, onSelectUser }) => {
  return (
    <Col className="mb-4">
      <Card className="user-list-section">
        <Card.Header
          className="text-dark"
          style={{ borderBottom: "none", background: "transparent" }}
        >
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
                onSelect={onSelectUser}
              />
            ))
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UserList;
