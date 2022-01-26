import React, { useState, useRef, useEffect, useCallback, 
        forwardRef, useImperativeHandle, useContext } from "react";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import PauseIcon from '@mui/icons-material/Pause';
import { Error } from '../Notification/Notification';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { SpinnerRotate } from "../spinner/spinner-grow";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';

import { LoadAudio } from "../../App";
import { apiLinks } from "../../connection.config";


import "./index.css";

let timeState = null;

const MusicPlayer = forwardRef((props, ref) => {
    const audioRef = useRef(null);
    const borderRef = useRef(null);
    const volumeRef = useRef(null);

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
        const percent = (audioRef.current.currentTime / endTime * 100);
        borderRef.current.style.width = `${endTime === null ? 100 : percent}%`;
        
        timeState = setTimeout(updateBorderRef, 2000);
    }, [endTime]);

    const playPauseSong = () => {
        if(playing){
            window.clearTimeout(timeState);
            audioRef.current.pause();
        }
        else{
            audioRef.current.play();
            timeState = setTimeout(updateBorderRef, 1000);
        }
        setPlaying(prev => !prev);
    };

    const prevSong = useCallback(() => {
        if(currentSongIdx > 0){
            window.clearTimeout(timeState);
            props.setCurrentSong(playlist[currentSongIdx - 1]);
        }
    }, [props, currentSongIdx, playlist]);

    const nextSong = useCallback(() => {
        if(currentSongIdx < (playlist.length - 1)){
            window.clearTimeout(timeState);
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
                // setEndTime(0);
                // borderRef.current.style.width = "0%";
                audioRef.current.src = await (apiLinks.getAudio + props.currentSong.musicKey);
                const playPromise = audioRef.current.play();
                audioRef.current.volume = volume;
                timeState = setTimeout(() => updateBorderRef(), 100);

                // audioRef.current.addEventListener('loadedmetadata', () => {
                //     setEndTime(audioRef.current.duration);
                // })
                setEndTime(props.currentSong.duration);

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                    //   setEndTime(audioRef.current.duration);
                      abortController = null;
                    })
                    .catch(error => {
                      setPlaying(false);
                    });
                }

                const currentSongIndex = props.playlist?.findIndex(obj => obj.id === props.currentSong?.id);
                setCurrentSongIdx(currentSongIndex);

                audioRef.current.onended = () => {
                    clearTimeout(timeState);
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
                Error(err.message);
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

    // console.log(currentSong);

    return(
        <>

            <div className="mt-2 bottom-navigation-container">
                <div ref={borderRef} className="top-one-row"/>
                <div className="custom-bottom-navigation" >
                    <div className="timeline start">{calculateSongTime(currentTime)}</div>
                    <div className="timeline end">{endTime !== Infinity ? calculateSongTime(endTime): '--:--'}</div>
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
                                <Link to={`/album/${currentSong.albumTitle}`}>
                                    {currentSong.albumTitle}
                                </Link>
                            </h6>
                        </div>
                    </div>

                    <div className="custom-button-group-container">
                        <div className="custom-button-group">
                            <SkipPreviousIcon 
                                onClick={currentSongIdx > 0 ? prevSong : null}
                                className={currentSongIdx === 0 ? "disabled-svg": ''}
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
                                className={currentSongIdx === (playlist.length - 1) ? "disabled-svg": ''}
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
                        <audio ref={audioRef} preload="auto" />
                    </div>
                </div>
            </div>
            <Container className="mt-3 pt-5 pb-5"/>
        </>
    );
});

export default MusicPlayer;