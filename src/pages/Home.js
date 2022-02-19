import axios from "axios";
import Slider from "react-slick";
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import React, { useEffect, useReducer, useState, useContext } from "react";

import { apiLinks } from '../connection.config';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SpinnerGrow from "../components/spinner/spinner-grow";
import Navigation from "../components/navigation/Navigation-bar/navigation";
import { LoadAudio, PlayerContext, PlayPause, Playing, IsDark } from "../App";

import "./Home.css";

const musicList = {};

const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH_SUCCESS':
        case "FETCH_CACHE":
            const artistData = action.artistData.filter(item => item.show === true);
            const genreData = action.genreData.filter(item => item.show === true);
            const categoryData = action.categoryData.filter(item => item.show === true);
            const term = action.message.filter(item => item.show === true);
            
            let genreList = {};
            let artistList = {};
            let albumList = {};
            let categoryList = {};
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

const loaderSettings = {
    arrows: false,
    dots: false,
    draggable: false,
    easing: "linear",
    infinite: false,
    lazyLoad: "ondemand",
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    swipeToSlide: false,
    responsive: [
        {
            breakpoint: 1500,
            settings: {
              slidesToShow: 7,
            }
        },
        {
            breakpoint: 1350,
            settings: {
              slidesToShow: 6,
            }
        },
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

const settings = {
    arrows: true,
    dots: false,
    draggable: true,
    easing: "linear",
    infinite: false,
    lazyLoad: "ondemand",
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
        {
            breakpoint: 1500,
            settings: {
              slidesToShow: 7,
            }
        },
        {
            breakpoint: 1350,
            settings: {
              slidesToShow: 6,
            }
        },
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

const Home = (props) => {
    const isDark = useContext(IsDark);
    const playing = useContext(Playing);
    const loadAudio = useContext(LoadAudio);
    const playPauseState = useContext(PlayPause);
    const currentSong = useContext(PlayerContext);

    const [loader, setLoader] = useState(false);
    const [mouseId, setMouseId] = useState(0);

    const [list, dispatch] = useReducer(reducer, musicList);

    // console.log(loader, list);

    const handleStateChange = (e) => {
        const event = {
            ...e,
            code: "Space",
            preventDefault : () => {}
        };
        playPauseState(event);
    };

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

    // console.log(list);

    return (
        <div className="App">
            {loader ? 
                <SpinnerGrow color="success" />: 
                <React.Fragment />
            }
            <Navigation />
            <div className={`page-content ${isDark ? "dark" : "light"}`}
                style={currentSong.id ? {height: "calc(100vh - 215px)"} : {height: "calc(100vh - 90px)"}}> 
                <Container key='category-container' className="mt-3" fluid>
                    {list.categoryList ?  
                        Object.keys(list.categoryList).map(catList => {
                            let ll = [];
                            if(catList === 'New Releases')
                                ll = list.categoryList[catList].sort((a, b) => {
                                    let keyA = new Date(a.timeStamp);
                                    let keyB = new Date(b.timeStamp);
                                    if(keyA < keyB) return 1;
                                    else if(keyA > keyB) return -1;
                                    else return 0;
                                });
                            else
                                ll = list.categoryList[catList];

                            return (
                                <Container key={catList} className=" mt-3 slider-container" fluid>
                                    <h2 className={`category-list-heading ${isDark ? "dark-heading" : "light-heading"}`} title={catList}>{catList}</h2>
                                    <Slider {...settings}>
                                        {ll.map(item => {
                                            return (
                                                <div key={item.id} className={`mt-3 mb-3 custom-card-items song-list-items ${isDark ? "dark-card" : "light-card"}`}
                                                    onMouseEnter={() => setMouseId(item.id)}
                                                    onMouseLeave={() => setMouseId(0)}
                                                    onTouchStart={() => setMouseId(item.id)}                                                   
                                                    onTouchEnd={() => setMouseId(item.id)}
                                                >
                                                    <div className="card-image-container">
                                                        
                                                        <div className={`hide-hover-play-icon ${mouseId === item.id || item.id === currentSong.id ? 
                                                                                                    "show": null }`}
                                                            title={`Play ${item.musicTitle}`}
                                                        >
                                                            {
                                                                item.id === currentSong.id && playing ?
                                                                <PauseIcon className="play-icon-image-overlay" onClick={handleStateChange} /> :
                                                                <PlayArrowIcon className="play-icon-image-overlay" 
                                                                    onClick={(e) => item.id === currentSong.id ? handleStateChange(e): loadAudio(ll, item, e)}
                                                                />  
                                                            }
                                                        </div>
                                        
                                                        <img 
                                                            src={apiLinks.getImage + item.musicImageKey} 
                                                            alt={item.musicTitle} 
                                                            className="card-image"
                                                        />
                                                    </div>
                                                    <div className="card-text-container">
                                                        <div className="card-text">
                                                            <h5 className={`pt-3 song-name ${isDark ? "hover-dark" : "hover-light"}`} title={`Play ${item.musicTitle}`}>
                                                                <span style={{cursor: "pointer"}} 
                                                                    onClick={(e) => loadAudio(ll, item, e)} >
                                                                    {item.musicTitle}
                                                                </span>
                                                            </h5>
                                                            <h6 title={`Watch ${item.albumTitle}`} className={`album-title ${isDark ? "hover-dark" : "hover-light"}`}>
                                                                <Link to={`/album/${item.albumTitle}`} className={`album-title ${isDark ? "hover-dark" : "hover-light"}`}>
                                                                    {item.albumTitle}
                                                                </Link>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </Slider>
                                </Container>
                            );
                        })
                    : Array.from(new Array(3)).map((item, index) => {
                        return (
                            <Container key={index} className=" mt-3 slider-container" fluid>
                                <Skeleton animation='wave' variant="h1" width="30%" height="3rem" className="mb-3 mt-3" />
                                <Slider {...loaderSettings}>
                                    {
                                        Array.from(new Array(10)).map((dummy, idx) => {
                                            return (
                                                <React.Fragment>
                                                    <div className="card-image-container">
                                                        <Skeleton animation='wave' variant="rectangular" height="100%" className="card-image" />
                                                    </div>
                                                    <div className="card-text-container">
                                                        <Skeleton animation='wave' variant="text" className="card-text" />
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })
                                    }
                                </Slider>
                            </Container>
                        );
                    })
                    }
                </Container>
                <Container key="artist-container" className="mt-5" fluid>
                    { list.artistList ? 
                        <Container className="slider-container" fluid>
                            <h2 className={`category-list-heading ${isDark ? "dark-heading" : "light-heading"}`} title="Artists">Artists</h2>
                            <Slider {...settings}>
                            { Object.keys(list.artistList).map((artist, id) => {
                                return (
                                    <div key={id} className="mt-3 mb-3 custom-card-items">
                                        <Link to={`/artist/${artist}`} className={`artist-name ${isDark ? "hover-dark" : "hover-light"}`}>
                                            <div className="artist-card-image-container d-flex">
                                                <img 
                                                    src={apiLinks.getArtistImgFromName + artist} 
                                                    alt={artist} 
                                                    className={`artist-card-image ${isDark ? "dark" : "light"}`}
                                                />
                                            </div>
                                            <div className="card-text-container mt-0">
                                                <div className="card-text" style={{textAlign: "center"}}>
                                                    <h4 className={`pt-3 pb-3 artist-name ${isDark ? "hover-dark" : "hover-light"}`} title={artist}>
                                                            {artist}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                            </Slider>
                        </Container>
                    : Array.from(new Array(1)).map((item, index) => {
                        return (
                            <Container key={index} className=" mt-3 slider-container" fluid>
                                <Skeleton animation='wave' variant="h1" width="30%" height="3rem" className="mb-3 mt-3" />
                                <Slider {...loaderSettings}>
                                    {
                                        Array.from(new Array(10)).map((dummy, idx) => {
                                            return (
                                                <React.Fragment>
                                                    <div className="card-image-container">
                                                        <Skeleton animation='wave' variant="circular" height="100px" width="100px" className="card-image" />
                                                    </div>
                                                    <div className="card-text-container">
                                                        <Skeleton animation='wave' variant="text" className="card-text" />
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })
                                    }
                                </Slider>
                            </Container>
                        );
                    }) 
                    }
                </Container>
            </div>
        </div>
    );
};

export default Home;
