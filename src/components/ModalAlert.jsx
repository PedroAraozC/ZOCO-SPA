import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalAlert = ({ show, handleClose, title, message }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Alerta"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || "Ha ocurrido un error."}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAlert;
