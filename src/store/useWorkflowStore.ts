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
  isExecutionMode: boolean;
  toggleExecutionMode: () => void;
  viewMode: 'canvas' | 'dashboard' | 'neural' | 'governance' | 'cosmos' | 'advisor' | 'info' | 'privacy' | 'about' | 'guide';
  setViewMode: (mode: 'canvas' | 'dashboard' | 'neural' | 'governance' | 'cosmos' | 'advisor' | 'info' | 'privacy' | 'about' | 'guide') => void;
  deselectNodes: () => void;
  setNodesHidden: (nodeIds: string[], hidden: boolean) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
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
  // Undo/Redo
  past: { nodes: Node[], edges: Edge[] }[];
  future: { nodes: Node[], edges: Edge[] }[];
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
  addStrategicAdvice: (advice: Omit<StrategicAdvice, 'id'>) => void;
  recordMemory: (memory: Omit<MemoryPattern, 'id' | 'timestamp'>) => void;
  updateHealth: (health: Partial<OrganizationalHealth>) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  createGroup: (nodeIds: string[], label?: string) => void;
  // Context Menu
  contextMenu: { id: string, x: number, y: number } | null;
  setContextMenu: (menu: { id: string, x: number, y: number } | null) => void;
  // Org Structure
  organization: {
    name: string;
    departments: { id: string, name: string, roles: string[] }[];
    users: { id: string, name: string, role: string, deptId: string }[];
  };
  // Historical Health Data
  healthHistory: { timestamp: string, stability: number, cognition: number, velocity: number, stress: number }[];
  addHealthSnap: (snap: { stability: number, cognition: number, velocity: number, stress: number }) => void;
  // Templates
  addTemplate: (template: { name: string, nodes: any[], edges: any[] }) => void;
  // Agent Management
  addAgent: (agent: { id: string, name: string, role: string, status: 'idle' | 'executing', lastAction: string }) => void;
  updateAgent: (id: string, updates: Partial<EnterpriseAgent>) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
};

const getDefaultOrg = () => ({
  name: 'ABC Architects Pvt Ltd',
  departments: [
    { id: 'dept-01', name: 'Board / Directors', roles: ['Principal Architect', 'Director', 'Board Member'] },
    { id: 'dept-02', name: 'Administration', roles: ['Admin Head', 'Office Assistant'] },
    { id: 'dept-03', name: 'HR Department', roles: ['HR Manager'] },
    { id: 'dept-04', name: 'Accounts / Finance', roles: ['Accountant'] },
    { id: 'dept-05', name: 'IT / Server Control', roles: ['IT Administrator'] },
    { id: 'dept-06', name: 'Architecture Department', roles: ['Senior Architect', 'Junior Architect', 'Draughtsman', 'BIM Modeler'] },
    { id: 'dept-07', name: 'Interior Department', roles: ['Interior Designer', 'Senior Interior Architect'] },
  ],
  users: [
    { id: 'u-1', name: 'Alex Rivera', role: 'Principal Architect', deptId: 'dept-01' },
    { id: 'u-2', name: 'Sarah Chen', role: 'Senior Architect', deptId: 'dept-06' },
    { id: 'u-3', name: 'Michael Ross', role: 'IT Administrator', deptId: 'dept-05' },
  ]
});

