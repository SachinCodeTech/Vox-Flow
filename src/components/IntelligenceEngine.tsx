import { useEffect } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';

const SAMPLE_INSIGHTS: any[] = [
  { type: 'optimization', title: 'Workflow Bottleneck', description: 'CAD Archive step is taking 40% longer than average in Arch Dept.', impact: 'medium' },
  { type: 'risk', title: 'Storage Threshold', description: 'NAS Archive is approaching 90% capacity. Predictive overflow in 3 days.', impact: 'high' },
  { type: 'anomaly', title: 'Unusual Access', description: 'Higher than normal webhook triggers detected from external vendor.', impact: 'low' },
  { type: 'optimization', title: 'Auto-Recovery Opportunity', description: 'AI suggests adding a Security Gate before Global Mirror sync.', impact: 'medium' }
];

const AGENT_ACTIONS: Record<string, string[]> = {
  'archive-001': ['Compressing old assets', 'Calculating redundancy', 'Pruning temp folders'],
  'coord-001': ['Scanning calendar syncs', 'Predicting conflict', 'Optimizing buffer times'],
  'cad-001': ['Verifying Layer 0 standards', 'Checking XREF paths', 'Summarizing revision E'],
  'guard-001': ['Monitoring edge traffic', 'Verifying auth keys', 'Running vulnerability sweep']
};

const SAMPLE_EVENTS: any[] = [
  { source: 'NAS Storage', type: 'I/O Threshold', payload: 'Extended write latency detected on Vol_01', impact: 0.4 },
  { source: 'Guardian Agent', type: 'Policy Audit', payload: 'Zero-trust validation succeeded for CAD export', impact: 0.1 },
  { source: 'Webhook', type: 'External Signal', payload: 'Vendor status updated: Structural Phase 2', impact: 0.2 },
  { source: 'System', type: 'Mesh Rebalancing', payload: 'Redistributing agent compute load', impact: 0.3 }
];

export const IntelligenceEngine = () => {
  const { 
    addRuntimeJob, 
    currentWorkspaceId, 
    nodes, 
    addInsight, 
    updateAgentStatus,
    agents,
    addEvent,
    runSimulation
  } = useWorkflowStore();

  useEffect(() => {
    // 1. Simulating Runtime Executions (Every 12s)
    const runtimeInterval = setInterval(() => {
      if (Math.random() > 0.3 && nodes.length > 0) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        addRuntimeJob({
          workspaceId: currentWorkspaceId,
          nodeId: randomNode.data.label,
          status: 'running'
        });

        setTimeout(() => {
          addRuntimeJob({
            workspaceId: currentWorkspaceId,
            nodeId: randomNode.data.label,
            status: Math.random() > 0.08 ? 'success' : 'failed'
          });
        }, 3000);
      }
    }, 12000);

    // 2. Simulating AI Insights (Every 45s)
    const insightInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        const insight = SAMPLE_INSIGHTS[Math.floor(Math.random() * SAMPLE_INSIGHTS.length)];
        addInsight(insight);
      }
    }, 45000);

    // 3. Simulating Agent Activity (Every 8s)
    const agentInterval = setInterval(() => {
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const possibleActions = AGENT_ACTIONS[agent.id] || ['Processing...'];
      const action = possibleActions[Math.floor(Math.random() * possibleActions.length)];
      
      updateAgentStatus(agent.id, 'executing', action);
      
      setTimeout(() => {
        updateAgentStatus(agent.id, 'idle', action);
      }, 4000);
    }, 8000);

    // 4. Simulating Event Stream (Every 15s)
    const eventInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const event = SAMPLE_EVENTS[Math.floor(Math.random() * SAMPLE_EVENTS.length)];
        addEvent(event);
      }
    }, 15000);

    // 5. Simulating Background Simulations (Every 60s)
    const simInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        runSimulation({
          target: 'Operational Mesh',
          scenario: 'Autonomous Recovery Test',
          outcome: 'positive',
          confidence: 0.96,
          results: ['Evasion protocols verified', 'Reroute success: 100%', 'No human intervention needed']
        });
      }
    }, 60000);

    // 6. Sentience Layer: Record Memories and Strategic Advice (Every 30s)
    const sentienceInterval = setInterval(() => {
      const { addStrategicAdvice, recordMemory, updateHealth, health } = useWorkflowStore.getState();
      
      const patterns = [
        { pattern: 'End-of-Quarter Approval Squeeze', context: 'Engineering review latency increases by 40%' },
        { pattern: 'Storage Cascade Pattern', context: 'Temporary workspace bloat detected during CAD exports' },
        { pattern: 'Neural Synchronization Peak', context: 'Optimal agent collaboration at 09:00 UTC' }
      ];
      if (Math.random() > 0.4) {
        recordMemory({ ...patterns[Math.floor(Math.random() * patterns.length)], occurrence: 'cyclical' });
      }

      const adv = [
        {
          category: 'restructuring' as const,
          title: 'Asynchronous Approval Mesh',
          recommendation: 'Decentralize Architect approval to departmental guardians.',
          rationale: 'Current project velocity is bottlenecked by single-node review. Implementation reduces latency by 62%.',
          actionable: true,
          confidence: 0.91
        },
        {
          category: 'velocity' as const,
          title: 'Predictive Archive Trigger',
          recommendation: 'Initialize CAD compression at 75% NAS threshold.',
          rationale: 'Archive Agent can preemptively optimize projects based on predicted stress waves.',
          actionable: true,
          confidence: 0.88
        }
      ];
      if (Math.random() > 0.6) {
        addStrategicAdvice(adv[Math.floor(Math.random() * adv.length)]);
      }

      updateHealth({
        stability: Math.min(0.99, Math.max(0.90, health.stability + (Math.random() - 0.5) * 0.02)),
        stress: Math.min(0.3, Math.max(0.05, health.stress + (Math.random() - 0.5) * 0.05)),
        cognition: Math.min(0.99, Math.max(0.85, health.cognition + 0.01))
      });
    }, 30000);

    return () => {
      clearInterval(runtimeInterval);
      clearInterval(insightInterval);
      clearInterval(agentInterval);
      clearInterval(eventInterval);
      clearInterval(simInterval);
      clearInterval(sentienceInterval);
    };
  }, [nodes, currentWorkspaceId, addRuntimeJob, addInsight, updateAgentStatus, agents, addEvent, runSimulation]);

  return null;
};
