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
  isFavorite?: boolean;
  description?: string;
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
  executionState: 'idle' | 'running' | 'paused' | 'stepping';
  setExecutionState: (state: 'idle' | 'running' | 'paused' | 'stepping') => void;
  executionHistory: { nodes: Node[], edges: Edge[] }[];
  executionStep: number;
  isExecutionMode: boolean;
  toggleExecutionMode: () => void;
  viewMode: 'canvas' | 'dashboard' | 'neural' | 'governance' | 'cosmos' | 'advisor' | 'info' | 'privacy' | 'about' | 'guide' | 'mission';
  setViewMode: (mode: 'canvas' | 'dashboard' | 'neural' | 'governance' | 'cosmos' | 'advisor' | 'info' | 'privacy' | 'about' | 'guide' | 'mission') => void;
  isSplitLayout: boolean;
  toggleSplitLayout: () => void;
  splitRightView: 'dashboard' | 'neural' | 'cosmos' | 'advisor' | 'governance' | 'mission';
  setSplitRightView: (view: 'dashboard' | 'neural' | 'cosmos' | 'advisor' | 'governance' | 'mission') => void;
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
  updateWorkspaceName: (id: string, name: string) => void;
  toggleFavoriteWorkspace: (id: string) => void;
  duplicateWorkspace: (id: string) => void;
  // PWA Install Prompt State
  deferredPrompt: any;
  setDeferredPrompt: (prompt: any) => void;
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
  contextMenu: { id?: string, x: number, y: number, type: 'node' | 'canvas' } | null;
  setContextMenu: (menu: { id?: string, x: number, y: number, type: 'node' | 'canvas' } | null) => void;
  // Org Structure
  organization: {
    name: string;
    departments: { id: string, name: string, roles: string[] }[];
    users: { id: string, name: string, role: string, deptId: string }[];
  };
  // Historical Health Data
  healthHistory: { time: string, value: number, stability: number, cognition: number, velocity: number, stress: number }[];
  addHealthSnap: (snap: { stability: number, cognition: number, velocity: number, stress: number }) => void;
  // Strategic Objectives
  objectives: { id: string, label: string, progress: number }[];
  updateObjective: (id: string, progress: number) => void;
  // System Vitals
  systemVitals: {
    threads: number;
    meshLoad: number;
    kernelTemp: number;
    storageUsed: string;
    networkOut: string;
    infrastructure: { id: string, name: string, load: string, storage: string, temp: string }[];
  };
  // Templates
  addTemplate: (template: { name: string, nodes: any[], edges: any[] }) => void;
  // Agent Management
  addAgent: (agent: { id: string, name: string, role: string, status: 'idle' | 'executing', lastAction: string }) => void;
  updateAgent: (id: string, updates: Partial<EnterpriseAgent>) => void;
  // Logs & History
  systemLogs: { id: string, timestamp: string, level: 'info' | 'warn' | 'error' | 'sentient', message: string, source: string }[];
  addLog: (log: { level: 'info' | 'warn' | 'error' | 'sentient', message: string, source: string }) => void;
  clearLogs: () => void;
  notifications: { id: string, title: string, message: string, type: 'info' | 'success' | 'warn' | 'error', timestamp: number }[];
  addNotification: (notif: { title: string, message: string, type: 'info' | 'success' | 'warn' | 'error' }) => void;
  removeNotification: (id: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  // Execution
  executeSequence: () => Promise<void>;
  pauseExecution: () => void;
  resumeExecution: () => void;
  stepExecution: () => Promise<void>;
  rewindExecution: () => void;
  analyzeWorkflow: () => Promise<void>;
  // Auth & Roles
  currentUser: { id: string, name: string, role: string, deptId: string } | null;
  setCurrentUser: (user: { id: string, name: string, role: string, deptId: string } | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Templates & Sub-workflows
  customTemplates: { id: string, name: string, nodes: Node[], edges: Edge[] }[];
  saveAsTemplate: (name: string, nodeIds: string[]) => void;
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const getDefaultOrg = () => ({
  name: 'VoxFlow Sentient Corp',
  departments: [],
  users: []
});

const getDefaultNodes = (): Node[] => [];

const DEFAULT_WORKSPACE: Workspace = {
  id: 'init-core',
  name: 'AI Studio & GitHub Sync',
  nodes: [
    { 
      id: 'ai-studio-trigger', 
      type: 'trigger', 
      data: { label: 'Google AI Studio', icon: 'AI', status: 'success' }, 
      position: { x: 100, y: 150 } 
    },
    { 
      id: 'github-backup', 
      type: 'action', 
      data: { label: 'Backup Github Repository', icon: 'Zip', status: 'idle' }, 
      position: { x: 450, y: 150 } 
    },
    { 
      id: 'sync-status-check', 
      type: 'action', 
      data: { label: 'Connectivity Sentinel', icon: 'Globe', status: 'idle' }, 
      position: { x: 800, y: 150 } 
    }
  ],
  edges: [
    { id: 'e1', source: 'ai-studio-trigger', target: 'github-backup', animated: true, type: 'neural' },
    { id: 'e2', source: 'github-backup', target: 'sync-status-check', animated: true, type: 'neural' }
  ],
  lastUpdated: new Date().toISOString()
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workspaces: [DEFAULT_WORKSPACE],
  currentWorkspaceId: DEFAULT_WORKSPACE.id,
  geminiApiKey: '',
  setGeminiApiKey: (geminiApiKey) => set({ geminiApiKey }),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  login: async () => {}, // Handled by SDK
  logout: async () => {
    try {
      const { auth } = await import('../lib/firebase');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      set({ currentUser: null });
    } catch (error) {
      console.error("Logout error:", error);
      set({ currentUser: null }); // Ensure clear even on error
    }
  },
  customTemplates: [],
  saveAsTemplate: (name, nodeIds) => {
    const nodes = get().nodes.filter(n => nodeIds.includes(n.id));
    const edges = get().edges.filter(e => nodeIds.includes(e.source) && nodeIds.includes(e.target));
    const newTemplate = { id: `template-${Date.now()}`, name, nodes, edges };
    set(state => ({ customTemplates: [...state.customTemplates, newTemplate] }));
  },
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  systemLogs: [],
  addLog: (log) => set(state => ({ 
    systemLogs: [{ id: `log-${Date.now()}-${Math.random()}`, timestamp: new Date().toLocaleTimeString(), ...log }, ...state.systemLogs].slice(0, 100) 
  })),
  clearLogs: () => set({ systemLogs: [] }),

  notifications: [],
  addNotification: (notif) => set(state => ({
    notifications: [...state.notifications, { id: `notif-${Date.now()}-${Math.random()}`, ...notif, timestamp: Date.now() }]
  })),
  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  analyzeWorkflow: async () => {
    const { nodes, edges, addStrategicAdvice, updateAgent, addInsight, recordMemory, addLog } = get();
    
    addLog({ level: 'sentient', message: 'Initiating neural analysis mesh...', source: 'GEMINI_ORACLE' });

    try {
      const response = await fetch('/api/analyze-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges })
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();

      if (data.insights) {
        data.insights.forEach((insight: any) => {
          addStrategicAdvice({
            category: Math.random() > 0.5 ? 'velocity' : 'governance',
            title: insight.title,
            recommendation: insight.description,
            rationale: `Neural analysis indicates ${insight.impact} impact on enterprise stability.`,
            actionable: insight.impact === 'high',
            confidence: 0.85 + Math.random() * 0.1
          });

          addInsight({
            type: insight.impact === 'high' ? 'risk' : 'optimization',
            title: insight.title,
            description: insight.description,
            impact: insight.impact
          });
        });

        recordMemory({
          pattern: `Architecture Scan: ${nodes.length} nodes analyzed`,
          occurrence: 'emerging',
          context: 'AI Architect triggered manual optimization scan.'
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      addInsight({
        type: 'anomaly',
        title: 'Neural Link Severed',
        description: 'Failed to communicate with AI Operations Core.',
        impact: 'low'
      });
    } finally {
      updateAgent('coord-001', { status: 'idle', lastAction: 'Analysis complete' });
      updateAgent('guard-001', { status: 'idle', lastAction: 'Audit finished' });
    }
  },

  nodes: [],
  edges: [],
  runtimeJobs: [],
  aiInsights: [],
  agents: [
    { id: 'archive-001', name: 'Archive Agent', role: 'NAS Optimizer & Storage Guardian', status: 'idle', lastAction: 'Systems ready.' },
    { id: 'coord-001', name: 'Coord Agent', role: 'Global Node Synchronizer', status: 'idle', lastAction: 'Monitoring mesh latency.' },
    { id: 'cad-001', name: 'CAD Agent', role: 'Geometric Logic Validator', status: 'idle', lastAction: 'Idle in Forge.' },
    { id: 'guard-001', name: 'Guardian Agent', role: 'Zero-Trust Policy Enforcer', status: 'idle', lastAction: 'Perimeter secure.' }
  ],
  policies: [],
  events: [],
  simulations: [],
  strategicAdvice: [],
  institutionalMemory: [],
  health: { stability: 1, cognition: 1, velocity: 1, stress: 0 },
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  viewMode: 'canvas',
  setViewMode: (viewMode) => set({ viewMode }),
  isSplitLayout: false,
  toggleSplitLayout: () => set((state) => ({ isSplitLayout: !state.isSplitLayout })),
  splitRightView: 'dashboard',
  setSplitRightView: (splitRightView) => set({ splitRightView }),
  healthHistory: Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    value: 70 + Math.random() * 20,
    stability: 0.9 + Math.random() * 0.08,
    cognition: 0.85 + Math.random() * 0.1,
    velocity: 0.7 + Math.random() * 0.2,
    stress: 0.1 + Math.random() * 0.2,
  })),
  contextMenu: null,
  setContextMenu: (contextMenu) => set({ contextMenu }),
  organization: getDefaultOrg(),

  objectives: [
    { id: 'obj-1', label: 'Sovereign Efficiency', progress: 0 },
    { id: 'obj-2', label: 'Policy Integration', progress: 0 },
    { id: 'obj-3', label: 'Autonomous Scaling', progress: 0 }
  ],
  updateObjective: (id, progress) => set(state => ({
    objectives: state.objectives.map(o => o.id === id ? { ...o, progress } : o)
  })),

  systemVitals: {
    threads: 492,
    meshLoad: 14,
    kernelTemp: 34,
    storageUsed: '9.2 TB',
    networkOut: '1.4 GB/s',
    infrastructure: [
      { id: 'CORE-S1', name: 'Primary Mainframe', load: '42%', storage: '12PB', temp: '32°C' },
      { id: 'CAD-ARX', name: 'Deep Storage Vault', load: '18%', storage: '850TB', temp: '18°C' },
      { id: 'AI-NODE', name: 'Cognitive Cluster', load: '94%', storage: '2PB', temp: '44°C' },
      { id: 'SEC-GWY', name: 'Neural Firewall', load: '08%', storage: '120TB', temp: '22°C' }
    ]
  },

  addHealthSnap: (snap) => set(state => ({
    healthHistory: [...state.healthHistory.slice(1), { time: new Date().toLocaleTimeString(), value: snap.stability * 100, ...snap }]
  })),

  addTemplate: (template) => {
    // No-op for now as it's handled by other means
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
    get().saveWorkflow();
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const updatedEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: updatedEdges });
    const workspaces = get().workspaces.map(w => 
      w.id === get().currentWorkspaceId ? { ...w, edges: updatedEdges } : w
    );
    set({ workspaces });
    get().saveWorkflow();
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
    get().saveWorkflow();
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
  executionState: 'idle',
  setExecutionState: (executionState) => set({ executionState }),
  executionHistory: [],
  executionStep: 0,
  
  pauseExecution: () => set({ executionState: 'paused' }),
  resumeExecution: () => set({ executionState: 'running' }),
  
  rewindExecution: () => {
    const { executionHistory } = get();
    if (executionHistory.length > 0) {
      const lastState = executionHistory[executionHistory.length - 1];
      set(state => ({
        nodes: lastState.nodes,
        edges: lastState.edges,
        executionHistory: state.executionHistory.slice(0, -1),
        executionStep: Math.max(0, state.executionStep - 1)
      }));
    }
  },

  executeSequence: async () => {
    const { nodes, edges, setIsExecuting, updateNodeData, addRuntimeJob, updateAgent, addLog } = get();
    set({ executionState: 'running', executionHistory: [], executionStep: 0 });
    setIsExecuting(true);
    
    addLog({ level: 'sentient', message: 'Initiating global neural logic pulse...', source: 'CORE_ORCHESTRATOR' });
    updateAgent('cad-001', { status: 'executing', lastAction: 'Overseeing logic pulse' });
    updateAgent('guard-001', { status: 'executing', lastAction: 'Monitoring security integrity' });
    
    // Reset all nodes to idle status
    const resetNodes = nodes.map(n => ({ ...n, data: { ...n.data, status: 'idle' } }));
    set({ nodes: resetNodes });

    const queue = nodes.filter(n => n.type === 'trigger');
    const processed = new Set<string>();

    while (queue.length > 0) {
      // Check pause state
      while (get().executionState === 'paused') {
        await new Promise(r => setTimeout(r, 100));
      }

      if (get().executionState === 'idle' && get().isExecuting) break; 

      const node = queue.shift()!;
      if (processed.has(node.id)) continue;

      // Check if all prerequisites are met
      const prerequisites = edges.filter(e => e.target === node.id).map(e => e.source);
      const allPreReqsMet = prerequisites.every(id => processed.has(id));

      if (node.type !== 'trigger' && !allPreReqsMet) continue;

      addLog({ level: 'info', message: `Executing node [${node.data.label || node.id}]`, source: 'RUNTIME_ENGINE' });

      // Save history for rewind
      set(state => ({ 
        executionHistory: [...state.executionHistory, { nodes: JSON.parse(JSON.stringify(state.nodes)), edges: JSON.parse(JSON.stringify(state.edges)) }],
        executionStep: state.executionStep + 1
      }));

      // Execute node
      updateNodeData(node.id, { status: 'running' });
      addRuntimeJob({ workspaceId: get().currentWorkspaceId, nodeId: node.id, status: 'running' });
      
      if (node.data.label === 'AI Trigger') {
        const condition = node.data.params?.condition || 'No condition defined';
        addLog({ level: 'sentient', message: `Evaluating AI Condition: "${condition}"`, source: 'GEMINI_ORACLE' });
        await new Promise(r => setTimeout(r, 1500)); // Mimic complex analysis
        addLog({ level: 'sentient', message: 'Condition matched. Activating downstream mesh.', source: 'GEMINI_ORACLE' });
      } else if (node.data.label === 'Figma Hook') {
        const fileRef = node.data.params?.fileRef || 'UNKNOWN_REF';
        addLog({ level: 'info', message: `Nexus established with Figma file [${fileRef}]`, source: 'FIGMA_BRIDGE' });
      } else if (node.data.label === 'VoxCadd Sync') {
        addLog({ level: 'info', message: 'Synchronizing geometric primitives with VoxCadd Runtime', source: 'VOXCADD_CORE' });
      }

      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (node.data.label === 'Human Approval') {
        addLog({ level: 'warn', message: 'Awaiting human authorization for node clearance', source: 'SECURITY_MESH' });
        updateNodeData(node.id, { status: 'awaiting' });
        // Poll for user action
        let resolved = false;
        while (!resolved) {
          await new Promise(r => setTimeout(r, 500));
          const currentNode = get().nodes.find(n => n.id === node.id);
          if (currentNode?.data.status === 'success' || currentNode?.data.status === 'failed') {
            resolved = true;
          }
          if (get().executionState === 'idle') return; // Cancelled
        }
      } else {
        const success = Math.random() > 0.05; 
        const status = success ? 'success' : 'failed';
        if (!success) addLog({ level: 'error', message: `Execution failed at node [${node.data.label}] - LOGIC_FAULT`, source: 'DIAGNOSTIC_SUB' });
        updateNodeData(node.id, { status, lastRun: new Date().toLocaleTimeString() });
        addRuntimeJob({ workspaceId: get().currentWorkspaceId, nodeId: node.id, status });
      }

      const finalNode = get().nodes.find(n => n.id === node.id);
      if (finalNode?.data.status === 'success') {
        processed.add(node.id);
        const downstream = edges.filter(e => e.source === node.id).map(e => nodes.find(n => n.id === e.target)).filter(Boolean) as Node[];
        queue.push(...downstream);
      }

      // If stepping, pause after each node
      if (get().executionState === 'stepping') {
        set({ executionState: 'paused' });
      }
    }

    addLog({ level: 'sentient', message: 'Neural logic pulse completed successfully.', source: 'CORE_ORCHESTRATOR' });
    updateAgent('cad-001', { status: 'idle', lastAction: 'Pulse execution complete' });
    updateAgent('guard-001', { status: 'idle', lastAction: 'Mesh audit successful' });
    set({ executionState: 'idle' });
    setIsExecuting(false);
  },

  stepExecution: async () => {
    const { executionState, resumeExecution } = get();
    if (executionState === 'idle') {
      set({ executionState: 'stepping' });
      get().executeSequence();
    } else {
      set({ executionState: 'stepping' });
      resumeExecution();
    }
  },

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
    if (get().currentWorkspaceId === id && filtered.length > 0) {
      get().switchWorkspace(filtered[0].id);
    }
    get().saveWorkflow();
  },

  updateWorkspaceName: (id: string, name: string) => {
    const workspaces = get().workspaces.map(w => 
      w.id === id ? { ...w, name, lastUpdated: new Date().toISOString() } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },

  toggleFavoriteWorkspace: (id: string) => {
    const workspaces = get().workspaces.map(w => 
      w.id === id ? { ...w, isFavorite: !w.isFavorite, lastUpdated: new Date().toISOString() } : w
    );
    set({ workspaces });
    get().saveWorkflow();
  },

  duplicateWorkspace: (id: string) => {
    const target = get().workspaces.find(w => w.id === id);
    if (!target) return;
    const newWs: Workspace = {
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${target.name} (Copy)`,
      nodes: JSON.parse(JSON.stringify(target.nodes)),
      edges: JSON.parse(JSON.stringify(target.edges)),
      isFavorite: target.isFavorite,
      lastUpdated: new Date().toISOString()
    };
    set({ workspaces: [...get().workspaces, newWs] });
    get().saveWorkflow();
  },

  deferredPrompt: null,
  setDeferredPrompt: (prompt: any) => set({ deferredPrompt: prompt }),

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
      try {
        const { workspaces, currentWorkspaceId } = JSON.parse(saved);
        if (!Array.isArray(workspaces) || workspaces.length === 0) return false;
        
        const current = workspaces.find((w: Workspace) => w && w.id === currentWorkspaceId) || workspaces[0];
        if (!current) return false;

        set({ 
          workspaces, 
          currentWorkspaceId: current.id,
          nodes: current.nodes || [],
          edges: current.edges || []
        });
        return true;
      } catch (e) {
        console.error("Failed to parse saved workflow:", e);
        return false;
      }
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
}))
