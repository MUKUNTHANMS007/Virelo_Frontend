import { create } from 'zustand';
import { api } from '../lib/api';
import { useEditorStore } from './editorStore';
import { useAuthStore } from './authStore';
import { captureToSketch } from '../lib/sketchUtils';

interface Project {
  _id: string;
  name: string;
  sceneData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  activeProjectName: string;
  isSaving: boolean;
  isGenerating: boolean;
  generationStatus: string;
  lastSaved: Date | null;
  error: string | null;
  resultUrl: string | null;
  psdUrl: string | null;
  referenceSheetUrl: string | null;
  trainingProgress: number;
  activeResult: {
    id?: string;
    videoUrl: string;
    psdUrl: string | null;
    title: string;
    type: 'generation' | 'transition';
    fidelity?: 'high' | 'standard';
    status?: 'pending' | 'processing' | 'completed' | 'failed';
  } | null;
  autoSaveTimer: ReturnType<typeof setTimeout> | null;

  createProject: (name: string) => Promise<boolean>;
  saveProject: () => Promise<boolean>;
  loadProject: (project: any) => void;
  listProjects: () => Promise<void>;
  scheduleAutoSave: () => void;
  setProjectName: (name: string) => void;
  generateAnimation: () => Promise<boolean>;
  trainModel: () => Promise<void>;
  
  sequence: string[];
  setSequence: (sequence: string[]) => void;
  setActiveResult: (result: ProjectState['activeResult']) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProjectId: null,
  activeProjectName: 'Untitled Scene',
  isSaving: false,
  isGenerating: false,
  generationStatus: '',
  lastSaved: null,
  error: null,
  resultUrl: null,
  psdUrl: null,
  referenceSheetUrl: null,
  trainingProgress: 0,
  activeResult: null,
  autoSaveTimer: null,
  sequence: [],

  setSequence: (sequence) => set({ sequence }),
  setActiveResult: (activeResult) => set({ activeResult }),
  setProjectName: (name) => set({ activeProjectName: name }),

  trainModel: async () => {
    const { activeProjectId } = get();
    const token = useAuthStore.getState().token;
    if (!activeProjectId || !token) return;

    set({ trainingProgress: 0 });
    
    // Simulate training progress for UX while calling backend
    const progressPromise = new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 2;
        if (progress >= 95) {
          progress = 95;
          clearInterval(interval);
          resolve();
        }
        set({ trainingProgress: progress });
      }, 500);
    });

    try {
      // Parallel: Simulate UI progress AND trigger backend personalization
      await Promise.all([
        progressPromise,
        api(`/projects/${activeProjectId}/train`, { method: 'POST', token })
      ]);
      set({ trainingProgress: 100 });
      setTimeout(() => set({ trainingProgress: 0 }), 1000);
    } catch (err) {
      console.error('Training Error:', err);
      set({ trainingProgress: 0, error: 'Character personalization failed.' });
    }
  },

  createProject: async (name) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    const editorState = useEditorStore.getState();
    const sketchData = await captureToSketch();

    const res = await api<Project>('/projects', {
      method: 'POST',
      token,
      body: {
        name,
        sketchData,
        sceneData: {
          keyframes: editorState.keyframes,
          sequence: get().sequence,
          sunPosition: [5, 10, 5],
          sunIntensity: 1.5,
          sunColor: '#ffffff',
        },
      },
    });

    if (res.success && res.data) {
      set({
        activeProjectId: res.data._id,
        activeProjectName: name,
        lastSaved: new Date(),
      });
      return true;
    }
    set({ error: res.error || 'Failed to create project' });
    return false;
  },

  saveProject: async () => {
    const { activeProjectId, activeProjectName } = get();
    const token = useAuthStore.getState().token;
    if (!token) return false;

    const editorState = useEditorStore.getState();

    // If no active project, create one
    if (!activeProjectId) {
      return get().createProject(activeProjectName);
    }

    set({ isSaving: true, error: null });

    const sketchData = await captureToSketch();

    const res = await api<Project>(`/projects/${activeProjectId}`, {
      method: 'PUT',
      token,
      body: {
        name: activeProjectName,
        sketchData,
        sceneData: {
          keyframes: editorState.keyframes,
          sequence: get().sequence,
          sunPosition: [5, 10, 5],
          sunIntensity: 1.5,
          sunColor: '#ffffff',
        },
      },
    });

    if (res.success && res.data) {
      set({ isSaving: false, lastSaved: new Date() });
      return true;
    }

    set({ isSaving: false, error: res.error || 'Save failed' });
    return false;
  },

  loadProject: (project) => {
    const sceneData = project.sceneData as {
      keyframes?: Parameters<typeof useEditorStore.getState>['length'] extends 0
        ? ReturnType<typeof useEditorStore.getState>['keyframes']
        : never;
    };

    // Hydrate editor store with the project's keyframes
    const store = useEditorStore.getState();
    const keyframes = (sceneData as { keyframes?: ReturnType<typeof useEditorStore.getState>['keyframes'] }).keyframes ?? [];
    store.setKeyframes(keyframes);

    set({
      activeProjectId: project._id,
      activeProjectName: project.name,
      sequence: (sceneData as { sequence?: string[] }).sequence ?? [],
      lastSaved: new Date(project.updatedAt),
    });
  },

  listProjects: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const res = await api<Project[]>('/projects', { token });
    if (res.success && res.data) {
      set({ projects: res.data });
    }
  },

  scheduleAutoSave: () => {
    const existing = get().autoSaveTimer;
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      const { activeProjectId } = get();
      if (activeProjectId && useAuthStore.getState().isAuthenticated) {
        get().saveProject();
      }
    }, 30000); // 30 second debounce

    set({ autoSaveTimer: timer });
  },

  generateAnimation: async () => {
    const { activeProjectId } = get();
    const token = useAuthStore.getState().token;
    
    if (!token || !activeProjectId) {
      set({ error: 'Please save your scene before generating an animation.' });
      return false;
    }

    set({ isGenerating: true, generationStatus: 'Saving current scene...', error: null, resultUrl: null, psdUrl: null });
    
    // Ensure the latest changes are saved including reference material
    const saved = await get().saveProject();
    if (!saved) {
      set({ isGenerating: false, generationStatus: '', error: 'Failed to sync scene before generation.' });
      return false;
    }

    set({ generationStatus: 'Matching Keypoints & Processing via AI...' });

    const res = await api<any>(`/projects/${activeProjectId}/generate`, {
      method: 'POST',
      token,
    });

    if (res.success && res.data) {
      const generationId = res.data._id;
      
      // Set the active result immediately so the UI can navigate to the Result page
      // The Result page will handle the polling and progress bar
      get().setActiveResult({
        id: generationId,
        videoUrl: '', // Will be filled by ResultPage polling
        psdUrl: null,
        title: get().activeProjectName,
        type: 'generation',
        status: 'processing'
      });

      set({ 
        isGenerating: false, 
        generationStatus: '', // Clear overlay since we are navigating
      });

      return true;
    }

    set({ isGenerating: false, generationStatus: '', error: res.error || 'AI request failed.' });
    return false;
  },
}));
