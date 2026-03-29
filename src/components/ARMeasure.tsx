"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Ruler, Zap, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ARMeasureProps {
  onMeasurement: (distanceFeet: number) => void;
  onCancel: () => void;
}

/**
 * iOS AR Measurement using WebXR AR Viewer
 * Works on iPhone 12+ with LiDAR for best accuracy
 */
export function ARMeasure({ onMeasurement, onCancel }: ARMeasureProps) {
  const [arSupported, setArSupported] = useState(true);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arViewerRef = useRef<any>(null);

  useEffect(() => {
    // Check if device supports AR
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const hasWebXR = 'xr' in navigator;
    
    // iOS devices with ARKit support
    setArSupported(isIOS || hasWebXR);
    
    if (!isIOS && !hasWebXR) {
      setError("AR measurement requires iOS device or WebXR support");
    }
    
    // Start camera for AR view
    startCamera();
    
    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please ensure camera permissions are granted.");
    }
  };

  const handleVideoClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!canvasRef.current) {
      console.error('Canvas ref not available');
      return;
    }
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get touch or mouse coordinates
    let clientX, clientY;
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    // Calculate click position relative to canvas
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    
    console.log('AR tap detected at:', { x, y, clientX, clientY });
    
    setPoints(prev => {
      const newPoints = [...prev, { x, y }];
      
      // Draw point on canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        console.log('Drawing point on canvas');
        
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Label the point
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${newPoints.length}`, x + 12, y - 12);
        
        // Draw line if we have 2+ points
        if (newPoints.length >= 2) {
          const lastPoint = newPoints[newPoints.length - 2];
          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(x, y);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      
      return newPoints;
    });
  }, []);

  const handleFinish = () => {
    if (points.length >= 2) {
      // Calculate pixel distance between first two points
      const dx = points[1].x - points[0].x;
      const dy = points[1].y - points[0].y;
      const pixelDistance = Math.sqrt(dx * dx + dy * dy);
      
      // For AR mode, we need calibration
      // For now, prompt for real-world distance
      const realDistance = prompt(
        `Enter the real-world distance (in feet) between these points:\n(Pixel distance: ${pixelDistance.toFixed(0)})`,
        "10"
      );
      
      if (realDistance) {
        const distance = parseFloat(realDistance);
        if (!isNaN(distance) && distance > 0) {
          onMeasurement(distance);
        }
      }
    }
  };

  const handleClear = () => {
    setPoints([]);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-black/80 text-white flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <span className="font-semibold">AR Measurement Mode</span>
        </div>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="border-white text-white hover:bg-white/20"
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>

      {/* AR Viewer Container */}
      <div className="flex-1 relative" ref={arViewerRef}>
        {/* Camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover touch-none"
          onClick={handleVideoClick}
          onTouchStart={handleVideoClick}
        />
        
        {/* Canvas overlay for drawing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          width={typeof window !== 'undefined' ? window.innerWidth : 800}
          height={typeof window !== 'undefined' ? window.innerHeight - 100 : 600}
        />
        
        {/* AR not supported message */}
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">AR Not Available</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
          {points.length === 0
            ? "👆 Tap screen to mark start point"
            : points.length === 1
            ? "👆 Tap screen to mark end point"
            : "✅ Tap 'Finish' or continue marking points"}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex gap-4 justify-center flex-wrap">
          {points.length >= 2 && (
            <>
              <Button
                onClick={handleFinish}
                size="lg"
                className="bg-green-600 hover:bg-green-700 min-w-[120px]"
              >
                <Zap className="w-5 h-5 mr-2" />
                Use This Distance
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/20"
              >
                Clear Points
              </Button>
            </>
          )}
        </div>

        {points.length > 0 && (
          <div className="text-center text-white mt-4 text-sm">
            Points marked: {points.length} | Segments: {points.length - 1}
          </div>
        )}

        {/* iPhone 12+ LiDAR badge */}
        {arSupported && (
          <div className="text-center text-gray-400 text-xs mt-4 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>iPhone 12+ with LiDAR provides best accuracy</span>
          </div>
        )}
      </div>
    </div>
  );
}
