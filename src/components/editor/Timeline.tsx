import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useProjectStore } from '../../store/projectStore';
import { Film, GripVertical, Plus, Trash2 } from 'lucide-react';

export function Timeline() {
  const { keyframes, selectedId, setSelectedId } = useEditorStore();
  const { sequence, setSequence } = useProjectStore();
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const availableKeyframes = keyframes.filter((kf) => !sequence.includes(kf.id));

  const handleAdd = (id: string) => {
    setSequence([...sequence, id]);
  };

  const handleRemove = (id: string) => {
    setSequence(sequence.filter((seqId) => seqId !== id));
  };

  const onDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    const newSeq = [...sequence];
    const item = newSeq[draggedIdx];
    newSeq.splice(draggedIdx, 1);
    newSeq.splice(idx, 0, item);
    
    setSequence(newSeq);
    setDraggedIdx(idx);
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 h-32 bg-white/80 backdrop-blur-2xl border border-neutral-200/50 rounded-xl flex shadow-sm z-10 overflow-hidden">
      {/* Left Sidebar - Available Models/Poses */}
      <div className="w-56 bg-neutral-50/50 border-r border-neutral-200/50 flex flex-col">
        <div className="px-3 py-2 text-xs font-semibold text-neutral-600 border-b border-neutral-200/50 flex items-center gap-2">
          <Film className="w-3.5 h-3.5" />
          Scene Keyframes
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {availableKeyframes.length === 0 && (
            <div className="text-xs text-neutral-400 p-2 text-center h-full flex items-center justify-center">
              All keyframes are in the sequence.
            </div>
          )}
          {availableKeyframes.map((kf) => (
            <div
              key={kf.id}
              onClick={() => setSelectedId(kf.id)}
              className="flex items-center justify-between p-1.5 pl-2 text-xs bg-white border border-neutral-200/60 rounded cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <span className="truncate pr-2 font-medium text-neutral-600">{kf.type || 'Keyframe'}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(kf.id);
                }}
                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                title="Add to Timeline"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Timeline Sequence */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="px-4 py-2 text-xs font-semibold text-neutral-600 border-b border-neutral-200/50 flex items-center">
          Dope Sheet Sequence ({sequence.length})
        </div>
        <div className="flex-1 flex items-center px-4 gap-2 overflow-x-auto custom-scrollbar">
          {sequence.length === 0 && (
            <div className="text-sm text-neutral-400 animate-pulse">
              Click '+' on a scene keyframe to add it to the timeline.
            </div>
          )}
          {sequence.map((id, idx) => {
            const kf = keyframes.find((k) => k.id === id);
            return (
              <div
                key={id}
                draggable
                onDragStart={(e) => onDragStart(e, idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDragEnd={onDragEnd}
                onClick={() => setSelectedId(id)}
                className={`flex-shrink-0 w-32 h-16 group relative flex items-center p-2 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all ${selectedId === id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
              >
                <GripVertical className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold text-neutral-700 truncate">
                    Frame {idx + 1}
                  </span>
                  <span className="text-[10px] text-neutral-500 truncate">
                    {kf ? (kf.type || 'Object') : 'Missing'}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(id);
                  }}
                  className="absolute top-1 right-1 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
