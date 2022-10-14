import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Game from './pages/Game';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './components/Navigation';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Navigation />
        <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/game" element={<Game />}></Route>
        </Routes>
    </BrowserRouter>
);

