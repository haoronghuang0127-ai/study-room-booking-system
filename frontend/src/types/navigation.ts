import type { ReactNode } from 'react';

export interface NavigationItem {
  key: string;       // router path
  label: string;     // label
  icon?: ReactNode;  // Menu icon 
}