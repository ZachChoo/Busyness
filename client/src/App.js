import React from 'react';
//import Header from './Components/Header';
import Location from './Views/Location';
import Home from './Views/Home';
import Admin from './Views/Admin';
import About from './Views/About';
import Contact from './Views/Contact';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='location/:id' element={<Location />} />
          <Route path='admin' element={<Admin />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
