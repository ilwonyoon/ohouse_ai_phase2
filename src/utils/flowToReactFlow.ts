import { Node, Edge } from '@xyflow/react';
import { Flow } from '../types/flows';

export interface FlowLayoutConfig {
  nodeSpacing: number;
  flowSpacing: number;
  startX: number;
  startY: number;
}

const defaultConfig: FlowLayoutConfig = {
  nodeSpacing: 150,
  flowSpacing: 600,
  startX: 50,
  startY: 50,
};

export function convertFlowsToReactFlow(
  flows: Flow[],
  config: FlowLayoutConfig = defaultConfig
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  flows.forEach((flow, flowIndex) => {
    const baseX = config.startX + flowIndex * config.flowSpacing;
    let currentY = config.startY;

    // Add flow header node (entry point)
    const headerNodeId = `${flow.id}-header`;
    nodes.push({
      id: headerNodeId,
      type: 'input',
      position: { x: baseX, y: currentY },
      data: {
        label: flow.name,
      },
      style: {
        background: '#3b82f6',
        color: 'white',
        border: '2px solid #2563eb',
        borderRadius: '12px',
        padding: '12px 20px',
        fontWeight: 600,
        fontSize: '14px',
        minWidth: '280px',
        textAlign: 'center',
      },
    });

    currentY += config.nodeSpacing;

    // Add flow steps as custom nodes
    flow.steps.forEach((step, stepIndex) => {
      const nodeId = step.id;
      const hasIssues = flow.bottlenecks.some(b => b.stepId === step.id);

      nodes.push({
        id: nodeId,
        type: 'flowNode',
        position: { x: baseX, y: currentY },
        data: {
          step,
          flowName: flow.name,
          flowStatus: flow.status,
          hasIssues,
        },
      });

      // Connect to previous node
      if (stepIndex === 0) {
        // Connect first step to header
        edges.push({
          id: `${headerNodeId}-${nodeId}`,
          source: headerNodeId,
          target: nodeId,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });
      } else {
        // Connect to previous step
        const prevNodeId = flow.steps[stepIndex - 1].id;
        edges.push({
          id: `${prevNodeId}-${nodeId}`,
          source: prevNodeId,
          target: nodeId,
          animated: step.friction === 'high',
          style: {
            stroke: step.friction === 'high' ? '#dc2626' : '#3b82f6',
            strokeWidth: 2,
          },
          label: step.hasBackButton ? '→' : undefined,
        });

        // Add back button edge if applicable
        if (step.hasBackButton) {
          edges.push({
            id: `${nodeId}-back-${prevNodeId}`,
            source: nodeId,
            target: prevNodeId,
            animated: false,
            style: {
              stroke: '#9ca3af',
              strokeWidth: 1,
              strokeDasharray: '5,5',
            },
            label: '← Back',
            labelStyle: { fontSize: 10, fill: '#6b7280' },
          });
        }
      }

      currentY += config.nodeSpacing;
    });

    // Add exit node
    const exitNodeId = `${flow.id}-exit`;
    nodes.push({
      id: exitNodeId,
      type: 'output',
      position: { x: baseX, y: currentY },
      data: {
        label: `Exit: ${flow.exitPoints[0] || 'Complete'}`,
      },
      style: {
        background: flow.status === 'complete' ? '#10b981' : flow.status === 'partial' ? '#f59e0b' : '#ef4444',
        color: 'white',
        border: `2px solid ${flow.status === 'complete' ? '#059669' : flow.status === 'partial' ? '#d97706' : '#dc2626'}`,
        borderRadius: '12px',
        padding: '12px 20px',
        fontWeight: 600,
        fontSize: '14px',
        minWidth: '280px',
        textAlign: 'center',
      },
    });

    // Connect last step to exit
    if (flow.steps.length > 0) {
      const lastStepId = flow.steps[flow.steps.length - 1].id;
      edges.push({
        id: `${lastStepId}-${exitNodeId}`,
        source: lastStepId,
        target: exitNodeId,
        animated: true,
        style: {
          stroke: flow.status === 'complete' ? '#10b981' : flow.status === 'partial' ? '#f59e0b' : '#ef4444',
          strokeWidth: 2,
        },
      });
    }
  });

  return { nodes, edges };
}

// Helper to create cross-flow connections (e.g., from Home to creation flows)
export function addCrossFlowEdges(
  nodes: Node[],
  edges: Edge[],
  connections: Array<{ from: string; to: string; label?: string }>
): Edge[] {
  const newEdges = [...edges];

  connections.forEach(({ from, to, label }) => {
    const sourceNode = nodes.find(n => n.id === from);
    const targetNode = nodes.find(n => n.id === to);

    if (sourceNode && targetNode) {
      newEdges.push({
        id: `cross-${from}-${to}`,
        source: from,
        target: to,
        animated: false,
        style: {
          stroke: '#8b5cf6',
          strokeWidth: 2,
          strokeDasharray: '5,5',
        },
        label: label || '→',
        labelStyle: { fontSize: 10, fill: '#7c3aed' },
        type: 'smoothstep',
      });
    }
  });

  return newEdges;
}
