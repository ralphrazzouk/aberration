import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';

const DetectQuake = () => {
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
        await pyodideInstance.loadPackage(['numpy']); // Load both packages

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
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        alert("try")
        // Make an API call to upload the file
        const response = await fetch('https://aberration-server.onrender.com/process-file', { 
          method: 'POST',
          body: formData,
        });
      
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

          const data = await response.json();
          console.log('File uploaded successfully:', data);
      
          const plotImage = `data:image/png;base64,${data.image}`;
          // alert(plotImage);
          // alert("image received");

          const img = document.createElement('img');
          img.src = plotImage;
          img.alt = "Generated Plot";
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          // alert("setting up image");

          const divRight = document.getElementById('divright');
          divRight.appendChild(img);
          // alert("mafroud appended");

        } catch (error) {
          console.error('Error running Python code:', error);
        }
      }
    }

  return (
    <>
      <div className="w-full min-h-screen bg-fixed bg-center bg-no-repeat bg-cover bg-homeBg dark:bg-homeBg-dark md:pb-16">
				<div className="text-center">
        <div className="w-40">
          {/* Background image */}
          <div className="absolute inset-0 z-0 bg-center bg-cover" style={{backgroundImage: "url('/moon/MoonWallpaper1')"}}></div>
          
          <div className="z-10 items-center justify-center mx-8">
            {/* Title */}
            <div className='py-16'>
              <h1 className="mb-4 text-4xl font-bold">Seismic Detection Tool</h1>
              
              {/* Description */}
              <h3 className="mb-8 text-xl text-center">
                Upload your seismic data in the form of CSV file and this tool will use a convolution neural network
                to predict the arrival time of the seismic activity, if any, and generate a plot showing it.
              </h3>
            </div>
            
            {/* Upload box */}
            <div className="p-6 space-y-4 bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold text-white ">Upload CSV File</h2>
              
              <div className="flex items-center justify-center">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center h-32 transition duration-300 bg-gray-700 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400">CSV files only</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept=".csv" />
                </label>
              </div>
              
              <p className="text-sm text-gray-300">
                Please ensure your CSV file has the columns: &quot;time_rel(sec)&quot; and &quot;velocity(m/s)&quot;. If different, set alternative labels below.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="time-column" className="block mb-1 text-sm font-medium text-gray-300">Your &quot;Time&quot; column is labelled:</label>
                  <input 
                    type="text" 
                    id="time-column"
                    defaultValue="time_rel(sec)" 
                    className="px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="velocity-column" className="block mb-1 text-sm font-medium text-gray-300">Your &quot;Velocity&quot; column is labelled:</label>
                  <input 
                    type="text" 
                    id="velocity-column"
                    defaultValue="velocity(m/s)" 
                    className="px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button className="px-4 py-2 font-bold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Detect the Arrival Time
              </button>
            </div>
          </div>
          
          {/* Graph section */}
          <div className="p-4 bg-gray-900 bg-opacity-80">
            <img 
              src="/api/placeholder/800/200" 
              alt="Seismic Activity Graph" 
              className="h-auto rounded-lg shadow-lg"
            />
          </div>
      </div>
				</div>
			</div>
    </>
    
  );
};

export default DetectQuake;


// function DetectQuake() {
//   const [pythonOutput, setPythonOutput] = useState("Loading Model...");
//   // const [csvData, setCsvData] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   // const [imageSrc, setImageSrc] = useState(null);
//   const [pyodide, setPyodide] = useState(null); // State to hold the Pyodide instance

//   const loadScript = (src) => {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       script.src = src;
//       script.async = true;
//       script.onload = () => resolve(script);
//       script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
//       document.body.appendChild(script);
//     });
//   };

//   useEffect(() => {
//     const loadPyodide = async () => {
//       await loadScript("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js");

//       try {
//         const pyodideInstance = await window.loadPyodide();
//         await pyodideInstance.loadPackage(['numpy']); // Load both packages

//         // Set the Pyodide instance to state
//         setPyodide(pyodideInstance);
        
//         const result = "The Model is loaded. Please proceed...";
//         setPythonOutput(result);
//       } catch (error) {
//         console.error("Error loading Pyodide or running Python:", error);
//       }
//     };

//     loadPyodide();
//   }, []);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleFileUpload = async () => {
//     if (selectedFile) {
//       const formData = new FormData();
//       formData.append('file', selectedFile);

//       try {
//         alert("try")
//         // Make an API call to upload the file
//         const response = await fetch('https://aberration-server.onrender.com/process-file', { 
//           method: 'POST',
//           body: formData,
//         });
        
//         if (!response.ok) {
//           throw new Error('Failed to upload file');
//         }

