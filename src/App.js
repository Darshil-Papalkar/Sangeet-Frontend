import React from 'react';
import { Flip, ToastContainer } from 'react-toastify';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import Home from './components/Home.js';
import Error from './components/Error.js';
import Admin from './components/Admin/admin.js';

import './App.css';
import "react-toastify/dist/ReactToastify.css";

function App() {
  
  library.add(faHome);
  
  return (
    <React.Fragment>
      <div className="app-bg">
        <Router>
          <Routes>

            <Route exact path="/" element={<Home />} />
            <Route path="/admin/" element={<Admin />} />
            <Route path="*" element={<Error />} />

          </Routes>
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
    </React.Fragment>
  );
}

export default App;
