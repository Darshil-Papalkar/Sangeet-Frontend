import React, { useState } from "react";
import { Navbar, Nav, Container } from "reactstrap";

import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

import "./index.css";

const MusicPlayer = (props) => {

    const [playing, setPlaying] = useState(false);

    return(
        <>

            <div className="mt-2 bottom-navigation-container">
                <div 
                    // color="dark"
                    // dark
                    // expand
                    // fixed="bottom"
                    // full
                    // light
                    className="top-one-row custom-bottom-navigation"
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


                    <div className="custom-button-group-container">
                        <div className="custom-button-group">
                            <SkipPreviousIcon fontSize="large" />
                            {
                                playing ?
                                <PauseIcon fontSize="large" /> : 
                                <PlayArrowIcon fontSize="large" />
                            }
                            <SkipNextIcon fontSize="large" />
                        </div>
                    </div>
                </div>
            </div>
            {/* <Container className="pt-5 pb-5"/> */}
        </>
    );
};

export default MusicPlayer;