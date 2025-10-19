import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { flows, flowAnalytics } from '../data/flows';
import { Flow, FlowStep, Bottleneck } from '../types/flows';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  LayoutGrid,
} from 'lucide-react';
import { FlowNode } from './FlowNode';
import { convertFlowsToReactFlow } from '../utils/flowToReactFlow';

const nodeTypes = {
  flowNode: FlowNode,
};

export const FlowDiagramViewer: React.FC = () => {
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Convert flow data to React Flow format
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => {
      const result = convertFlowsToReactFlow(flows);
      console.log('FlowDiagramViewer - Nodes:', result.nodes.length, result.nodes);
      console.log('FlowDiagramViewer - Edges:', result.edges.length, result.edges);
      return result;
    },
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  console.log('ReactFlow rendering with:', nodes.length, 'nodes', edges.length, 'edges');

  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);

    // Find which flow this node belongs to
    const flow = flows.find(f =>
      f.steps.some(step => step.id === node.id) ||
      node.id.includes(f.id)
    );

    if (flow) {
      setSelectedFlow(flow);
    }
  }, []);

  // Get selected step
  const selectedStep = useMemo(() => {
    if (!selectedNodeId || !selectedFlow) return null;
    return selectedFlow.steps.find(step => step.id === selectedNodeId) || null;
  }, [selectedNodeId, selectedFlow]);

  // Get bottlenecks for selected step
  const stepBottlenecks = useMemo(() => {
    if (!selectedStep || !selectedFlow) return [];
    return selectedFlow.bottlenecks.filter(b => b.stepId === selectedStep.id);
  }, [selectedStep, selectedFlow]);

  const getStatusColor = (status: Flow['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'broken':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getSeverityIcon = (severity: Bottleneck['severity']) => {
    switch (severity) {
      case 'low':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex" style={{ height: '100vh', width: '100vw' }}>
      {/* Left Sidebar - Flow List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">User Flows</h2>
          <p className="text-sm text-gray-600 mt-1">Click a flow to highlight</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {flows.map((flow) => (
              <button
                key={flow.id}
                onClick={() => {
                  setSelectedFlow(flow);
                  setSelectedNodeId(null);
                }}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedFlow?.id === flow.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                    {flow.name}
                  </h3>
                  <Badge className={getStatusColor(flow.status)} variant="outline">
                    {flow.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {flow.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {flow.steps.length} steps
                  </Badge>
                  {flow.bottlenecks.length > 0 && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                      {flow.bottlenecks.length} issues
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Analytics Summary */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Overview</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{flowAnalytics.totalFlows}</p>
              <p className="text-xs text-gray-600">Flows</p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{flowAnalytics.totalSteps}</p>
              <p className="text-xs text-gray-600">Steps</p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="text-2xl font-bold text-red-600">{flowAnalytics.bottlenecks}</p>
              <p className="text-xs text-gray-600">Issues</p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{flowAnalytics.deadEnds}</p>
              <p className="text-xs text-gray-600">Dead Ends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas - React Flow */}
      <div className="flex-1 relative">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <ReactFlow
          style={{ width: '100%', height: '100%' }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          className="bg-gray-50"
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls
            showInteractive={false}
            className="bg-white border border-gray-200 rounded-lg shadow-lg"
          />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'flowNode') {
                const data = node.data as any;
                if (data.hasIssues) return '#ef4444';
                if (data.step?.friction === 'high') return '#f59e0b';
                if (data.step?.friction === 'medium') return '#eab308';
                return '#10b981';
              }
              return '#3b82f6';
            }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg"
          />

          {/* Top Panel with Instructions */}
          <Panel position="top-center" className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-700">Low Friction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-700">Medium Friction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-700">High Friction</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-xs text-gray-600">Click nodes for details • Scroll to zoom • Drag to pan</span>
            </div>
          </Panel>
        </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Node Details */}
      {(selectedStep || selectedFlow) && (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Selected Step Details */}
              {selectedStep ? (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedStep.title}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedStep.description}</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Step Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <span className="ml-2 text-gray-900">{selectedStep.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Friction:</span>
                        <Badge className="ml-2" variant="outline">
                          {selectedStep.friction}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Estimated Time:</span>
                        <span className="ml-2 text-gray-900">{selectedStep.estimatedTime}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Alternatives:</span>
                        <span className="ml-2 text-gray-900">{selectedStep.alternatives}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Back Button:</span>
                        <span className="ml-2 text-gray-900">
                          {selectedStep.hasBackButton ? '✓ Yes' : '✗ No'}
                        </span>
                      </div>
                      {selectedStep.interactions && selectedStep.interactions.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700 block mb-2">Interactions:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedStep.interactions.map((interaction, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {interaction}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Bottlenecks for this step */}
                  {stepBottlenecks.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-sm text-red-900 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Issues ({stepBottlenecks.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {stepBottlenecks.map((bottleneck, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-red-200">
                            <div className="flex items-start gap-2 mb-2">
                              {getSeverityIcon(bottleneck.severity)}
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900">
                                  {bottleneck.issue}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`mt-1 ${
                                    bottleneck.severity === 'high'
                                      ? 'bg-red-100 text-red-800'
                                      : bottleneck.severity === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {bottleneck.severity}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-gray-700 mb-2">
                              <span className="font-medium">Impact:</span> {bottleneck.impact}
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded p-2">
                              <p className="text-xs font-medium text-green-900 mb-1">
                                💡 Suggestion:
                              </p>
                              <p className="text-xs text-green-800">{bottleneck.suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : selectedFlow ? (
                <>
                  {/* Flow Overview */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedFlow.name}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedFlow.description}</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Flow Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <Badge className="ml-2" variant="outline">
                          {selectedFlow.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Priority:</span>
                        <span className="ml-2 text-gray-900">{selectedFlow.priority}/5</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Steps:</span>
                        <span className="ml-2 text-gray-900">{selectedFlow.steps.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Average Time:</span>
                        <span className="ml-2 text-gray-900">{selectedFlow.averageTime}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Completion Rate:</span>
                        <span className="ml-2 text-gray-900">{selectedFlow.completionRate}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Entry & Exit Points</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">Entry Points</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedFlow.entryPoints.map((entry, idx) => (
                            <Badge key={idx} variant="outline" className="bg-green-50 text-xs">
                              {entry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">Exit Points</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedFlow.exitPoints.map((exit, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 text-xs">
                              {exit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedFlow.bottlenecks.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-sm text-red-900">
                          All Issues ({selectedFlow.bottlenecks.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedFlow.bottlenecks.map((bottleneck, idx) => {
                            const step = selectedFlow.steps.find(s => s.id === bottleneck.stepId);
                            return (
                              <div key={idx} className="bg-white rounded p-2 border border-red-200">
                                <p className="text-xs font-medium text-gray-900">{step?.title}</p>
                                <p className="text-xs text-gray-700">{bottleneck.issue}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default FlowDiagramViewer;
