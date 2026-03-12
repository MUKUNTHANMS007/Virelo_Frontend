import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <h1 className="text-6xl font-extrabold mb-6 tracking-tighter">
        Give us two frames.
      </h1>
      <p className="text-gray-400 text-xl max-w-2xl">
        The ultimate temporal AI engine for creating seamless transitions.
      </p>
    </div>
  );
};

// This line is what Vite is looking for!
export default Home;