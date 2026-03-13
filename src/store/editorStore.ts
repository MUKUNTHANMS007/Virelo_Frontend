import { create } from 'zustand';

export interface KeyframeData {
  id: string;
  type?: 'default' | 'model' | 'cube' | 'sphere' | 'cylinder';
  url?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export type TransformMode = 'translate' | 'rotate' | 'scale' | 'sculpt';

interface EditorState {
  keyframes: KeyframeData[];
  selectedId: string | null;
  transformMode: TransformMode;
  addKeyframe: (kf: KeyframeData) => void;
  updateKeyframe: (id: string, updates: Partial<KeyframeData>) => void;
  removeKeyframe: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
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

  setSelectedId: (id) => set({ selectedId: id }),
  setTransformMode: (mode) => set({ transformMode: mode }),
}));
