// components/adminDashboard/UserDataForm.jsx
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

const UserDataForm = ({ setShow, showModal, initialData, setInitialData, onSave }) => {
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
      setFormData(prev => ({ ...prev, ...initialData.data }));
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (type === "estudio") {
      if (!formData.institution.trim()) newErrors.institution = "La institución es requerida";
      if (!formData.degree.trim()) newErrors.degree = "El título/carrera es requerido";
      if (!formData.startDate) newErrors.startDate = "La fecha de inicio es requerida";
      if (formData.status === "completado" && !formData.endDate) newErrors.endDate = "La fecha de finalización es requerida";
    } else {
      if (!formData.street.trim()) newErrors.street = "La dirección es requerida";
      if (!formData.city.trim()) newErrors.city = "La ciudad es requerida";
      if (!formData.province.trim()) newErrors.province = "La provincia es requerida";
      if (!formData.zipCode.trim()) newErrors.zipCode = "El código postal es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSave({ id: initialData?.id, type, data: formData });
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
    
    setErrors({});
  };

  const renderFields = type === "estudio" ? (
    <>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label><FaGraduationCap className="me-2 text-primary" />Institución *</Form.Label>
            <Form.Control
              type="text"
              value={formData.institution}
              onChange={(e) => handleInputChange("institution", e.target.value)}
              isInvalid={!!errors.institution}
            />
            <Form.Control.Feedback type="invalid">{errors.institution}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Título/Carrera *</Form.Label>
            <Form.Control
              type="text"
              value={formData.degree}
              onChange={(e) => handleInputChange("degree", e.target.value)}
              isInvalid={!!errors.degree}
            />
            <Form.Control.Feedback type="invalid">{errors.degree}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Inicio *</Form.Label>
            <Form.Control
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              isInvalid={!!errors.startDate}
            />
            <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
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
              <Form.Label>Fecha de Finalización *</Form.Label>
              <Form.Control
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                isInvalid={!!errors.endDate}
              />
              <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      )}
    </>
  ) : (
    <>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label><FaMapMarkerAlt className="me-2 text-danger" />Dirección *</Form.Label>
            <Form.Control
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              isInvalid={!!errors.street}
            />
            <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Ciudad *</Form.Label>
            <Form.Control
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              isInvalid={!!errors.city}
            />
            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Provincia *</Form.Label>
            <Form.Control
              type="text"
              value={formData.province}
              onChange={(e) => handleInputChange("province", e.target.value)}
              isInvalid={!!errors.province}
            />
            <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Código Postal *</Form.Label>
            <Form.Control
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              isInvalid={!!errors.zipCode}
              maxLength={10}
            />
            <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              value={formData.addressType}
              onChange={(e) => handleInputChange("addressType", e.target.value)}
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
            <Form.Label>País</Form.Label>
            <Form.Control
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );

  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="bg-light border-0">
        <Modal.Title>
          {type === "estudio" ? (
            <><FaGraduationCap className="me-2" />Información Académica</>
          ) : (
            <><FaMapMarkerAlt className="me-2" />Información de Dirección</>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Tipo de Información</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="estudio"
                    name="type"
                    label={<><FaGraduationCap className="me-2 text-primary" />Estudios</>}
                    value="estudio"
                    checked={type === "estudio"}
                    onChange={(e) => setType(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    id="direccion"
                    name="type"
                    label={<><FaMapMarkerAlt className="me-2 text-danger" />Dirección</>}
                    value="direccion"
                    checked={type === "direccion"}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Form onSubmit={handleSubmit}>{renderFields}</Form>
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="mt-3">
              <strong>Corrige los siguientes errores:</strong>
              <ul className="mb-0 mt-2">
                {Object.values(errors).map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={handleClose} disabled={isSubmitting}>
          <FaTimes className="me-2" />Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
          ) : (
            <><FaSave className="me-2" />{initialData?.id ? "Actualizar" : "Guardar"}</>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDataForm;
