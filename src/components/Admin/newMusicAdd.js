import React, {useEffect, useState} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col} from 'reactstrap';
import axios from 'axios';

import TextInput from './textInput';
import CheckBoxInput from './checkBoxInput';
import NewImageUpload from './newImageUpload';
import { apiLinks } from '../../connection.config';
import { Error } from '../Notification/Notification';

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

const NewMusicAdd = (props) => {

    const [genreList, setGenreList] = useState([]);
    const [artistList, setArtistList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    const {genre, category, musicName, artist, musicImgPath, musicImgName, addMusicWidget, hiddenFileInput, musicDuration,
        hiddenMusicInput, uploadMusic, handleClick, handleChange, saveUploadMusic, handleMusicClick, fav, setFav,
        uploadMusicImage, handleGenreChange, removeMusicDetails, removeSelectedSong, removeSelectedImage,
        updateAddMusicWidget, handleCategoryChange, musicTitle, albumTitle, setMusicTitle, setAlbumTitle} = props;

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
                    const data = response.data.message
                    setGenreList(data);
                    genreController = null;
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
                    const data = response.data.message
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
                    const data = response.data.message
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

    const calculateSongTime = (time) => {
        // console.log(time);
        if(time !== Infinity){
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes < 10 ? '0' + String(minutes) : String(minutes)}:${seconds < 10 ? '0' + String(seconds) : String(seconds)}`;
        } 
        return time;
    };

    return (
        <React.Fragment>
            
            <Modal
                isOpen={addMusicWidget}
                centered={true}
                scrollable={true}
                backdrop
                size='xl'
                toggle={updateAddMusicWidget}
            >
                <ModalHeader toggle={updateAddMusicWidget}>
                    <span className='modal-header-title'>
                        Add New Song
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
                                    check={true}
                                    value={musicTitle}
                                    onChange={setMusicTitle}
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
                                    <div className='music-upload-detail d-flex justify-content-center align-items-center'>
                                        <span className='music-image-title' style={{textAlign: "center"}}>
                                            <div>
                                                " {musicName.trim().length === 0 ? "Select File" : musicName} "
                                            </div>
                                            <div>
                                                Duration: {musicDuration !== 0 ? calculateSongTime(musicDuration) : '00:00'}
                                            </div>
                                        </span>
                                        {musicName.trim().length === 0 ? 
                                            <React.Fragment /> : 
                                            <Button close title='Remove song' onClick={removeSelectedSong}/>
                                        }
                                    </div>
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
                                        >
                                            Upload Song
                                        </Button>
                                    </div>
                                </div>
                            </Row>

                            <NewImageUpload 
                                musicImgName={musicImgName}
                                musicImgPath={musicImgPath}
                                removeSelectedImage={removeSelectedImage}
                                uploadMusicImage={uploadMusicImage}
                                hiddenFileInput={hiddenFileInput}
                                handleClick={handleClick}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        onClick={saveUploadMusic}
                    >
                        Save
                    </Button>
                    <Button onClick={removeMusicDetails}>
                        Discard
                    </Button>
                </ModalFooter>
            </Modal>

            
        </React.Fragment>
    );
};

export default NewMusicAdd;
