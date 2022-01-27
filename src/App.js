import React, { useState, useRef, useEffect } from 'react';
import { Flip, ToastContainer } from 'react-toastify';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import Home from './pages/Home.js';
import Error from './pages/Error.js';
import Album from './pages/Album.js';
import Admin from './pages/admin.js';
import Artist from "./pages/Artist.js";
import { Subscribe } from './client/index';
import * as serviceWorker from './client/serviceWorker.js';
import MusicPlayer from "./components/MusicPlayer/index.js";

import './App.css';
import "react-toastify/dist/ReactToastify.css";

export const Playing = React.createContext();
export const LoadAudio = React.createContext();
export const PlayPause = React.createContext();
export const PlayerContext = React.createContext();

function App() {
  library.add(faHome);
  
  const player = useRef(null);

  const [playlist, setPlaylist] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({});

  const loadAudio = (ll, item, e) => {
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

  useEffect(() => {

    if("Notification" in window){
      if(Notification.permission === "default"){
          Notification.requestPermission().then((permission) => {
              if(permission === "granted"){
                  Subscribe();
              }
          })
      }
      else if(Notification.permission === "granted"){
          Subscribe();
      }
    }
    else{
        console.log("Notification is not supported");
    }
    
    window?.addEventListener('keydown', handleKeyPress, false);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };

  }, []);
  
  return (
    <React.Fragment>
      <PlayerContext.Provider value={currentSong}>
        <PlayPause.Provider value={handleKeyPress}>
          <Playing.Provider value={playing}>
            <LoadAudio.Provider value={loadAudio}>
              <div className="app-bg">
                <Router>
                  <Routes>

                    <Route exact path="/" element={<Home />} />
                    <Route path="/album/:albumName" element={<Album />} />
                    <Route path="/artist/:artistName" element={<Artist />} />
                    <Route path="/admin/" element={<Admin />} />
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
            </LoadAudio.Provider>
          </Playing.Provider>
        </PlayPause.Provider>
      </PlayerContext.Provider>
    </React.Fragment>
  );
}

serviceWorker.register();

export default App;
