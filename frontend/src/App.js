import React from 'react';
import './base.css';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import Upload from './Pages/Upload.js';
import Home from './Pages/Home.js';
function App() {
  return (
    <div className="container">
      <Router>
        <nav className="nav">
          <div className="nav-brand">Cloudinary REACT</div>
          <ul className="nav-items">
            <li className="nav-item">
              <Link to="/">Gallery</Link>
            </li>
            <li className="nav-item">
              <Link to="/upload">Upload</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route component={Upload} path="/upload" />
          <Route component={Home} path="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;