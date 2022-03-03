import React, { useState, useRef, useEffect, useCallback, 
        forwardRef, useImperativeHandle, useContext } from "react";
import { Link } from "react-router-dom";
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { SpinnerRotate } from "../spinner/spinner-grow";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { useTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';

import { LoadAudio, IsDark } from "../../App";
import { apiLinks } from "../../connection.config";

import "./index.css";

const MusicPlayer = forwardRef((props, ref) => {
    const theme = useTheme();
    
    const audioRef = useRef(null);
    const borderRef = useRef(null);
    const volumeRef = useRef(null);

    const isDark = useContext(IsDark);
    const loadAudio = useContext(LoadAudio);

    const { playing, setPlaying } = props;

    const [style, setStyle] = useState({display: 'none'});

    // const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);

    const [playlist, setPlaylist] = useState([]);
    const [currentSong, setCurrentSong] = useState({});
    const [currentSongIdx, setCurrentSongIdx] = useState(0);
    
    const [volume, setVolume] = useState(1.0);
    const [currentTime, setCurrentTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    
    document.title = currentSong.musicTitle || 'Sangeet - Enjoy Ad Free Music'; 
    
    const calculateSongTime = (time) => {
        // console.log(time);
        if(time !== Infinity){
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes < 10 ? '0' + String(minutes) : String(minutes)}:${seconds < 10 ? '0' + String(seconds) : String(seconds)}`;
        } 
        return time;
    };

    const updateBorderRef = useCallback(() => {
        setCurrentTime(audioRef.current.currentTime);
    }, []);

    const playPauseSong = () => {
        if(playing){
            audioRef.current.pause();
        }
        else{
            audioRef.current.play();
        }
        setPlaying(prev => !prev);
    };

    const prevSong = useCallback(() => {
        if(currentSongIdx > 0){
            props.setCurrentSong(playlist[currentSongIdx - 1]);
        }
    }, [props, currentSongIdx, playlist]);

    const nextSong = useCallback(() => {
        if(currentSongIdx < (playlist.length - 1)){
            audioRef.current.pause(); 
            props.setCurrentSong(playlist[currentSongIdx + 1]);
        }
    }, [currentSongIdx, playlist, props]);

    const volumeInc = () => {
        if(volume < 1){
            const vol = parseFloat(volume.toFixed(1)) + 0.1;
            volumeRef.current.value = vol;
            audioRef.current.volume = vol;
            setVolume(vol);
        }
    };

    const volumeDec = () => {
        if(volume > 0){
            const vol = parseFloat(volume.toFixed(1)) - 0.1;
            volumeRef.current.value = vol;
            audioRef.current.volume = vol;
            setVolume(vol);
        }
    };

    const handleMute = (vol) => {
        setVolume(vol);
        audioRef.current.volume = vol;
    };

    useImperativeHandle(ref, () => ({
        handlePlayPause(){
            playPauseSong();
        },
        handleNextSong(){
            nextSong();
        },
        handlePrevSong(){
            prevSong();
        },
        handleVolumeInc(){
            volumeInc();
        },
        handleVolumeDec(){
            volumeDec();
        },
        }),
    )

    useEffect(() => {

        let abortController = new AbortController();

        const loadMusic = async () => {
            try{
                setLoading(true);
                audioRef.current.src = await (apiLinks.getAudio + props.currentSong.musicKey);
                const playPromise = audioRef.current.play();
                audioRef.current.volume = volume;

                setEndTime(props.currentSong.duration);

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                      abortController = null;
                    })
                    .catch(error => {
                      setPlaying(false);
                    });
                }

                const currentSongIndex = props.playlist?.findIndex(obj => obj.id === props.currentSong?.id);
                setCurrentSongIdx(currentSongIndex);

                audioRef.current.onended = () => {
                    if(currentSongIndex < props.playlist?.length - 1){
                        loadAudio(props.playlist, props.playlist[currentSongIndex + 1], null);
                    }
                    else{
                        loadAudio([], {}, null);
                    }
                    setPlaying(false);
                };
            }
            catch(err){
                console.log("An Error occured while loading music", err);
                // Error(err.message);
            }
            finally{
                audioRef.current.oncanplaythrough = () => {
                    setLoading(false);
                    setPlaying(true);
                };
                
                if(!(audioRef.current.paused) && audioRef.current.readyState > 0)
                setLoading(false);
            }
        };
        
        if(props.currentSong?.musicTitle !== currentSong.musicTitle){
            setPlaylist(props.playlist);
            setCurrentSong(props.currentSong);
            loadMusic();
        }

        return () => {
            abortController?.abort();
        }
        
    }, 
    [   props.currentSong, props.playlist, props, currentSongIdx, playlist, ref, volume, setPlaying, 
        props?.currentSong?.musicTitle, currentSong?.musicTitle, nextSong, updateBorderRef, loadAudio
    ]);

    return(
        <>
            <div className={`mt-2 bottom-navigation-container ${isDark ? "player-dark" : "player-light"}`}>
                {/* <div ref={borderRef} className="top-one-row"/> */}
                <Slider
                    ref={borderRef}
                    aria-label="time-indicator"
                    size="small"
                    default={0}
                    step={1}
                    max={endTime}
                    value={currentTime}
                    onChange={(e) => {
                        audioRef.current.currentTime = parseFloat(e.target.value);
                        setCurrentTime(e.target.value);
                    }}
                    sx={{
                        color: 'rgb(64, 226, 0)',
                        height: 4,
                        padding: '0 !important',
                        '& .MuiSlider-thumb': {
                        width: 15,
                        height: 15,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&:before': {
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                        },
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0px 0px 0px 8px ${
                            theme.palette.mode === 'dark'
                                ? 'rgb(255 255 255 / 16%)'
                                : 'rgb(0 0 0 / 16%)'
                            }`,
                        },
                        '&.Mui-active': {
                            width: 25,
                            height: 25,
                        },
                        },
                        '& .MuiSlider-rail': {
                        opacity: 0.28,
                        },
                    }}
                />
                <div className="custom-bottom-navigation" >
                    <div className={`timeline start ${isDark ? "dark-time" : "light-time"}`}>{calculateSongTime(currentTime)}</div>
                    <div className={`timeline end ${isDark ? "dark-time" : "light-time"}`}>{endTime !== Infinity ? calculateSongTime(endTime): '--:--'}</div>
                    <div className="musicDetails">
                        <div className="image-box">
                            <div className="navbarHead-img-container">
                                <img 
                                    className={`navbarHead-img ${!currentSong.musicImageKey && "hover-img"}`} 
                                    src={currentSong.musicImageKey ? apiLinks.getImage + currentSong.musicImageKey : "/assets/svg/dvd.svg"} 
                                    alt="player-img" 

                                />
                            </div>
                        </div>

                        <div className="music-detail-box">
                            <h5 className="music-title">
                                {currentSong.musicTitle}
                            </h5>
                            <h6 className="music-album">
                                <Link className={`${isDark ? "dark-link-hover" : "light-link-hover"}`} to={`/album/${currentSong.albumTitle}`}>
                                    {currentSong.albumTitle}
                                </Link>
                            </h6>
                        </div>
                    </div>

                    <div className="custom-button-group-container">
                        <div className={`custom-button-group ${isDark ? "dark" : "light"}`}>
                            <SkipPreviousIcon 
                                onClick={currentSongIdx > 0 ? prevSong : null}
                                className={currentSongIdx === 0 ? `disabled-svg ${isDark ? "dark" : "light"}`: ''}
                                style={currentSongIdx > 0 ? 
                                    { cursor: 'pointer'} : { cursor: 'not-allowed' }} 
                            />
                            {
                                loading ?
                                    <SpinnerRotate 
                                        size=""
                                        color="success"
                                    /> :
                                    playing ?
                                        <PauseIcon title="Pause Song" onClick={playPauseSong} /> : 
                                        <PlayArrowIcon title="Play Song" onClick={playPauseSong} />
                            }
                            <SkipNextIcon 
                                onClick={currentSongIdx < (playlist.length - 1) ? nextSong: null}
                                className={currentSongIdx === (playlist.length - 1) ? `disabled-svg ${isDark ? "dark" : "light"}`: ''}
                                style={
                                        currentSongIdx < (playlist.length - 1) ? 
                                            { cursor: 'pointer'} : { cursor: 'not-allowed' }} 
                            />
                            <span 
                                className="volume-range-slider"

                                onClick={e => {
                                    setStyle(prev => {
                                        return {
                                            display: prev.display === 'block' ? 'none' : 'block'
                                        }
                                    })
                                }}
                            >
                                {
                                    volume > 0.5 ?
                                        <VolumeUpIcon className="volume-svg" /> :
                                        volume > 0 ?
                                            <VolumeDownIcon className="volume-svg" /> :
                                            <VolumeOffIcon className="volume-svg" />
                                }
                                <input style={style} min={0} max={1} step={0.1} onChange={e => handleMute(parseFloat(e.target.value))}
                                    type="range" orient="vertical" className="volume-slider" ref={volumeRef} defaultValue={volume} />
                            </span>
                        </div>
                        <audio ref={audioRef} preload="auto" onTimeUpdate={updateBorderRef} />
                    </div>
                </div>
            </div>
            {/* <Container className="mt-3 pt-5 pb-5"/> */}
        </>
    );
});

export default MusicPlayer;