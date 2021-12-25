import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

import TextInput from './textInput';
import AddNewModal from './addNewModal';
import CheckBoxInput from './checkBoxInput';
import EditImageUpload from './editImageUpload';
import { apiLinks } from '../../connection.config';
import { Error } from "../Notification/Notification";
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

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

const EditExistingMusic = (props) => {

    const audioRef = useRef();
    const rangeRef = useRef();
    const animationRef = useRef();

    const [endTime, setEndTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [load, setLoad] = useState(false);
    const [playing, setPlaying] = useState(false);

    const [musicKey, setMusicKey] = useState("");
    const [musicImgKey, setMusicImgKey] = useState("");

    const [musicName, setMusicName] = useState(props.musicTitle+".mp3");

    const [addGenreWidget, setAddGenreWidget] = useState(false);
    const [addArtistWidget, setAddArtistWidget] = useState(false);
    const [addCategoryWidget, setAddCategoryWidget] = useState(false);

    const {genre, category, artist, musicTitle, albumTitle, editMusicWidget, editId,
            handleChange,  setMusicTitle, Loader, setLoader,
            setAlbumTitle, handleGenreChange, handleCategoryChange, 
            updateEditMusicWidget } = props;
    

    const onButtonClick = (event) => {
        const id = event.target.id;
        switch(id){
            case 'add-1': 
                setAddArtistWidget(prev => !prev);
                break;
            case 'add-2':
                setAddGenreWidget(prev => !prev);
                break;
            case 'add-3':
                setAddCategoryWidget(prev => !prev);
                break;
            default:
                setAddGenreWidget(false);
                setAddArtistWidget(false);
                setAddCategoryWidget(false);
                break;
        }
    };

    const calculateTime = (time) => {
        const minutes = Math.floor(time/60);
        const returnMinutes = minutes >= 10 ? `${minutes}` : `0${minutes}`;

        const seconds = Math.floor(time%60);
        const returnSeconds = seconds >= 10 ? `${seconds}` : `0${seconds}`;

        return `${returnMinutes}:${returnSeconds}`;
    };

    const updateSongState = async () => {
        
        setPlaying(prev => !prev);

        if(playing === false){
            try{
                setLoad(true);
                if(!audioRef.current.src){
                    audioRef.current.src =  apiLinks.getAudio + musicKey;
                    audioRef.current.loop = true;
                }
                audioRef.current.play();
                animationRef.current = requestAnimationFrame(whilePlaying);
            }
            catch(err){
                console.log("Error Occured while fetching audio", err);
                Error(err.message);
            }
            finally{
                audioRef.current.oncanplaythrough = () => {
                    const secs = Math.floor(audioRef.current.duration);
                    rangeRef.current.max = secs;
                    setEndTime(secs);
                    setLoad(false);
                };
                if(!(audioRef.current.paused))
                    setLoad(false);
            }
            
        }
        else{
            audioRef.current.pause();
            cancelAnimationFrame(animationRef.current);
        }

    };

    const saveEditFile = async () => {

    };

    const changePlayerCurrentTime = () => {
        rangeRef.current.style.setProperty('--seek-before-width', `${(rangeRef.current.value / endTime) * 100}%`);
        setCurrentTime(rangeRef.current.value);
    };

    const changeRange = () => {
        console.log(rangeRef.current.value);
        audioRef.current.currentTime = parseInt(rangeRef.current.value);
        console.log(audioRef.current.currentTime);
        changePlayerCurrentTime();
    };

    const whilePlaying = () => {
        rangeRef.current.value = audioRef.current.currentTime;
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    };

    useEffect(() => {

        const getImageFileKey = async () => {
            try{
                const response = await axios.get(apiLinks.getImageKey+editId);
                if(response.data.code === 200){
                    setMusicImgKey(response.data.message.musicImageKey);
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
                const response = await axios.get(apiLinks.getAudioKey+editId);
                if(response.data.code === 200){
                    setMusicKey(response.data.message.musicKey);
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


    }, [editId]);

    return (
        <React.Fragment>
            
            <Modal
                isOpen={editMusicWidget}
                centered={true}
                scrollable={true}
                backdrop
                size='xl'
                toggle={updateEditMusicWidget}
            >
                <ModalHeader toggle={updateEditMusicWidget}>
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
                                    names={names}
                                />
                                <CheckBoxInput 
                                    id="genre-name" labelName="Genre Name"
                                    label="Select Genre" type={genre}
                                    handleChange={handleGenreChange} MenuProps={MenuProps}
                                    names={names}
                                />
                                <CheckBoxInput 
                                    id="category-name" labelName="Category Name"
                                    label="Select Category" type={category}
                                    handleChange={handleCategoryChange} MenuProps={MenuProps}
                                    names={names}
                                />

                                <Row className='music-detail-fields'>
                                    <Col xs="4" className='mt-2 mb-3' style={{textAlign: "center"}}>
                                        <Button id="add-1" color='dark' onClick={onButtonClick}>
                                            Add Artists
                                        </Button>
                                    </Col>
                                    <Col xs="4" className='mt-2 mb-3' style={{textAlign: "center"}}>
                                        <Button id="add-2" color="dark" onClick={onButtonClick}>
                                            Add Genre
                                        </Button>
                                    </Col>
                                    <Col xs="4" className='mt-2 mb-3' style={{textAlign: "center"}}>
                                        <Button id="add-3" color="dark" onClick={onButtonClick}>
                                            Add Category
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col lg="6">

                            <Row>
                                <div className='music-upload-button'>
                                    <div className='music-upload-detail'>
                                        <span className='music-image-title' style={{textAlign: "center"}}>
                                            <LibraryMusicIcon /> &ensp; " {musicName} "
                                            <span 
                                                className='existing-music-play-container' 
                                                onClick={updateSongState} 
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
                                                                    <PauseCircleIcon title="Stop Playing" />
                                                                </> 
                                                        )
                                                        :
                                                        <PlayCircleIcon title="Play this Song" />
                                                }
                                            </span>
                                        </span>
                                    </div>
                                    <div className='audio-duration'>
                                        <audio id="music_player" ref={audioRef} />
                                        <span className='durationTimer'>{calculateTime(currentTime)}</span>
                                        <input 
                                            type="range" 
                                            ref={rangeRef} 
                                            defaultValue={0}
                                            onChange={changeRange} 
                                            className='admin-audio-progressBar'
                                        />
                                        <span className='durationTimer'>{!isNaN(endTime) && calculateTime(endTime)}</span>
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

            {addArtistWidget ? 
                <AddNewModal 
                    header="Add New Artist"
                    toggle={setAddArtistWidget}
                    id='1'
                /> :
                <React.Fragment />
            }
            
            {addGenreWidget ? 
                <AddNewModal 
                    header="Add New Genre"
                    toggle={setAddGenreWidget}
                    id='2'
                /> :
                <React.Fragment />
            }
            
            {addCategoryWidget ? 
                <AddNewModal 
                    header="Add New Category"
                    toggle={setAddCategoryWidget}
                    id='3'
                /> :
                <React.Fragment />
            }
        </React.Fragment>
    );
};

export default EditExistingMusic;
