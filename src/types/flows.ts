/**
 * Flow Diagram Type Definitions
 * Defines the structure for user flow analysis and visualization
 */

export type FlowStatus = 'complete' | 'partial' | 'broken';
export type FrictionLevel = 'low' | 'medium' | 'high';
export type SeverityLevel = 'low' | 'medium' | 'high';
export type StepType = 'screen' | 'action' | 'decision';

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  type: StepType;
  hasBackButton: boolean;
  alternatives: number; // Number of alternative paths/choices
  friction: FrictionLevel;
  estimatedTime?: string; // e.g., "2 seconds", "5 seconds"
  interactions?: string[]; // User actions like "Click", "Scroll", "Input"
}

export interface Bottleneck {
  stepId: string;
  issue: string;
  severity: SeverityLevel;
  suggestion: string;
  impact?: string; // User impact description
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  entryPoints: string[]; // How users can enter this flow
  exitPoints: string[]; // How users can leave/complete
  status: FlowStatus;
  bottlenecks: Bottleneck[];
  completionRate?: string; // e.g., "High", "Medium", "Low"
  averageTime?: string; // Total estimated time
  priority?: number; // Importance (1-5)
}

export interface FlowConnection {
  from: string; // Step ID
  to: string; // Step ID
  label?: string; // Connection label like "Click", "Go Back"
  condition?: string; // e.g., "If image uploaded"
}

export interface FlowAnalytics {
  totalFlows: number;
  totalSteps: number;
  entryPoints: number;
  bottlenecks: number;
  deadEnds: number;
  mostCommonPath: string;
  longestPath: string;
  shortestPath: string;
}
