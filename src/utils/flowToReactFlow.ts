import { Node, Edge } from '@xyflow/react';
import { Flow, FlowStep } from '../types/flows';

export interface FlowLayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
}

const defaultConfig: FlowLayoutConfig = {
  nodeWidth: 320,
  nodeHeight: 150,
  horizontalSpacing: 200,
  verticalSpacing: 120,
};

/**
 * Creates a unified flowchart showing ALL user journeys
 * Starting from Home screen, branching to different creation flows
 */
export function convertFlowsToReactFlow(
  flows: Flow[],
  config: FlowLayoutConfig = defaultConfig
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // ==================== HOME SCREEN (STARTING POINT) ====================
  const homeFlow = flows.find(f => f.id === 'home-flow');

  // Start node
  nodes.push({
    id: 'start',
    type: 'input',
    position: { x: 800, y: 50 },
    data: { label: 'App Launch' },
    style: {
      background: '#10b981',
      color: 'white',
      border: '2px solid #059669',
      borderRadius: '50px',
      padding: '12px 24px',
      fontWeight: 600,
      fontSize: '14px',
    },
  });

  // Home Screen node
  nodes.push({
    id: 'home-screen',
    type: 'flowNode',
    position: { x: 750, y: 180 },
    data: {
      step: homeFlow?.steps[0] || {
        id: 'home-screen',
        title: 'Home Screen',
        description: 'Feature cards + Design feed',
        type: 'screen' as const,
        hasBackButton: false,
        alternatives: 3,
        friction: 'low' as const,
        estimatedTime: '1 second',
      },
      flowName: 'Home',
      flowStatus: 'complete' as const,
      hasIssues: false,
    },
  });

  edges.push({
    id: 'start-home',
    source: 'start',
    target: 'home-screen',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
  });

  // Decision node: Which creation mode?
  nodes.push({
    id: 'decision-creation-mode',
    type: 'default',
    position: { x: 780, y: 380 },
    data: { label: '🔀 Select Creation Mode' },
    style: {
      background: '#fef3c7',
      border: '2px solid #f59e0b',
      borderRadius: '8px',
      padding: '16px',
      fontWeight: 600,
      fontSize: '13px',
      transform: 'rotate(45deg)',
      width: '180px',
      height: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  edges.push({
    id: 'home-decision',
    source: 'home-screen',
    target: 'decision-creation-mode',
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  });

  // ==================== THREE CREATION FLOWS ====================
  const creationFlows = [
    { flow: flows.find(f => f.id === 'place-object-flow'), x: 200, label: 'Place Object' },
    { flow: flows.find(f => f.id === 'interior-design-flow'), x: 800, label: 'Interior Design' },
    { flow: flows.find(f => f.id === 'exterior-design-flow'), x: 1400, label: 'Exterior Design' },
  ];

  let currentY = 620;

  creationFlows.forEach(({ flow, x, label }) => {
    if (!flow) return;

    // Branch edge from decision
    edges.push({
      id: `decision-${flow.id}`,
      source: 'decision-creation-mode',
      target: flow.steps[0].id,
      label: label,
      labelStyle: { fontSize: 11, fontWeight: 600, fill: '#6b7280' },
      style: { stroke: '#f59e0b', strokeWidth: 2 },
      animated: true,
    });

    // Add flow steps vertically
    flow.steps.forEach((step, stepIndex) => {
      const hasIssues = flow.bottlenecks.some(b => b.stepId === step.id);

      nodes.push({
        id: step.id,
        type: 'flowNode',
        position: { x: x, y: currentY + (stepIndex * 180) },
        data: {
          step,
          flowName: flow.name,
          flowStatus: flow.status,
          hasIssues,
        },
      });

      // Connect to previous step
      if (stepIndex > 0) {
        const prevStep = flow.steps[stepIndex - 1];
        edges.push({
          id: `${prevStep.id}-${step.id}`,
          source: prevStep.id,
          target: step.id,
          animated: step.friction === 'high',
          style: {
            stroke: step.friction === 'high' ? '#dc2626' : '#3b82f6',
            strokeWidth: 2,
          },
        });

        // Back button edge
        if (step.hasBackButton) {
          edges.push({
            id: `${step.id}-back-${prevStep.id}`,
            source: step.id,
            target: prevStep.id,
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
    });

    // Exit node for this flow
    const lastStep = flow.steps[flow.steps.length - 1];
    const exitNodeId = `${flow.id}-exit`;

    nodes.push({
      id: exitNodeId,
      type: 'default',
      position: { x: x + 30, y: currentY + (flow.steps.length * 180) + 80 },
      data: { label: '→ My Page' },
      style: {
        background: '#dbeafe',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '12px 20px',
        fontWeight: 600,
        fontSize: '13px',
      },
    });

    edges.push({
      id: `${lastStep.id}-${exitNodeId}`,
      source: lastStep.id,
      target: exitNodeId,
      label: 'Submit Render',
      labelStyle: { fontSize: 11, fill: '#3b82f6' },
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    });

    // Connect to My Page
    edges.push({
      id: `${exitNodeId}-mypage`,
      source: exitNodeId,
      target: 'mypage-1',
      style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5,5' },
    });
  });

  // ==================== MY PAGE FLOW ====================
  const myPageFlow = flows.find(f => f.id === 'mypage-flow');
  if (myPageFlow) {
    const myPageX = 800;
    const myPageY = currentY + (6 * 180) + 200;

    myPageFlow.steps.forEach((step, stepIndex) => {
      const hasIssues = myPageFlow.bottlenecks.some(b => b.stepId === step.id);

      nodes.push({
        id: step.id,
        type: 'flowNode',
        position: { x: myPageX, y: myPageY + (stepIndex * 180) },
        data: {
          step,
          flowName: myPageFlow.name,
          flowStatus: myPageFlow.status,
          hasIssues,
        },
      });

      if (stepIndex > 0) {
        const prevStep = myPageFlow.steps[stepIndex - 1];
        edges.push({
          id: `${prevStep.id}-${step.id}`,
          source: prevStep.id,
          target: step.id,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });

        if (step.hasBackButton) {
          edges.push({
            id: `${step.id}-back-${prevStep.id}`,
            source: step.id,
            target: prevStep.id,
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
    });

    // End node
    nodes.push({
      id: 'end',
      type: 'output',
      position: { x: myPageX + 50, y: myPageY + (myPageFlow.steps.length * 180) + 80 },
      data: { label: 'Complete' },
      style: {
        background: '#10b981',
        color: 'white',
        border: '2px solid #059669',
        borderRadius: '50px',
        padding: '12px 24px',
        fontWeight: 600,
        fontSize: '14px',
      },
    });

    edges.push({
      id: 'mypage-end',
      source: myPageFlow.steps[myPageFlow.steps.length - 1].id,
      target: 'end',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 },
    });
  }

  // ==================== ALTERNATE PATHS ====================
  // Direct My Page access from Home
  edges.push({
    id: 'home-mypage-direct',
    source: 'home-screen',
    target: 'mypage-1',
    label: 'My Page Tab',
    labelStyle: { fontSize: 11, fill: '#8b5cf6' },
    style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5,5' },
    type: 'smoothstep',
  });

  return { nodes, edges };
}
