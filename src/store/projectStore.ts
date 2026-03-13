import { create } from 'zustand';
import { api } from '../lib/api';
import { useEditorStore } from './editorStore';
import { useAuthStore } from './authStore';

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
  lastSaved: Date | null;
  error: string | null;
  autoSaveTimer: ReturnType<typeof setTimeout> | null;

  createProject: (name: string) => Promise<boolean>;
  saveProject: () => Promise<boolean>;
  loadProject: (project: Project) => void;
  listProjects: () => Promise<void>;
  scheduleAutoSave: () => void;
  setProjectName: (name: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProjectId: null,
  activeProjectName: 'Untitled Scene',
  isSaving: false,
  lastSaved: null,
  error: null,
  autoSaveTimer: null,

  setProjectName: (name) => set({ activeProjectName: name }),

  createProject: async (name) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    const editorState = useEditorStore.getState();

    const res = await api<Project>('/projects', {
      method: 'POST',
      token,
      body: {
        name,
        sceneData: {
          keyframes: editorState.keyframes,
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

    const res = await api<Project>(`/projects/${activeProjectId}`, {
      method: 'PUT',
      token,
      body: {
        name: activeProjectName,
        sceneData: {
          keyframes: editorState.keyframes,
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
    // Reset and reload keyframes
    const keyframes = (sceneData as { keyframes?: ReturnType<typeof useEditorStore.getState>['keyframes'] }).keyframes ?? [];
    // Clear existing and add saved keyframes
    keyframes.forEach((kf: ReturnType<typeof useEditorStore.getState>['keyframes'][number]) => {
      store.addKeyframe(kf);
    });

    set({
      activeProjectId: project._id,
      activeProjectName: project.name,
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
}));
