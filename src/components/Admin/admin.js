import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import {Button, Container} from 'reactstrap';

import NewMusicAdd from './newMusicAdd';
import EditExistingMusic from './editExistingMusic';
import StickyHeadTable from "./music-table";
import AddIcon from '@mui/icons-material/Add';
import SpinnerGrow from "../spinner/spinner-grow";
import { apiLinks } from '../../connection.config';
import { Success, Error } from '../Notification/Notification';
import AdminNavigation from '../navigation/Navigation-bar/admin-navigation';

import "./admin.css";

const Admin = () => {
    const hiddenFileInput = useRef(null);
    const hiddenMusicInput = useRef(null);

    const [loader, setLoader] = useState(false);
    
    const [rows, setRows] = useState([]);

    const [editId, setEditId] = useState(0);

    const [genre, setGenre] = useState([]);
    const [artist, setArtist] = useState([]);
    const [category, setCategory] = useState([]);

    const [addMusicWidget, setAddMusicWidget] = useState(false);
    const [editMusicWidget, setEditMusicWidget] = useState(false);
    
    const [music, setMusic] = useState({});
    const [musicName, setMusicName] = useState('');

    const [musicTitle, setMusicTitle] = useState('');
    const [albumTitle, setAlbumTitle] = useState('');
    
    const [musicImg, setMusicImg] = useState({});
    const [musicImgName, setMusicImgName] = useState("");
    const [musicImgPath, setMusicImgPath] = useState('/assets/images/default-music-upload-image.png');

    useEffect(() => {
        const getMusicData = async () => {

            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getAllAudio);
                if(response.data.code === 200){
                  setRows(response.data.message);
                }
                else{
                  Error(response.data.message);
                  setRows([]);
                }
            }
            catch(err){
                console.log(err);
                Error(err.message);
                setRows([]);
            }
            finally{
                setLoader(false);
            }
        };

        getMusicData();
    
    }, []);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setArtist(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleGenreChange = (event) => {
        const {
            target: { value },
        } = event;
        setGenre(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleCategoryChange = (event) => {
        const {
            target: { value },
        } = event;
        setCategory(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    
    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const handleMusicClick = (event) => {
        hiddenMusicInput.current.click();
    };

    const updateAddMusicWidget = () => {
        setAddMusicWidget(prev => !prev);
    };

    const updateEditMusicWidget = () => {
        setEditMusicWidget(prev => !prev);
    };
    
    const uploadMusicImage = (event) => {
        if(event.target.files[0]){
            setMusicImg(event.target.files);
            setMusicImgName(event.target.files[0].name);
            setMusicImgPath(URL.createObjectURL(event.target.files[0]));
        }
    };
    
    const uploadMusic = (event) => {
        if(event.target.files[0]){
            setMusic(event.target.files);
            setMusicName(event.target.files[0].name);
        }
    };
    
    const removeSelectedSong = () => {
        setMusic({});
        setMusicName("");
    };
    
    const removeSelectedImage = () => {
        setMusicImg({});
        setMusicImgName('');
        setMusicImgPath('/assets/images/default-music-upload-image.png');
    };
    
    const removeMusicDetails = () => {
        setGenre([]);
        setArtist([]);
        setCategory([]);

        setMusic({});
        setMusicName("");
        
        setMusicTitle("");
        setAlbumTitle("");

        setMusicImg({});
        setMusicImgName("");
        setMusicImgPath("/assets/images/default-music-upload-image.png");
    };

    const saveUploadMusic = async () => {
        setLoader(true);
        const today = new Date().toISOString();

        const formData = new FormData();
        formData.append('musicImageFile', musicImg[0]);
        formData.append('musicFile', music[0]);
        formData.append('musicTitle', musicTitle);
        formData.append('albumTitle', albumTitle);
        formData.append("artist", artist);
        formData.append("category", category);
        formData.append("genre", genre);
        formData.append("date", today);

        try{
            const response = await axios.post(apiLinks.postSong, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.data.code === 200){
                setRows(prevData => [...prevData, response.data.rowData]);
                removeMusicDetails();
                setAddMusicWidget(false);
                Success("Uploaded Successfully");
            }
            else{
                Error(response.data.message);
            }
        }
        catch(err){
            console.log("Error Occured - ", err);
            Error(err.message);
        }
        finally{
            setLoader(false);
        }
    };

    const editRow = (id) => {
        const editableRow = rows.filter(entry => entry.id === id);
        console.log(editableRow);

        setEditId(id);
        setGenre(editableRow[0].genre);
        setArtist(editableRow[0].artists);
        setCategory(editableRow[0].category);
        setMusicTitle(editableRow[0].musicTitle);
        setAlbumTitle(editableRow[0].albumTitle);
        setEditMusicWidget(true);
    };

    const deleteRow = (id) => {
        console.log(id);
    };
    
    return (
        <React.Fragment>
            <div className='admin-page'>
                {loader ? 
                    <SpinnerGrow color="success" />: 
                    <React.Fragment />
                }

                {
                    editMusicWidget ? 
                    <EditExistingMusic 
                        genre={genre}
                        artist={artist}
                        editId={editId}
                        loader={loader}
                        category={category}
                        musicTitle={musicTitle}
                        albumTitle={albumTitle}
                        editMusicWidget={editMusicWidget}

                        setLoader={setLoader}
                        handleChange={handleChange}
                        setMusicTitle={setMusicTitle}
                        setAlbumTitle={setAlbumTitle}
                        handleGenreChange={handleGenreChange}
                        handleCategoryChange={handleCategoryChange}
                        updateEditMusicWidget={updateEditMusicWidget}

                    /> : 
                    <React.Fragment />
                }

                {
                    addMusicWidget ? 
                    <NewMusicAdd 
                        genre={genre}
                        artist={artist}
                        category={category}
                        musicName={musicName}
                        musicTitle={musicTitle}
                        albumTitle={albumTitle}
                        musicImgPath={musicImgPath}
                        musicImgName={musicImgName}
                        addMusicWidget={addMusicWidget}
                        hiddenFileInput={hiddenFileInput}
                        hiddenMusicInput={hiddenMusicInput}

                        uploadMusic={uploadMusic}
                        handleClick={handleClick}
                        handleChange={handleChange}
                        setMusicTitle={setMusicTitle}
                        setAlbumTitle={setAlbumTitle}
                        saveUploadMusic={saveUploadMusic}
                        handleMusicClick={handleMusicClick}
                        uploadMusicImage={uploadMusicImage}
                        handleGenreChange={handleGenreChange}
                        removeMusicDetails={removeMusicDetails}
                        removeSelectedSong={removeSelectedSong}
                        removeSelectedImage={removeSelectedImage}
                        updateAddMusicWidget={updateAddMusicWidget}
                        handleCategoryChange={handleCategoryChange}

                    /> : 
                    <React.Fragment />
                }

                <AdminNavigation />
                <Container className='button-container'>
                    <Button className="add-music-button" onClick={updateAddMusicWidget}>
                        <AddIcon fontSize="large"  />
                    </Button>
                </Container>
                <Container className='mb-3'>
                    <StickyHeadTable 
                        rows = {rows}
                        editRow={editRow}
                        deleteRow={deleteRow}
                    />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Admin;
