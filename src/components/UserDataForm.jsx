import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Modal,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";

function UserDataForm({
  setShow,
  showModal,
  initialData,
  setInitialData,
  onSave,
}) {
  const [type, setType] = useState(initialData?.type || "estudio");
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    status: "en_curso",
    street: "",
    city: "",
    province: "",
    zipCode: "",
    country: "Argentina",
    addressType: "personal",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData?.id) {
      setType(initialData.type);
      setFormData({
        ...formData,
        ...initialData.data,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (type === "estudio") {
      if (!formData.institution.trim())
        newErrors.institution = "La institución es requerida";
      if (!formData.degree.trim())
        newErrors.degree = "El título/carrera es requerido";
      if (!formData.startDate)
        newErrors.startDate = "La fecha de inicio es requerida";
      if (formData.status === "completado" && !formData.endDate) {
        newErrors.endDate =
          "La fecha de finalización es requerida para estudios completados";
      }
    } else {
      if (!formData.street.trim())
        newErrors.street = "La dirección es requerida";
      if (!formData.city.trim()) newErrors.city = "La ciudad es requerida";
      if (!formData.province.trim())
        newErrors.province = "La provincia es requerida";
      if (!formData.zipCode.trim())
        newErrors.zipCode = "El código postal es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dataToSave = {
        id: initialData?.id,
        type,
        data: formData,
      };

      await onSave(dataToSave);
      setShow(false);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
      setInitialData(null);
      setFormData({
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        status: "en_curso",
        street: "",
        city: "",
        province: "",
        zipCode: "",
        country: "Argentina",
        addressType: "personal",
      });
    }
  };

  const handleClose = () => {
    setShow(false);
    setErrors({});
  };

  const renderEstudioFields = () => (
    <>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <FaGraduationCap className="me-2 text-primary" />
              Institución *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Universidad Nacional de Tucumán"
              value={formData.institution}
              onChange={(e) => handleInputChange("institution", e.target.value)}
              isInvalid={!!errors.institution}
              className="rounded-3"
            />
            <Form.Control.Feedback type="invalid">
              {errors.institution}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Título/Carrera *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Licenciatura en Sistemas"
              value={formData.degree}
              onChange={(e) => handleInputChange("degree", e.target.value)}
              isInvalid={!!errors.degree}
              className="rounded-3"
            />
            <Form.Control.Feedback type="invalid">
              {errors.degree}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Fecha de Inicio *</Form.Label>
            <Form.Control
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              isInvalid={!!errors.startDate}
              className="rounded-3"
            />
            <Form.Control.Feedback type="invalid">
              {errors.startDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Estado</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="rounded-3"
            >
              <option value="en_curso">En Curso</option>
              <option value="completado">Completado</option>
              <option value="pausado">Pausado</option>
              <option value="abandonado">Abandonado</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {formData.status === "completado" && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Fecha de Finalización *
              </Form.Label>
              <Form.Control
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                isInvalid={!!errors.endDate}
                className="rounded-3"
              />
              <Form.Control.Feedback type="invalid">
                {errors.endDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      )}
    </>
  );

  const renderDireccionFields = () => (
    <>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <FaMapMarkerAlt className="me-2 text-danger" />
              Dirección *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Av. Independencia 123, Piso 2, Dpto A"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              isInvalid={!!errors.street}
              className="rounded-3"
            />
            <Form.Control.Feedback type="invalid">
              {errors.street}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Ciudad *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: San Miguel de Tucumán"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              isInvalid={!!errors.city}
              className="rounded-3"
            />
            <Form.Control.Feedback type="invalid">
              {errors.city}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Provincia *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Tucumán"
              value={formData.province}
              onChange={(e) => handleInputChange("province", e.target.value)}
              isInvalid={!!errors.province}
              className="rounded-3"
            />
            <Form.Control.Feedback type="invalid">
              {errors.province}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Código Postal *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: 4000"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              isInvalid={!!errors.zipCode}
              className="rounded-3"
              maxLength="10"
            />
            <Form.Control.Feedback type="invalid">
              {errors.zipCode}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Tipo</Form.Label>
            <Form.Select
              value={formData.addressType}
              onChange={(e) => handleInputChange("addressType", e.target.value)}
              className="rounded-3"
            >
              <option value="personal">Personal</option>
              <option value="laboral">Laboral</option>
              <option value="familiar">Familiar</option>
              <option value="otro">Otro</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">País</Form.Label>
            <Form.Control
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="rounded-3"
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      className="custom-modal"
    >
      <Modal.Header
        closeButton
        className="bg-gradient text-black border-0"
        style={{
          backgroundColor: "#f8f9fa",
          background: "#f8f9fa",
        }}
      >
        <Modal.Title className="fw-bold">
          {type === "estudio" ? (
            <>
              <FaGraduationCap className=" me-2" />
              Información Académica
            </>
          ) : (
            <>
              <FaMapMarkerAlt className=" me-2" />
              Información de Dirección
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <Container fluid>
          {/* Selector de Tipo */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark mb-3">
                  Tipo de Información
                </Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="estudio"
                    name="type"
                    label={
                      <span className="fw-semibold">
                        <FaGraduationCap className="me-2 text-primary" />
                        Estudios
                      </span>
                    }
                    value="estudio"
                    checked={type === "estudio"}
                    onChange={(e) => setType(e.target.value)}
                    className="custom-radio"
                  />
                  <Form.Check
                    type="radio"
                    id="direccion"
                    name="type"
                    label={
                      <span className="fw-semibold">
                        <FaMapMarkerAlt className="me-2 text-danger" />
                        Dirección
                      </span>
                    }
                    value="direccion"
                    checked={type === "direccion"}
                    onChange={(e) => setType(e.target.value)}
                    className="custom-radio"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />

          {/* Formulario Dinámico */}
          <Form onSubmit={handleSubmit}>
            {type === "estudio"
              ? renderEstudioFields()
              : renderDireccionFields()}

            {Object.keys(errors).length > 0 && (
              <Alert variant="danger" className="mt-3">
                <strong>Por favor, corrige los siguientes errores:</strong>
                <ul className="mb-0 mt-2">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}
          </Form>
        </Container>
      </Modal.Body>

      <Modal.Footer
        className="border-0 p-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={isSubmitting}
          className="me-2 rounded-pill px-4"
        >
          <FaTimes className="me-2" />
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-pill px-4"
          style={{
            background: "#2563eb",
            border: "none",
          }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Guardando...
            </>
          ) : (
            <>
              <FaSave className="me-2" />
              {initialData?.id ? "Actualizar" : "Guardar"}
            </>
          )}
        </Button>
      </Modal.Footer>

      <style jsx>{`
        .custom-modal .modal-dialog {
          max-width: 800px;
        }

        .custom-radio .form-check-input:checked {
          background-color: #667eea;
          border-color: #667eea;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        @media (max-width: 768px) {
          .custom-modal .modal-dialog {
            margin: 0.5rem;
            max-width: calc(100% - 1rem);
          }

          .modal-body {
            padding: 1rem !important;
          }
        }
      `}</style>
    </Modal>
  );
}

export default UserDataForm;
