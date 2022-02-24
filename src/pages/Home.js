import Slider from "react-slick";
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import React, { useState, useContext } from "react";

import { apiLinks } from '../connection.config';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SpinnerGrow from "../components/spinner/spinner-grow";
import Navigation from "../components/navigation/Navigation-bar/navigation";
import { LoadAudio, PlayerContext, PlayPause, Playing, IsDark, List, Loader } from "../App";

import "./Home.css";

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
    const list = useContext(List);
    const isDark = useContext(IsDark);
    const loader = useContext(Loader);
    const playing = useContext(Playing);
    const loadAudio = useContext(LoadAudio);
    const playPauseState = useContext(PlayPause);
    const currentSong = useContext(PlayerContext);

    const [mouseId, setMouseId] = useState(0);

    const handleStateChange = (e) => {
        const event = {
            ...e,
            code: "Space",
            preventDefault : () => {}
        };
        playPauseState(event);
    };

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
                                <Container key={catList} className={`mt-3 slider-container ${isDark ? "dark" : "light"}`} fluid>
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
                                <Skeleton sx={isDark ? {bgcolor: '#ffffff29'}: null} animation='wave' variant="h1" width="30%" height="3rem" className="mb-3 mt-3" />
                                <Slider {...loaderSettings}>
                                    {
                                        Array.from(new Array(10)).map((dummy, idx) => {
                                            return (
                                                <React.Fragment key={idx}>
                                                    <div className="card-image-container">
                                                        <Skeleton sx={isDark ? {bgcolor: '#ffffff29'}: null} animation='wave' variant="rectangular" height="100%" className="card-image" />
                                                    </div>
                                                    <div className="card-text-container">
                                                        <Skeleton sx={isDark ? {bgcolor: '#ffffff29'}: null} animation='wave' variant="text" className="card-text" />
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
                        <Container className={`slider-container ${isDark ? "dark" : "light"}`} fluid>
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
                                <Skeleton sx={isDark ? {bgcolor: '#ffffff29'}: null} animation='wave' variant="h1" width="30%" height="3rem" className="mb-3 mt-3" />
                                <Slider {...loaderSettings}>
                                    {
                                        Array.from(new Array(10)).map((dummy, idx) => {
                                            return (
                                                <React.Fragment key={idx}>
                                                    <div className="card-image-container">
                                                        <Skeleton sx={isDark ? {bgcolor: '#ffffff29'}: null} animation='wave' variant="circular" height="100px" width="100px" className="card-image" />
                                                    </div>
                                                    <div className="card-text-container">
                                                        <Skeleton sx={isDark ? {bgcolor: '#ffffff29'}: null} animation='wave' variant="text" className="card-text" />
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
