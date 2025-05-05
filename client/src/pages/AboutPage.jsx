import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">About Me</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          I'm <strong>Bishwa Bandhu Parmar</strong>, a passionate <strong>MERN Stack Developer</strong> and aspiring software engineer currently pursuing B.Tech in Computer Science & Engineering at Gaya College of Engineering, Bihar.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          I love building full-stack web apps, solving coding problems, and continuously learning new technologies. I'm particularly interested in <strong>Machine Learning</strong> and Software Development.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          Outside tech, I enjoy playing cricket and have earned a certificate for my skills.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
