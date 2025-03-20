import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import logo from '../images/logo.png'

const Header = () => {
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
                    Router
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="justify-content-center" variant="underline" defaultActiveKey="/home">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/map">MAP</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/create" eventKey="link-1">CREATE</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/review" eventKey="link-2">REVIEW</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/drafts" eventKey="link-3">DRAFTS</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
