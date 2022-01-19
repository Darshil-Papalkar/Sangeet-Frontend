import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

import TextInput from './textInput';
import CheckBoxInput from './checkBoxInput';
import EditImageUpload from './editImageUpload';
import { apiLinks } from '../../connection.config';
import { Error, Success } from "../Notification/Notification";
import { SpinnerRotate } from "../spinner/spinner-grow";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
    style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
    },
    },
};

// let audioRef;

const EditExistingMusic = (props) => {
    
    const audioRef = useRef();
    // const rangeRef = useRef();
    // const animationRef = useRef();

    // const [endTime, setEndTime] = useState(0);
    // const [currentTime, setCurrentTime] = useState(0);

    const [load, setLoad] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [currentPaused, setCurrentPaused] = useState(false);

    const [musicKey, setMusicKey] = useState("");
    const [musicImgKey, setMusicImgKey] = useState("");

    const {genre, category, artist, musicTitle, albumTitle, editMusicWidget, editId,
            handleChange,  setMusicTitle, setLoader, updateRow, fav, setFav,
            setAlbumTitle, handleGenreChange, handleCategoryChange, 
            updateEditMusicWidget } = props;

    const [genreList, setGenreList] = useState([]);
    const [artistList, setArtistList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    
    const closeWidget = () => {
        // cancelAnimationFrame(animationRef.current);
        updateEditMusicWidget();
    };

    // const calculateTime = (time) => {
    //     if(time !== Infinity){
    //         const minutes = Math.floor(time/60);
    //         const returnMinutes = minutes >= 10 ? `${minutes}` : `0${minutes}`;
    
    //         const seconds = Math.floor(time%60);
    //         const returnSeconds = seconds >= 10 ? `${seconds}` : `0${seconds}`;
    
    //         return `${returnMinutes}:${returnSeconds}`;
    //     }
    // };

    const stopSong = () => {
        
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        
        setPlaying(prev => !prev);
        if(currentPaused)
            setCurrentPaused(prev => !prev);
    };

    const pauseSong = () => {
        if(currentPaused)
            audioRef.current.play();
        else
            audioRef.current.pause();
        setCurrentPaused(prev => !prev);
    };

    const updateSongState = async () => {
        setPlaying(prev => !prev);
        if(playing === false){
            try{
                setLoad(true);
                // src={musicKey && (apiLinks.getAudio + musicKey)}
                // audioRef.current.src = apiLinks.getAudio + musicKey;
                audioRef.current.play();
                audioRef.current.onended = () => {
                    setCurrentPaused(prev => !prev);
                    setPlaying(prev => !prev);
                }
                // animationRef.current = requestAnimationFrame(whilePlaying);
            }
            catch(err){
                console.log("Error Occured while fetching audio", err);
                Error(err.message);
            }
            finally{

                if(audioRef.current){
                    audioRef.current.oncanplaythrough  = () => {
                        console.log(audioRef.current.duration);
                        
                        // const secs = Math.floor(audioRef.current.duration);
                        // rangeRef.current.max = secs;
                        // setEndTime(secs);
                        setLoad(false);
                    }

                    if(!(audioRef.current.paused) && audioRef.current.readyState > 0)
                        setLoad(false);
                }

            }
        }
        else{
            audioRef.current.pause();
            // cancelAnimationFrame(animationRef.current);
        }

    };

    const saveEditFile = async () => {

        try{
            setLoader(true);
            
            const today = new Date().toISOString();
            const formData = {
                "musicTitle": musicTitle,
                "albumTitle": albumTitle,
                "artist": JSON.stringify(artist),
                "genre": JSON.stringify(genre),
                "category": JSON.stringify(category),
                "date": today,
                "show": fav
            };

            const response = await axios.put(apiLinks.updateAdminData+editId, formData, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            
            if(response.data.code === 200){
                updateRow(response.data.data);
                Success(response.data.message);
            }
            else{
                Error(response.data.message);
            }

            // console.log(response.data);
        }
        catch(err){
            console.log("An Error Occured while updating data", err);
            Error(err.message);
        }
        finally{
            setLoader(false);
            closeWidget();
        }

    };

    // const changePlayerCurrentTime = () => {
    //     rangeRef.current.style.setProperty('--seek-before-width', `${(Number(rangeRef.current.value) / endTime) * 100}%`);
    //     setCurrentTime(rangeRef.current.value);
    // };

    // const changeRange = async (event) => {
    //     try{
    //         rangeRef.current.value = event.target.value;     
    //         audioRef.current.src = apiLinks.getAudio + musicKey;
    //         audioRef.current.play();
    //         audioRef.current.addEventListener('canplay', () => {
    //             audioRef.current.currentTime = parseInt(event.target.value);
    //         });
    //         changePlayerCurrentTime();
    //     }
    //     catch(err){
    //         console.log("An Error Occured", err.message);
    //     }
    // };

    // const whilePlaying = () => {
        // rangeRef.current.value = audioRef.current.currentTime;
        // changePlayerCurrentTime();
        // animationRef.current = requestAnimationFrame(whilePlaying);

    // };

    useEffect(() => {

        let imgFileController = new AbortController();
        let audioFileController = new AbortController();

        const getImageFileKey = async () => {
            try{
                const response = await axios.get(apiLinks.getImageKey+editId, {
                    signal: imgFileController.signal
                });
                if(response.data.code === 200){
                    setMusicImgKey(response.data.message.musicImageKey);
                    imgFileController = null;
                }
                else{
                    Error(response.data.message);
                }
            }
            catch(err){
                console.log("Error Occured", err.message);
                Error(err.message);
            }
        };

        getImageFileKey();

        const getAudioFileKey = async () => {
            try{
                const response = await axios.get(apiLinks.getAudioKey+editId, {
                    signal: audioFileController.signal
                });
                if(response.data.code === 200){
                    setMusicKey(response.data.message.musicKey);
                    audioFileController = null;
                }
                else{
                    Error(response.data.message);
                }
            }
            catch(err){
                console.log("Error Occured", err.message);
                Error(err.message);
            }
        };

        getAudioFileKey();

        return () => {
            imgFileController?.abort();
            audioFileController?.abort();
        }

    }, [editId]);

    useEffect(() => {

        let genreController = new AbortController();
        let artistController = new AbortController();
        let categoryController = new AbortController();

        const getGenreList = async () => {
            try{
                const response = await axios.get(apiLinks.getAllGenre, {
                    signal: genreController.signal
                });
                if(response.data.code === 200){
                    const data = response.data.message.map(item => item.type);
                    setGenreList(data);
                    genreController =  null;
                }
                else{ 
                    Error(response.data.message);
                    setGenreList([]);
                }
            }
            catch(err){
                console.log(err);
                Error(err.message);
                setGenreList([]);
            }
        };
        
        const getArtistList = async () => {
            try{
                const response = await axios.get(apiLinks.getAllArtists, {
                    signal: artistController.signal
                });
                if(response.data.code === 200){
                    const data = response.data.message.map(item => item.name);
                    setArtistList(data);
                    artistController = null;
                }
                else{ 
                    Error(response.data.message);
                    setArtistList([]);
                }
            }
            catch(err){
                console.log(err);
                Error(err.message);
                setArtistList([]);
            }
        };

        const getCategoryList = async () => {
            try{
                const response = await axios.get(apiLinks.getAllCategory, {
                    signal: categoryController.signal
                });
                if(response.data.code === 200){
                    const data = response.data.message.map(item => item.type);
                    setCategoryList(data);
                    categoryController = null;
                }
                else{ 
                    Error(response.data.message);
                    setCategoryList([]);
                }
            }
            catch(err){
                console.log(err);
                Error(err.message);
                setCategoryList([]);
            }
        };

        getGenreList();
        getArtistList();
        getCategoryList();

        return () => {
            genreController?.abort();
            artistController?.abort();
            categoryController?.abort();
        };

    }, []);

    return (
        <React.Fragment>
            
            <Modal
                isOpen={editMusicWidget}
                centered={true}
                scrollable={true}
                backdrop
                size='xl'
                toggle={closeWidget}
            >
                <ModalHeader toggle={closeWidget}>
                    <span className='modal-header-title'>
                        Edit Existing Song
                    </span>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col lg="6">
                            <div className='music-details'>
                                
                                <TextInput 
                                    required
                                    id="song-name"
                                    labelName="Song Name"
                                    label="Enter Song Name"
                                    value={musicTitle}
                                    onChange={setMusicTitle}
                                    // check={true}
                                    checkedValue={fav}
                                    onCheckBoxChange={setFav}
                                />
                                <TextInput 
                                    id="album-name"
                                    labelName="Album Name"
                                    label="Enter Album Name"
                                    value={albumTitle}
                                    onChange={setAlbumTitle}
                                />

                                <CheckBoxInput 
                                    id="artist-name" labelName="Artist Name"
                                    label="Select Artist" type={artist}
                                    handleChange={handleChange} MenuProps={MenuProps}
                                    names={artistList}
                                />
                                <CheckBoxInput 
                                    id="genre-name" labelName="Genre Name"
                                    label="Select Genre" type={genre}
                                    handleChange={handleGenreChange} MenuProps={MenuProps}
                                    names={genreList}
                                />
                                <CheckBoxInput 
                                    id="category-name" labelName="Category Name"
                                    label="Select Category" type={category}
                                    handleChange={handleCategoryChange} MenuProps={MenuProps}
                                    names={categoryList}
                                />
                            </div>
                        </Col>
                        <Col lg="6">

                            <Row>
                                <div className='music-upload-button'>
                                    <div className='music-upload-detail'>
                                        <span className='music-image-title' style={{textAlign: "center"}}>
                                            <LibraryMusicIcon /> &ensp; " {props.musicTitle+".mp3"} "
                                            <span 
                                                className='pl-3 existing-music-play-container' 
                                            >
                                                {
                                                    playing ?
                                                        (
                                                            load ? 
                                                                <SpinnerRotate 
                                                                    size="sm"
                                                                    color="dark"
                                                                /> : 
                                                                <>
                                                                    {
                                                                        currentPaused ? 
                                                                        <PlayCircleIcon title="Resume Playing" onClick={pauseSong} /> :
                                                                        <PauseCircleIcon title="Pause Playing" onClick={pauseSong} />
                                                                    }
                                                                    <StopCircleIcon title="Stop Playing" onClick={stopSong} />
                                                                </> 
                                                        )
                                                        :
                                                        <PlayCircleIcon title="Play this Song" onClick={updateSongState} />
                                                }
                                            </span>
                                        </span>
                                    </div>
                                    <div className='audio-duration'>
                                        <audio ref={audioRef} 
                                            src={musicKey && (apiLinks.getAudio + musicKey)}
                                        />
                                        {/* <span className='durationTimer'>{calculateTime(currentTime)}</span>
                                        <input 
                                            type="range" 
                                            ref={rangeRef} 
                                            defaultValue={0}
                                            // onChange={changeRange} 
                                            className='admin-audio-progressBar'
                                        />
                                        <span className='durationTimer'>{!isNaN(endTime) && calculateTime(endTime)}</span> */}
                                    </div>
                                </div>
                            </Row>

                            <EditImageUpload 
                                imageKey = {musicImgKey}
                                musicImgName={musicTitle}
                            />

                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        onClick={saveEditFile}
                    >
                        Save
                    </Button>

                </ModalFooter>
            </Modal>
            
        </React.Fragment>
    );
};

export default EditExistingMusic;
