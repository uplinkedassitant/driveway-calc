import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToolType = 'perimeter' | 'scale' | 'slope' | null;

export interface Point {
  x: number;
  y: number;
}

export interface MeasurementJob {
  id: string;
  name: string;
  image: string;
  perimeterPoints: Point[];
  scaleStart: Point | null;
  scaleEnd: Point | null;
  scaleLengthFeet: number;
  slopeStart: Point | null;
  slopeEnd: Point | null;
  slopeRiseInches: number;
  createdAt: number;
}

interface MeasurementState {
  currentJob: MeasurementJob | null;
  activeTool: ToolType;
  perimeterPoints: Point[];
  scaleStart: Point | null;
  scaleEnd: Point | null;
  scaleLengthFeet: number;
  slopeStart: Point | null;
  slopeEnd: Point | null;
  slopeRiseInches: number;
  savedJobs: MeasurementJob[];
  
  setCurrentJob: (job: MeasurementJob | null) => void;
  setActiveTool: (tool: ToolType) => void;
  addPerimeterPoint: (point: Point) => void;
  clearPerimeter: () => void;
  setScaleStart: (point: Point | null) => void;
  setScaleEnd: (point: Point | null) => void;
  setScaleLength: (length: number) => void;
  setSlopeStart: (point: Point | null) => void;
  setSlopeEnd: (point: Point | null) => void;
  setSlopeRise: (rise: number) => void;
  clearAll: () => void;
  saveJob: () => void;
  deleteJob: (id: string) => void;
  loadJob: (job: MeasurementJob) => void;
}

export const useMeasurementStore = create<MeasurementState>()(
  persist(
    (set, get) => ({
      currentJob: null,
      activeTool: null,
      perimeterPoints: [],
      scaleStart: null,
      scaleEnd: null,
      scaleLengthFeet: 10,
      slopeStart: null,
      slopeEnd: null,
      slopeRiseInches: 0,
      savedJobs: [],
      
      setCurrentJob: (job) => set({ currentJob: job }),
      setActiveTool: (tool) => set({ activeTool: tool }),
      addPerimeterPoint: (point) => set((state) => ({ 
        perimeterPoints: [...state.perimeterPoints, point] 
      })),
      clearPerimeter: () => set({ perimeterPoints: [] }),
      setScaleStart: (point) => set({ scaleStart: point }),
      setScaleEnd: (point) => set({ scaleEnd: point }),
      setScaleLength: (length) => set({ scaleLengthFeet: length }),
      setSlopeStart: (point) => set({ slopeStart: point }),
      setSlopeEnd: (point) => set({ slopeEnd: point }),
      setSlopeRise: (rise) => set({ slopeRiseInches: rise }),
      
      clearAll: () => set({
        perimeterPoints: [],
        scaleStart: null,
        scaleEnd: null,
        slopeStart: null,
        slopeEnd: null,
      }),
      
      saveJob: () => {
        const state = get();
        if (!state.currentJob) return;
        
        const job: MeasurementJob = {
          ...state.currentJob,
          perimeterPoints: state.perimeterPoints,
          scaleStart: state.scaleStart,
          scaleEnd: state.scaleEnd,
          scaleLengthFeet: state.scaleLengthFeet,
          slopeStart: state.slopeStart,
          slopeEnd: state.slopeEnd,
          slopeRiseInches: state.slopeRiseInches,
        };
        
        set((state) => ({
          savedJobs: [...state.savedJobs.filter(j => j.id !== job.id), job],
          currentJob: job,
        }));
      },
      
      deleteJob: (id) => set((state) => ({
        savedJobs: state.savedJobs.filter(job => job.id !== id),
      })),
      
      loadJob: (job) => set({
        currentJob: job,
        perimeterPoints: job.perimeterPoints,
        scaleStart: job.scaleStart,
        scaleEnd: job.scaleEnd,
        scaleLengthFeet: job.scaleLengthFeet,
        slopeStart: job.slopeStart,
        slopeEnd: job.slopeEnd,
        slopeRiseInches: job.slopeRiseInches,
      }),
    }),
    {
      name: 'driveway-calc-storage',
      partialize: (state) => ({
        savedJobs: state.savedJobs,
        scaleLengthFeet: state.scaleLengthFeet,
        slopeRiseInches: state.slopeRiseInches,
      }),
    }
  )
);
