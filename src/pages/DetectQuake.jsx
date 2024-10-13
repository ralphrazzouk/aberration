import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';

const DetectQuake = () => {
  const [pythonOutput, setPythonOutput] = useState("Loading Model...");
  // const [csvData, setCsvData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  // const [imageSrc, setImageSrc] = useState(null);
  const [pyodide, setPyodide] = useState(null); // State to hold the Pyodide instance

  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeColumn, setTimeColumn] = useState('time_rel(sec)');
  const [velocityColumn, setVelocityColumn] = useState('velocity(m/s)');

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadPyodide = async () => {
      await loadScript("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js");

      try {
        const pyodideInstance = await window.loadPyodide();
        await pyodideInstance.loadPackage(['numpy']); // Load both packages

        // Set the Pyodide instance to state
        setPyodide(pyodideInstance);
      
        const result = "The model is loaded. Please proceed...";
        setPythonOutput(result);
      } catch (error) {
        console.error("Error loading Pyodide or running Python:", error);
      }
    };

    loadPyodide();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
  
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('time_column', timeColumn);
    formData.append('velocity_column', velocityColumn);
  
    try {
      console.log('Sending request to:', 'https://aberration-server.onrender.com/process');
      console.log('Request method:', 'POST');
      console.log('Request payload:', formData);
  
      const response = await fetch('https://aberration-server.onrender.com/process', {
        method: 'POST',
        body: formData,
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      setImageSrc(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(`Failed to process the file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const styles = {
    entirePage:{
      marginTop:'10px',
      maxWidth: '60%',
      margin: '8px auto',
    },
    container: {
      maxWidth: '100%',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: 'rgba(20, 20, 20, 0.95)',
      color: 'white',
      float: 'left'
    },
    title: {
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    description: {
      textAlign: 'center',
      backgroundColor: 'rgba(20, 20, 20, 0.95)',
      border: '1px',
      borderRadius: '16px',
      color: '#d0d0d0',
      fontSize: '20px',
      marginBottom: '30px',
      padding: '20px',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      display: 'block',
      margin: '0 auto',
    },
    buttonDisabled: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'black',
      color: 'gray',
      cursor: 'not-allowed',
      display: 'block',
      margin: '0 auto',
    },
    inputforcolumns: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'black',
      color: 'white',
      margin:'10px',
      fontSize: '20px'
    },
    centralize: {
      textAlign: 'center',
      color: '#d0d0d0',
      fontSize: '16px',
      marginBottom: '30px',
    },
    image: {
      maxWidth: '100%',
      height: 'auto',
    },
    holder: {
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column', // Stack divs in column
      // justifyContent: 'center',
      alignItems: 'center',
      gap: '20px', // Optional: spacing between the two divs
    },
    uploadtitle: {
      fontSize: '24px',
      color: 'white',
      fontWeight: 'semibold',
      marginBottom: '1rem',
    },
    uploadarea:{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '8rem',
      border: '2px dashed gray',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      backgroundColor: 'rgba(55, 65, 81, 1)', // bg-gray-700
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: 'rgba(75, 85, 99, 1)', // bg-gray-600
      }
    },
    uploadlabel:{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    upload:{
      width: '1.5rem',
      height: '1.5rem',
      color: 'gray',
    },
    uploadtext:{
      fontWeight: '500',
      color: '#d0d0d0',
    }
  };

  return (
    <div className="w-full min-h-screen bg-fixed bg-center bg-no-repeat bg-cover md:pb-16 bg-homeBg dark:bg-homeBg-dark" > 
      <br /><br />
      <div style={styles.entirePage}>
        <h1 style={styles.title}>Aberration Algorithm</h1>
        <p style={styles.description}>
          This is a seismic detection tool. The model consists of a convolutional neural network that will
          predict the arrival time of the seismic activity. Upload your seismic data in the form of CSV file
          with the given column names below, and it will generate a plot where it thinks the arrival time is.
        </p>

        <div style={styles.centralize}>
          <p>{loading ? "Processing..." : "The model is loaded. Please proceed..."}</p>
        </div>

        <div style={styles.holder}>
          <div id="divleft" style={styles.container}>
            <div style={styles.uploadtitle}>Upload CSV File</div>
            <div>
              <label htmlFor="file-upload" style={styles.uploadarea}>
                <span style={styles.uploadlabel}>
                  <Upload style={styles.upload} />
                  <span style={styles.uploadtext}>Drop files to attach, or click to browse</span>
                </span>
                <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
              </label>
            </div>

            <br />
            
            <div style={{fontSize: '24px', fontWeight: 'semibold'}}>Note:</div>
            <div style={{fontSize: '18px', fontWeight: 'semibold'}}>Please make sure that your CSV file has the following columns: &quot;time_rel(sec)&quot; and &quot;velocity(m/s)&quot;.</div>
            <div style={{fontSize: '18px', fontWeight: 'semibold'}}>If not, please set the alternative column label for each.</div>

            <br />
            
            <div style={{fontSize: '24px', fontWeight: 'semibold'}}>Time needed:</div>
            <div style={{fontSize: '18px', fontWeight: 'semibold'}}>This will take a while to run. In particular, it will be on the order of (number of rows)/32000 minutes.</div>
            <div style={{fontSize: '18px', fontWeight: 'semibold'}}>For example, if the data set given is 570,000 data points, then it will take 17.8125 minutes.</div>
            <br />
            {/* <div>
              <ul>
                <li style={{fontSize: '22px', fontWeight: 'semibold'}}>
                  Your time values column is labeled:
                  <input 
                    type="text" 
                    value={timeColumn} 
                    onChange={(e) => setTimeColumn(e.target.value)} 
                    style={styles.inputforcolumns} 
                  />
                </li>
                <li style={{fontSize: '22px', fontWeight: 'semibold'}}>
                  Your velocity values column is labeled: 
                  <input 
                    type="text" 
                    value={velocityColumn} 
                    onChange={(e) => setVelocityColumn(e.target.value)} 
                    style={styles.inputforcolumns} 
                  />
                </li>
              </ul>
            </div>
            <br /> */}
            <button 
              style={selectedFile && !loading ? styles.button : styles.buttonDisabled} 
              onClick={handleFileUpload} 
              disabled={!selectedFile || loading}
            >
              {loading ? 'Processing...' : 'Detect the Arrival Time'}
            </button>
            {error && <div style={styles.errorMessage}>{error}</div>}
          </div>
          
          <div id="divright" style={styles.container_right}>
            {imageSrc && <img src={imageSrc} alt="Generated Plot" style={styles.image} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectQuake;