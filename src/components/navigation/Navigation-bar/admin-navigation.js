import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, NavItem, Nav, NavbarToggler, NavbarBrand, NavLink,
        Offcanvas, OffcanvasHeader, OffcanvasBody, Container } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMusic, faBell, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import "./admin-navigation.css";

const AdminNavigation = (props) => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const updateNavClick = () => {
        setIsOpen(prev => !prev);
    };

    return(
        <>
            <div className="mb-5 admin-Navigation-container">
                <Navbar 
                    color="dark"
                    dark
                    expand="true"
                    sticky="true"
                    className="one-row"
                >
                    <NavbarBrand onClick={() => navigate('/')} className="me-auto">
                        <div className="navbarHead">
                            SANGEET
                        </div>
                    </NavbarBrand>
                    <NavbarToggler className="me-2" onClick={updateNavClick} />
                    
                    <Offcanvas isOpen={isOpen} className="offcanvas-tag" scrollable={false}
                        toggle={updateNavClick} direction="end">
                        <OffcanvasHeader toggle={updateNavClick}>

                        </OffcanvasHeader>
                        <OffcanvasBody className="navbar-menu-links">
                            <Nav className="ms-auto" navbar>
                                <NavItem className="navbar-item">
                                    <NavLink className="navbar-item-link" onClick={() => navigate('/')}>
                                        <FontAwesomeIcon icon={faHome} /> 
                                            <span className="extra-spacing" /> Home
                                    </NavLink>
                                </NavItem>
                                <NavItem className="navbar-item">
                                    <NavLink className="navbar-item-link">
                                        <FontAwesomeIcon icon={faMusic} /> 
                                            <span className="extra-spacing" /> Playlists
                                    </NavLink>
                                </NavItem>
                                <NavItem className="navbar-item">
                                    <NavLink className="navbar-item-link">
                                        <FontAwesomeIcon icon={faBell} /> 
                                            <span className="extra-spacing" /> Notifications
                                    </NavLink>
                                </NavItem>
                                <NavItem className="navbar-item">
                                    <NavLink className="navbar-item-link">
                                        <FontAwesomeIcon icon={faSignInAlt} /> 
                                            <span className="extra-spacing" /> Login / SignUp 
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </OffcanvasBody>
                    </Offcanvas>
                </Navbar>
            </div>
            <Container className="pt-5 pb-5"/>
        </>
    );
};

export default AdminNavigation;