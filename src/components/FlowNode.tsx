import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { FlowStep, FrictionLevel } from '../types/flows';

interface FlowNodeData {
  step: FlowStep;
  flowName: string;
  flowStatus: 'complete' | 'partial' | 'broken';
  hasIssues: boolean;
}

export interface FlowNodeProps {
  data: FlowNodeData;
  selected?: boolean;
}

export const FlowNode: React.FC<FlowNodeProps> = ({ data, selected }) => {
  const { step, flowName, flowStatus, hasIssues } = data;

  const getFrictionColor = (friction: FrictionLevel) => {
    switch (friction) {
      case 'low':
        return 'bg-green-50 border-green-300';
      case 'medium':
        return 'bg-yellow-50 border-yellow-300';
      case 'high':
        return 'bg-red-50 border-red-300';
    }
  };

  const getFrictionBadgeColor = (friction: FrictionLevel) => {
    switch (friction) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStepIcon = () => {
    if (hasIssues) {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
    if (step.friction === 'low') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (step.friction === 'medium') {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getStepTypeLabel = () => {
    switch (step.type) {
      case 'screen':
        return '📱 Screen';
      case 'action':
        return '⚡ Action';
      case 'decision':
        return '🔀 Decision';
    }
  };

  return (
    <div
      className={`
        relative px-4 py-3 rounded-lg border-2 bg-white shadow-md transition-all
        ${getFrictionColor(step.friction)}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl scale-105' : 'hover:shadow-lg'}
        min-w-[280px] max-w-[320px]
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
      />

      {/* Header with Icon and Type */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStepIcon()}
          <span className="text-xs font-medium text-gray-600">{getStepTypeLabel()}</span>
        </div>
        {hasIssues && (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-xs">
            Issue
          </Badge>
        )}
      </div>

      {/* Step Title */}
      <h3 className="font-semibold text-sm text-gray-900 mb-1 leading-tight">
        {step.title}
      </h3>

      {/* Step Description */}
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {step.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{step.estimatedTime}</span>
        </div>
        <Badge className={getFrictionBadgeColor(step.friction)} variant="outline">
          {step.friction}
        </Badge>
      </div>

      {/* Additional Info */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {step.hasBackButton && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
            ← Back
          </Badge>
        )}
        {step.alternatives > 0 && (
          <span className="text-xs text-gray-500">
            {step.alternatives} {step.alternatives === 1 ? 'option' : 'options'}
          </span>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
      />
    </div>
  );
};

export default FlowNode;
