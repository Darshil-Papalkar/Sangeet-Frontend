import axios from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
import {Container, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col} from 'reactstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Backdrop } from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CategoryIcon from '@mui/icons-material/Category';
import DomainIcon from '@mui/icons-material/Domain';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CellTowerIcon from '@mui/icons-material/CellTower';

import AddNewModal from '../components/Admin/addNewModal';
import NewMusicAdd from '../components/Admin/newMusicAdd';

import GenreTable from '../components/Tables/Genre-table';
import BroadcastTable from '../components/Tables/broadcast';
import ArtistsTable from '../components/Tables/artists-table';
import StickyHeadTable from "../components/Tables/music-table";
import CategoryTable from '../components/Tables/category-table';
import PlaylistTable from '../components/Tables/playlist-table';

import { IsDark, PlayerContext } from "../App";
import { apiLinks } from '../connection.config';
import SpinnerGrow from "../components/spinner/spinner-grow";
import { DeleteWarning } from '../components/Warning/Warning';
import EditExistingMusic from '../components/Admin/editExistingMusic';
import EditExistingModal from '../components/Admin/editExistingModal';
import { Success, Error } from '../components/Notification/Notification';
import AdminNavigation from '../components/navigation/Navigation-bar/admin-navigation';


import "./admin.css";

let genreRows = [], artistRows = [], categoryRows = [], 
    musicRows = [], broadcastRows = [], playlistRows = [];

