import React, { useEffect, useState } from 'react';

function DetectQuake() {
  const [pythonOutput, setPythonOutput] = useState("Loading Model...");
  const [csvData, setCsvData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [pyodide, setPyodide] = useState(null); // State to hold the Pyodide instance

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
        await pyodideInstance.loadPackage(['matplotlib', 'pandas', 'tensorflow', 'numpy', 'sklearn', 'spicy']); // Load both packages

        // Set the Pyodide instance to state
        setPyodide(pyodideInstance);
        
        const result = "The Model is loaded. Please proceed...";
        setPythonOutput(result);
      } catch (error) {
        console.error("Error loading Pyodide or running Python:", error);
      }
    };

    loadPyodide();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile && pyodide) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        setCsvData(text); 

        const pythonCode = `
import pandas as pd
from io import StringIO
import matplotlib.pyplot as plt
import base64
from io import BytesIO
def plot_please():
  csv_data = StringIO("""${text}""")
  try:
      df = pd.read_csv(csv_data)
      df['time_abs'] = pd.to_datetime(df['time_abs(%Y-%m-%dT%H:%M:%S.%f)'])

      # Create the plot
      plt.figure(figsize=(10, 5))
      plt.plot(df['time_abs'], df['velocity(m/s)'], label='Velocity (m/s)', color='b')
      plt.title('Velocity Over Time')
      plt.xlabel('Time (Absolute)')
      plt.ylabel('Velocity (m/s)')
      plt.xticks(rotation=45)
      plt.legend()
      plt.tight_layout()

      # Save the plot to a BytesIO object
      buf = BytesIO()
      plt.savefig(buf, format='png')
      buf.seek(0)

      # Encode the image to base64
      img_str = base64.b64encode(buf.read()).decode('utf-8')
      img_tag = f"data:image/png;base64,{img_str}"

      # Clear the figure to avoid overlap in subsequent plots
      plt.clf()

      # Return the image data
      return img_tag
  except Exception as e:
      print(e)
      error_message = str(e)  # Capture any error messages
      return error_message
plot_please()
`;
  

        try {
          const plotImage = await pyodide.runPythonAsync(pythonCode);
          alert(plotImage);
          alert("image received")

          const img = document.createElement('img');
          img.src = plotImage;
          img.alt = "Generated Plot";
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          alert("setting up image");

          const existingImages = document.querySelectorAll('.generated-plot');
          existingImages.forEach(image => image.remove());
  
          img.className = 'generated-plot';
          document.body.appendChild(img);
          alert("mafroud appended");
  
        } catch (error) {
          console.error('Error running Python code:', error);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const styles = {
    container: {
      maxWidth: '35%',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: 'rgba(33, 33, 33, 0.85)',
      color: 'white',
      float: 'left'
      
    },
    container_right: {
      width: '65%',
      margin: '0 auto',
      padding: '20px',
      color: 'white',
      float: 'right',
      flex:1
      
    },
    header: {
      textAlign: 'center',
      color: 'white',
      marginBottom: '20px',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonDisabled: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'black',
      color: 'white',
      cursor: 'not-allowed',
    },
    inputforcolumns: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'black',
      color: 'white',
      margin:'10px'
    },
    paragraph: {
      textAlign: 'center',
      color: '#d0d0d0',
      fontSize: '16px',
      marginBottom: '30px',
    },
    centralize: {
      textAlign: 'center',
      color: '#d0d0d0',
      fontSize: '16px',
      marginBottom: '30px',
    },
    image: {
      marginTop: '20px',
      maxWidth: '100%',
      height: 'auto',
    },
    holder: {
      maxWidth: '100%'
    }
  };

  return (
    <div className="bg-homeBg min-h-screen dark:bg-homeBg-dark bg-no-repeat bg-center bg-cover bg-fixed  md:pb-16 w-full">
      <h1 style={styles.title}>Seismic Detection Tool</h1>
      <p style={styles.paragraph}>
        Upload your seismic CSV data, and this tool will generate a plot showing the arrival time of the seismic activity, if any.
      </p>
      <div style={styles.centralize}>
        <p>{pythonOutput}</p>
      </div>
      {pythonOutput === "The Model is loaded. Please proceed..." && (
        <>
        <div style={styles.holder}>

        
        <div id="divleft" style={styles.container}>

          <h2 style={styles.header}>Upload CSV File:</h2>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <br></br>
          
          <div>Please make sure that your file (csv or mseed) has the following columns: "time_rel(sec)" and "velocity(m/s)". If not, please set the alternative column label for each.</div>
          <br></br>
          <div>
            <ul>
              <li>Your "Time" column is labelled: <input type="text" defaultValue="time_rel(sec)" style={styles.inputforcolumns}></input></li>
              <li>Your "Velocity" column is labelled: <input type="text" defaultValue="velocity(m/s)" style={styles.inputforcolumns}></input></li>
            </ul>
          </div>
          <br></br>
          <button 
            style={selectedFile ? styles.button : styles.buttonDisabled} 
            onClick={handleFileUpload} 
            disabled={!selectedFile}
          >
            Detect the Arrival Time
          </button>
        </div>
        <div id="divright" style={styles.container_right}></div>
        </div>
        </>
        )}
        <div className="generated-plot">

        
        
      </div>
    </div>
  );
}

export default DetectQuake;
