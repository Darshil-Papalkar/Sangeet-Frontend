import axios from 'axios';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Switch from '@mui/material/Switch';
import { createTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState, useContext, useEffect } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
// import { Navbar, NavItem, Nav, NavbarToggler, NavbarBrand, NavLink,
//         Offcanvas, OffcanvasHeader, OffcanvasBody, Container } from "reactstrap";
import { Navbar, NavbarBrand, Container } from 'reactstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHome, faMusic, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import { Subscribe } from "../../../client";
import { IsDark, SetIsDark, Search } from "../../../App";
import { apiLinks } from "../../../connection.config.js";

import "./admin-navigation.css";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#ffc107',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#111',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
}));

const AdminNavigation = (props) => {
    const navigate = useNavigate();

    const isDark = useContext(IsDark);
    const setSearch = useContext(Search);
    const setIsDark = useContext(SetIsDark);

    // const [isOpen, setIsOpen] = useState(false);
    const [notificationData, setNotificationData] = useState([]);

    // const updateNavClick = () => {
    //     setIsOpen(prev => !prev);
    // };

    const theme = createTheme({
        palette: {
            mode: isDark ? "dark" : "light"
        }
    });

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const getNotificationData = async () => {
        if(window?.localStorage?.getItem("endpoint")){
            const endpoint = window.localStorage.getItem("endpoint");
            const response = await axios.get(apiLinks.getBroadcastNotifications, {
                params: {
                    endpoint: endpoint
                }
            });
            if(response.data.code === 200){
                setNotificationData(response.data.message);
            }
            else{
                setNotificationData([]);
            }
        }
        else{
            Notification.requestPermission().then(permission => {
                if(permission === "granted"){
                    Subscribe();
                }
            }).catch(err => {
                console.log(err);
            });
        }
    };

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);
        await getNotificationData();
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const moveNavigate = (notification) => {
        const url = notification.url.split('15.206.69.224/');
        navigate("../"+url[1]);
    };

    useEffect(() => {
        getNotificationData();
    }, []);

    return(
        <>
            <div className="admin-Navigation-container">
                <Navbar
                    color={isDark ? "dark" : "light"}
                    dark={isDark}
                    light={!isDark}
                    expand="true"
                    sticky="true"
                    className="one-row"
                >
                    <NavbarBrand onClick={() => navigate('/')} className="me-auto">
                        <div className="navbarHead">
                            SANGEET
                        </div>
                    </NavbarBrand>

                    <Tooltip title="Search">
                        <IconButton
                            onClick={() => setSearch(prev => !prev)}
                        >
                            <SearchIcon 
                                sx={{ fontSize: 30, color: isDark ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)" }} />
                        </IconButton>
                    </Tooltip>


                    <Tooltip title="Notifications">
                        <IconButton
                            sx={{
                                marginRight: "15px"
                            }}
                            onClick={handleClick}
                            size="small"
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Badge badgeContent={notificationData.length || '0'} className="notification-count" >
                                <NotificationsIcon sx={{ fontSize: 30, color: isDark ? "rgb(0, 255, 0)" : "rgb(0, 0, 0)" }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Toggle Theme">
                        <MaterialUISwitch theme={theme} checked={isDark} onClick={setIsDark} />
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            className: `notification-message-container ${isDark ? "dark" : "light"}`,
                            sx: {
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: 10,
                                    height: 10,
                                    bgcolor: `${isDark ? "#0A0F18" : "#eee"}`,
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {
                            notificationData.length > 0 ?
                                notificationData.map(notification => 
                                    <MenuItem key={notification.id} onClick={() => moveNavigate(notification)}>
                                        <div>
                                            <div className="notification-row mb-2">
                                                <div className="notification-image-container">
                                                    <img className="notification-image"
                                                        src={apiLinks.getImage + notification.image} alt={notification.title} />
                                                </div>
                                                <div className="notification-text-container">
                                                    <div className="notification-title">
                                                        {notification.title}
                                                    </div>
                                                    <div className="notification-body">
                                                        {notification.body}
                                                    </div>
                                                </div>
                                            </div>
                                            <Divider />
                                        </div>
                                    </MenuItem>
                                ) : 
                                <div className="no-notifications-container">
                                    <h5 className="no-notifications">
                                        No Notifications Available
                                    </h5>
                                </div>
                        }
                    </Menu>

                    {/* <NavbarToggler className="me-2" onClick={updateNavClick} />
                    
                    <Offcanvas isOpen={isOpen} className="offcanvas-tag" scrollable={false}
                        toggle={updateNavClick} direction="end">
                        <OffcanvasHeader toggle={updateNavClick} className="custom-close-icon-canvas-header"/>
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
                                    <NavLink className="navbar-item-link" onClick={() => navigate('/admin')}>
                                        <FontAwesomeIcon icon={faSignInAlt} /> 
                                            <span className="extra-spacing" /> Login / SignUp 
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </OffcanvasBody>
                    </Offcanvas> */}
                </Navbar>
            </div>
            <Container className="pt-5 pb-5"/>
        </>
    );
};

export default AdminNavigation;