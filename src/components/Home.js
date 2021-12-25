import React from "react";

import Navigation from "./navigation/Navigation-bar/navigation";

import "./Home.css";

const Home = () => {
    return (
        <div className="App">
            <Navigation />
            <h1 style={{height: "200vh"}}>Home</h1>
        </div>
    );
};

export default Home;