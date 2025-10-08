import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Inventory from './pages/inventory';
// import { Provider } from 'react-redux';
import Dairy from './pages/diary';



const App = () => {
  return (
    <div>
    
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/inventory' element={<Inventory/>}/>
          <Route path='*' element={<Dairy/>}/>
        </Routes>

    
          </div>
  )
}

export default App