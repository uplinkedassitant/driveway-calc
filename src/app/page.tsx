"use client";

import React, { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { MeasurementCanvas } from "@/components/MeasurementCanvas";
import { ARMeasure } from "@/components/ARMeasure";
import { useMeasurementStore } from "@/store/useMeasurementStore";
import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const { savedJobs, saveJob, deleteJob, loadJob } = useMeasurementStore();

  const handleImageSelect = (imageData: string) => {
    setImage(imageData);
  };

  const handleSave = () => {
    const name = prompt("Enter job name:");
    if (name) {
      saveJob();
    }
  };

  const handleARMeasurement = (distanceFeet: number) => {
    // AR measurement complete
    // Could create image from AR capture or use existing workflow
    setShowAR(false);
    // For now, just show success message
    alert(`Measured: ${distanceFeet.toFixed(2)} feet`);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">DrivewayCalc</h1>
            <p className="text-sm text-muted-foreground">Job Site Measurement Tool</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
            >
              <FileText className="w-4 h-4 mr-2" />
              {showHistory ? "Hide History" : "History"}
            </Button>
            {image && (
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {!image ? (
          <ImageUploader 
            onImageSelect={handleImageSelect}
            onARMode={() => setShowAR(true)}
          />
        ) : (
          <div>
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => {
                  setImage(null);
                  useMeasurementStore.getState().clearAll();
                }}
              >
                ← New Job
              </Button>
            </div>
            <MeasurementCanvas image={image} />
          </div>
        )}

        {/* AR Measure Modal */}
        {showAR && (
          <ARMeasure 
            onMeasurement={(distance) => {
              handleARMeasurement(distance);
            }}
            onCancel={() => setShowAR(false)}
          />
        )}

        {/* Job History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Saved Jobs</h2>
                <Button variant="ghost" onClick={() => setShowHistory(false)}>
                  ✕
                </Button>
              </div>
              
              {savedJobs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No saved jobs yet
                </p>
              ) : (
                <div className="grid gap-4">
                  {savedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-background"
                    >
                      {job.image && (
                        <img
                          src={job.image}
                          alt={job.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{job.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            loadJob(job);
                            setImage(job.image);
                            setShowHistory(false);
                          }}
                        >
                          Load
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
