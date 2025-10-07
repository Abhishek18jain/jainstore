import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Inventory from './pages/inventory';
// import { Provider } from 'react-redux';



const App = () => {
  return (
    <div>
    
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/inventory' element={<Inventory/>}/>
        </Routes>

    
          </div>
  )
}

export default App