const Admin = () => {
    document.title = 'Admin';

    const isDark = useContext(IsDark);
    const currentSong = useContext(PlayerContext);

    const hiddenFileInput = useRef(null);
    const hiddenMusicInput = useRef(null);
    const audioDurationRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [tabId, setTabId] = useState(1);

    const [loader, setLoader] = useState(false);
    
    const [rows, setRows] = useState([]);

    const [editId, setEditId] = useState(0);
    const [header, setHeader] = useState("");
    const [modalId, setModalId] = useState('0');
    const [deleteId, setDeleteId] = useState(0);
    const [warning, setWarning] = useState(false);
    const [catGenValue, setCatGenValue] = useState('');
    const [deleteItemName, setDeleteItemName] = useState('');

    const [genre, setGenre] = useState([]);
    const [artist, setArtist] = useState([]);
    const [category, setCategory] = useState([]);

    const [showBroadCast, setShowBroadCast] = useState(false);
    const [addMusicWidget, setAddMusicWidget] = useState(false);
    const [createPlaylist, setCreatePlaylist] = useState(false);
    const [addGenreWidget, setAddGenreWidget] = useState(false);
    const [editMusicWidget, setEditMusicWidget] = useState(false);
    const [addArtistWidget, setAddArtistWidget] = useState(false);
    const [addCategoryWidget, setAddCategoryWidget] = useState(false);
    const [editExistingWidget, setEditExistingWidget] = useState(false);
    
    const [fav, setFav] = useState(false);
    const [music, setMusic] = useState({});
    const [musicName, setMusicName] = useState('');
    const [musicPath, setMusicPath] = useState([]);
    const [musicDuration, setMusicDuration] = useState(0);

    const [musicTitle, setMusicTitle] = useState('');
    const [albumTitle, setAlbumTitle] = useState('');
    
    const [musicImg, setMusicImg] = useState({});
    const [musicImgName, setMusicImgName] = useState("");
    const [musicImgPath, setMusicImgPath] = useState('/assets/images/default-music-upload-image.png');

    const updateTabId = (id) => {
        setTabId(id);
        window?.localStorage?.setItem("tabId", id);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const updateAddMusicWidget = () => {
        removeMusicDetails();
        setAddMusicWidget(prev => !prev);
    };

    const broadCast = () => setShowBroadCast(prev => !prev);
    const updateCreatePlaylist = () => setCreatePlaylist(prev => !prev);
    const updateAddGenreWidget = () => setAddGenreWidget(prev => !prev);
    const updateAddArtistWidget = () => setAddArtistWidget(prev => !prev);
    const updateAddCategoryWidget = () => setAddCategoryWidget(prev => !prev);
    
    const updateEditMusicWidget = () => {
        setMusic({});
        setMusicName('');
        setEditMusicWidget(prev => !prev);
    };

    const defaultProps = {
        options: rows,
        getOptionLabel: (option) => (option.musicTitle && `${option.musicTitle} - ${option.albumTitle}`) || option.name || option.type || option.title || option.playlist_name,
    };
    
    
    useEffect(() => {
        
        if(window?.localStorage){
            const id = window?.localStorage?.getItem("tabId");
            if(id && 0 < id < 7){
                setTabId(parseInt(id));
            }
        }

        let musicController = new AbortController();
        let artistController = new AbortController();
        let genreController = new AbortController();
        let categoryController = new AbortController();
        let broadCastController = new AbortController();
        let playlistController = new AbortController();
        
        const getMusicData = async () => {
    
            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getAllAudio, {
                    signal: musicController.signal
                });
                if(response.data.code === 200){
                  setRows(response.data.message);
                  musicRows = response.data.message;
                  musicController = null;
                }
                else{
                  Error(response.data.message);
                  setRows([]);
                }
            }
            catch(err){
                console.log(err);
                // Error(err.message);
                setRows([]);
            }
            finally{
                setLoader(false);
            }
        };
    
        const getArtistsData = async () => {
            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getAllArtists, {
                    signal: artistController.signal
                });
                if(response.data.code === 200){
                  setRows(response.data.message);
                  artistController = null;
                  artistRows = response.data.message;
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
    
        const getGenreData = async () => {
            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getAllGenre, {
                    signal: genreController.signal
                });
                if(response.data.code === 200){
                  setRows(response.data.message);
                  genreController = null;
                  genreRows = response.data.message;
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
    
        const getCategoryData = async () => {
            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getAllCategory, {
                    signal: categoryController.signal
                });
                if(response.data.code === 200){
                  setRows(response.data.message);
                  categoryRows = response.data.message;
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

        const getBroadCastData = async () => {
            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getBroadcast, {
                    signal: broadCastController.signal,
                });
                if(response.data?.code === 200){
                    setRows(response.data.message);
                    broadcastRows = response.data.message;
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

        const getPlaylistData = async () => {
            
            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getAllPlaylist, {
                    signal: playlistController.signal,
                });
                if(response.data?.code === 200){
                    setRows(response.data.message);
                    playlistRows = response.data.message;
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

        if(tabId === 1) 
            getMusicData();
        else if(tabId === 2) 
            getArtistsData();
        else if(tabId === 3) 
            getGenreData();
        else if(tabId === 4)
            getCategoryData();
        else if(tabId === 5)
            getBroadCastData();
        else
            getPlaylistData();

        return () => {
            musicController?.abort();
            artistController?.abort();
            genreController?.abort();
            categoryController?.abort();
            setLoader(false);
        }
    
    }, [tabId]);

    const getSearchedAutoCompleteRow = (value) => {
        if(value && value.id){
            let searchedData = [];
            if(tabId === 1){
                searchedData = musicRows.filter(row => row.id === value.id);
            }
            else if(tabId === 2){
                searchedData = artistRows.filter(row => row.id === value.id);
            }
            else if(tabId === 3){
                searchedData = genreRows.filter(row => row.id === value.id);
            }
            else if(tabId === 4){
                searchedData = categoryRows.filter(row => row.id === value.id);
            }
            else if(tabId === 5){
                searchedData = broadcastRows.filter(row => row.id === value.id);
            }
            else if(tabId === 6){
                searchedData = playlistRows.filter(row => row.id === value.id);
            }
            setRows(searchedData);
        }
        else{
            if(tabId === 1){
                setRows(musicRows);
            }
            else if(tabId === 2){
                setRows(artistRows)
            }
            else if(tabId === 3){
                setRows(genreRows);
            }
            else if(tabId === 4){
                setRows(categoryRows);
            }
            else if(tabId === 5){
                setRows(broadcastRows);
            }
            else if(tabId === 6){
                setRows(playlistRows);
            }
        }
    };

    const getSearchedRow = (event) => {
        if(event.target.value.length){
            const data = event.target.value;
            let searchedData = [];
            if(tabId === 1){
                searchedData = [...musicRows.filter(row => row.musicTitle.toLowerCase().includes(data.toLowerCase())), 
                                ...musicRows.filter(row => row.albumTitle.toLowerCase().includes(data.toLowerCase()))]
                                .filter((item, index, self) => index === self.findIndex((entry) => entry.id === item.id));
            }
            else if(tabId === 2){
                searchedData = artistRows.filter(row => row.name.toLowerCase().includes(data.toLowerCase()));
            }
            else if(tabId === 3){
                searchedData = genreRows.filter(row => row.type.toLowerCase().includes(data.toLowerCase()));
            }
            else if(tabId === 4){
                searchedData = categoryRows.filter(row => row.type.toLowerCase().includes(data.toLowerCase()));
            }
            else if(tabId === 5){
                searchedData = broadcastRows.filter(row => row.title.toLowerCase().includes(data.toLowerCase()));
            }
            else if(tabId === 6){
                searchedData = playlistRows.filter(row => row['playlist_name'].toLowerCase().includes(data.toLowerCase()));
            }
            setRows(searchedData);
        }
        else{
            if(tabId === 1){
                setRows(musicRows);
            }
            else if(tabId === 2){
                setRows(artistRows)
            }
            else if(tabId === 3){
                setRows(genreRows);
            }
            else if(tabId === 4){
                setRows(categoryRows);
            }
            else if(tabId === 5){
                setRows(broadcastRows);
            }
            else if(tabId === 6){
                setRows(playlistRows);
            }
        }
    };

    const updateRow = (data) => {
        const rowData = rows.map(row => {
            if(row.id === data.id){
                return data;
            }
            else{
                return row;
            }
        });

        setRows(rowData);
    };

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
    
    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleMusicClick = () => {
        hiddenMusicInput.current.click();
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
            window.URL = window.URL || window.webkitURL;
            audioDurationRef.current = document.createElement("audio");
            audioDurationRef.current.preload = 'metadata';

            audioDurationRef.current.onloadedmetadata = () => {
                window.URL.revokeObjectURL(audioDurationRef.current.src);
                const duration = Math.floor(audioDurationRef.current.duration);
                setMusicDuration(duration);
            };

            audioDurationRef.current.src = URL.createObjectURL(event.target.files[0]);

            setMusic(event.target.files);
            setMusicPath(event.target.files);
            setMusicName(event.target.files[0].name);
        }
    };
    
    const removeSelectedSong = () => {
        setMusic({});
        setMusicName("");
        setMusicDuration(0);
        audioDurationRef.current = null;
        audioDurationRef?.current?.remove();
    };
    
    const removeSelectedImage = () => {
        setMusicImg({});
        setMusicImgName('');
        setMusicImgPath('/assets/images/default-music-upload-image.png');
    };
    
    const removeMusicDetails = () => {
        setFav(false);

        setGenre([]);
        setArtist([]);
        setCategory([]);

        removeSelectedSong();
        
        setMusicTitle("");
        setAlbumTitle("");

        removeSelectedImage();
    };

    const saveUploadMusic = async () => {
        setLoader(true);
        const today = new Date().toISOString();

        const formData = new FormData();
        formData.append("show", fav);
        formData.append("date", today);
        formData.append("genre", genre);
        formData.append("artist", artist);
        formData.append("category", category);
        formData.append('musicFile', music[0]);
        formData.append('musicTitle', musicTitle);
        formData.append('albumTitle', albumTitle);
        formData.append("duration", musicDuration);
        formData.append('musicImageFile', musicImg[0]);

        try{
            const response = await axios.post(apiLinks.postSong, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.data.code === 200){
                if(tabId === 1){
                    musicRows.push(...(response.data.rowData));
                    // setRows(prevData => [...prevData, ...(response.data.rowData)]);
                }
                else{
                    updateTabId(1);
                }
                
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
        // console.log(editableRow);

        setFav(editableRow[0].show);
        setEditId(id);
        setGenre(editableRow[0].genre);
        setArtist(editableRow[0].artists);
        setCategory(editableRow[0].category);
        setMusicTitle(editableRow[0].musicTitle);
        setAlbumTitle(editableRow[0].albumTitle);
        setEditMusicWidget(true);
    };

    const editArtistGenreCategoryPlaylist = (id, domain="") => {

        const editTableRow = rows.filter(entry => entry.id === id);

        if(editTableRow.length){
            setFav(editTableRow[0].show);
            setEditId(id);
            setEditExistingWidget(prev => !prev);
            setCatGenValue(editTableRow[0].name || editTableRow[0].type || editTableRow[0].playlist_name);

            if(domain === "artist"){
                setHeader('Edit Artist');
                setModalId('1');
            }
            else if(domain === 'genre'){
                setHeader("Edit Genre");
                setModalId('2');
            }
            else if(domain === 'category'){
                setHeader("Edit Category");
                setModalId('3');
            }
            else if(domain === 'playlist'){
                setHeader("Edit Playlist");
                setModalId('4');
            }
            else{
                Error("Domain Not Valid for Edit");
            }
        }
        else{
            Error("No such row id found");
        }
    };

    const toggleWarning = (id = 0) => {
        const name = rows.filter(row => row.id === id);

        if(id && tabId === 1){
            setDeleteItemName(name[0].musicTitle);
        }
        else if(id && tabId === 2){
            setDeleteItemName(name[0].name);
        }
        else if(id && tabId === 3){
            setDeleteItemName(name[0].type);
        }
        
        else if(id && tabId === 4){
            setDeleteItemName(name[0].type);
        }
        else if(id && tabId === 5){
            setDeleteItemName(name[0].title);
        }
        else if(id && tabId === 6){
            setDeleteItemName(name[0]['playlist_name'])
        }

        setDeleteId(id);
        setWarning(prev => !prev);
    };

    const deleteRow = async () => {
        const id = deleteId;

        try{
            setLoader(true);
            let response = {};
            if(tabId === 1){
                response = await axios.delete(apiLinks.deleteMusic+id);
            }
            else if(tabId === 2){
                response = await axios.delete(apiLinks.deleteArtist+id);
            }
            else if(tabId === 3){
                response = await axios.delete(apiLinks.deleteGenre+id);
            }
            else if(tabId === 4){
                response = await axios.delete(apiLinks.deleteCategory+id);
            }
            else if(tabId === 5){
                response = await axios.delete(apiLinks.deleteBroadcast+id);
            }
            else if(tabId === 6){
                response = await axios.delete(apiLinks.deletePlaylist+id);
            }

            if(response?.data?.code === 200){
                // if(tabId === 1){
                //     musicRows = rows.filter(row => row.id !== id);
                // }
                // else if(tabId === 2){
                //     artistRows = rows.filter(row => row.id !== id);
                // }
                // else if(tabId === 3){
                //     genreRows = rows.filter(row => row.id !== id);
                // }
                // else if(tabId === 4){
                //     categoryRows = rows.filter(row => row.id !== id);
                // }
                // else if(tabId === 5){
                //     broadcastRows = rows.filter(row => row.id !== id);
                // }
                setRows(prev => prev.filter(row => row.id !== id));
                Success(response.data.message);
            }
            else{
                Error(response.data.message);
            }
        }
        catch(err){
            console.log("An Error occured while deleting", err);
            Error(err.message);
        }
        finally{
            setLoader(false);
            toggleWarning();
        }
    };
    
    const actions = [
        { icon: <CellTowerIcon />, name: "BroadCast", click: broadCast }, 
        { icon: <DomainIcon />, name: 'Add Genre', click: updateAddGenreWidget },
        { icon: <MusicNoteIcon />, name: 'Add Song', click: updateAddMusicWidget },
        { icon: <PersonAddIcon />, name: 'Add Artist', click: updateAddArtistWidget },
        { icon: <CategoryIcon />, name: 'Add Category', click: updateAddCategoryWidget },
        { icon: <PlaylistAddIcon />, name: "Create Playlist", click: updateCreatePlaylist },
    ];

    return (
        <React.Fragment>
            <div className='admin-page'>
                {loader ? 
                    <SpinnerGrow color="success" />: 
                    <React.Fragment />
                }

                {
                    warning ?
                    <DeleteWarning 
                        musicTitle={deleteItemName}
                        toggle={toggleWarning}
                        deleteRow={deleteRow}
                    />: 
                    <React.Fragment />
                }

                {
                    editMusicWidget ? 
                    <EditExistingMusic
                        fav={fav}
                        genre={genre}
                        artist={artist}
                        editId={editId}
                        loader={loader}
                        category={category}
                        musicName={musicName}
                        musicPath={musicPath}
                        musicTitle={musicTitle}
                        albumTitle={albumTitle}
                        musicDuration={musicDuration}
                        editMusicWidget={editMusicWidget}
                        hiddenFileInput={hiddenFileInput}
                        hiddenMusicInput={hiddenMusicInput}

                        setFav={setFav}
                        updateRow={updateRow}
                        setLoader={setLoader}
                        uploadMusic={uploadMusic}
                        handleChange={handleChange}
                        setMusicTitle={setMusicTitle}
                        setAlbumTitle={setAlbumTitle}
                        handleMusicClick={handleMusicClick}
                        handleGenreChange={handleGenreChange}
                        handleCategoryChange={handleCategoryChange}
                        updateEditMusicWidget={updateEditMusicWidget}

                    /> : 
                    <React.Fragment />
                }

                {
                    addMusicWidget ? 
                    <NewMusicAdd 
                        fav={fav}
                        genre={genre}
                        artist={artist}
                        category={category}
                        musicName={musicName}
                        musicTitle={musicTitle}
                        albumTitle={albumTitle}
                        musicImgPath={musicImgPath}
                        musicImgName={musicImgName}
                        musicDuration={musicDuration}
                        addMusicWidget={addMusicWidget}
                        hiddenFileInput={hiddenFileInput}
                        hiddenMusicInput={hiddenMusicInput}

                        setFav={setFav}
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

                {editExistingWidget ? 
                    <EditExistingModal 
                        fav={fav}
                        rows={rows}
                        id={modalId}
                        editId={editId}
                        header={header}
                        value={catGenValue}

                        setFav={setFav}
                        setRows={setRows}
                        toggle={setEditExistingWidget}
                    /> :
                    <React.Fragment />
                }

                {addArtistWidget ? 
                    <AddNewModal 
                        id='1'
                        tabId={tabId}
                        header="Add New Artist"
                        artistRows={artistRows}
                        toggle={setAddArtistWidget}
                    /> :
                    <React.Fragment />
                }
                
                {addGenreWidget ? 
                    <AddNewModal 
                        id='2'
                        tabId={tabId}
                        genreRows={genreRows}
                        header="Add New Genre"
                        toggle={setAddGenreWidget}
                    /> :
                    <React.Fragment />
                }
                
                {addCategoryWidget ? 
                    <AddNewModal 
                        id='3'
                        tabId={tabId}
                        header="Add New Category"
                        categoryRows={categoryRows}
                        toggle={setAddCategoryWidget}
                    /> :
                    <React.Fragment />
                }

                {
                    showBroadCast ? 
                    <AddNewModal 
                        id='4'
                        tabId={tabId}
                        header="BroadCast News"
                        toggle={setShowBroadCast}
                        broadcastRows={broadcastRows}
                    /> : 
                    <React.Fragment />
                }

                {
                    createPlaylist ? 
                    <AddNewModal 
                        id='5'
                        tabId={tabId}
                        header="Add New Playlist"
                        toggle={setCreatePlaylist}
                        playlistRows={playlistRows}
                    /> : 
                    <React.Fragment />
                }

                <AdminNavigation />

                {/* <Container fluid>
                     */}
                <Container className={`page-content ${isDark ? "dark" : "light"} mb-3`}
                    style={currentSong.id ? {height: "calc(100vh - 230px)"} : {height: "calc(100vh - 120px)"}}
                >
                    <div>
                        <div className="d-flex navtabs-autocomplete">
                            <Nav tabs className="align-bottom-flex">
                                <NavItem>
                                    <NavLink
                                        className={`${tabId === 1 && "active"} admin-nav-table-link`}
                                        onClick={() => updateTabId(1)}
                                    >
                                        Music Data
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={`${tabId === 2 && "active"} admin-nav-table-link`}
                                        onClick={() => updateTabId(2)}
                                    >
                                        Artists
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={`${tabId === 3 && "active"} admin-nav-table-link`}
                                        onClick={() => updateTabId(3)}
                                    >
                                        Genre
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={`${tabId === 4 && "active"} admin-nav-table-link`}
                                        onClick={() => updateTabId(4)}
                                    >
                                        Category
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={`${tabId === 6 && "active"} admin-nav-table-link`}
                                        onClick={() => updateTabId(6)}
                                    >
                                        Playlists
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={`${tabId === 5 && "active"} admin-nav-table-link`}
                                        onClick={() => updateTabId(5)}
                                    >
                                        BroadCasts
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <Autocomplete
                                {...defaultProps}
                                id={`auto-complete`}
                                className={`autoComplete ${isDark ? "dark" : "light"}`}
                                onChange={(evt, val) => getSearchedAutoCompleteRow(val)}
                                autoComplete
                                includeInputInList
                                renderInput={(params) => (
                                <TextField {...params} label={  tabId === 1 ? "Search Music/Album" : 
                                                                tabId === 2 ? "Search Artist" : 
                                                                tabId === 3 ? "Search Genre" : 
                                                                tabId === 4 ? "Search Category":
                                                                tabId === 5 ? "Search Title" : 
                                                                "Search Playlist"} 
                                    className="input-div" variant="standard" 
                                    onChange={getSearchedRow}
                                    />
                                )}
                            />
                        </div>
                        <TabContent activeTab={tabId}>
                            <TabPane tabId={1}>
                                <Row>
                                    <Col>
                                        <StickyHeadTable 
                                            id="table"
                                            rows = {rows}
                                            setRows={setRows}
                                            editRow={editRow}
                                            toggleWarning={toggleWarning}
                                        />
                                    </Col>
                                </Row>
                            </TabPane> 
                            <TabPane tabId={2}>
                                <Row>
                                    <Col>
                                        <ArtistsTable 
                                            rows = {rows}
                                            setRows={setRows}
                                            toggleWarning={toggleWarning}
                                            editArtist={editArtistGenreCategoryPlaylist}
                                        />
                                    </Col>
                                </Row>
                            </TabPane> 
                            <TabPane tabId={3}>
                                <Row>
                                    <Col>
                                        <GenreTable 
                                            rows = {rows}
                                            setRows={setRows}
                                            toggleWarning={toggleWarning}
                                            editGenre={editArtistGenreCategoryPlaylist}
                                        /> 
                                    </Col>
                                </Row>
                            </TabPane> 
                            <TabPane tabId={4}>
                                <Row>
                                    <Col>
                                        <CategoryTable 
                                            rows = {rows}
                                            setRows={setRows}
                                            toggleWarning={toggleWarning}
                                            editCategory={editArtistGenreCategoryPlaylist}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId={5}>
                                <Row>
                                    <Col>
                                        <BroadcastTable 
                                            rows = {rows}
                                            setRows={setRows}
                                            toggleWarning={toggleWarning}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId={6}>
                                <Row>
                                    <Col>
                                        <PlaylistTable 
                                            rows={rows}
                                            setRows={setRows}
                                            toggleWarning={toggleWarning}
                                            editPlaylist={editArtistGenreCategoryPlaylist}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>  
                        </TabContent>
                    </div>
                </Container>
                <Box className='add-button-speed-dial' sx={{ height: 300, transform: 'translateZ(0px)', 
                        flexGrow: 1, bottom: `${currentSong.id ? "8rem" : ".5rem"}` }}>
                    <Backdrop open={open} />
                    <SpeedDial
                        ariaLabel="SpeedDial tooltip example"
                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
                        icon={<SpeedDialIcon />}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        open={open}
                        className="speed-dial-custom"
                    >
                        {actions.map((action, index) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                tooltipOpen
                                onClick={action.click}
                            />
                        ))}
                    </SpeedDial>
                </Box>
            </div>
        </React.Fragment>
    );
};

export default Admin;
