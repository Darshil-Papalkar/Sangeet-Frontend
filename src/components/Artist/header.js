import { Container } from "reactstrap";
import React, { useContext } from "react";
import CircleIcon from '@mui/icons-material/Circle';

import { apiLinks } from "../../connection.config";
import { CalculateTimeContext, Duration } from "../../pages/Artist";

import "./header.css";

const Header = (props) => {
    const totalDuration = useContext(Duration);
    const calculateTotalDuration = useContext(CalculateTimeContext);

    return (
        <React.Fragment>
            <Container>
                <div className="album-container">
                    <div className="album-image-container">
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
                        <div className="album-artists">
                            Duration&nbsp;<CircleIcon style={{ fontSize: '.5rem' }} />&nbsp;{ calculateTotalDuration(totalDuration) }
                        </div>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
};

export default Header;