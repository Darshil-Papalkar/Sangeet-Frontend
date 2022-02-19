import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState, useEffect, useRef } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
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

const EditExistingMusic = (props) => {
    
    const audioRef = useRef();

    const [load, setLoad] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [currentPaused, setCurrentPaused] = useState(false);

    const [musicKey, setMusicKey] = useState("");
    const [musicImgKey, setMusicImgKey] = useState("");

    const {genre, category, artist, musicTitle, albumTitle, editMusicWidget, editId, hiddenMusicInput,
            handleChange,  setMusicTitle, setLoader, updateRow, fav, setFav, uploadMusic, musicName, 
            setAlbumTitle, handleGenreChange, handleCategoryChange, handleMusicClick, musicPath, 
            updateEditMusicWidget, hiddenFileInput, musicDuration } = props;

    const [genreList, setGenreList] = useState([]);
    const [artistList, setArtistList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    
    const [artistImg, setArtistImg] = useState({});
    const [artistImgPath, setArtistPath] = useState('');
    const [artistImgName, setArtistImgName] = useState('');
  
    const closeWidget = () => {
        updateEditMusicWidget();
    };

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const uploadArtistImage = (event) => {
        if(event.target.files[0]){
            setArtistImg(event.target.files);
            setArtistImgName(event.target.files[0].name);
            setArtistPath(URL.createObjectURL(event.target.files[0]));
        }
    };

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
        if(musicPath.length){
            audioRef.current.src = URL.createObjectURL(musicPath[0]);
        }
        setPlaying(prev => !prev);
        if(playing === false){
            try{
                setLoad(true);
                audioRef.current.play();
                audioRef.current.onended = () => {
                    setCurrentPaused(prev => !prev);
                    setPlaying(prev => !prev);
                }
            }
            catch(err){
                console.log("Error Occured while fetching audio", err);
                Error(err.message);
            }
            finally{

                if(audioRef.current){
                    audioRef.current.oncanplaythrough  = () => {
                        setLoad(false);
                    }

                    if(!(audioRef.current.paused) && audioRef.current.readyState > 0)
                        setLoad(false);
                }

            }
        }
        else{
            audioRef.current.pause();
        }
    };

    const saveEditFile = async () => {

        try{
            setLoader(true);
            
            const today = new Date().toISOString();

            const formData = new FormData();
            formData.append("show", fav);
            formData.append("date", today);
            formData.append("musicTitle", musicTitle);
            formData.append("albumTitle", albumTitle);
            formData.append("songImage", artistImg[0]);
            formData.append("musicFile", musicPath[0]);
            formData.append("duration", musicDuration);
            formData.append("genre", JSON.stringify(genre));
            formData.append("artist", JSON.stringify(artist));
            formData.append("category", JSON.stringify(category));

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
                                        <span className='music-image-title' style={{textAlign: "center", flexDirection: "row"}}>
                                            <LibraryMusicIcon /> &ensp; " {musicName || musicTitle+".mp3"} "
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
                                            <div className='music-upload-button'>
                                                <div className='music-upload-detail d-flex justify-content-center align-items-center'>
                                                    <div className='music-upload-detail'>
                                                        <input 
                                                            type="file" 
                                                            accept='audio/*'
                                                            onChange={uploadMusic} 
                                                            ref={hiddenMusicInput}
                                                            style={{display: "none"}}
                                                        />
                                                        <Button 
                                                            onClick={handleMusicClick}
                                                            color='dark'
                                                            outline={true}
                                                            style={{
                                                                padding: "2px 6px",
                                                                display: "flex",
                                                            }}
                                                        >
                                                            <EditIcon title="Edit Image" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div className='audio-duration'>
                                        <audio ref={audioRef} 
                                            src={(musicKey && (apiLinks.getAudio + musicKey))}
                                        />
                                    </div>
                                </div>
                            </Row>

                            <EditImageUpload 
                                imageKey = {musicImgKey}
                                handleClick={handleClick}
                                musicImgPath={artistImgPath}
                                artistImgName={artistImgName}
                                musicImgName={`${musicTitle}`}
                                hiddenFileInput={hiddenFileInput}
                                uploadMusicImage={uploadArtistImage}
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
