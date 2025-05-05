import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-4 mt-8">
      <div className="container mx-auto px-4 flex justify-around items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Bishwa Bandhu Parmar. All rights reserved.
        </p>
        <p className="text-sm">
          Built with 💻 using React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
