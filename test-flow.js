// Quick test to verify flow conversion
import { flows } from './src/data/flows.ts';
import { convertFlowsToReactFlow } from './src/utils/flowToReactFlow.ts';

const { nodes, edges } = convertFlowsToReactFlow(flows);

console.log('Nodes:', nodes.length);
console.log('Edges:', edges.length);
console.log('First node:', nodes[0]);
console.log('First edge:', edges[0]);
