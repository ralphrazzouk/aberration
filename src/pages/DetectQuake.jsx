import React, { useState } from 'react';

function DetectQuake() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make an API call to upload the file
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          // Handle the response from the server
          console.log('File uploaded successfully:', response);
        })
        .catch((error) => {
          // Handle any errors during the upload
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!selectedFile}>
        Upload
      </button>
    </div>
  );
}


export default DetectQuake
