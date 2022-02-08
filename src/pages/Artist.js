import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";

import Body from "../components/Artist/body";
import Header from "../components/Artist/header";
import Footer from "../components/Artist/footer";
import { apiLinks } from "../connection.config";
import { Error } from "../components/Notification/Notification";
import SpinnerGrow from "../components/spinner/spinner-grow";
import Navigation from "../components/navigation/Navigation-bar/navigation";
import { PlayerContext, IsDark } from "../App";

import "./artist.css";

export const SongList = React.createContext();
export const Duration = React.createContext();
export const AlbumList = React.createContext();
export const CalculateTimeContext = React.createContext();

const Artist = (props) => {
    const isDark = useContext(IsDark);
    const currentSong = useContext(PlayerContext);

    const params = useParams();

    const [loader, setLoader] = useState(false);
    const [songList, setSongList] = useState([]);
    const [albumList, setAlbumList] = useState([]);
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

        const getArtistDetails = async () => {
            try{
                setLoader(true);
                const response = await axios.get(apiLinks.getArtistDetails + params.artistName, {
                    headers: {
                        'content-type': "application/json"
                    },
                    signal: abortController.signal
                });
                if(response.data.code === 200){
                    // console.log(response.data.message);
                    const duration = response.data.message.reduce((partial_sum, a) => partial_sum + a.duration, 0);
                    const album = [];
                    response.data.message.map(item => album.includes(item.albumTitle) ? null : album.push(item));

                    setAlbumList(album);
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
                // Error(err.message);
            }
            finally{
                setLoader(false);
            }
        };

        getArtistDetails();

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
                        <Duration.Provider value={totalDuration}>
                            <AlbumList.Provider value={albumList}>
                                <Header artist={params.artistName} />
                                <Body artist={params.artistName} />
                                <Footer artist={params.artistName} />
                            </AlbumList.Provider>
                        </Duration.Provider>
                    </SongList.Provider>
                </CalculateTimeContext.Provider>
            </div>
        </React.Fragment>
    );
};

export default Artist;
