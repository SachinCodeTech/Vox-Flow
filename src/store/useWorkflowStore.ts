import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

export type Workspace = {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  lastUpdated: string;
};

export type RuntimeJob = {
  id: string;
  workspaceId: string;
  nodeId: string;
  status: 'running' | 'success' | 'failed';
  timestamp: string;
};

export type AIInsight = {
  id: string;
  type: 'optimization' | 'risk' | 'anomaly';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
};

export type EnterpriseAgent = {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'analyzing' | 'executing' | 'offline';
  lastAction: string;
};

export type Policy = {
  id: string;
  name: string;
  rules: string[];
  status: 'active' | 'evaluating' | 'drift';
  severity: 'critical' | 'standard';
};

export type EnterpriseEvent = {
  id: string;
  source: string;
  type: string;
  payload: string;
  timestamp: string;
  impact: number; // 0 to 1
};

export type Simulation = {
  id: string;
  target: string;
  scenario: string;
  outcome: 'positive' | 'negative' | 'neutral';
  confidence: number;
  results: string[];
};

export type StrategicAdvice = {
  id: string;
  category: 'restructuring' | 'velocity' | 'capacity' | 'governance';
  title: string;
  recommendation: string;
  rationale: string;
  actionable: boolean;
  confidence: number;
};

export type MemoryPattern = {
  id: string;
  pattern: string;
  occurrence: 'frequent' | 'emerging' | 'cyclical';
  context: string;
  timestamp: string;
};

export type OrganizationalHealth = {
  stability: number; // 0-1
  cognition: number; // 0-1
  velocity: number; // 0-1
  stress: number; // 0-1
};

export type WorkflowState = {
  workspaces: Workspace[];
  currentWorkspaceId: string;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  isExecuting: boolean;
  setIsExecuting: (executing: boolean) => void;
  viewMode: 'canvas' | 'dashboard' | 'neural' | 'governance' | 'cosmos' | 'advisor' | 'info' | 'privacy' | 'about';
  setViewMode: (mode: 'canvas' | 'dashboard' | 'neural' | 'governance' | 'cosmos' | 'advisor' | 'info' | 'privacy' | 'about') => void;
  deleteNode: (nodeId: string) => void;
  saveWorkflow: () => void;
  loadWorkflow: () => boolean;
  resetWorkflow: () => void;
  // Workspace management
  switchWorkspace: (workspaceId: string) => void;
  addWorkspace: (name: string) => void;
  deleteWorkspace: (id: string) => void;
  // Runtime tracking
  runtimeJobs: RuntimeJob[];
  addRuntimeJob: (job: Omit<RuntimeJob, 'id' | 'timestamp'>) => void;
  // Intelligence Layer
  aiInsights: AIInsight[];
  agents: EnterpriseAgent[];
  addInsight: (insight: Omit<AIInsight, 'id' | 'timestamp'>) => void;
  updateAgentStatus: (agentId: string, status: EnterpriseAgent['status'], lastAction: string) => void;
  // Governance & Events
  policies: Policy[];
  events: EnterpriseEvent[];
  simulations: Simulation[];
  addEvent: (event: Omit<EnterpriseEvent, 'id' | 'timestamp'>) => void;
  runSimulation: (sim: Omit<Simulation, 'id'>) => void;
  updatePolicyStatus: (id: string, status: Policy['status']) => void;
  // Sentience Layer
  strategicAdvice: StrategicAdvice[];
  institutionalMemory: MemoryPattern[];
  health: OrganizationalHealth;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  addStrategicAdvice: (advice: Omit<StrategicAdvice, 'id'>) => void;
  recordMemory: (memory: Omit<MemoryPattern, 'id' | 'timestamp'>) => void;
  updateHealth: (health: Partial<OrganizationalHealth>) => void;
};

const getDefaultNodes = (): Node[] => [
  {
    id: 'trigger-0',
    type: 'trigger',
    position: { x: 250, y: 150 },
    data: { label: 'Initialize System', icon: 'Activity' },
  }
];

