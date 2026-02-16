'use client';

import React, { useState, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from 'flowbite-react';

// Helper function to create a centered crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

interface ImageCropperProps {
  src: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspect?: number;
}

export default function ImageCropper({
  src,
  onCropComplete,
  onCancel,
  aspect = 1, // Default to square aspect ratio
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const handleCropComplete = useCallback(() => {
    if (!completedCrop || !imageRef) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    const pixelRatio = window.devicePixelRatio;
    
    canvas.width = completedCrop.width * pixelRatio * scaleX;
    canvas.height = completedCrop.height * pixelRatio * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    // Convert to blob and then to base64
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          onCropComplete(reader.result as string);
        };
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      0.9 // Quality
    );
  }, [completedCrop, imageRef, onCropComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">Ajuste a imagem</h2>
        <div className="relative max-h-[70vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            circularCrop
          >
            <img
              ref={setImageRef}
              src={src}
              alt="Crop me"
              onLoad={onImageLoad}
              className="max-w-full max-h-[60vh]"
            />
          </ReactCrop>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button color="gray" onClick={onCancel}>
            Cancelar
          </Button>
          <Button color="purple" onClick={handleCropComplete}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}
