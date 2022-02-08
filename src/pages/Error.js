import React, { useContext } from 'react';

import { IsDark } from '../App';
import Navigation from '../components/navigation/Navigation-bar/navigation';

import "./Error.css";

const Error = () => {
  const isDark = useContext(IsDark);

  return(
      <React.Fragment>
      <Navigation />
      <div className='error-page'>
          <h1 style={isDark ? { color: "#eee" } : { color: "#000" }}>Error: 404</h1>
          <h3 style={isDark ? { color: "#eee" } : { color: "#000" }}> Page Not Found</h3>
      </div>
      </React.Fragment>
  );  
};

export default Error;