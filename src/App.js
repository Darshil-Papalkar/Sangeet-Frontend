import axios from "axios";
import Slider from "react-slick";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Flip, ToastContainer } from 'react-toastify';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Card, CardText, CardBody, CardImg } from 'reactstrap';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import React, { useState, useRef, useEffect, useReducer } from 'react';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';

import { faHome } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import Home from './pages/Home.js';
import Error from './pages/Error.js';
import Album from './pages/Album.js';
import Admin from './pages/admin.js';
import Artist from "./pages/Artist.js";
import Category from "./pages/Category";
import Playlist from "./pages/playlist";
import { apiLinks } from './connection.config';
import { Subscribe, Unsubscribe } from './client/index';
import * as serviceWorker from './client/serviceWorker.js';
import MusicPlayer from "./components/MusicPlayer/index.js";

import './App.css';
import "react-toastify/dist/ReactToastify.css";

export const List = React.createContext();
export const Search = React.createContext();
export const IsDark = React.createContext();
export const Loader = React.createContext();
export const Playing = React.createContext();
export const SetIsDark = React.createContext();
export const LoadAudio = React.createContext();
export const PlayPause = React.createContext();
export const PlayerContext = React.createContext();

const musicList = {};

const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH_SUCCESS':
        case "FETCH_CACHE":
            const allArtistData = action.artistData;
            const artistData = action.artistData.filter(item => item.show === true);
            const genreData = action.genreData.filter(item => item.show === true);
            const categoryData = action.categoryData.filter(item => item.show === true);
            const term = action.message.filter(item => item.show === true);
            
            let genreList = {};
            let albumList = {};
            let artistList = {};
            let categoryList = {};
            let allArtistList = {};
            let musicList = action.message;

            for(var i=0; i < term.length; i++){

                // Filtering genre data
                let list = term[i].genre;
                for(var j=0; j < list.length; j++){
                    const data = list[j];
                    if(genreData.find(genre => genre.type === data)){
                        if(genreList[data] === undefined){
                            genreList[data] = [term[i]];
                        }
                        else{
                            genreList[data].push(term[i]);
                        }
                    }
                }

                // Filtering album data
                list = term[i].albumTitle;
                if(albumList[list] === undefined){
                    albumList[list] = [term[i]];
                }
                else{
                    albumList[list].push(term[i]);
                }

                // Filtering artist data
                list = term[i].artists;
                for(j=0; j < list.length; j++){
                    const data = list[j];
                    if(artistData.find(artist => artist.name === data)){
                        if(artistList[data] === undefined){
                            artistList[data] = [term[i]];
                        }
                        else{
                            artistList[data].push(term[i]);
                        }
                    }
                }

                // Getting All Artists
                for(j=0; j < list.length; j++){
                    const data = list[j];
                    if(allArtistData.find(artist => artist.name === data)){
                        if(allArtistList[data] === undefined){
                          allArtistList[data] = [term[i]];
                        }
                        else{
                          allArtistList[data].push(term[i]);
                        }
                    }
                }

                // Filtering category data
                list = term[i].category;
                for(j=0; j < list.length; j++){
                    const data = list[j];
                    if(categoryData.find(category => category.type === data)){
                        if(categoryList[data] === undefined){
                            categoryList[data] = [term[i]];
                        }
                        else{
                            categoryList[data].push(term[i]);
                        }
                    }
                }
            }

            const list = {
                genreList,
                albumList,
                artistList,
                allArtistList,
                categoryList,
                musicList
            };

            // console.log(list);

            return list;

        case 'FETCH_ERROR':
            // Error(action.message);
            return state;

        default:
            return state;
    }
};

const settings = {
  arrows: true,
  dots: false,
  draggable: true,
  easing: "linear",
  infinite: false,
  lazyLoad: "ondemand",
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  swipeToSlide: true,
  responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        }
      },
      {
          breakpoint: 850,
          settings: {
            slidesToShow: 4,
          }
        },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2
        }
      },
      {
          breakpoint: 300,
          settings: {
            slidesToShow: 1
          }
      },
  ]
};

