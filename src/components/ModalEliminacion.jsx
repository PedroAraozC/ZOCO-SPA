import { Modal, Button, Spinner, Badge } from "react-bootstrap";
import {
  FaExclamationTriangle,
  FaTimes,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";

const ModalEliminacion = ({ show, onHide, onConfirm, loading, item }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="sm"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <div className="text-danger mb-2">
            <FaExclamationTriangle size={48} />
          </div>
          <h5 className="text-dark mb-0">Confirmar Eliminación</h5>
        </Modal.Title>
        <Button
          variant="link"
          className="position-absolute top-0 end-0 mt-2 me-2 p-1 text-muted"
          onClick={onHide}
          style={{ fontSize: "1.2rem", textDecoration: "none" }}
        >
          <FaTimes />
        </Button>
      </Modal.Header>

      <Modal.Body className="text-center px-4">
        <p className="mb-3">
          ¿Estás seguro de que quieres eliminar este elemento?
        </p>

        {item && (
          <div className="bg-light p-3 rounded mb-3">
            <Badge
              bg={item.type === "estudio" ? "primary" : "danger"}
              className="mb-2"
            >
              {item.type === "estudio" ? (
                <FaGraduationCap className="me-1" />
              ) : (
                <FaMapMarkerAlt className="me-1" />
              )}
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Badge>
            <div className="mt-2">
              {item.type === "estudio" ? (
                <>
                  <div>
                    <strong>{item.data.degree}</strong>
                  </div>
                  <div className="text-muted small">
                    {item.data.institution}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>{item.data.street}</strong>
                  </div>
                  <div className="text-muted small">
                    {item.data.city}, {item.data.province}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <p className="text-muted small mb-0">
          Esta acción no se puede deshacer.
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 justify-content-center">
        <div className="d-flex gap-2 w-100">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            disabled={loading}
            className="flex-fill"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="flex-fill"
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
                Eliminando...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Eliminar
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalEliminacion;