const DEFAULT_WORKSPACE: Workspace = {
  id: 'arch-dept-001',
  name: 'Architecture Dept',
  nodes: getDefaultNodes(),
  edges: [],
  lastUpdated: new Date().toISOString()
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workspaces: [DEFAULT_WORKSPACE],
  currentWorkspaceId: 'arch-dept-001',
  nodes: DEFAULT_WORKSPACE.nodes,
  edges: DEFAULT_WORKSPACE.edges,
  runtimeJobs: [],
  aiInsights: [],
  agents: [
    { id: 'archive-001', name: 'Archive Agent', role: 'Storage Optimization', status: 'idle', lastAction: 'Scanned backups' },
    { id: 'coord-001', name: 'Coordination Agent', role: 'Schedule Management', status: 'idle', lastAction: 'Resolved meeting conflict' },
    { id: 'cad-001', name: 'CAD Review Agent', role: 'Engineering Standards', status: 'idle', lastAction: 'Verified layer integrity' },
    { id: 'guard-001', name: 'Guardian Agent', role: 'Security Monitoring', status: 'idle', lastAction: 'Audited SSH access' }
  ],
  policies: [
    { id: 'p1', name: 'Data Sovereignty Protocol', rules: ['Local retention only', 'Zero-trust export'], status: 'active', severity: 'critical' },
    { id: 'p2', name: 'CAD Export Governance', rules: ['Architect approval required', 'Watermark injection'], status: 'active', severity: 'standard' },
    { id: 'p3', name: 'AI Operational Limits', rules: ['Max compute threshold: 85%', 'Manual override enabled'], status: 'evaluating', severity: 'standard' }
  ],
  events: [],
  simulations: [],
  strategicAdvice: [],
  institutionalMemory: [],
  health: { stability: 0.98, cognition: 0.92, velocity: 0.85, stress: 0.12 },
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  viewMode: 'canvas',
  setViewMode: (viewMode) => set({ viewMode }),
  
  onNodesChange: (changes: NodeChange[]) => {
    const updatedNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: updatedNodes });
    // Update active workspace snapshot
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: updatedNodes } : w
    );
    set({ workspaces });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const updatedEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: updatedEdges });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, edges: updatedEdges } : w
    );
    set({ workspaces });
  },

  onConnect: (connection: Connection) => {
    const updatedEdges = addEdge({ 
      ...connection, 
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'rgba(0, 242, 255, 0.2)', strokeWidth: 2 }
    }, get().edges);
    set({ edges: updatedEdges });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, edges: updatedEdges } : w
    );
    set({ workspaces });
  },

  addNode: (node: Node) => {
    const updatedNodes = [...get().nodes, node];
    set({ nodes: updatedNodes });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: updatedNodes } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },

  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
  isExecuting: false,
  setIsExecuting: (isExecuting: boolean) => set({ isExecuting }),

  deleteNode: (nodeId: string) => {
    const updatedNodes = get().nodes.filter(n => n.id !== nodeId);
    const updatedEdges = get().edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    set({ nodes: updatedNodes, edges: updatedEdges });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: updatedNodes, edges: updatedEdges } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },

  switchWorkspace: (workspaceId: string) => {
    const workspace = get().workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      set({ 
        currentWorkspaceId: workspaceId,
        nodes: workspace.nodes,
        edges: workspace.edges
      });
    }
  },

  addWorkspace: (name: string) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      nodes: getDefaultNodes(),
      edges: [],
      lastUpdated: new Date().toISOString()
    };
    set({ workspaces: [...get().workspaces, newWs] });
    get().saveWorkflow();
  },

  deleteWorkspace: (id: string) => {
    if (get().workspaces.length <= 1) return;
    const filtered = get().workspaces.filter(w => w.id !== id);
    set({ workspaces: filtered });
    if (get().currentWorkspaceId === id) {
      get().switchWorkspace(filtered[0].id);
    }
    get().saveWorkflow();
  },

  addRuntimeJob: (job) => {
    const newJob: RuntimeJob = {
      ...job,
      id: `job-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    set({ runtimeJobs: [newJob, ...get().runtimeJobs].slice(0, 50) });
  },

  addInsight: (insight) => {
    const newInsight: AIInsight = {
      ...insight,
      id: `insight-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    set({ aiInsights: [newInsight, ...get().aiInsights].slice(0, 10) });
  },

  updateAgentStatus: (agentId, status, lastAction) => {
    const agents = get().agents.map(a => 
      a.id === agentId ? { ...a, status, lastAction } : a
    );
    set({ agents });
  },

  addEvent: (event) => {
    const newEvent: EnterpriseEvent = {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    set({ events: [newEvent, ...get().events].slice(0, 100) });
  },

  runSimulation: (sim) => {
    const newSim: Simulation = {
      ...sim,
      id: `sim-${Date.now()}`
    };
    set({ simulations: [newSim, ...get().simulations].slice(0, 5) });
  },

  updatePolicyStatus: (id, status) => {
    const policies = get().policies.map(p => 
      p.id === id ? { ...p, status } : p
    );
    set({ policies });
  },

  addStrategicAdvice: (advice) => {
    const newAdvice: StrategicAdvice = {
      ...advice,
      id: `advice-${Date.now()}`
    };
    set({ strategicAdvice: [newAdvice, ...get().strategicAdvice].slice(0, 10) });
  },

  recordMemory: (memory) => {
    const newMemory: MemoryPattern = {
      ...memory,
      id: `mem-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    set({ institutionalMemory: [newMemory, ...get().institutionalMemory].slice(0, 50) });
  },

  updateHealth: (health) => {
    set({ health: { ...get().health, ...health } });
  },

  saveWorkflow: () => {
    const { workspaces, currentWorkspaceId } = get();
    localStorage.setItem('voxflow-enterprise-data', JSON.stringify({ 
      workspaces, 
      currentWorkspaceId,
      lastUpdated: new Date().toISOString() 
    }));
  },

  loadWorkflow: () => {
    const saved = localStorage.getItem('voxflow-enterprise-data');
    if (saved) {
      const { workspaces, currentWorkspaceId } = JSON.parse(saved);
      const current = workspaces.find((w: Workspace) => w.id === currentWorkspaceId) || workspaces[0];
      set({ 
        workspaces, 
        currentWorkspaceId: current.id,
        nodes: current.nodes,
        edges: current.edges
      });
      return true;
    }
    return false;
  },

  resetWorkflow: () => {
    const resetNodes = getDefaultNodes();
    set({ nodes: resetNodes, edges: [] });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: resetNodes, edges: [] } : w
    );
    set({ workspaces });
  },
}));