const App = () => {
  library.add(faHome);
  
  const player = useRef(null);
  
  const [isDark, setIsDark] = useState(true);
  
  const [search, setSearch] = useState(false);
  const [searchItem, setSearchItem] = useState({});
  const [querySearch, setQuerySearch] = useState('');

  const [loader, setLoader] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({});

  const [list, dispatch] = useReducer(reducer, musicList);

  const loadAudio = (ll, item, e = null) => {
    if(e)
        e.preventDefault();
    setPlaylist(ll);
    setCurrentSong(item);
    // console.log(ll, item);
  };

  const handleKeyPress = (e) => {
    switch(e.code){
        case 'Space':  
            if(player.current)
              e.preventDefault();
              player?.current?.handlePlayPause();
            break;
        case 'ArrowLeft':
            if(player.current)
              e.preventDefault();
              player?.current?.handlePrevSong();
            break;
        case 'ArrowRight':
            if(player.current)
              e.preventDefault();
              player?.current?.handleNextSong();
            break;
        case 'ArrowUp':
            if(player.current)
              e.preventDefault();
              player?.current?.handleVolumeInc();
            break;
        case 'ArrowDown':
            if(player.current)
              e.preventDefault();
              player?.current?.handleVolumeDec();
            break;
        default:
            break;
    }
    return false;
  };

  const updateDark = () => {
    window?.localStorage?.setItem("mode", !isDark);
    setIsDark(prev => !prev);
  };

  const updateQuerySearch = (e) => {
    const value = e.target.value;

    if(value.length){
      const searchMusicList = list?.musicList.filter(item => item.musicTitle.toLowerCase().includes(value.toLowerCase()));
      let searchAlbumList = list?.musicList.filter(item => item.albumTitle.toLowerCase().includes(value.toLowerCase()));
      const searchArtistList = Object.keys(list.allArtistList)?.filter(name => name.toLowerCase().includes(value.toLowerCase()));

      searchAlbumList = searchAlbumList.filter((value, index, self) => 
                          index === self.findIndex((item) => (
                            item.albumTitle === value.albumTitle
                          ))
      );

      setSearchItem({
        music: searchMusicList,
        album: searchAlbumList,
        artist: searchArtistList
      });
    }
    else{
      setSearchItem({
        music: [],
        album: [],
        artist: []
      });
    }

    setQuerySearch(e.target.value);
  };

  useEffect(() => {

    if("Notification" in window){
      if(Notification.permission === "default"){
          Notification.requestPermission().then((permission) => {
              if(permission === "granted"){
                  Subscribe();
              }
              else{
                Unsubscribe();
              }
          })
      }
      else if(Notification.permission === "granted"){
          Subscribe();
          // console.log("already subscribed");
      }
      else{
        Unsubscribe();
      }
    }
    else{
        console.log("Notification is not supported");
    }
    
    setIsDark(window?.localStorage?.getItem("mode") === 'true' ? true : false);
    
    window?.addEventListener('keydown', handleKeyPress, false);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  useEffect(() => {

    let abortController = new AbortController();

    const getAudioData = async() => {
        try{
            setLoader(true);
            const response = await axios.get(apiLinks.getAllAudioDetails, {
                signal: abortController.signal
            });
            if(response.data.code === 200){
                dispatch({  type: 'FETCH_SUCCESS', 
                            message: response.data.message,
                            artistData: response.data.artistData,
                            genreData: response.data.genreData,
                            categoryData: response.data.categoryData
                        });
                if(window.localStorage){
                    window.localStorage.setItem("Song Data", JSON.stringify({
                        message: response.data.message,
                        artistData: response.data.artistData,
                        genreData: response.data.genreData,
                        categoryData: response.data.categoryData
                    }));
                }
            }
            else{
                dispatch({ type: 'FETCH_ERROR', message: response.data.message });
            }
        }
        catch(err){
            console.log(err);
            dispatch({ type: 'FETCH_ERROR', message: err.message });
        }
        finally{
            setLoader(false);
        }
    };

    if(window?.localStorage?.getItem("Song Data") && Object.keys(currentSong).length !== 0){
        const prevData = JSON.parse(window.localStorage.getItem("Song Data"));
        if(Object.keys(prevData).length)
            dispatch({type: "FETCH_CACHE", ...prevData})
        else
            getAudioData();
    }
    else
        getAudioData();

    return () => {
        if(abortController){
            abortController?.abort();
            setLoader(false);
        }
    }
  }, [currentSong]);

  const toggleSearch = () => {
    setQuerySearch(''); 
    setSearchItem({}); 
    setSearch(prev => !prev);
  };
  
  return (
    <React.Fragment>
      <PlayerContext.Provider value={currentSong}>
        <PlayPause.Provider value={handleKeyPress}>
          <Playing.Provider value={playing}>
            <LoadAudio.Provider value={loadAudio}>
              <IsDark.Provider value={isDark}>
                <SetIsDark.Provider value={updateDark}>
                  <Search.Provider value={setSearch}>
                    <List.Provider value={list}>
                      <Loader.Provider value={loader}>
                        <div className={`app-bg ${isDark ? "dark" : "light"}`}>
                          <Router>
                            <Modal 
                              isOpen={search}
                              scrollable
                              size='lg'
                              toggle={toggleSearch}
                            >
                              <ModalHeader
                                toggle={toggleSearch}
                              >
                                Search Music
                              </ModalHeader>
                              <ModalBody>
                                <div>
                                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <TextField id="input-with-sx" label="Search keyword" variant="standard" 
                                      value={querySearch} onChange={updateQuerySearch}
                                    />
                                    <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5, cursor: 'pointer' }} />
                                  </Box>
                                  {
                                    querySearch.length === 0 ?
                                      <React.Fragment>
                                        <Box className="mt-3">
                                          <h5>Music <ArrowRightAltIcon /></h5>
                                          <Slider className="search-slider" {...settings}>
                                            {
                                              list?.musicList?.map(item => {
                                                return (
                                                  <Card key={item.id} title={`Play ${item.musicTitle}`}>
                                                    <CardImg className="search-card-image" onClick={() => {loadAudio([item], item); toggleSearch();}}
                                                      src={apiLinks.getImage + item.musicImageKey} />
                                                    <CardBody className="search-card-body">
                                                      <CardText onClick={() => {loadAudio([item], item); toggleSearch();}} className="search-card-text">
                                                        {item.musicTitle}
                                                      </CardText>
                                                    </CardBody> 
                                                  </Card>
                                                );
                                              })
                                            }
                                          </Slider>
                                        </Box>
                                      </React.Fragment>
                                      : 
                                      <React.Fragment />
                                  }
                                  {
                                    searchItem?.artist?.length > 0 ? 
                                    <Box className="mt-3">
                                      <h5>Artists <ArrowRightAltIcon /></h5>
                                      <Slider className="search-slider" {...settings}>
                                        {
                                          searchItem.artist.map(item => {
                                            return (
                                              <Card key={item}>
                                                <Link style={{ textDecoration: "none" }} onClick={toggleSearch} to={`/artist/${item}`}>
                                                  <CardImg className="search-card-image" src={apiLinks.getArtistImgFromName + item} />
                                                  <CardBody className="search-card-body">
                                                    <CardText className="search-card-text">
                                                      {item}
                                                    </CardText>
                                                  </CardBody> 
                                                </Link>
                                              </Card>
                                            );
                                          })
                                        }
                                      </Slider>
                                    </Box> :
                                    <React.Fragment />
                                  }
                                  {
                                    searchItem?.album?.length > 0 ?
                                    <Box className="mt-3">
                                      <h5>Album <ArrowRightAltIcon /></h5>
                                      <Slider className="search-slider" {...settings}>
                                        {
                                          searchItem.album.map(item => {
                                            return (
                                              <Card key={item}>
                                                <Link style={{ textDecoration: "none" }} onClick={toggleSearch} to={`/album/${item.albumTitle}`}>
                                                  <CardImg className="search-card-image" src={apiLinks.getImage + item.musicImageKey} />
                                                  <CardBody className="search-card-body">
                                                    <CardText className="search-card-text">
                                                      {item.albumTitle}
                                                    </CardText>
                                                  </CardBody> 
                                                </Link>
                                              </Card>
                                            );
                                          })
                                        }
                                      </Slider>
                                    </Box> :
                                    <React.Fragment />
                                  }
                                  {
                                    searchItem?.music?.length > 0 ?
                                    <Box className="mt-3">
                                      <h5>Music <ArrowRightAltIcon /></h5>
                                      <Slider className="search-slider" {...settings}>
                                        {
                                          searchItem.music.map(item => {
                                            return (
                                              <Card key={item.id} title={`Play ${item.musicTitle}`}>
                                                <CardImg className="search-card-image" onClick={() => {loadAudio([item], item); toggleSearch();}}
                                                  src={apiLinks.getImage + item.musicImageKey} />
                                                <CardBody className="search-card-body">
                                                  <CardText onClick={() => {loadAudio([item], item); toggleSearch();}} className="search-card-text">
                                                    {item.musicTitle}
                                                  </CardText>
                                                </CardBody>                                     
                                              </Card>
                                            );
                                          })
                                        }
                                      </Slider>
                                    </Box> :
                                    <React.Fragment />
                                  }
                                  {
                                    querySearch.length !== 0 && searchItem?.artist?.length === 0 && 
                                    searchItem?.album?.length === 0 && searchItem?.music?.length === 0 ?
                                    <h4 
                                      style={{ textAlign: 'center', marginTop: '1rem' }}
                                    >
                                      No Result Found!
                                    </h4> :
                                    <React.Fragment />
                                  }
                                </div>
                              </ModalBody>
                            </Modal>

                            <Routes>

                              <Route exact path="/" element={<Home />} />
                              <Route path="/admin/" element={<Admin />} />
                              <Route path="/category/:category" element={<Category />} />
                              <Route path="/album/:albumName" element={<Album />} />
                              <Route path="/artist/:artistName" element={<Artist />} />
                              <Route path="/playlist/:playlistName" element={<Playlist />} />
                              <Route path="*" element={<Error />} />

                            </Routes>
                            {
                                playlist.length ? 
                                    <MusicPlayer 
                                        ref={player}
                                        currentSong={currentSong}
                                        playlist={playlist}
                                        setCurrentSong={setCurrentSong}
                                        playing={playing}
                                        setPlaying={setPlaying}
                                    />
                                    : <React.Fragment />
                            }
                          </Router>
                        </div>
                        <ToastContainer 
                            position='top-right'
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={true}
                            closeOnClick={true}
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="dark"
                            transition={Flip}
                        />
                      </Loader.Provider>
                    </List.Provider>
                  </Search.Provider>
                </SetIsDark.Provider>
              </IsDark.Provider>
            </LoadAudio.Provider>
          </Playing.Provider>
        </PlayPause.Provider>
      </PlayerContext.Provider>
    </React.Fragment>
  );
}

serviceWorker.register();

export default App;
