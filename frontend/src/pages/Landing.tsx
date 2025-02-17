import React from 'react';
import backgroundImage from '../assets/bg.jpg'; // Sesuaikan dengan nama file gambar Anda

const Landing = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="text-center text-white p-5">
          <h1 className="text-3xl font-bold">Welcome to Artichel Travel</h1>
          <p>Explore beautiful destinations and share your experiences.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
