"use client";

import React, { useCallback, useState } from "react";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (image: string) => void;
  onARMode?: () => void;
}

export function ImageUploader({ onImageSelect, onARMode }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleCamera = useCallback(async () => {
    try {
      // Request high quality back camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 4096 },
          height: { ideal: 3072 },
          aspectRatio: { ideal: 4/3 }
        } 
      });
      
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve(video);
        };
      });
      
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Could not create canvas context");
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get high quality JPEG
      const imageData = canvas.toDataURL("image/jpeg", 0.95);
      onImageSelect(imageData);
      
      // Stop camera
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied or not available. Please ensure you have camera permissions enabled.");
    }
  }, [onImageSelect]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">DrivewayCalc</h1>
        <p className="text-muted-foreground text-lg">
          Measure driveways & job sites from photos
        </p>
      </div>

      <div
        className={cn(
          "w-full max-w-xl p-12 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/10" 
            : "border-border hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium">Drop image here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports JPG, PNG, WebP • High resolution recommended
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {onARMode && (
          <Button 
            onClick={onARMode}
            size="lg" 
            className="min-w-[160px] bg-purple-600 hover:bg-purple-700"
          >
            <Camera className="w-5 h-5 mr-2" />
            AR Measure (iPhone)
          </Button>
        )}
        <Button onClick={handleCamera} size="lg" className="min-w-[160px]">
          <Camera className="w-5 h-5 mr-2" />
          Take Photo (HD)
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => document.getElementById("file-input")?.click()}
          className="min-w-[160px]"
        >
          <ImageIcon className="w-5 h-5 mr-2" />
          Upload Image
        </Button>
      </div>

      {error && (
        <div className="text-destructive text-sm max-w-md text-center">{error}</div>
      )}

      <div className="text-xs text-muted-foreground max-w-md text-center mt-4 space-y-2">
        <p>
          <strong>💡 Pro Tips for Accuracy:</strong>
        </p>
        <ul className="text-left list-disc list-inside space-y-1">
          <li>Take photos from directly above or at a high angle</li>
          <li>Include a tape measure or known distance in the photo</li>
          <li>Ensure good lighting and minimal shadows</li>
          <li>Keep camera steady and parallel to ground</li>
          <li>For best results, use 12MP+ camera resolution</li>
        </ul>
      </div>
    </div>
  );
}
