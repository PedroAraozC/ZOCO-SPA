import React from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Button } from "react-bootstrap";
import UserDataManager from "../components/UserDataManager";
import CardProfile from "../components/CardProfile";

function UserProfile() {
  const { user, logout } = useAuth();
  console.log(user);
  return (
    <Container className="mt-5">
      <CardProfile />
      <UserDataManager />
    </Container>
  );
}

export default UserProfile;
