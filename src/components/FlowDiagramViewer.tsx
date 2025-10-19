import React, { useState } from 'react';
import { flows, flowAnalytics } from '../data/flows';
import { Flow, FlowStep, Bottleneck } from '../types/flows';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Users,
  TrendingUp,
  MousePointer
} from 'lucide-react';

export const FlowDiagramViewer: React.FC = () => {
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(flows[0]);
  const [selectedStep, setSelectedStep] = useState<FlowStep | null>(null);

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
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  const getSeverityIcon = (severity: Bottleneck['severity']) => {
    switch (severity) {
      case 'low':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Flow Diagram Analysis
            </h1>
            <p className="text-gray-600">
              Visual map of all user journeys and interactions in the Ohouse AI app
            </p>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{flowAnalytics.totalFlows}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Flows</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{flowAnalytics.entryPoints}</p>
                  <p className="text-sm text-gray-600 mt-1">Entry Points</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{flowAnalytics.bottlenecks}</p>
                  <p className="text-sm text-gray-600 mt-1">Bottlenecks</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{flowAnalytics.deadEnds}</p>
                  <p className="text-sm text-gray-600 mt-1">Dead Ends</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Flow List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Flows</CardTitle>
                  <CardDescription>Click to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {flows.map((flow) => (
                        <button
                          key={flow.id}
                          onClick={() => {
                            setSelectedFlow(flow);
                            setSelectedStep(null);
                          }}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedFlow?.id === flow.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                {flow.name}
                              </h3>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {flow.description}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={getStatusColor(flow.status)} variant="outline">
                                  {flow.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {flow.steps.length} steps
                                </Badge>
                                {flow.bottlenecks.length > 0 && (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                                    {flow.bottlenecks.length} issues
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Flow Details */}
            <div className="lg:col-span-2">
              {selectedFlow ? (
                <div className="space-y-6">
                  {/* Flow Overview */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{selectedFlow.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {selectedFlow.description}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(selectedFlow.status)} variant="outline">
                          {selectedFlow.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Average Time</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {selectedFlow.averageTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Completion Rate</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {selectedFlow.completionRate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Priority</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {selectedFlow.priority}/5
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2">Entry Points</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedFlow.entryPoints.map((entry, idx) => (
                              <Badge key={idx} variant="outline" className="bg-green-50">
                                {entry}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2">Exit Points</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedFlow.exitPoints.map((exit, idx) => (
                              <Badge key={idx} variant="outline" className="bg-blue-50">
                                {exit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flow Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Flow Steps</CardTitle>
                      <CardDescription>Click a step to see details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedFlow.steps.map((step, index) => (
                          <div key={step.id}>
                            <button
                              onClick={() => setSelectedStep(step)}
                              className={`w-full text-left p-4 rounded-lg border transition-all ${
                                selectedStep?.id === step.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                                    <Badge className={getFrictionColor(step.friction)} variant="outline">
                                      {step.friction}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                                  <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {step.estimatedTime}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MousePointer className="w-3 h-3" />
                                      {step.alternatives} options
                                    </span>
                                    {step.hasBackButton && (
                                      <Badge variant="outline" className="bg-green-50 text-xs">
                                        <ArrowLeft className="w-3 h-3 mr-1" />
                                        Back available
                                      </Badge>
                                    )}
                                  </div>
                                  {step.interactions && step.interactions.length > 0 && (
                                    <div className="mt-2 flex gap-1 flex-wrap">
                                      {step.interactions.map((interaction, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {interaction}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                            {index < selectedFlow.steps.length - 1 && (
                              <div className="flex justify-center py-2">
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bottlenecks */}
                  {selectedFlow.bottlenecks.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Identified Issues ({selectedFlow.bottlenecks.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedFlow.bottlenecks.map((bottleneck, index) => {
                            const step = selectedFlow.steps.find(s => s.id === bottleneck.stepId);
                            return (
                              <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                                <div className="flex items-start gap-3">
                                  {getSeverityIcon(bottleneck.severity)}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-semibold text-gray-900">{bottleneck.issue}</h4>
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
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      <span className="font-medium">Step:</span> {step?.title}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-2">
                                      <span className="font-medium">Impact:</span> {bottleneck.impact}
                                    </p>
                                    <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                                      <p className="text-sm font-medium text-green-900 mb-1">
                                        💡 Suggestion:
                                      </p>
                                      <p className="text-sm text-green-800">{bottleneck.suggestion}</p>
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
                <Card className="h-full flex items-center justify-center">
                  <CardContent>
                    <p className="text-gray-500 text-center">Select a flow to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Summary Insights */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Most Common Path</p>
                  <p className="text-sm text-gray-700">{flowAnalytics.mostCommonPath}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Longest Flow</p>
                  <p className="text-sm text-gray-700">{flowAnalytics.longestPath}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Shortest Flow</p>
                  <p className="text-sm text-gray-700">{flowAnalytics.shortestPath}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Critical Issues</p>
                  <p className="text-sm text-red-700 font-medium">
                    {flowAnalytics.deadEnds} dead ends • {flowAnalytics.bottlenecks} bottlenecks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlowDiagramViewer;
