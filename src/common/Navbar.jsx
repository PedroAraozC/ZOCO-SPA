import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import { getUserInfo } from "../../mockService";
import { useAuth } from "../context/AuthContext";
import { Dropdown,ButtonGroup, DropdownButton } from "react-bootstrap";

const Navbar = () => {
  const [data, setData] = useState([]);
  const { user,logout } = useAuth();

  const loadData = () => {
    const userData = getUserInfo(user.id);
    setData(userData);
  };

  useEffect(() => {
    loadData();
  }, []);
  console.log(data);
  return (
    <div className="navbar">
      <label>Dashboard</label>
      <DropdownButton
        as={ButtonGroup}
        id="dropdown-custom-components"
        title={data.name}
      >
        <Dropdown.Divider />
        <Dropdown.Item eventKey="1" onClick={logout}> Logout</Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

export default Navbar;
