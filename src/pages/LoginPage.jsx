import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    console.log(success);
    if (success) {
      navigate("/dashboard");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

       <Form.Group controlId="formPassword" className="mb-3" style={{ position: "relative" }}>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              top: "70%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#6c757d",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Iniciar sesión
        </Button>
      </Form>
    </Container>
  );
}

export default LoginPage;
