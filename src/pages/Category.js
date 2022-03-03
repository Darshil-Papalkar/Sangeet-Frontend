import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";

import Body from "../components/Category/body";
import Header from "../components/Category/header";
import Footer from "../components/Category/footer";
import { apiLinks } from "../connection.config";
import { Error } from "../components/Notification/Notification";
import SpinnerGrow from "../components/spinner/spinner-grow";
import Navigation from "../components/navigation/Navigation-bar/navigation";
import { PlayerContext, IsDark } from "../App";

import "./Category.css";

export const Artists = React.createContext();
export const SongList = React.createContext();
export const Duration = React.createContext();
export const CalculateTimeContext = React.createContext();

const Category = () => {
    const params = useParams();
    // document.title = params.category;

    const isDark = useContext(IsDark);
    const currentSong = useContext(PlayerContext);
    
    const [artists, setArtists] = useState([]); 
    const [loader, setLoader] = useState(false);
    const [songList, setSongList] = useState([]);
    const [totalDuration, setTotalDuration] = useState(0);

    const calculateSongTime = (time) => {
        // console.log(time);
        if(time !== Infinity){
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes < 10 ? '0' + String(minutes) : String(minutes)}:${seconds < 10 ? '0' + String(seconds) : String(seconds)}`;
        } 
        return time;
    };

    useEffect(() => {
        let abortController = new AbortController();

        const getCategoryData = async () => {
            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getCategoryByName+params.category, {
                    headers: {
                        'content-type': "application/json"
                    },
                    signal: abortController.signal
                });
                if(response.data.code === 200){
                    const artist = [...new Set(response.data.message.map((songs) => songs.artists).flat())];
                    const duration = response.data.message.reduce((partial_sum, a) => partial_sum + a.duration, 0);
                    
                    setArtists(artist);
                    setTotalDuration(duration);
                    setSongList(response.data.message);
                    abortController = null;
                }
                else{
                    Error(response.data.message);
                }
            }
            catch(err){
                console.log(err);
            }
            finally{
                setLoader(false);
            }
        };

        getCategoryData();

        return () => {
            if(abortController){
                abortController?.abort();
                setLoader(false);
            }
        }

    }, [params]);

    return(
        <React.Fragment>
            {loader ? 
                <SpinnerGrow color="success" />: 
                <React.Fragment />
            }
            <Navigation />
            <div className={`page-content ${isDark ? "dark" : "light"}`}
                style={currentSong.id ? {height: "calc(100vh - 215px)"} : {height: "calc(100vh - 70px)"}}> 
                <CalculateTimeContext.Provider value={calculateSongTime}>
                    <SongList.Provider value={songList}>
                        <Artists.Provider value={artists}>
                            <Duration.Provider value={totalDuration}>
                                <Header title={params.category} />
                                <Body />
                                <Footer />
                            </Duration.Provider>
                        </Artists.Provider>
                    </SongList.Provider>
                </CalculateTimeContext.Provider>
            </div>
        </React.Fragment>
    );
};

export default Category;
