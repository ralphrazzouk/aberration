import React, { useState } from 'react';

function DetectQuake() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        // Make an API call to upload the file
        const response = await fetch('http://127.0.0.1:5173/venv/api/upload', { // Ensure this URL matches your Flask server
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        const data = await response.json();
        console.log('File uploaded successfully:', data);

        // Immediately fetch and display the image after the file upload
        setImageSrc(`data:image/png;base64,${data.img}`);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  // const handleFetchImage = async () => {
  //   try {
  //     const response = await fetch('http://127.0.0.1:5000/api/plot'); // Ensure this URL matches your Flask server
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch image');
  //     }
      
  //     const data = await response.json();
  //     // Set the image source as base64
  //     setImageSrc(`data:image/png;base64,${data.image}`);
  //   } catch (error) {
  //     console.error('Error fetching the image:', error);
  //   }
  // };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!selectedFile}>
        Upload and Generate Plot
      </button>
      <div>
        {imageSrc && <img src={imageSrc} alt="Generated Plot" />}
      </div>
    </div>
  );
}

export default DetectQuake;