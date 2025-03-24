// Adapted from shadcn-ui toast component
// https://ui.shadcn.com/docs/components/toast

/**
 * Toast hook for showing notifications
 * Provides a clean API for creating and managing toasts
 */

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

let count = 0;

/**
 * Generates a unique ID for a toast
 * @returns {string} Unique ID
 */
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let listeners = [];
let memoryState = { toasts: [] };

/**
 * Dispatch a toast action
 * @param {Object} action - Toast action
 */
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * Reducer function for toast state
 * @param {Object} state - Current state
 * @param {Object} action - Action to perform
 * @returns {Object} New state
 */
function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
      
    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
      
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      
      // If no toast ID provided, dismiss all
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        };
      }
      
      // Otherwise dismiss toast with ID
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }
    
    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;
      
      // If no toast ID provided, remove all closed toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.open),
        };
      }
      
      // Otherwise remove toast with ID
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      };
    }
    
    default:
      return state;
  }
}

/**
 * Creates a toast
 * @param {Object} props - Toast props
 * @returns {Object} Toast object with methods
 */
function toast(props) {
  const id = genId();
  
  const update = (newProps) => {
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...newProps, id },
    });
    
    return { id, dismiss, update };
  };
  
  const dismiss = () => {
    dispatch({
      type: actionTypes.DISMISS_TOAST,
      toastId: id,
    });
  };
  
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss();
        }
      },
    },
  });
  
  return { id, dismiss, update };
}

/**
 * Hook for using toast
 * @returns {Object} Toast methods
 */
function useToast() {
  const [state, setState] = useState(memoryState);
  
  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast };

// Add missing import at the top
import { useState, useEffect } from "react";