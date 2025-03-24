import React, { createContext, useReducer, useContext } from "react";

// Generate a unique ID for each toast
function genId() {
  return Math.random().toString(36).substring(2, 9);
}

// Toast context
export const ToastContext = createContext(undefined);

// Action types
const ADD_TOAST = "ADD_TOAST";
const UPDATE_TOAST = "UPDATE_TOAST";
const DISMISS_TOAST = "DISMISS_TOAST";
const REMOVE_TOAST = "REMOVE_TOAST";

/**
 * Reducer function for toast state
 * @param {Object} state - Current state
 * @param {Object} action - Action to perform
 * @returns {Object} New state
 */
function reducer(state, action) {
  switch (action.type) {
    case ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case DISMISS_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, open: false } : t
        ),
      };
    case REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

/**
 * Toast provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ToastProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    toasts: [],
  });
  
  const toast = (props) => {
    const id = props.id || genId();
    const { duration = 5000, ...restProps } = props;
    
    dispatch({
      type: ADD_TOAST,
      toast: {
        id,
        open: true,
        ...restProps,
      },
    });
    
    if (duration !== 0) {
      setTimeout(() => {
        dispatch({
          type: DISMISS_TOAST,
          toastId: id,
        });
      }, duration);
    }
    
    return {
      id,
      update: (props) => {
        dispatch({
          type: UPDATE_TOAST,
          toast: {
            id,
            ...props,
          },
        });
      },
      dismiss: () => {
        dispatch({
          type: DISMISS_TOAST,
          toastId: id,
        });
      },
    };
  };
  
  const contextValue = {
    ...state,
    toast,
    update: (id, props) => {
      dispatch({
        type: UPDATE_TOAST,
        toast: {
          id,
          ...props,
        },
      });
    },
    dismiss: (toastId) => {
      dispatch({
        type: DISMISS_TOAST,
        toastId,
      });
    },
    remove: (toastId) => {
      dispatch({
        type: REMOVE_TOAST,
        toastId,
      });
    },
  };
  
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook for using toast
 * @returns {Object} Toast methods
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return {
    toast: context.toast,
  };
}