const getDefaultNodes = (): Node[] => [
  {
    id: 'trigger-0',
    type: 'trigger',
    position: { x: 50, y: 150 },
    data: { label: 'Operational Core', icon: 'Activity' },
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
  geminiApiKey: '',
  setGeminiApiKey: (geminiApiKey) => set({ geminiApiKey }),
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
  contextMenu: null,
  setContextMenu: (contextMenu) => set({ contextMenu }),
  organization: getDefaultOrg(),

  healthHistory: Array.from({ length: 24 }).map((_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    stability: 0.9 + Math.random() * 0.08,
    cognition: 0.85 + Math.random() * 0.1,
    velocity: 0.7 + Math.random() * 0.2,
    stress: 0.1 + Math.random() * 0.2,
  })),

  addHealthSnap: (snap) => set(state => ({
    healthHistory: [...state.healthHistory.slice(1), { timestamp: new Date().toISOString(), ...snap }]
  })),

  addTemplate: (template) => {
    // In a real app we'd save to a backend/DB. For now we can just log or push to a local list if we had one.
    // The user wants to see it in the sidebar. We'll need a state for custom templates.
    set(state => ({
      // We'll use a hidden state or just a notification for now, or update the sidebar's templates if they were in store.
      // Let's assume we want to track them.
    }));
  },

  addAgent: (agent) => set(state => ({ agents: [...state.agents, agent] })),
  
  updateAgent: (id, updates) => set(state => ({
    agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  
  deselectNodes: () => {
    const updatedNodes = get().nodes.map(n => ({ ...n, selected: false }));
    set({ nodes: updatedNodes });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: updatedNodes } : w
    );
    set({ workspaces });
  },

  setNodesHidden: (nodeIds, hidden) => {
    const updatedNodes = get().nodes.map(n => 
      nodeIds.includes(n.id) ? { ...n, hidden } : n
    );
    set({ nodes: updatedNodes });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: updatedNodes } : w
    );
    set({ workspaces });
  },

  past: [],
  future: [],

  takeSnapshot: () => {
    const { nodes, edges, past } = get();
    const lastSnapshot = past[past.length - 1];
    if (lastSnapshot && 
        JSON.stringify(lastSnapshot.nodes) === JSON.stringify(nodes) && 
        JSON.stringify(lastSnapshot.edges) === JSON.stringify(edges)) {
      return;
    }
    set({ 
      past: [...past, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }].slice(-50),
      future: [] 
    });
  },

  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: newPast,
      future: [{ nodes, edges }, ...future].slice(0, 50)
    });

    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: previous.nodes, edges: previous.edges } : w
    );
    set({ workspaces });
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, { nodes, edges }],
      future: newFuture
    });

    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: next.nodes, edges: next.edges } : w
    );
    set({ workspaces });
  },
  
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
      type: 'neural',
      animated: true,
    }, get().edges);
    set({ edges: updatedEdges });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, edges: updatedEdges } : w
    );
    set({ workspaces });
  },

  addNode: (node: Node) => {
    get().takeSnapshot();
    const updatedNodes = [...get().nodes, node];
    set({ nodes: updatedNodes });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: updatedNodes } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },

  setNodes: (nodes: Node[]) => {
    set({ nodes });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },

  updateNodeData: (nodeId: string, data: any) => {
    get().takeSnapshot();
    const updatedNodes = get().nodes.map(n => 
      n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
    );
    set({ nodes: updatedNodes });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: updatedNodes } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },

  createGroup: (nodeIds, label = 'Neural Cluster') => {
    if (nodeIds.length === 0) return;
    get().takeSnapshot();
    
    // Calculate bounding box
    const targetNodes = get().nodes.filter(n => nodeIds.includes(n.id));
    const minX = Math.min(...targetNodes.map(n => n.position.x)) - 40;
    const minY = Math.min(...targetNodes.map(n => n.position.y)) - 60;
    const maxX = Math.max(...targetNodes.map(n => n.position.x + (n.width || 250))) + 40;
    const maxY = Math.max(...targetNodes.map(n => n.position.y + (n.height || 100))) + 40;

    const groupId = `group-${Date.now()}`;
    const groupNode = {
      id: groupId,
      type: 'group',
      position: { x: minX, y: minY },
      style: { width: maxX - minX, height: maxY - minY },
      data: { label, isCollapsed: false },
    };

    // Update nodes to be children of the group
    const updatedNodes = get().nodes.map(n => {
      if (nodeIds.includes(n.id)) {
        return { 
          ...n, 
          parentNode: groupId, 
          position: { 
            x: n.position.x - minX, 
            y: n.position.y - minY 
          },
          selected: false
        };
      }
      return n;
    });

    const finalNodes = [...updatedNodes, groupNode];
    set({ nodes: finalNodes });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: finalNodes } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, edges } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },
  isExecuting: false,
  setIsExecuting: (isExecuting: boolean) => set({ isExecuting }),
  isExecutionMode: false,
  toggleExecutionMode: () => set((state) => ({ isExecutionMode: !state.isExecutionMode })),

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

  updateNodeLabel: (nodeId: string, label: string) => {
    const updatedNodes = get().nodes.map(n => 
      n.id === nodeId ? { ...n, data: { ...n.data, label } } : n
    );
    set({ nodes: updatedNodes });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, nodes: updatedNodes } : w
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
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      nodes: getDefaultNodes(),
      edges: [],
      lastUpdated: new Date().toISOString()
    };
    set({ workspaces: [...get().workspaces, newWs] });
    get().switchWorkspace(newWs.id);
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
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    set({ runtimeJobs: [newJob, ...get().runtimeJobs].slice(0, 50) });
  },

  addInsight: (insight) => {
    const newInsight: AIInsight = {
      ...insight,
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    set({ events: [newEvent, ...get().events].slice(0, 100) });
  },

  runSimulation: (sim) => {
    const newSim: Simulation = {
      ...sim,
      id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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
      id: `advice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    set({ strategicAdvice: [newAdvice, ...get().strategicAdvice].slice(0, 10) });
  },

  recordMemory: (memory) => {
    const newMemory: MemoryPattern = {
      ...memory,
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
