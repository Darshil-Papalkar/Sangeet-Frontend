// for song list
import { Container } from "reactstrap";
import { Link } from 'react-router-dom';
import React, { useState, useContext } from "react";
import PlayCircle from "@mui/icons-material/PlayCircle";
import PauseCircle from "@mui/icons-material/PauseCircle";
import EqualizerIcon from '@mui/icons-material/Equalizer';

import { CalculateTimeContext, SongList } from "../../pages/Artist";
import { PlayerContext, PlayPause, Playing, LoadAudio, IsDark } from "../../App";

import "./body.css";

const Body = (props) => {
    
    const isDark = useContext(IsDark);
    const paused = useContext(Playing);
    const songList = useContext(SongList);
    const loadAudio = useContext(LoadAudio);
    const playPauseState = useContext(PlayPause);
    const currentPlayer = useContext(PlayerContext);
    const calculateTimeContext = useContext(CalculateTimeContext);

    const [playId, setPlayId] = useState(0);
    const [playing, setPlaying] = useState(false);

    const updatePlayId = (value) => {
        setPlayId(value);
    };

    const updatePlayPause = (event) => {
        const e = {
            ...event, 
            code: "Space",
            preventDefault: () => {}
        };

        playPauseState(e);
    };

    return (
        <React.Fragment>
            <Container> 
                <div className="song-list">
                    {
                        songList.map((song, index) => {
                            return (
                                <div key={index}>
                                    <div className={`table-row ${isDark ? "dark" : "light"}`}
                                        key={song.id}
                                        style={currentPlayer.id && currentPlayer.id === song.id ? {color: isDark ? "#eee" : "#111"}: null}
                                        onMouseEnter={(e) => {updatePlayId(song.id)}}
                                        onMouseLeave={(e) => {updatePlayId(0)}}
                                        onClick={e => loadAudio(songList, song, e)}
                                    >
                                        <div className="srno-title">
                                            <div className="srno">
                                                {
                                                    currentPlayer.id && currentPlayer.id === song.id ?
                                                    <span
                                                        onMouseEnter={() => setPlaying(true)}
                                                        onMouseLeave={() => setPlaying(false)}
                                                    > 
                                                        {
                                                            !paused ?
                                                                <PlayCircle 
                                                                    onClick = {e => updatePlayPause(e)}
                                                                /> :
                                                                playing ?
                                                                    <PauseCircle 
                                                                        onClick = {e => updatePlayPause(e)}
                                                                    />:
                                                                    <EqualizerIcon />
                                                        }
                                                    </span>:
                                                    playId === song.id ? 
                                                        <PlayCircle /> :
                                                        index+1
                                                }
                                            </div>
                                            <div className="title">
                                                <div className="music-title">
                                                    {song.musicTitle}
                                                </div>
                                                <div className="d-flex custom-artists">
                                                    {
                                                        song.artists?.map((art, index) => {
                                                            return (
                                                                <div className="" key={index}>
                                                                    <span className="song-list-artist">
                                                                        <Link to={`/artist/${art}`}>
                                                                                {art}
                                                                        </Link>
                                                                    </span>
                                                                    <span className="song-list-artist-separation">
                                                                        {song.artists.length - 1 > index ? ",": ""}&nbsp;
                                                                    </span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="duration">
                                                {song.duration ? calculateTimeContext(song.duration) : '--:--'}
                                        </div>
                                    </div>
                                    {
                                        index < songList.length - 1 ? (
                                            <div className="custom-bottom-border" key={index} />
                                        ) : <React.Fragment />
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </Container>
        </React.Fragment>
    );
};

export default Body;