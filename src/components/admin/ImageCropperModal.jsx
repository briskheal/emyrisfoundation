import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../lib/cropImage';

export default function ImageCropperModal({ imageSrc, onCropDone, onCancel, aspectRatio = 1.5 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, 'cropped-image.jpg');
      onCropDone(croppedFile);
    } catch (e) {
      console.error(e);
      alert('Error cropping image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ position: 'relative', width: '90%', height: '70vh', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      
      <div style={{ marginTop: '20px', width: '90%', maxWidth: '400px' }}>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '20px' }}
        />
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={onCancel} 
            disabled={isProcessing}
            style={{ padding: '10px 20px', background: '#555', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleCrop}
            disabled={isProcessing}
            style={{ padding: '10px 20px', background: 'var(--primary-orange)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isProcessing ? 'Processing...' : 'Crop & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
