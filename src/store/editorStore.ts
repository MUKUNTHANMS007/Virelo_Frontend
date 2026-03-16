import { create } from 'zustand';
import { temporal } from 'zundo';

export interface KeyframeData {
  id: string;
  type?: 'default' | 'model' | 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'icosahedron' | 'capsule' | 'human' | 'car' | 'sun';
  url?: string;
  color?: string;
  subTransforms?: Record<string, {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }>;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export type TransformMode = 'translate' | 'rotate' | 'scale' | 'sculpt' | 'subTransform';

interface EditorState {
  keyframes: KeyframeData[];
  selectedId: string | null;
  transformMode: TransformMode;
  showGrid: boolean;
  addKeyframe: (kf: KeyframeData) => void;
  updateKeyframe: (id: string, updates: Partial<KeyframeData>) => void;
  removeKeyframe: (id: string) => void;
  duplicateKeyframe: (id: string) => void;
  clearKeyframes: () => void;
  randomizeScene: () => void;
  setKeyframes: (kfs: KeyframeData[]) => void;
  setSelectedId: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;
  setShowGrid: (show: boolean) => void;
}

export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      keyframes: [
        {
          id: 'default-kf-1',
          type: 'default',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        }
      ],
      selectedId: null,
      transformMode: 'translate',
      showGrid: true,
      
      addKeyframe: (kf) => set((state) => ({ keyframes: [...state.keyframes, kf] })),
      
      updateKeyframe: (id, updates) => set((state) => ({
        keyframes: state.keyframes.map((kf) => 
          kf.id === id ? { ...kf, ...updates } : kf
        )
      })),

      removeKeyframe: (id) => set((state) => ({
        keyframes: state.keyframes.filter((kf) => kf.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId
      })),

      duplicateKeyframe: (id) => set((state) => {
        const original = state.keyframes.find(kf => kf.id === id);
        if (!original) return state;
        
        const newKf: KeyframeData = {
          ...original,
          id: `${original.type || 'obj'}-${Date.now()}`,
          position: [original.position[0] + 0.5, original.position[1], original.position[2] + 0.5], // Offset slightly
        };
        
        return {
          keyframes: [...state.keyframes, newKf],
          selectedId: newKf.id
        };
      }),

      clearKeyframes: () => set({ keyframes: [], selectedId: null }),

      randomizeScene: () => set((state) => {
        const types: KeyframeData['type'][] = ['cube', 'sphere', 'cylinder', 'cone', 'torus', 'plane', 'icosahedron', 'capsule'];
        const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
        const newKfs: KeyframeData[] = Array.from({ length: 5 }).map((_, i) => ({
          id: `random-${Date.now()}-${i}`,
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          position: [(Math.random() - 0.5) * 10, Math.random() * 5, (Math.random() - 0.5) * 10],
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          scale: [0.5 + Math.random(), 0.5 + Math.random(), 0.5 + Math.random()],
        }));
        return { keyframes: [...state.keyframes, ...newKfs] };
      }),
      
      setKeyframes: (kfs) => set({ keyframes: kfs }),

      setSelectedId: (id) => set({ selectedId: id }),
      setTransformMode: (mode) => set({ transformMode: mode }),
      setShowGrid: (show) => set({ showGrid: show }),
    }),
    {
      partialize: (state) => ({ keyframes: state.keyframes }),
      limit: 100,
    }
  )
);
