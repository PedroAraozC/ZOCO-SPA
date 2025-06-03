import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import { getUserInfo } from "../../mockService";
import { useAuth } from "../context/AuthContext";
import { Dropdown, ButtonGroup, DropdownButton } from "react-bootstrap";
import imgProfile from "../assets/placeholder.jpg"; // Adjust the path as necessary

const Navbar = () => {
  const [data, setData] = useState([]);
  const { user, logout } = useAuth();

  const loadData = () => {
    const userData = getUserInfo(user?.id);
    setData(userData);
  };

  useEffect(() => {
    loadData();
  }, []);
  console.log(data);
  return (
    <div className="navbar">
      <label className="ms-2">Dashboard</label>
      <DropdownButton
        as={ButtonGroup}
        id="dropdown-custom-components"
        title={
          <span className=" ">
            <img
              src={imgProfile}
              alt="profile"
              className="rounded-circle imgbtn me-2"
              width="30"
              height="30"
            />
            {data?.name}
          </span>
        }
        className="me-2 btnPerfil"
      >
        {/* <Dropdown.Divider /> */}
        <Dropdown.Item eventKey="1" onClick={logout}>
          {" "}
          Logout
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

export default Navbar;
