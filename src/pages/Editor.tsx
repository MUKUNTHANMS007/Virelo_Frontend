import React, { useRef, useEffect } from 'react';
import { Leva, useControls } from 'leva';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { KeyboardShortcuts } from '../components/editor/KeyboardShortcuts';
import { useEditorStore } from '../store/editorStore';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import {
  Layers, MousePointer2, Move, Rotate3D, Scaling, Download, Box, Circle,
  Cylinder, ArrowUpRight, Eraser, Save, CheckCircle, Loader2, FolderOpen
} from 'lucide-react';

export default function Editor() {
  const transformMode = useEditorStore((state) => state.transformMode);
  const setTransformMode = useEditorStore((state) => state.setTransformMode);
  const keyframes = useEditorStore((state) => state.keyframes);
  const selectedId = useEditorStore((state) => state.selectedId);
  const addKeyframe = useEditorStore((state) => state.addKeyframe);

  const { saveProject, scheduleAutoSave, isSaving, lastSaved, activeProjectName, setProjectName } = useProjectStore();
  const { isAuthenticated } = useAuthStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Schedule auto-save whenever keyframes change
  useEffect(() => {
    if (isAuthenticated) {
      scheduleAutoSave();
    }
  }, [keyframes, isAuthenticated, scheduleAutoSave]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    addKeyframe({
      id: `model-${Date.now()}`,
      type: 'model',
      url,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    });

    e.target.value = '';
  };

  // Leva controls
  useControls('AI Properties', {
    temporalSmoothness: { value: 0.8, min: 0, max: 1, step: 0.01 },
    frameDensity: { value: 24, min: 12, max: 60, step: 1 },
    promptStrength: { value: 7.5, min: 1, max: 20, step: 0.1 },
    interpolation: { options: ['linear', 'bezier', 'step'] }
  });

  const sunControls = useControls('Sun Settings', {
    sunPosition: { value: [5, 10, 5], step: 1 },
    sunIntensity: { value: 1.5, min: 0, max: 10, step: 0.1 },
    sunColor: { value: '#ffffff' },
  });

  const handleSpawnShape = (shapeType: 'cube' | 'sphere' | 'cylinder') => {
    addKeyframe({
      id: `${shapeType}-${Date.now()}`,
      type: shapeType,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    });
  };

  const handleExport = () => {
    window.dispatchEvent(new Event('export-scene'));
  };

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const diff = Math.round((Date.now() - lastSaved.getTime()) / 1000);
    if (diff < 60) return 'Saved just now';
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    return `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-neutral-50 text-neutral-900 overflow-hidden text-sm select-none font-sans flex flex-col pt-16 z-50">
      
      {/* Top Header Panel */}
      <div className="absolute top-16 left-0 right-0 h-14 bg-white/70 backdrop-blur-xl border-b border-neutral-200/50 flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          
          {/* Import Button */}
          <div className="flex items-center">
            <input 
              type="file" 
              accept=".glb,.gltf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange} 
            />
            <button 
              onClick={handleImportClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg shadow-sm hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium text-neutral-700"
            >
              <Download className="w-4 h-4" />
              Import Model
            </button>
          </div>

          <div className="h-6 w-px bg-neutral-200" />

          {/* Primitive Shapes */}
          <div className="flex gap-1 bg-white p-1 rounded-lg border border-neutral-200 shadow-sm">
            <button onClick={() => handleSpawnShape('cube')} className="px-2 py-1.5 rounded-md text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1 font-medium" title="Add Cube">
              <Box className="w-4 h-4" />
            </button>
            <button onClick={() => handleSpawnShape('sphere')} className="px-2 py-1.5 rounded-md text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1 font-medium" title="Add Sphere">
              <Circle className="w-4 h-4" />
            </button>
            <button onClick={() => handleSpawnShape('cylinder')} className="px-2 py-1.5 rounded-md text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1 font-medium" title="Add Cylinder">
              <Cylinder className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-neutral-200" />

          {/* Gizmo Tools */}
          <div className="flex gap-1 bg-neutral-100/80 p-1 rounded-lg border border-neutral-200/50">
            <button onClick={() => setTransformMode('translate')} className={`p-2 rounded-md transition-all ${transformMode === 'translate' ? 'bg-white shadow-sm text-indigo-600 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5 border border-transparent'}`} title="Translate (G)">
              <Move className="w-4 h-4" />
            </button>
            <button onClick={() => setTransformMode('rotate')} className={`p-2 rounded-md transition-all ${transformMode === 'rotate' ? 'bg-white shadow-sm text-indigo-600 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5 border border-transparent'}`} title="Rotate (R)">
              <Rotate3D className="w-4 h-4" />
            </button>
            <button onClick={() => setTransformMode('scale')} className={`p-2 rounded-md transition-all ${transformMode === 'scale' ? 'bg-white shadow-sm text-indigo-600 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5 border border-transparent'}`} title="Scale (S)">
              <Scaling className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-neutral-200/50 mx-1 self-center" />
            <button onClick={() => setTransformMode('sculpt')} className={`p-2 rounded-md transition-all ${transformMode === 'sculpt' ? 'bg-white shadow-sm text-indigo-600 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5 border border-transparent'}`} title="Sculpt / Bulge">
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-neutral-200" />
          
          {/* Export Button */}
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white border border-indigo-700 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium"
          >
            <ArrowUpRight className="w-4 h-4" />
            Export Scene
          </button>

          <span className="text-neutral-400 flex items-center gap-2 ml-2">
            <MousePointer2 className="w-4 h-4" />
            Left-click: Select | Right-click: Orbit
          </span>
        </div>

        {/* Right side: Project Name + Save */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Editable project name */}
              <input
                type="text"
                value={activeProjectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="px-3 py-1.5 text-sm font-medium bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-40 text-neutral-700"
              />

              {/* Last saved indicator */}
              {lastSaved && !isSaving && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {formatLastSaved()}
                </span>
              )}

              {/* Save Now button */}
              <button
                onClick={() => saveProject()}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60 text-xs"
              >
                {isSaving ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-3.5 h-3.5" /> Save Now</>
                )}
              </button>
            </>
          ) : (
            <span className="flex items-center gap-2 text-xs text-neutral-400 px-3 py-1.5 bg-neutral-50 rounded-lg border border-neutral-200">
              <FolderOpen className="w-3.5 h-3.5" />
              Sign in to save projects
            </span>
          )}
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 relative w-full h-full mt-12">
        {/* Left Panel - Outliner */}
        <div className="absolute top-4 left-4 w-64 bg-white/70 backdrop-blur-2xl border border-neutral-200/50 rounded-xl p-4 flex flex-col gap-4 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-700 font-medium pb-2 border-b border-neutral-200/50">
            <Layers className="w-4 h-4" />
            Outliner
          </div>
          <div className="flex flex-col gap-1">
            {keyframes.map((kf, i) => (
              <div 
                key={kf.id}
                onClick={() => useEditorStore.getState().setSelectedId(kf.id)}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedId === kf.id ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-neutral-100 text-neutral-600 border border-transparent'}`}
              >
                {kf.type === 'model' ? 'Imported Model' : kf.type ? kf.type.charAt(0).toUpperCase() + kf.type.slice(1) : `Keyframe ${i + 1}`}
              </div>
            ))}
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full">
          <EditorCanvas 
            sunPosition={sunControls.sunPosition}
            sunIntensity={sunControls.sunIntensity}
            sunColor={sunControls.sunColor}
          />
        </div>

        {/* Right Panel - Leva */}
        <div className="absolute top-4 right-4 z-10 custom-leva-wrapper">
          <Leva 
            theme={{
              colors: {
                elevation1: 'rgba(255,255,255,0.7)',
                elevation2: 'rgba(0,0,0,0.05)',
                elevation3: 'rgba(0,0,0,0.1)',
                accent1: '#6366f1',
                accent2: '#4f46e5',
                accent3: '#818cf8',
                highlight1: '#171717',
                highlight2: '#525252',
                highlight3: '#737373',
                vivid1: '#ffcc00',
              },
              space: { sm: '6px', md: '10px', rowGap: '6px', colGap: '6px' },
              borderWidths: { folder: '1px', root: '1px' },
              radii: { xs: '4px', sm: '6px', lg: '12px' }
            }}
            hideCopyButton
            titleBar={{ title: 'Properties' }}
          />
        </div>
      </div>

      <KeyboardShortcuts />
    </div>
  );
}
