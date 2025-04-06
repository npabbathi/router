import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { Link, useNavigate } from "react-router-dom";
import logo from '../images/logo.png';
import logout_icon from "../images/person-circle.svg";
import { logout } from "../components/auth";

const Header = ({ currentUser, setCurrentUser }) => {
    const navigate = useNavigate();
    return (
        <Navbar expand="lg" className="bg-body-tertiary justify-content-center">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        alt=""
                        src={logo}
                        width="15"
                        height="20"
                        className="d-inline-block align-top"
                    />{' '}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="justify-content-center navbar" variant="underline" defaultActiveKey="/home">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/map" eventKey="link-1">MAP</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/create" eventKey="link-2">CREATE</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/drafts" eventKey="link-4">DRAFTS</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/review" eventKey="link-3">REVIEW</Nav.Link>
                            
                        </Nav.Item>
                    </Nav>
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            <img
                                src={logout_icon}
                                alt="User Icon"
                                width="30"
                                height="30"
                                className="rounded-circle"
                                style={{ cursor: "pointer", marginLeft: "10px" }}
                            />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item disabled>{currentUser}</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => logout(setCurrentUser)}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
