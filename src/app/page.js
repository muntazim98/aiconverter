'use client';
import { useState } from 'react';

const HomePage = () => {
  const [image, setImage] = useState(null);
  const [outputFormat, setOutputFormat] = useState('jpeg'); // Default format is 'jpeg'

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the uploaded file to state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image); // Add image file to the form data
    formData.append('outputFormat', outputFormat); // Add selected format

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob); // Create a URL for the converted image
      window.open(url); // Open the converted image in a new tab
    } else {
      alert('Image conversion failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Image Converter</h1>
      <p className="mb-4 text-center text-gray-700">
        Upload your image and select the desired format for conversion.
      </p>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="border border-gray-300 rounded p-2 w-full mb-4"
          required
        />
        <label className="block mb-2 font-semibold text-gray-700">Select Output Format:</label>
        <select
          onChange={(e) => setOutputFormat(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-4"
        >
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="avif">AVIF</option>
          <option value="webp">WebP</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
        >
          Convert Image
        </button>
      </form>
    </div>
  );
};

export default HomePage;
