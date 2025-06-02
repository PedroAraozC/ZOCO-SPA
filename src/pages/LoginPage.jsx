import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Form,
  Button,
  InputGroup,
  FloatingLabel,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/LoginPage.css"; // Import your custom styles

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
    <Container className="p-5" style={{ maxWidth: "400px" }}>
      <Form onSubmit={handleSubmit} className="loginContainer">
        <h2 className="mb-4">Login</h2>
        <FloatingLabel
          controlId="floatingInput"
          label="Email "
          className="mb-3"
        >
          <Form.Control
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FloatingLabel>

        <Form.Group
          controlId="formPassword"
          className="mb-3 floating-label"
          style={{ position: "relative" }}
        >
          <FloatingLabel
            controlId="floatingInput"
            label="Password"
            className="mb-3 "
          >
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </FloatingLabel>
        </Form.Group>

        <Button variant="primary" type="submit" className="login-button">
          Iniciar sesión
        </Button>
      </Form>
    </Container>
  );
}

export default LoginPage;
