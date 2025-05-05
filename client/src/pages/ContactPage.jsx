import React from 'react'
const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Contact Me</h1>
        <p className="text-gray-700 mb-2">
          <strong>Name:</strong> Bishwa Bandhu Parmar
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Phone:</strong> 9142364660
        </p>
        <p className="text-gray-700 mb-2">
          <strong>LinkedIn:</strong>{' '}
          <a
            href="https://www.linkedin.com/in/bishwabandhu06/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Connect on LinkedIn
          </a>
        </p>
        <p className="text-gray-700">
          Feel free to reach out for collaboration, internship opportunities, or just to say hi!
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
