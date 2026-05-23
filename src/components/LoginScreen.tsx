import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Mail, 
  UserPlus, 
  ArrowRight, 
  RefreshCw, 
  ChevronLeft,
  Terminal as TermIcon,
  Globe,
  Cpu,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';

type AccessTab = 'guest' | 'credentials';
type AuthMode = 'login' | 'register' | 'recovery';

export const LoginScreen = () => {
  const { setCurrentUser } = useWorkflowStore();
  const [activeTab, setActiveTab] = useState<AccessTab>('guest');
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Custom Boot Loader State
  const [isBooting, setIsBooting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);

  // Periodic visual telemetry stats
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memoryLoad, setMemoryLoad] = useState(44);
  const [activeThreads, setActiveThreads] = useState(5);

  useEffect(() => {
    const statTimer = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 25) + 10);
      setMemoryLoad(Math.floor(Math.random() * 10) + 40);
      setActiveThreads(Math.floor(Math.random() * 4) + 4);
    }, 2800);
    return () => clearInterval(statTimer);
  }, []);

  const systemBootSequenceLogs = [
    "LOGIC: Initializing Secure Handshake...",
    "SECURE: Generating Ephemeral TLS Session Keys...",
    "KERNEL: Handshaking with Autonomic Engine Sandbox...",
    "SYNAPSE: Compiling Active Infrastructure Mesh...",
    "DEVICES: Launching Graph Neural Logic Board...",
    "GOVERNOR: Mounting Compliance Sentinel Policies...",
    "SYSTEM: VoxOS Kernel Handshake Complete. Welcome, Architect."
  ];

  // Simulated Boot Script
  useEffect(() => {
    if (!isBooting) return;

    let progressInterval: NodeJS.Timeout;
    let logInterval: NodeJS.Timeout;

    progressInterval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const delta = Math.floor(Math.random() * 15) + 8;
        return Math.min(prev + delta, 100);
      });
    }, 150);

    const speakLogs: string[] = [];
    let logIdx = 0;
    
    logInterval = setInterval(() => {
      if (logIdx < systemBootSequenceLogs.length) {
        speakLogs.push(`[OK] ${systemBootSequenceLogs[logIdx]}`);
        setBootLogs([...speakLogs]);
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [isBooting]);

  useEffect(() => {
    if (isBooting && bootProgress >= 100) {
      const timer = setTimeout(() => {
        // Automatically switch states in store to log in
        setCurrentUser({
          id: activeTab === 'guest' ? 'guest-user' : 'dev-001',
          name: activeTab === 'guest' ? 'Guest_Architect' : 'Developer_drs52',
          role: activeTab === 'guest' ? 'Guest Architect' : 'Lead Architect',
          deptId: 'dept-01'
        });
        setIsBooting(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [bootProgress, isBooting, activeTab, setCurrentUser]);

  const triggerBootAnimation = () => {
    setIsBooting(true);
    setBootProgress(0);
    setBootLogs([`[INIT] Booting Secure Sandbox Session...`]);
  };

  const handleGuestAccess = () => {
    triggerBootAnimation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Developer Mock Access Bypass - direct access if credentials match
    if (mode === 'login' && email === 'drs52ss19@gmail.com' && password === 'developer2024') {
      setTimeout(() => {
        setIsLoading(false);
        triggerBootAnimation();
      }, 600);
      return;
    }
    
    try {
      if (mode === 'login') {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        triggerBootAnimation();
      } else if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update Firebase Auth Profile
        await updateProfile(user, { displayName: name });

        // Create Firestore User Document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          role: 'Architect',
          deptId: 'dept-01',
          createdAt: new Date().toISOString()
        });
        triggerBootAnimation();
      } else {
        await sendPasswordResetEmail(auth, email);
        alert('Verification protocol sent to ' + email + '. Check your neural inbox.');
        setMode('login');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError(
          <div className="space-y-2 normal-case tracking-normal text-left font-sans text-xs">
            <span className="font-bold text-red-400 block uppercase tracking-widest text-[10px] flex items-center gap-1.5">
               <AlertTriangle size={12} /> Fault: AUTH_PROVIDER_DISABLED
            </span>
            <p className="text-white/80 leading-relaxed font-normal">
              Email/Password sign-in method is currently disabled on your Firebase project console.
            </p>
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-mono leading-relaxed space-y-1 mt-1 text-white/70">
               <div>1. Enable Email/Password in <strong className="text-vox-primary">Firebase Sandbox Settings</strong>.</div>
               <div>2. Or, use the bypass login on the right side:</div>
               <div className="text-white">Credentials: <strong className="text-amber-400">drs52ss19@gmail.com</strong> / <strong className="text-amber-400">developer2024</strong></div>
            </div>
          </div>
        );
      } else {
        let message = 'Access Denied: Neural handshake failed.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          message = 'Fault: Identity or crypt crypt-key validation failed.';
        } else if (err.code === 'auth/email-already-in-use') {
          message = 'Fault: Identity vector coordinates already registered.';
        } else if (err.code === 'auth/weak-password') {
          message = 'Fault: Access crypt too simple. Increase safety hash complexity.';
        }
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020308] z-[10000] flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      
      {/* Immersive Starfields & Grids */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,#14192d_0%,transparent_60%)]" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#05070e_1px,transparent_1px),linear-gradient(to_bottom,#05070e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />
      
      <AnimatePresence>
        {isBooting ? (
          /* PRE-BOOT TERMINAL OVERLAY SCREEN - HIGH TECH TRANSITION */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-[10001] flex flex-col items-center justify-center p-8 sm:p-12 font-mono text-emerald-400"
          >
            <div className="w-full max-w-2xl bg-[#030604]/90 border border-emerald-500/20 rounded-3xl p-6 sm:p-10 shadow-[0_0_100px_rgba(16,185,129,0.15)] relative overflow-hidden">
               
               <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full" />
               
               {/* Terminal Top Info Bar */}
               <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4 mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/80">VoxOS v4.2 Kernel Handshaking</span>
                 </div>
                 <span className="text-[9px] text-emerald-500/30">PORT: 3000 // SEC_SHIELD</span>
               </div>

               {/* Live Progress Stats */}
               <div className="space-y-6">
                 <div className="flex items-center justify-between text-xs font-bold font-mono">
                   <span>COMPILING SYNAPSE MODULES:</span>
                   <span className="text-xl text-white font-black">{bootProgress}%</span>
                 </div>

                 {/* Custom Glow Progress Bar */}
                 <div className="w-full h-2 bg-emerald-950/60 rounded-full overflow-hidden border border-emerald-500/10 p-0.5">
                   <motion.div 
                     className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                     style={{ width: `${bootProgress}%` }}
                     transition={{ duration: 0.1 }}
                   />
                 </div>

                 {/* Console Output Log Mesh */}
                 <div className="bg-black/80 rounded-2xl p-5 border border-emerald-500/5 h-48 overflow-y-auto leading-relaxed custom-scrollbar font-mono text-[10px] space-y-1.5 text-emerald-400/80">
                   {bootLogs.map((log, i) => (
                     <div key={i} className="flex gap-2">
                       <span className="text-emerald-500/30 font-bold select-none">❯</span>
                       <span>{log}</span>
                     </div>
                   ))}
                   <div className="w-1.5 h-3.5 bg-emerald-400 animate-pulse inline-block ml-1" />
                 </div>
               </div>

               <div className="mt-6 pt-4 border-t border-emerald-500/10 flex justify-between text-[9px] text-emerald-500/40">
                 <span>SYS STATE: MEM_LOAD={memoryLoad}%</span>
                 <span>INITIALIZATION LOGIC SEQUENCE GUEST</span>
               </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Primary Grid Layout Frame */}
      <div className="w-full max-w-5xl bg-[#090b14]/75 border border-[#1d2644] rounded-[2.5rem] p-4 sm:p-8 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden z-10">
        
        {/* Neon light corner accents */}
        <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-vox-primary via-transparent to-transparent opacity-40" />
        <div className="absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-vox-primary via-transparent to-transparent opacity-40" />
        
        {/* LEFT COLUMN: CYBERPUNK TELEMETRY INTERFACE DECK */}
        <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#171e36] pb-6 md:pb-0 md:pr-8 space-y-8 select-none">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vox-primary/10 to-transparent border border-vox-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.1)]">
                <TermIcon className="text-vox-primary animate-pulse" size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black tracking-widest text-vox-primary uppercase">MEMBER CORE</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-vox-success animate-ping" />
                </div>
                <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase font-display leading-none mt-1">
                  Vox Flow <span className="text-vox-secondary text-lg">OS</span>
                </h1>
              </div>
            </div>
            
            <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-wider font-medium font-sans">
              Autonomous Institutional Synthesis & Flow Control Kernel compiled directly for neural enterprise automation.
            </p>
          </div>

          {/* Interactive Live KPI Telemetry Monitor */}
          <div className="space-y-4 py-4 px-5 rounded-3xl bg-black/40 border border-[#151c31] relative">
            <div className="absolute top-3 right-4 flex items-center gap-2">
              <Activity size={10} className="text-vox-secondary animate-pulse" />
              <span className="text-[7px] font-bold text-white/30 uppercase tracking-[0.2em]">Diagnostic</span>
            </div>

            <h3 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 font-mono">Sandbox Engine Telemetry:</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold tracking-widest text-white/60">
                  <span>COGNICON CORE CPU LOAD</span>
                  <span className="font-mono text-vox-primary">{cpuUsage}%</span>
                </div>
                <div className="h-1.5 bg-[#0e1324] rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full rounded-full bg-vox-primary" style={{ width: `${cpuUsage}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold tracking-widest text-white/60">
                  <span>DYNAMIC MEM_CACHE OCCUPY</span>
                  <span className="font-mono text-vox-secondary">{memoryLoad}%</span>
                </div>
                <div className="h-1.5 bg-[#0e1324] rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full rounded-full bg-vox-secondary" style={{ width: `${memoryLoad}%` }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3 mt-1 text-[8px] font-mono uppercase text-white/40">
              <div>
                <span>GRID LATENCY: </span>
                <span className="text-white font-bold ml-1">4.2ms</span>
              </div>
              <div>
                <span>COMPLY_FAIL: </span>
                <span className="text-green-400 font-bold ml-1">0_DTCT</span>
              </div>
            </div>
          </div>

          {/* Micro-Credits */}
          <div className="flex items-center gap-2 pt-2">
            <Globe className="text-vox-primary animate-spin" size={12} style={{ animationDuration: '24s' }} />
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest font-mono">LINK STABILIZED SECURE_MATRIX</span>
          </div>

        </div>

        {/* RIGHT COLUMN: REBUILT DUAL-STRATEGY TAB CORE CARD */}
        <div className="md:col-span-7 flex flex-col justify-center">
          
          {/* Elite Cyber Panel Wrapper */}
          <div className="space-y-6">
            
            {/* Custom Premium Tabs Selector */}
            <div className="flex border-b border-[#171e36] pb-3 justify-start gap-4">
              <button 
                onClick={() => {
                  setActiveTab('guest');
                  setError(null);
                }}
                className={cn(
                  "relative py-1.5 px-3 text-[10px] sm:text-xs uppercase tracking-widest font-black transition-all",
                  activeTab === 'guest' ? "text-vox-primary font-black" : "text-white/40 hover:text-white"
                )}
              >
                <span>🚀 Sandbox Sandbox Access</span>
                {activeTab === 'guest' && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-vox-primary" 
                  />
                )}
              </button>

              <button 
                onClick={() => {
                  setActiveTab('credentials');
                  setError(null);
                }}
                className={cn(
                  "relative py-1.5 px-3 text-[10px] sm:text-xs uppercase tracking-widest font-black transition-all",
                  activeTab === 'credentials' ? "text-vox-secondary font-black" : "text-white/40 hover:text-white"
                )}
              >
                <span>🔐 Enterprise Cloud Auth</span>
                {activeTab === 'credentials' && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-vox-secondary" 
                  />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'guest' ? (
                /* TAB 1: GUEST ACCESS WITH OUTSTANDING ANIMATED LOGIC CARD */
                <motion.div
                  key="guest-panel"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6 py-2"
                >
                  <div className="space-y-2">
                     <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                       <Zap className="text-vox-primary animate-pulse" size={20} /> Anonymous Pilot Core
                     </h2>
                     <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium">
                       Instant developer sandbox authorization. Recommends bypass.
                     </p>
                  </div>

                  {/* Elite CTA Bypass Deck */}
                  <div className="p-6 rounded-[2rem] bg-gradient-to-br from-vox-primary/10 to-[#0e1323] border border-vox-primary/20 relative shadow-[0_0_30px_rgba(0,229,255,0.05)]">
                     <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-vox-success" />
                        <span className="text-[7px] font-black text-white/40 tracking-wider">No Configuration Required</span>
                     </div>
                     
                     <div className="space-y-4">
                        <p className="text-[10px] leading-relaxed uppercase tracking-wider font-semibold text-white/70">
                           Fully deploy, edit, and run neural meshes entirely client-side. Excellent for rapid workflow testing and dashboard monitoring.
                        </p>

                        <button 
                           onClick={handleGuestAccess}
                           disabled={isBooting}
                           className="w-full py-4 rounded-xl bg-vox-primary text-vox-bg text-[10px] font-black uppercase tracking-[0.25em] shadow-xl hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 group"
                        >
                           Initialize Autonomous Sandbox
                           <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                        </button>
                     </div>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-3.5 items-start">
                     <Shield className="text-vox-primary shrink-0 mt-0.5" size={14} />
                     <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider">
                        Enterprise and Firebase credentials can be synchronized at any time. Offline state is preserved on this browser sandbox.
                     </p>
                  </div>
                </motion.div>
              ) : (
                /* TAB 2: REGISTER/LOGIN WITH FIREBASE AND EXCELENT ERROR HANDLING */
                <motion.div
                  key="credential-panel"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6 py-2"
                >
                   <AnimatePresence mode="wait">
                     <motion.div
                       key={mode}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="space-y-6"
                     >
                       <div className="flex justify-between items-end">
                          <div>
                             <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
                               {mode === 'login' ? 'Vector_Cloud_Access' : mode === 'register' ? 'Register_Identity' : 'Identity_Recovery'}
                             </h2>
                             <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">
                               {mode === 'login' ? 'Establish secure network handshake' : 'Initialize manual Cloud credentials'}
                             </p>
                          </div>
                          <Shield size={22} className="text-vox-secondary opacity-30 animate-pulse" />
                       </div>

                       <form onSubmit={handleSubmit} className="space-y-4">
                         {mode === 'register' && (
                           <AuthInput 
                             icon={Cpu} 
                             type="text" 
                             placeholder="NICKNAME_OR_CODE" 
                             value={name} 
                             onChange={setName} 
                           />
                         )}
                         <AuthInput 
                           icon={Mail} 
                           type="email" 
                           placeholder="EMAIL_VECTOR" 
                           value={email} 
                           onChange={setEmail} 
                         />
                         {mode !== 'recovery' && (
                           <AuthInput 
                             icon={Lock} 
                             type="password" 
                             placeholder="ACCESS_CRYPT_KEY" 
                             value={password} 
                             onChange={setPassword} 
                           />
                         )}

                         {error && (
                           <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-[10px] uppercase tracking-widest leading-relaxed text-red-400">
                              {error}
                           </div>
                         )}

                         <div className="flex gap-3 pt-2">
                           <button 
                             type="submit"
                             disabled={isLoading}
                             className="flex-1 py-4 rounded-xl bg-vox-secondary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                           >
                              {isLoading ? (
                                <RefreshCw size={14} className="animate-spin" />
                              ) : (
                                <>
                                  {mode === 'login' ? 'Establish Link' : mode === 'register' ? 'Create' : 'Recover'} 
                                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                           </button>
                         </div>
                       </form>

                       <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#526490]">
                          {mode === 'login' ? (
                            <>
                               <button onClick={() => setMode('register')} className="hover:text-vox-secondary transition-colors flex items-center gap-1.5">
                                 <UserPlus size={11} /> No vector? <span className="text-vox-secondary">Register Crypt</span>
                               </button>
                               <button onClick={() => setMode('recovery')} className="hover:text-white transition-colors">
                                 Lost Access Crypt? <span className="underline italic">Recover</span>
                               </button>
                            </>
                          ) : (
                            <button onClick={() => setMode('login')} className="hover:text-vox-secondary transition-colors flex items-center gap-1.5">
                               <ChevronLeft size={11} /> Return to cloud gate
                            </button>
                          )}
                       </div>
                     </motion.div>
                   </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* Interactive Global Bottom Deck Info */}
      <div className="fixed bottom-0 left-0 right-0 h-10 px-6 hidden md:flex items-center justify-between border-t border-[#12182c]/80 bg-black/60 backdrop-blur-md opacity-50 z-10 text-[8px] font-black font-mono text-white/30 tracking-widest uppercase">
         <span>VOX_DEX_MESH TERMINATION SEC_SHIELD ACTIVE</span>
         <span>PLATFORM REVOLUTION v4.2 // MULTIPORT INGRESS OK</span>
         <span>DRS_ARCHITECT_LOGGED</span>
      </div>

    </div>
  );
};

const AuthInput = ({ icon: Icon, type, placeholder, value, onChange }: any) => (
  <div className="relative group/input">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within/input:text-vox-secondary transition-colors">
      <Icon size={14} />
    </div>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-black/45 border border-[#161c32] rounded-xl py-3.5 pl-11 pr-4 text-[10px] font-mono text-white focus:outline-none focus:border-vox-secondary/45 transition-all placeholder:text-white/10 group-hover/input:border-white/10"
      required
    />
  </div>
);
