"use client";

import React from "react";

type DialogState = {
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  resolve?: (value: boolean) => void;
};

type DialogAction =
  | { type: "OPEN_DIALOG"; dialog: Partial<DialogState> }
  | { type: "CLOSE_DIALOG" };

const initialState: DialogState = {
  isOpen: false,
};

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case "OPEN_DIALOG":
      return { ...state, ...action.dialog, isOpen: true };
    case "CLOSE_DIALOG":
      if (state.resolve) {
        state.resolve(false); // Default behavior: Resolve with false
      }
      return { ...initialState };
    default:
      return state;
  }
}

const DialogContext = React.createContext<{
  state: DialogState;
  dispatch: React.Dispatch<DialogAction>;
} | null>(null);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(dialogReducer, initialState);

  return (
    <DialogContext.Provider value={{ state, dispatch }}>
      {children}
    </DialogContext.Provider>
  );
};

export function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  const { state, dispatch } = context;

  const openDialog = (dialog: Partial<DialogState>): Promise<boolean> => {
    return new Promise((resolve) => {
      dispatch({ type: "OPEN_DIALOG", dialog: { ...dialog, resolve } });
    });
  };

  const closeDialog = () => dispatch({ type: "CLOSE_DIALOG" });

  return { ...state, openDialog, closeDialog };
}
