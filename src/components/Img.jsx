import React, { useEffect, useState } from "react";
import './img.css'

import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const Img = () => {

  const [userPrompt, setUserPrompt] = useState("");
  const [number, setNumber] = useState(1);
  const [size, setSize] = useState("1024x1024");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState("");



  const generateImage = async () => {
    try {
      setImageUrl('');
      
      setIsLoading(true);
      const imageParameters = {
        prompt: userPrompt,
        n: parseInt(number),
        size: size,
      };
      const response = await openai.createImage(imageParameters);
      const urlData = response.data.data[0].url;
      setImageUrl(urlData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setError("⚠ An error occurred while generating the image. Please Reload the page and try again.");
      toast.error("Failed! Try after Reload The page") 
    }
  };

  const [downloadLink, setDownloadLink] = useState("");
  const [newcnt , setnewcnt ] = useState(1);

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:3001/download-image?url=${encodeURIComponent(imageUrl)}`, {
        method: 'GET',
        mode: 'cors',
      });
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download =  "image.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setnewcnt(prevNewcnt => prevNewcnt + 1);
      toast.success('Your download has started!');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
     
  }, [handleDownload]);

  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

     



  

    return (
        <div className="App">
           <ToastContainer />
            
                <input placeholder='Write Description About Your Sketch..' type='text' className='main-inputs'  
                onChange={(e)=> setUserPrompt(e.target.value)} />
            <button style={{marginBottom:'30px', color:'Brown' ,fontSize:'1.1rem', fontWeight:'bold'}} className='main-button' onClick={generateImage} >Generate Sketch </button>
            {isLoading &&  <div className="rainbow-marker-loader"></div> } 
            {isLoading &&  <h3 className="title">Sketching...</h3>  } 
          
          
           {error &&  <p style={{color:'red'}}> {error} </p>  }
        
                {imageUrl && <img style={{ height:'400px', width:'400px'}}src={imageUrl} alt="Ai image" className="image"/>}
                {imageUrl && <button className="buttonDownload"   onClick={handleDownload} >
      Download Image
    </button>}


        </div>
    )
}

export default Img
