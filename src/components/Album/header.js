import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import CircleIcon from '@mui/icons-material/Circle';

import { apiLinks } from "../../connection.config";
import { CalculateTimeContext, SongList, Artists, Duration } from "../../pages/Album";

import "./header.css";

const Header = (props) => {
    const artists = useContext(Artists);
    const songList = useContext(SongList);
    const totalDuration = useContext(Duration);
    const calculateTotalDuration = useContext(CalculateTimeContext);

    return (
        <React.Fragment>
            <Container>
                <div className="album-container">
                    <div className="album-image-container">
                        <img 
                            className="album-image"
                            src={apiLinks.getImage + songList[0]?.musicImageKey} 
                            alt={songList[0]?.albumTitle} />
                    </div>
                    <div className="album-details">
                        <div className="album-heading">
                            Album
                        </div>
                        <div className="album-name">
                            {songList[0]?.albumTitle}
                        </div>
                        <div className="album-artists">
                            {
                                artists.length > 2 ? 
                                    "Various Artists" : 
                                    artists?.map((artist, idx) => {
                                        return (
                                            <span key={idx}>
                                                <Link to={`/artist/${artist}`}>
                                                    {artist}
                                                </Link>
                                                {idx < (artists.length - 1) ? " , " : " "}
                                            </span>
                                        )
                                    })
                            } &nbsp; <CircleIcon style={{ fontSize: '.5rem' }} />&nbsp; { calculateTotalDuration(totalDuration) }
                        </div>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
};

export default Header;