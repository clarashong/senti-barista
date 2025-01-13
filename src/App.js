import {React, useState} from 'react';
import Level from './components/Level';
import { GameProvider } from './context/GameContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LevelSelect from './screens/LevelSelect';
import { uploadIngredients } from './scripts/ingredients_DB';

function App() {
  const [uploadStatus, setUploadStatus] = useState({
    isUploading: false,
    status: null,
    error: null
  });

  const handleUpload = async () => {
    setUploadStatus({ isUploading: true, status: null, error: null });
    try {
      const result = await uploadIngredients();
      setUploadStatus({
        isUploading: false,
        status: result.success ? 'success' : 'warning',
        error: null
      });
    } catch (error) {
      setUploadStatus({
        isUploading: false,
        status: 'error',
        error: error.message
      });
    }
  };

  return (
    <div>
      <button 
        onClick={handleUpload}
        disabled={uploadStatus.isUploading}
      >
        {uploadStatus.isUploading ? 'Uploading...' : 'Upload Ingredients'}
      </button>
      
      {uploadStatus.status && (
        <div>
          {uploadStatus.status === 'success' && '✅ Upload successful'}
          {uploadStatus.status === 'warning' && '⚠️ Upload completed with some errors'}
          {uploadStatus.status === 'error' && `❌ Upload failed: ${uploadStatus.error}`}
        </div>
      )}
    </div>
  );
}


// await uploadIngredients(); 
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomeScreen />} />
//         <Route path="/levelselect" element={<LevelSelect />} />
//         <Route 
//           path="/game" 
//           element={
//             <GameProvider>
//               <Level />
//             </GameProvider>
//           } 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

export default App;
