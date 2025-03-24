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

// Store dispatch function
let dispatchToast;

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
 * Hook for managing toast state internally
 * @returns {Object} Toast state and methods
 */
function useToaster() {
  const [state, dispatchInternal] = useReducer(reducer, {
    toasts: [],
  });

  // Set global dispatch method
  dispatchToast = dispatchInternal;

  return {
    ...state,
    toast: (props) => {
      const id = props.id || genId();
      
      dispatchInternal({
        type: ADD_TOAST,
        toast: {
          id,
          open: true,
          ...props,
        },
      });
      
      return id;
    },
    update: (id, props) => {
      dispatchInternal({
        type: UPDATE_TOAST,
        toast: {
          id,
          ...props,
        },
      });
    },
    dismiss: (toastId) => {
      dispatchInternal({
        type: DISMISS_TOAST,
        toastId,
      });
    },
    remove: (toastId) => {
      dispatchInternal({
        type: REMOVE_TOAST,
        toastId,
      });
    },
  };
}

/**
 * Creates a toast
 * @param {Object} props - Toast props
 * @param {number} props.duration - Duration in milliseconds before auto-dismiss (default: 5000ms)
 * @returns {Object} Toast object with methods
 */
function toast(props) {
  const id = genId();
  const { duration = 5000, ...restProps } = props;
  
  // Auto-dismiss toast after specified duration
  let autoCloseTimeout;
  
  const dismiss = () => {
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout);
    }
    
    dispatch({
      type: DISMISS_TOAST,
      toastId: id,
    });
  };
  
  dispatch({
    type: ADD_TOAST,
    toast: {
      id,
      open: true,
      ...restProps,
    },
  });
  
  // Set the auto-dismiss timeout
  if (duration !== 0) {
    autoCloseTimeout = setTimeout(() => {
      dismiss();
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
    dismiss,
  };
}

/**
 * Hook for using toast
 * @returns {Object} Toast methods
 */
export function useToast() {
  return {
    toast,
  };
}

/**
 * Toast provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ToastProvider({ children }) {
  const toaster = useToaster();
  
  return (
    <ToastContext.Provider value={toaster}>
      {children}
    </ToastContext.Provider>
  );
}