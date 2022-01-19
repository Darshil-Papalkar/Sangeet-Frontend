import axios from "axios";
import Slider from "react-slick";
import { Container } from 'reactstrap';
import React, { useEffect, useReducer, useRef, useState } from "react";

import { Error } from "./Notification/Notification";
import MusicPlayer from "./MusicPlayer";
import { apiLinks } from '../connection.config';
import Navigation from "./navigation/Navigation-bar/navigation";

import "./Home.css";

const musicList = {};

const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH_SUCCESS':
            const artistData = action.artistData.filter(item => item.show === true);
            const genreData = action.genreData.filter(item => item.show === true);
            const categoryData = action.categoryData.filter(item => item.show === true);
            const term = action.message.filter(item => item.show === true);
            
            // console.log(term);
            // console.log(artistData);
            // console.log(genreData);
            // console.log(categoryData);

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
            Error(action.message);
            return state;
        default:
            return state;
    }
};

const settings = {
    dots: false,
    arrows: false,
    draggable: true,
    lazyLoad: "ondemand",
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    easing: "linear",
    responsive: [
        {
          breakpoint: 1024,
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
            breakpoint: 320,
            setting: {
                slidesToShow: 1
            }
        }
    ]
};

const artistSettings = {
    dots: false,
    arrows: false,
    draggable: true,
    lazyLoad: "ondemand",
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    easing: "linear",
    responsive: [
        {
          breakpoint: 1024,
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
        }
    ]
};

const Home = () => {
    const player = useRef(null);

    const [list, dispatch] = useReducer(reducer, musicList);
    const [playlist, setPlaylist] = useState([]);
    const [currentSong, setCurrentSong] = useState({});

    const loadAudio = (ll, item, e) => {
        if(e)
            e.preventDefault();
        setPlaylist(ll);
        setCurrentSong(item);
        // console.log(ll, item);
    };

    // console.log(currentSong, playlist);
        
    const handleKeyPress = (e) => {
        switch(e.code){
            case 'Space':  
                e.preventDefault();
                if(player.current)
                    player?.current?.handlePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if(player.current)
                    player?.current?.handlePrevSong();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if(player.current)
                    player?.current?.handleNextSong();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        let abortController = new AbortController();

        const getAudioData = async() => {
            try{
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
                }
                else{
                    dispatch({ type: 'FETCH_ERROR', message: response.data.message });
                }

                window?.addEventListener('keydown', handleKeyPress, false);
            }
            catch(err){
                console.log(err);
                dispatch({ type: 'FETCH_ERROR', message: err.message });
            }
        };

        getAudioData();

        return () => {
            abortController?.abort();
            document.removeEventListener('keypress', handleKeyPress);
        }

    }, []);

    return (
        <div className="App">
            <Navigation />
            <Container key='category-container' fluid>
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
                            <Container key={catList} fluid className=" mt-3 slider-container">
                                <h2 className="category-list-heading" title={catList}>{catList}</h2>
                                <Slider {...settings}>
                                    {ll.map(item => {
                                        return (
                                            <div key={item.id} className="mt-3 mb-3 custom-card-items">
                                                <div className="card-image-container">
                                                    <img 
                                                        src={apiLinks.getImage + item.musicImageKey} 
                                                        alt={item.musicTitle} 
                                                        className="card-image"
                                                    />
                                                </div>
                                                <div className="card-text-container">
                                                    <div className="card-text">
                                                        <h5 className="pt-3" title={`Play ${item.musicTitle}`}>
                                                            <span style={{cursor: "pointer"}} onClick={(e) => loadAudio(ll, item, e)}>
                                                                {item.musicTitle}
                                                            </span>
                                                        </h5>
                                                        <h6 style={{cursor: "pointer"}} className="album-title" title={`Listen ${item.albumTitle}`}>
                                                            {item.albumTitle}
                                                        </h6>
                                                        <h6>
                                                            {item.artists.map((artist, idx) => {
                                                                return (
                                                                    <React.Fragment>
                                                                        <span style={{cursor: "pointer"}} title={`Listen to ${artist}`} className="artist-name" key={artist}>
                                                                            {artist}
                                                                        </span>
                                                                        <span key={idx}>
                                                                            {item.artists?.length - 1 > idx ? `, ` : ``}
                                                                        </span>
                                                                    </React.Fragment>

                                                                )
                                                            })}
                                                            {/* {item.artists.join(', ')} */}
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
                : <React.Fragment />
                }
            </Container>
            <Container key="artist-container" className="mt-5" fluid>
                { list.artistList ? 
                    <Container className="slider-container" fluid>
                        <h2 className="category-list-heading" title="Artists">Artists</h2>
                        <Slider {...artistSettings}>
                        { Object.keys(list.artistList).map((artist, id) => {
                            return (
                                <div key={id} className="mt-3 mb-3 custom-card-items">
                                    <div className="artist-card-image-container">
                                        <img 
                                            src={apiLinks.getArtistImgFromName + artist} 
                                            alt={artist} 
                                            className="artist-card-image"
                                        />
                                    </div>
                                    <div className="card-text-container">
                                        <div className="card-text" style={{textAlign: "center"}}>
                                            <h4 className="pt-3" title={artist}>
                                                {artist}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        </Slider>
                    </Container>
                 : <React.Fragment /> }
            </Container>
            <Container className="pt-3" />
            {
                playlist.length ? 
                    <MusicPlayer 
                        ref={player}
                        currentSong={currentSong}
                        playlist={playlist}
                        setCurrentSong={setCurrentSong}
                        loadAudio={loadAudio}
                    />
                    : <React.Fragment />
            }
        </div>
    );
};

export default Home;
