import { createContext, useContext } from 'react';

export const WorkspaceContext = createContext(null);

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('WorkspaceItem must be used inside Workspace');
  }
  return context;
}
