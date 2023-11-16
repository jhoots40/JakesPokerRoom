import React from "react";
import "./styles/App.css";
import Login from "./Login";
import Home from "./Home";
import Signup from "./Signup";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
    </Routes>
  );
}

export default App;

/*
<div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>client/src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://beta.reactjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React 18
                </a>
                <p>
                    Edit <code>routes/api/crud.js</code> for adding Backend
                    APIs.
                    <br />
                    View existing APIs at{' '}
                    <a
                        className="App-link"
                        href="http://localhost:5000/api/v1/get"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        /api/v1/...
                    </a>
                </p>
                <a
                    className="App-link"
                    href="https://github.com/GauravWalia19/MernBoilerPlate"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    MERN Boilerplate 1.0.5
                </a>
                <br />
                <a
                    className="App-link"
                    href="https://www.heroku.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Deploy on Heroku
                </a>
            </header>
        </div>
        as;ldkfjas;ldkfj
*/
