import axios from "axios";
import Slider from "react-slick";
import React, { useEffect, useReducer } from "react";
import { Container } from 'reactstrap';

import Error from "./Error";
import MusicPlayer from "./MusicPlayer";
import { apiLinks } from '../connection.config';
import Navigation from "./navigation/Navigation-bar/navigation";

import "./Home.css";

const musicList = {};

const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH_SUCCESS':
            const term = action.message;

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
                    if(genreList[data] === undefined){
                        genreList[data] = [term[i]];
                    }
                    else{
                        genreList[data].push(term[i]);
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
                    if(artistList[data] === undefined){
                        artistList[data] = [term[i]];
                    }
                    else{
                        artistList[data].push(term[i]);
                    }
                }

                // Filtering category data
                list = term[i].category;
                for(j=0; j < list.length; j++){
                    const data = list[j];
                    if(categoryList[data] === undefined){
                        categoryList[data] = [term[i]];
                    }
                    else{
                        categoryList[data].push(term[i]);
                    }
                }
            }

            console.log(categoryList['New Releases']);
            console.log(categoryList['Popular English Songs']);

            const list = {
                genreList,
                albumList,
                artistList,
                categoryList,
                musicList
            };

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
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    easing: "linear",
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1
          }
        }
    ]
};

const Home = () => {

    const [list, dispatch] = useReducer(reducer, musicList);

    useEffect(() => {
        let abortController = new AbortController();

        const getAudioData = async() => {
            try{
                const response = await axios.get(apiLinks.getAllAudioDetails, {
                    signal: abortController.signal
                });
                if(response.data.code === 200){
                    dispatch({ type: 'FETCH_SUCCESS', message: response.data.message });
                }
                else{
                    dispatch({ type: 'FETCH_ERROR', message: response.data.message });
                }
            }
            catch(err){
                console.log(err);
                dispatch({ type: 'FETCH_ERROR', message: err.message });
            }
        };

        getAudioData();

        return () => abortController?.abort();

    }, []);

    console.log(list);

    return (
        <div className="App">
            <Navigation />
            <Container fluid>
                {list.categoryList ?  
                        Object.keys(list.categoryList).map(catList => {
                            let ll = [];
                            if(catList !== 'New Releases')
                                ll = list.categoryList[catList].sort(() => Math.random() - 0.5);
                            else
                                ll = list.categoryList[catList];
                            return (
                                <Container key={catList} fluid className="slider-container">
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
                                                            <h3 title={item.musicTitle}>
                                                                {item.musicTitle}
                                                            </h3>
                                                            <h5 title={item.albumTitle}>
                                                                {item.albumTitle}
                                                            </h5>
                                                            <h6 title={item.artists.join(', ')}>
                                                                {item.artists.join(', ')}
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
            <MusicPlayer />
        </div>
    );
};

export default Home;
