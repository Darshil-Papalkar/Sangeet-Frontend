import React, { useState, useRef, useEffect, useCallback } from "react";
import { Container } from "reactstrap";

import PauseIcon from '@mui/icons-material/Pause';
import { Error } from '../Notification/Notification';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { SpinnerRotate } from "../spinner/spinner-grow";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

import "./index.css";
import { apiLinks } from "../../connection.config";

let timeState = null;

const MusicPlayer = (props) => {
    const audioRef = useRef(null);
    const borderRef = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);

    const [playlist, setPlaylist] = useState([]);
    const [currentSong, setCurrentSong] = useState({});
    const [currentSongIdx, setCurrentSongIdx] = useState(0);

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
        if(!isNaN(endTime))
            setEndTime(audioRef.current.duration);
        const percent = Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100);
        // console.log(percent);
        borderRef.current.style.width = `${percent}%`;
        
        timeState = setTimeout(updateBorderRef, 1000);
    }, [endTime]);

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
        if(currentSongIdx > 0)
            props.setCurrentSong(playlist[currentSongIdx - 1]);
    }, [props, currentSongIdx, playlist]);

    const nextSong = useCallback(() => {
        if(currentSongIdx < (playlist.length - 1)){
            audioRef.current.pause();
            // console.log('Next song', currentSongIdx, playlist, currentSong);
            props.setCurrentSong(playlist[currentSongIdx + 1]);
        }
    }, [currentSongIdx, playlist, props]);

    useEffect(() => {

        let abortController = new AbortController();

        const loadMusic = async () => {
            try{
                setLoading(true);
                setEndTime(0);
                borderRef.current.style.width = "0%";
                audioRef.current.src = await (apiLinks.getAudio + props.currentSong.musicKey);
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                      // Automatic playback started!
                      // Show playing UI.
                      setEndTime(audioRef.current.duration);
                      setTimeout(() => updateBorderRef(), 100);
                      abortController = null;
                    })
                    .catch(error => {
                      // Auto-play was prevented
                      // Show paused UI.
                      setPlaying(false);
                    });
                }

                const currentSongIndex = props.playlist?.findIndex(obj => obj.id === props.currentSong?.id);
                setCurrentSongIdx(currentSongIndex);

                audioRef.current.onended = () => {
                    clearTimeout(timeState);
                    if(currentSongIndex < props.playlist?.length - 1){
                        props.loadAudio(props.playlist, props.playlist[currentSongIndex + 1], null);
                    }
                    else{
                        props.loadAudio([], {}, null);
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
    [   props.currentSong, props.playlist, props, currentSongIdx, playlist, 
        props?.currentSong?.musicTitle, currentSong?.musicTitle, nextSong, updateBorderRef
    ]);

    // console.log(currentSong, playlist);
    // console.log(currentTime, endTime);

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
                                {currentSong.albumTitle}
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
                        </div>
                        <audio ref={audioRef} preload="auto" />
                    </div>
                </div>
            </div>
            <Container className="mt-3 pt-5 pb-5"/>
        </>
    );
};

export default MusicPlayer;