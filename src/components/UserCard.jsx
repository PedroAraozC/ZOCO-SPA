import { Badge, Card, Col, Row } from "react-bootstrap";
import { FaEnvelope, FaEye, FaUser, FaUserTag } from "react-icons/fa6";

const UserCard = ({ user, isSelected, onSelect }) => (
  <Card
    className={`mb-2 user-card ${isSelected ? "border-primary bg-light" : ""}`}
    style={{ cursor: "pointer" }}
    onClick={() => onSelect(user.id)}
  >
    <Card.Body className="py-2">
      <Row className="align-items-center">
        {/* User Name & ID Section */}
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
            <small
              className="text-break"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </small>
          </div>
        </Col>

        {/* Role & Selected Section */}
        <Col xs={12} md={4} className="mt-2 mt-md-0">
          <div className="d-flex align-items-center justify-content-center justify-content-md-between">
            <div className="d-flex align-items-center">
              <FaUserTag className="me-2 text-info d-none d-md-inline" />
              <Badge bg="info">{user.role}</Badge>
            </div>
            {isSelected && (
              <FaEye className="text-primary ms-2 d-none d-md-inline" />
            )}
          </div>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

export default UserCard;
