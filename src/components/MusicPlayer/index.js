import React from "react";
import { Navbar, Nav, Container } from "reactstrap";

import "./index.css";

const MusicPlayer = (props) => {

    return(
        <>

            <div className="mb-5 navigation-container">
                <Navbar 
                    color="dark"
                    dark
                    expand
                    fixed="bottom"
                    full
                    light
                    className="top-one-row"
                >
                    <div className="image-box">
                        <div className="navbarHead-img-container">
                            <img className="navbarHead-img" src="/assets/svg/dvd.svg" alt="player-img" />
                        </div>
                    </div>

                    <div className="music-detail-box">
                        <h5 className="music-title">
                            Something Title
                        </h5>
                        <h6 className="music-album">
                            Some, More New artist which you can imagine whatever you want just imagine
                        </h6>
                    </div>
                    
                        <Nav className="ms-auto" navbar>
                            
                        </Nav>
                </Navbar>
            </div>
            <Container className="pt-5 pb-5"/>
        </>
    );
};

export default MusicPlayer;