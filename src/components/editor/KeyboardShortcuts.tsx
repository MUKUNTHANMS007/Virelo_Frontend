import { useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useProjectStore } from '../../store/projectStore';

export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field (like leva panel)
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          useEditorStore.temporal.getState().redo();
        } else {
          useEditorStore.temporal.getState().undo();
        }
        e.preventDefault();
        return;
      }

      if (cmdOrCtrl && e.key.toLowerCase() === 'y') {
        useEditorStore.temporal.getState().redo();
        e.preventDefault();
        return;
      }

      const selectedId = useEditorStore.getState().selectedId;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        useEditorStore.getState().removeKeyframe(selectedId);
        const sequence = useProjectStore.getState().sequence;
        useProjectStore.getState().setSequence(sequence.filter(id => id !== selectedId));
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'g':
          useEditorStore.getState().setTransformMode('translate');
          break;
        case 'r':
          useEditorStore.getState().setTransformMode('rotate');
          break;
        case 's':
          useEditorStore.getState().setTransformMode('scale');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
