"use client";

import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useMeasurementStore, Point } from "@/store/useMeasurementStore";
import { cn, calculateShoelaceArea, calculateDistance, getGradeEmoji } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Ruler, TrendingUp, Trash2, Undo } from "lucide-react";

interface MeasurementCanvasProps {
  image: string;
}

export function MeasurementCanvas({ image }: MeasurementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isDrawing, setIsDrawing] = useState(false);
  
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
    setSlopeStart,
    setSlopeEnd,
  } = useMeasurementStore();

  // Load image and fit to container
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      setImageObj(img);
      
      // Wait for container to be available
      setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          const maxWidth = window.innerWidth - 320;
          const maxHeight = window.innerHeight - 200;
          const ratio = Math.min(
            maxWidth / img.width,
            maxHeight / img.height,
            1
          );
          setCanvasSize({
            width: img.width * ratio,
            height: img.height * ratio,
          });
        }
      }, 100);
    };
  }, [image]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

    // Draw perimeter polygon
    if (perimeterPoints.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(perimeterPoints[0].x, perimeterPoints[0].y);
      perimeterPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      perimeterPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
      });
    }

    // Draw scale line
    if (scaleStart) {
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
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
          ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#22c55e";
          ctx.fill();
        }
      });
    }

    // Draw slope line
    if (slopeStart) {
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
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
          ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#f59e0b";
          ctx.fill();
        }
      });
    }
  }, [imageObj, perimeterPoints, scaleStart, scaleEnd, slopeStart, slopeEnd, canvasSize]);

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
    if (isDrawing) return;
    
    const point = getCanvasCoordinates(e);
    
    if (activeTool === "perimeter") {
      addPerimeterPoint(point);
    } else if (activeTool === "scale") {
      if (!scaleStart) {
        setScaleStart(point);
      } else if (!scaleEnd) {
        setScaleEnd(point);
        setActiveTool(null);
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

  // Calculate measurements
  const scalePixels = scaleStart && scaleEnd ? calculateDistance(scaleStart, scaleEnd) : 0;
  const slopePixels = slopeStart && slopeEnd ? calculateDistance(slopeStart, slopeEnd) : 0;
  
  const areaPixels = calculateShoelaceArea(perimeterPoints);
  const areaSqFt = scalePixels > 0 && perimeterPoints.length >= 3
    ? (areaPixels / (scalePixels * scalePixels)) * (scaleLengthFeet * scaleLengthFeet)
    : 0;
  
  const slopeRunFeet = scalePixels > 0 && slopePixels > 0
    ? (slopePixels / scalePixels) * scaleLengthFeet
    : 0;
  
  const grade = slopeRunFeet > 0 && slopeRiseInches > 0
    ? ((slopeRiseInches / 12) / slopeRunFeet) * 100
    : 0;

  // Material estimates
  const asphaltTons = areaSqFt > 0 ? (areaSqFt * 0.25 * 150) / 2000 : 0;
  const concreteYards = areaSqFt > 0 ? (areaSqFt * 0.33) / 27 : 0;

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
            onClick={() => setActiveTool(activeTool === "scale" ? null : "scale")}
            className={cn(activeTool === "scale" && "tool-active")}
          >
            <Ruler className="w-4 h-4 mr-2" />
            Set Scale
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
      <div className="w-full lg:w-72 space-y-4">
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="font-semibold mb-3">Measurements</h3>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Area</div>
              <div className="text-2xl font-bold">
                {areaSqFt.toFixed(1)} <span className="text-sm">sq ft</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Grade</div>
              <div className="text-2xl font-bold">
                {grade.toFixed(2)}%
                <span className="ml-2">{grade !== 0 && getGradeEmoji(grade)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Material Estimates</div>
            <div className="text-sm space-y-1">
              <div>Asphalt (3&quot;): <strong>{asphaltTons.toFixed(2)} tons</strong></div>
              <div>Concrete (4&quot;): <strong>{concreteYards.toFixed(2)} yd³</strong></div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Scale Reference</div>
            <div className="text-sm">
              {scalePixels > 0 ? `${scaleLengthFeet} ft` : "Not set"}
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border bg-card text-xs text-muted-foreground">
          <strong>⚠️ Disclaimer:</strong> Photo-based estimates only. Verify with physical tools on-site for accuracy.
        </div>
      </div>
    </div>
  );
}
