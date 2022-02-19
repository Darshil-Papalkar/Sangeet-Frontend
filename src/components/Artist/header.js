import { Container } from "reactstrap";
import React, { useContext } from "react";
import CircleIcon from '@mui/icons-material/Circle';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

import { IsDark, LoadAudio } from "../../App";
import { apiLinks } from "../../connection.config";
import { CalculateTimeContext, Duration, SongList } from "../../pages/Artist";

import "./header.css";

const Header = (props) => {
    const isDark = useContext(IsDark);
    const songList = useContext(SongList);
    const loadAudio = useContext(LoadAudio);
    const totalDuration = useContext(Duration);
    const calculateTotalDuration = useContext(CalculateTimeContext);

    return (
        <React.Fragment>
            <Container className="mt-3">
                <div className="album-container">
                    <div className={`album-image-container ${isDark ? "dark" : "light"}`}>
                        <img 
                            className="album-image"
                            src={apiLinks.getArtistImgFromName + props.artist} 
                            alt={props.artist} />
                    </div>
                    <div className="album-details">
                        <div className="album-heading">
                            Artist
                        </div>
                        <div className="album-name">
                            {props.artist}
                        </div>
                        <div className="album-duration">
                            Duration&nbsp;<CircleIcon style={{ fontSize: '.5rem' }} />&nbsp;{ calculateTotalDuration(totalDuration) }
                        </div>
                    </div>

                    <PlayCircleFilledIcon 
                        className={`artist-play-button ${isDark ? "dark" : "light"}`} 
                        onClick={(e) => loadAudio(songList, songList[0], e)}
                    />

                </div>
            </Container>
        </React.Fragment>
    );
};

export default Header;