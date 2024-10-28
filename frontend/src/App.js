import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Select from './Components/select'
import InitQuestion from './Components/InitQuestion'

function App() {
  
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Select />} />
          <Route path="/init_question" element={<InitQuestion />} />

        </Routes>
      </BrowserRouter>
    </div>

    
  );
}

export default App;
