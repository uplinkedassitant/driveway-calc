"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraPreviewProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

export function CameraPreview({ onCapture, onCancel }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 4096 },
          height: { ideal: 3072 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please ensure camera permissions are granted.");
    }
  };

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error('Video or canvas ref is null');
      return;
    }

    console.log('Capturing photo...', {
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      videoReadyState: video.readyState
    });
    
    // Set canvas to match video resolution
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      setError('Could not create canvas context');
      return;
    }
    
    try {
      // Draw current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data as JPEG with high quality
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      
      console.log('Photo captured successfully, length:', imageData.length);
      
      // Pass to parent
      onCapture(imageData);
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture photo');
    }
  }, [onCapture]);

  const switchCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-black/80 text-white flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <span className="font-semibold">Camera Preview</span>
        </div>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="border-white text-white hover:bg-white/20"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {/* Video preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "max-w-full max-h-full object-contain",
            facingMode === "user" && "transform scale-x-[-1]"
          )}
        />
        
        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Error message */}
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Grid overlay for composition */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
          Position your subject and tap the capture button
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/90 flex items-center justify-center gap-6">
        {/* Switch camera button */}
        <Button
          onClick={switchCamera}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-white text-white hover:bg-white/20"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        {/* Capture button */}
        <Button
          onClick={handleCapture}
          size="icon"
          className="w-20 h-20 rounded-full bg-white hover:bg-gray-200"
        >
          <div className="w-16 h-16 rounded-full border-4 border-black" />
        </Button>

        {/* Spacer for balance */}
        <div className="w-12" />
      </div>

      {/* Tips */}
      <div className="p-4 bg-black/80 text-gray-400 text-xs text-center">
        💡 Tip: For best quality, ensure good lighting and hold steady
      </div>
    </div>
  );
}
