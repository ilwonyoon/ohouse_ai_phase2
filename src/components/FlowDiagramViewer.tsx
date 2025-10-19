import React, { useState } from 'react';
import { flows, flowAnalytics } from '../data/flows';
import { Flow, FlowStep } from '../types/flows';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const FlowDiagramViewer: React.FC = () => {
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(flows[0]);

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

  const getFrictionColor = (friction: FlowStep['friction']) => {
    switch (friction) {
      case 'low':
        return 'border-green-300 bg-green-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'high':
        return 'border-red-300 bg-red-50';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Left Sidebar - Flow List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">User Flows</h2>
          <p className="text-sm text-gray-600 mt-1">Click to visualize</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {flows.map((flow) => (
              <button
                key={flow.id}
                onClick={() => setSelectedFlow(flow)}
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
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
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

      {/* Main Canvas - SVG Flowchart */}
      <div className="flex-1 overflow-auto p-8">
        {selectedFlow ? (
          <div className="min-w-max">
            {/* Flow Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedFlow.name}</h2>
              <p className="text-gray-600 mb-4">{selectedFlow.description}</p>
              <div className="flex items-center justify-center gap-4">
                <Badge className={getStatusColor(selectedFlow.status)} variant="outline">
                  {selectedFlow.status}
                </Badge>
                <span className="text-sm text-gray-600">{selectedFlow.steps.length} steps</span>
                <span className="text-sm text-gray-600">{selectedFlow.averageTime}</span>
              </div>
            </div>

            {/* Vertical Flow Diagram */}
            <div className="flex flex-col items-center gap-4">
              {/* Start Node */}
              <div className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg">
                Start: {selectedFlow.entryPoints[0]}
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />

              {/* Flow Steps */}
              {selectedFlow.steps.map((step, index) => {
                const hasIssues = selectedFlow.bottlenecks.some(b => b.stepId === step.id);

                return (
                  <React.Fragment key={step.id}>
                    {/* Step Node */}
                    <div
                      className={`w-96 border-2 rounded-lg p-4 shadow-md transition-all hover:shadow-xl ${getFrictionColor(
                        step.friction
                      )} ${hasIssues ? 'ring-2 ring-red-500' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-gray-900">{step.title}</h3>
                        </div>
                        {hasIssues && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 ml-10">{step.description}</p>

                      <div className="flex items-center gap-3 flex-wrap ml-10">
                        <Badge
                          variant="outline"
                          className={
                            step.friction === 'high'
                              ? 'bg-red-100 text-red-800'
                              : step.friction === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }
                        >
                          {step.friction} friction
                        </Badge>
                        <span className="text-xs text-gray-500">{step.estimatedTime}</span>
                        {step.alternatives > 0 && (
                          <span className="text-xs text-gray-500">{step.alternatives} options</span>
                        )}
                        {step.hasBackButton && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                            ← Back
                          </Badge>
                        )}
                      </div>

                      {hasIssues && (
                        <div className="mt-3 ml-10 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
                          {selectedFlow.bottlenecks
                            .filter(b => b.stepId === step.id)
                            .map((b, i) => (
                              <div key={i}>
                                <strong>Issue:</strong> {b.issue}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow between steps */}
                    {index < selectedFlow.steps.length - 1 && (
                      <ArrowRight
                        className={`w-6 h-6 rotate-90 ${
                          step.friction === 'high' ? 'text-red-500' : 'text-gray-400'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />

              {/* End Node */}
              <div
                className={`${
                  selectedFlow.status === 'complete'
                    ? 'bg-green-500'
                    : selectedFlow.status === 'partial'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                } text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg`}
              >
                End: {selectedFlow.exitPoints[0]}
              </div>
            </div>

            {/* Bottlenecks Summary */}
            {selectedFlow.bottlenecks.length > 0 && (
              <Card className="mt-8 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {selectedFlow.bottlenecks.length} Critical Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedFlow.bottlenecks.map((bottleneck, index) => {
                      const step = selectedFlow.steps.find(s => s.id === bottleneck.stepId);
                      return (
                        <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                          <div className="flex items-start gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={
                                bottleneck.severity === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : bottleneck.severity === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {bottleneck.severity}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                {bottleneck.issue}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">
                                <strong>Step:</strong> {step?.title}
                              </p>
                              <p className="text-xs text-gray-700 mb-2">
                                <strong>Impact:</strong> {bottleneck.impact}
                              </p>
                              <div className="bg-green-50 border border-green-200 rounded p-2">
                                <p className="text-xs font-medium text-green-900 mb-1">💡 Suggestion:</p>
                                <p className="text-xs text-green-800">{bottleneck.suggestion}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a flow to visualize</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowDiagramViewer;
