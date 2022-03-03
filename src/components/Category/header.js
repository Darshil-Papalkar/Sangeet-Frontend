import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import CircleIcon from '@mui/icons-material/Circle';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

import { IsDark, LoadAudio } from "../../App";
import { apiLinks } from "../../connection.config";
import { Artists, SongList, Duration, CalculateTimeContext } from '../../pages/Category';

import "./header.css";

const Header = (props) => {
    const isDark = useContext(IsDark);
    const artists = useContext(Artists);
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
                            src={apiLinks.getImage + songList[0]?.musicImageKey} 
                            alt={props.title} />
                    </div>
                    <div className="album-details">
                        <div className="album-heading">
                            Category
                        </div>
                        <div className="album-name">
                            {props.title}
                        </div>
                        <div className="album-artists">
                            {
                                artists.length > 2 ? 
                                    "Various Artists" : 
                                    artists?.map((artist, idx) => {
                                        return (
                                            <span key={idx}>
                                                <Link className={`artist-${isDark ? "dark" : "light"}`} to={`/artist/${artist}`}>
                                                    {artist}
                                                </Link>
                                                {idx < (artists.length - 1) ? " , " : " "}
                                            </span>
                                        )
                                    })
                            } &nbsp; <CircleIcon style={{ fontSize: '.5rem' }} />&nbsp; { calculateTotalDuration(totalDuration) }
                        </div>
                    </div>

                    <PlayCircleFilledIcon 
                        className={`album-play-button ${isDark ? "dark" : "light"}`} 
                        onClick={(e) => loadAudio(songList, songList[0], e)}
                    />
                    
                </div>
            </Container>
        </React.Fragment>
    );
};

export default Header;