"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useMeasurementStore, Point } from "@/store/useMeasurementStore";
import { cn, calculateShoelaceArea, calculateDistance, getGradeEmoji } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Ruler, TrendingUp, Trash2, Undo, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MeasurementCanvasProps {
  image: string;
}

export function MeasurementCanvas({ image }: MeasurementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showScaleInput, setShowScaleInput] = useState(false);
  const [tempScaleLength, setTempScaleLength] = useState("10");
  
  const {
    activeTool,
    perimeterPoints,
    scaleStart,
    scaleEnd,
    scaleLengthFeet,
    slopeStart,
    slopeEnd,
    slopeRiseInches,
    setActiveTool,
    addPerimeterPoint,
    clearPerimeter,
    setScaleStart,
    setScaleEnd,
    setScaleLength,
    setSlopeStart,
    setSlopeEnd,
  } = useMeasurementStore();

  // Load image and fit to container
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    
    img.onload = () => {
      console.log('Image loaded:', { width: img.width, height: img.height });
      setImageObj(img);
      
      // Wait for container to be available
      setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          // Use larger of screen width or image width for better quality
          const maxWidth = Math.max(window.innerWidth - 320, 1200);
          const maxHeight = Math.max(window.innerHeight - 200, 800);
          
          // Fit to screen while maintaining aspect ratio
          const ratio = Math.min(
            maxWidth / img.width,
            maxHeight / img.height,
            1 // Don't upscale
          );
          
          console.log('Setting canvas size:', {
            width: Math.max(img.width * ratio, 800),
            height: Math.max(img.height * ratio, 600)
          });
          
          setCanvasSize({
            width: Math.max(img.width * ratio, 800), // Minimum 800px width
            height: Math.max(img.height * ratio, 600),
          });
        }
      }, 100);
    };
    
    img.onerror = (err) => {
      console.error('Failed to load image:', err);
    };
  }, [image]);

  // Draw canvas whenever imageObj, perimeterPoints, or canvas changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image
    try {
      ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      console.error('Error drawing image:', err);
    }

    // Draw perimeter polygon
    if (perimeterPoints.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(perimeterPoints[0].x, perimeterPoints[0].y);
      perimeterPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      if (activeTool === "perimeter" && perimeterPoints.length >= 3) {
        ctx.closePath();
      }
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw points
      perimeterPoints.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label points
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`${index + 1}`, point.x - 5, point.y - 8);
      });
    }

    // Draw scale line
    if (scaleStart) {
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(scaleStart.x, scaleStart.y);
      ctx.lineTo(
        scaleEnd?.x || scaleStart.x,
        scaleEnd?.y || scaleStart.y
      );
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw circles
      [scaleStart, scaleEnd].forEach((point) => {
        if (point) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#22c55e";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      
      // Label scale
      if (scaleEnd) {
        const midX = (scaleStart.x + scaleEnd.x) / 2;
        const midY = (scaleStart.y + scaleEnd.y) / 2;
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`${scaleLengthFeet} ft`, midX + 10, midY - 10);
      }
    }

    // Draw slope line
    if (slopeStart) {
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(slopeStart.x, slopeStart.y);
      ctx.lineTo(
        slopeEnd?.x || slopeStart.x,
        slopeEnd?.y || slopeStart.y
      );
      ctx.stroke();
      ctx.setLineDash([]);

      [slopeStart, slopeEnd].forEach((point) => {
        if (point) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#f59e0b";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }
  }, [imageObj, perimeterPoints, scaleStart, scaleEnd, scaleLengthFeet, slopeStart, slopeEnd, activeTool, canvasSize.width, canvasSize.height]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);
    
    if (activeTool === "perimeter") {
      addPerimeterPoint(point);
    } else if (activeTool === "scale") {
      if (!scaleStart) {
        setScaleStart(point);
      } else if (!scaleEnd) {
        setScaleEnd(point);
        setActiveTool(null);
        setShowScaleInput(true);
      }
    } else if (activeTool === "slope") {
      if (!slopeStart) {
        setSlopeStart(point);
      } else if (!slopeEnd) {
        setSlopeEnd(point);
        setActiveTool(null);
      }
    }
  };

  const handleUndo = () => {
    if (activeTool === "perimeter") {
      clearPerimeter();
    } else if (activeTool === "scale") {
      if (scaleEnd) {
        setScaleEnd(null);
      } else if (scaleStart) {
        setScaleStart(null);
      }
    } else if (activeTool === "slope") {
      if (slopeEnd) {
        setSlopeEnd(null);
      } else if (slopeStart) {
        setSlopeStart(null);
      }
    }
  };

  const handleClear = () => {
    if (activeTool === "perimeter") {
      clearPerimeter();
    } else if (activeTool === "scale") {
      setScaleStart(null);
      setScaleEnd(null);
    } else if (activeTool === "slope") {
      setSlopeStart(null);
      setSlopeEnd(null);
    }
  };

  const handleScaleSubmit = () => {
    const length = parseFloat(tempScaleLength);
    if (length > 0) {
      setScaleLength(length);
    }
    setShowScaleInput(false);
  };

  // Calculate measurements
  const scalePixels = scaleStart && scaleEnd ? calculateDistance(scaleStart, scaleEnd) : 0;
  const slopePixels = slopeStart && slopeEnd ? calculateDistance(slopeStart, slopeEnd) : 0;
  
  // Calculate area using Shoelace formula
  const areaPixels = calculateShoelaceArea(perimeterPoints);
  
  // Convert to real-world square feet
  // If scale line is 100 pixels = 10 feet, then scale factor = 10/100 = 0.1 feet per pixel
  // Area conversion: (area in pixels) × (scale factor)² = area in sq ft
  const scaleFeetPerPixel = scalePixels > 0 ? scaleLengthFeet / scalePixels : 0;
  const areaSqFt = scaleFeetPerPixel > 0 && perimeterPoints.length >= 3
    ? areaPixels * (scaleFeetPerPixel * scaleFeetPerPixel)
    : 0;
  
  // Calculate slope run in feet
  const slopeRunFeet = scaleFeetPerPixel > 0 && slopePixels > 0
    ? slopePixels * scaleFeetPerPixel
    : 0;
  
  // Calculate grade percentage
  const grade = slopeRunFeet > 0 && slopeRiseInches > 0
    ? ((slopeRiseInches / 12) / slopeRunFeet) * 100
    : 0;

  // Material estimates
  // Asphalt: typically 112 lbs/sq ft per inch of thickness
  // For 3" thickness: area × 3 × 112 / 2000 = tons
  const asphaltTons = areaSqFt > 0 ? (areaSqFt * 3 * 112) / 2000 : 0;
  
  // Concrete: typically 0.0025 cubic yards per sq ft per inch
  // For 4" thickness: area × 4 × 0.0025 = cubic yards
  const concreteYards = areaSqFt > 0 ? areaSqFt * 4 * 0.0025 : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1" ref={containerRef}>
        <div className="canvas-container p-4">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleClick}
            className={cn(
              "cursor-crosshair rounded-lg",
              activeTool && "ring-2 ring-primary"
            )}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={activeTool === "perimeter" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool(activeTool === "perimeter" ? null : "perimeter")}
            className={cn(activeTool === "perimeter" && "tool-active")}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Draw Perimeter
          </Button>
          <Button
            variant={activeTool === "scale" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTool(activeTool === "scale" ? null : "scale");
              if (scaleStart && scaleEnd) {
                setScaleStart(null);
                setScaleEnd(null);
              }
            }}
            className={cn(activeTool === "scale" && "tool-active")}
          >
            <Ruler className="w-4 h-4 mr-2" />
            {scaleStart && scaleEnd ? "Reset Scale" : "Set Scale"}
          </Button>
          <Button
            variant={activeTool === "slope" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool(activeTool === "slope" ? null : "slope")}
            className={cn(activeTool === "slope" && "tool-active")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Draw Slope
          </Button>
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
      
      {/* Results Sidebar */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Measurements
          </h3>
          
          <div className="space-y-4">
            <div className="p-3 rounded bg-background">
              <div className="text-sm text-muted-foreground mb-1">Area</div>
              <div className="text-3xl font-bold">
                {areaSqFt.toFixed(1)} 
                <span className="text-sm text-muted-foreground ml-1">sq ft</span>
              </div>
              {perimeterPoints.length < 3 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Draw at least 3 points for area
                </div>
              )}
            </div>
            
            <div className="p-3 rounded bg-background">
              <div className="text-sm text-muted-foreground mb-1">Grade / Slope</div>
              <div className="text-3xl font-bold">
                {grade.toFixed(2)}%
                <span className="ml-2 text-lg">{grade !== 0 && getGradeEmoji(grade)}</span>
              </div>
              {slopeRiseInches === 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Enter rise to calculate grade
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Material Estimates</div>
            <div className="text-sm space-y-2">
              <div className="p-2 rounded bg-background">
                <div className="text-xs text-muted-foreground">Asphalt (3" thick)</div>
                <div className="font-semibold">{asphaltTons.toFixed(2)} tons</div>
              </div>
              <div className="p-2 rounded bg-background">
                <div className="text-xs text-muted-foreground">Concrete (4" thick)</div>
                <div className="font-semibold">{concreteYards.toFixed(2)} yd³</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Scale Reference</div>
            {scalePixels > 0 ? (
              <div className="p-2 rounded bg-background">
                <div className="text-sm">
                  <span className="font-semibold">{scaleLengthFeet} ft</span> = {scalePixels.toFixed(0)} pixels
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Scale: {scaleFeetPerPixel.toFixed(4)} ft/pixel
                </div>
              </div>
            ) : (
              <div className="text-sm">
                Not set - use "Set Scale" tool
              </div>
            )}
          </div>
          
          {/* Scale length input */}
          {showScaleInput && (
            <div className="mt-4 p-3 rounded bg-background border">
              <label className="text-sm font-medium block mb-2">
                Enter scale length (feet):
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tempScaleLength}
                  onChange={(e) => setTempScaleLength(e.target.value)}
                  className="flex-1"
                  step="0.1"
                />
                <Button onClick={handleScaleSubmit} size="sm">
                  Set
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This is the real-world distance between your two scale points
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4 rounded-lg border bg-card text-xs text-muted-foreground">
          <strong>⚠️ Accuracy Tips:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Set scale using a known distance in photo</li>
            <li>Take photos from directly above for best accuracy</li>
            <li>Use longer scale references for better precision</li>
            <li>Verify critical measurements on-site</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
