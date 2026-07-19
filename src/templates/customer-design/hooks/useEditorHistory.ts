import { useCallback, useReducer } from "react";
import type { EditorElement } from "../types";

const MAX_HISTORY = 50;

interface HistoryState {
  present: EditorElement[];
  past: EditorElement[][];
  future: EditorElement[][];
}

type HistoryAction =
  | { type: "PUSH"; payload: EditorElement[] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "REPLACE"; payload: EditorElement[] };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "PUSH": {
      if (JSON.stringify(state.present) === JSON.stringify(action.payload)) {
        return state;
      }
      const past = [...state.past, state.present].slice(-MAX_HISTORY);
      return { present: action.payload, past, future: [] };
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const past = state.past.slice(0, -1);
      return { present: previous, past, future: [state.present, ...state.future] };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const future = state.future.slice(1);
      return { present: next, past: [...state.past, state.present], future };
    }
    case "REPLACE":
      return { present: action.payload, past: state.past, future: state.future };
    default:
      return state;
  }
}

export function useEditorHistory(initialElements: EditorElement[]) {
  const [state, dispatch] = useReducer(historyReducer, {
    present: initialElements,
    past: [],
    future: [],
  });

  const pushHistory = useCallback(
    (elements: EditorElement[]) => dispatch({ type: "PUSH", payload: elements }),
    []
  );

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const replacePresent = useCallback(
    (elements: EditorElement[]) => dispatch({ type: "REPLACE", payload: elements }),
    []
  );

  return {
    present: state.present,
    pushHistory,
    canUndo,
    canRedo,
    undo,
    redo,
    replacePresent,
  };
}
