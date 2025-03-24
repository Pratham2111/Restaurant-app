// Adapted from shadcn/ui toast hook

/**
 * Generates a unique ID for a toast
 * @returns {string} Unique ID
 */
function genId() {
  return Math.random().toString(36).substring(2, 9);
}

// Action types for reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
};

/**
 * Dispatch a toast action
 * @param {Object} action - Toast action
 */
function dispatch(action) {
  if (listeners.length === 0) {
    memoryState = reducer(memoryState, action);
    return;
  }

  // Update state and notify listeners
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
        toasts: [...state.toasts, action.toast],
      };
    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case actionTypes.DISMISS_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

// List of state listeners
const listeners = [];

// Initial state
let memoryState = { toasts: [] };

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
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

/**
 * Hook for using toast
 * @returns {Object} Toast methods
 */
function useToast() {
  return {
    toast,
    dismiss: (toastId) => {
      dispatch({
        type: actionTypes.DISMISS_TOAST,
        toastId,
      });
    },
    dismissAll: () => {
      dispatch({
        type: actionTypes.DISMISS_TOAST,
      });
    },
  };
}

export { toast, useToast, reducer, actionTypes, dispatch, listeners, memoryState };