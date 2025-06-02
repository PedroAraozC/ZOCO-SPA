import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function UserDataForm({ initialData, onSave }) {
  const [type, setType] = useState(initialData.type || 'estudio');
  const [value, setValue] = useState(initialData.value || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ type, value });
  };

  return (
    <Container className="mt-4">
      <h4>{initialData.id ? 'Editar' : 'Nuevo'} Dato</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tipo</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '200px', borderColor:"#2563eb" }} required>
            <option value="estudio">Estudio</option>
            <option value="direccion">Dirección</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column align-items-center" >
          <Form.Label className='text-left'>Descripción</Form.Label>
          <Form.Control
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: "fit-content", borderColor:"#2563eb" }} required
          />
        </Form.Group>

        <Button type="submit" variant="success">Guardar</Button>
      </Form>
    </Container>
  );
}

export default UserDataForm;