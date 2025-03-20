import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import logo from '../images/logo.png';
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logout_icon from "../images/person-circle.svg";
import { logout } from "../components/auth";

const Header = ( { currentUser, setCurrentUser } ) => {
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
                    <Nav className="justify-content-center" variant="underline" defaultActiveKey="/home">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/map" eventKey="link-1">MAP</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/create" eventKey="link-2">CREATE</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/review" eventKey="link-3">REVIEW</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/drafts" eventKey="link-4">DRAFTS</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a>{currentUser}</a>
                            <img
                                    src={logout_icon}
                                    alt="Logout"
                                    width="20"
                                    height="20"
                                    style={{ cursor: "pointer", marginLeft: "10px" }}
                                    onClick={() => logout(setCurrentUser)}
                                />
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
