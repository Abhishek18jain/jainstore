import React from 'react';
import HeroImage from '../components/Gemini_Generated_Image_79lafp79lafp79la.png';
import { Link } from 'react-router-dom';
import Footer from '../pages/footer.jsx';

const HeroSection = () => {
  return (
    // Wrap everything in a React Fragment
    <>
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${HeroImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center pt-40">
          <div className="text-center">
            <h2 className="inline-block text-4xl md:text-5xl font-extrabold text-white">Manage Your Shop, Simplified</h2>
            <p className="text-lg text-gray-200 mt-2">Track your stock and products in one place.</p>
            <Link to="/inventory" className="inline-block mt-5 bg-indigo-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
              View Full Inventory
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer/>
    </>
  );
};

export default HeroSection;