//           const data = await response.json();
//           console.log('File uploaded successfully:', data);
        
//           const plotImage = `data:image/png;base64,${data.image}`;
//           // alert(plotImage);
//           // alert("image received");

//           const img = document.createElement('img');
//           img.src = plotImage;
//           img.alt = "Generated Plot";
//           img.style.maxWidth = '100%';
//           img.style.height = 'auto';
//           // alert("setting up image");

//           const divRight = document.getElementById('divright');
//           divRight.appendChild(img);
//           // alert("mafroud appended");
  
//         } catch (error) {
//           console.error('Error running Python code:', error);
//         }
//       }
//     }
  

//   const styles = {
//     entirePage:{
//       marginTop:'10px'
//     },
//     container: {
//       maxWidth: '35%',
//       margin: '0 auto',
//       padding: '20px',
//       border: '1px solid #ccc',
//       borderRadius: '8px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//       backgroundColor: 'rgba(33, 33, 33, 0.85)',
//       color: 'white',
//       float: 'left'
//     },
//     container_right: {
//       width: '60%',
//       margin: '0 auto',
//       color: 'white',
//       float: 'right',
//       flex:1
      
//     },
//     header: {
//       textAlign: 'center',
//       color: 'white',
//       marginBottom: '20px',
//     },
//     button: {
//       padding: '10px 20px',
//       border: 'none',
//       borderRadius: '4px',
//       backgroundColor: '#007bff',
//       color: 'white',
//       cursor: 'pointer',
//       transition: 'background-color 0.3s',
//     },
//     buttonDisabled: {
//       padding: '10px 20px',
//       border: 'none',
//       borderRadius: '4px',
//       backgroundColor: 'black',
//       color: 'white',
//       cursor: 'not-allowed',
//     },
//     inputforcolumns: {
//       padding: '10px 20px',
//       border: 'none',
//       borderRadius: '4px',
//       backgroundColor: 'black',
//       color: 'white',
//       margin:'10px'
//     },
//     paragraph: {
//       textAlign: 'center',
//       color: '#d0d0d0',
//       fontSize: '16px',
//       marginBottom: '30px',
//     },
//     centralize: {
//       textAlign: 'center',
//       color: '#d0d0d0',
//       fontSize: '16px',
//       marginBottom: '30px',
//     },
//     image: {
//       maxWidth: '100%',
//       height: 'auto',
//     },
//     holder: {
//       width: '100%',
//       minHeight: '100vh',
//       display: 'flex',
//       flexDirection: 'column', // Stack divs in column
//       // justifyContent: 'center',
//       alignItems: 'center',
//       gap: '50px', // Optional: spacing between the two divs
//     },
//   };

//   return (
//     <div className="w-full min-h-screen bg-fixed bg-center bg-no-repeat bg-cover bg-homeBg dark:bg-homeBg-dark md:pb-16" >
//       <br></br>
//       <br></br>
//       <h1 style={styles.title}>Seismic Detection Tool</h1>
//       <p style={styles.paragraph}>
//         Upload your seismic data in the form of CSV file and this tool will use a convolution neural network
//         to predict the arrival time of the seismic activity, if any, and generate a plot showing it.
//       </p>
//       <div style={styles.centralize}>
//         <p>{pythonOutput}</p>
//       </div>
//       {pythonOutput === "The model is loaded. Please proceed..." && (
//         <>
//         <div style={styles.holder}>

        
//         <div id="divleft" style={styles.container}>

//           <h2 style={styles.header}>Upload CSV File:</h2>
//           <input type="file" accept=".csv" onChange={handleFileChange} />
//           <br></br>
          
//           <div>Please make sure that your CSV file has the following columns: &quot;time_rel(sec)&quot; and &quot;velocity(m/s)&quot;. If not, please set the alternative column label for each.</div>
//           <br></br>
//           <div>
//             <ul>
//               <li>Your &quot;Time&quot; column is labelled: <input type="text" defaultValue="time_rel(sec)" style={styles.inputforcolumns}></input></li>
//               <li>Your &quot;Velocity&quot; column is labelled: <input type="text" defaultValue="velocity(m/s)" style={styles.inputforcolumns}></input></li>
//             </ul>
//           </div>
//           <br></br>
//           <button 
//             style={selectedFile ? styles.button : styles.buttonDisabled} 
//             onClick={handleFileUpload} 
//             disabled={!selectedFile}
//           >
//             Detect the Arrival Time
//           </button>
//         </div>
//         <div id="divright" >
//         </div>
//         </div>
//         </>
//         )}
//     </div>
//   );
// }

// export default DetectQuake;
