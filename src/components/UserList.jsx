import React from "react";
import { Card, Col, Row, Badge } from "react-bootstrap";
import { FaUser, FaEnvelope, FaUserTag, FaEye } from "react-icons/fa";
import "../styles/UserList.css";

const UserCard = ({ user, isSelected, onSelect }) => (
  <Card
    className={`mb-2 user-card ${isSelected ? "border-primary bg-light" : ""}`}
    style={{ cursor: "pointer" }}
    onClick={() => onSelect(user.id)}
  >
    <Card.Body className="py-2">
      <Row className="align-items-center">{/* User Name & ID Section */}
        <Col xs={12} sm={6} md={4}>
          <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
            <FaUser className="me-2 text-primary" />
            <div>
              <strong className="d-block">{user.name}</strong>
              <small className="text-muted d-sm-none">ID: {user.id}</small>
            </div>
          </div>
        </Col>

        {/* Email Section */}
        <Col xs={12} sm={6} md={4} className="mt-2 mt-sm-0">
          <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
            <FaEnvelope className="me-2 text-secondary d-none d-md-inline" />
            <small className="text-break" style={{overflow: "hidden",textOverflow: "ellipsis",  whiteSpace: "nowrap"}}>{user.email}</small>
          </div>
        </Col>

        {/* Role & Selected Section */}
        <Col xs={12} md={4} className="mt-2 mt-md-0">
          <div className="d-flex align-items-center justify-content-center justify-content-md-between">
            <div className="d-flex align-items-center">
              <FaUserTag className="me-2 text-info d-none d-md-inline" />
              <Badge bg="info">{user.role}</Badge>
            </div>
            {isSelected && <FaEye className="text-primary ms-2 d-none d-md-inline" />}
          </div>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

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