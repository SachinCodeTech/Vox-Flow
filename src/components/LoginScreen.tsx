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
  Terminal,
  Globe,
  Cpu
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

type AuthMode = 'login' | 'register' | 'recovery';

export const LoginScreen = () => {
  const { setCurrentUser } = useWorkflowStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Developer Mock Access Bypass
    if (mode === 'login' && email === 'drs52ss19@gmail.com' && password === 'developer2024') {
      setTimeout(() => {
        setCurrentUser({
          id: 'dev-001',
          name: 'Developer_drs52',
          role: 'Lead Architect',
          deptId: 'dept-01'
        });
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
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
      } else {
        await sendPasswordResetEmail(auth, email);
        alert('Verification protocol sent to ' + email + '. Check your neural inbox.');
        setMode('login');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let message = 'Access Denied: Neural handshake failed.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Fault: Identity or crypt validation failed.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'Fault: Identity vector already registered.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Fault: Access crypt too simple. Increase complexity.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-vox-bg z-[10000] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Layer: OS Wallpaper Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.05),transparent_70%)] invisible sm:visible" />
        <div className="absolute inset-0 bg-[#020202]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 filter blur-sm grayscale" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Top Branding (Desktop Boot Style) */}
        <div className="flex flex-col items-center mb-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-2 border-vox-primary/20 flex items-center justify-center mb-6 relative group"
            >
                <div className="absolute inset-0 rounded-full border-t-2 border-vox-primary animate-spin" />
                <Terminal className="text-vox-primary" size={24} />
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">VoxOS <span className="text-vox-primary/50 text-sm align-top ml-1">v4.2</span></h1>
            <p className="text-[9px] font-black text-vox-primary uppercase tracking-[0.6em] mt-3">Autonomous Institutional Kernel</p>
        </div>

        <div className="bg-vox-bg/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                   <div>
                      <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
                        {mode === 'login' ? 'Vector_Access' : mode === 'register' ? 'Create_Identity' : 'Identity_Recovery'}
                      </h2>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">
                        {mode === 'login' ? 'Establish secure handshake' : 'Initialize sentient profile'}
                      </p>
                   </div>
                   <Shield size={24} className="text-vox-primary opacity-20" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <AuthInput 
                      icon={Cpu} 
                      type="text" 
                      placeholder="NICKNAME_OR_ID" 
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
                      placeholder="ACCESS_CRYPT" 
                      value={password} 
                      onChange={setPassword} 
                    />
                  )}

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-400 uppercase tracking-widest">
                       Fault: {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-vox-primary text-vox-bg text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-vox-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden mt-6"
                  >
                     {isLoading ? (
                       <RefreshCw size={14} className="animate-spin mx-auto" />
                     ) : (
                       <span className="flex items-center justify-center gap-2">
                         {mode === 'login' ? 'Authorize' : mode === 'register' ? 'Initialize' : 'Reset'} 
                         <ArrowRight size={14} />
                       </span>
                     )}
                  </button>
                </form>

                <div className="flex flex-col gap-3 pt-4">
                   {mode === 'login' ? (
                     <>
                        <button onClick={() => setMode('register')} className="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-vox-primary transition-colors flex items-center justify-center gap-2">
                          <UserPlus size={12} /> No identity vector? <span className="text-vox-primary">Register</span>
                        </button>
                        <button onClick={() => setMode('recovery')} className="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">
                          Identity crypt lost? <span className="underline italic">Recover</span>
                        </button>
                     </>
                   ) : (
                     <button onClick={() => setMode('login')} className="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-vox-primary transition-colors flex items-center justify-center gap-2">
                        <ChevronLeft size={12} /> Back to authentication
                     </button>
                   )}
                </div>
              </motion.div>
            </AnimatePresence>
        </div>

        {/* Global Footer Tray (Mock OS System Bar) */}
        <div className="mt-12 flex items-center justify-center gap-8">
           <div className="flex items-center gap-2">
              <Globe size={11} className="text-vox-success animate-pulse" />
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Neural Link: Online</span>
           </div>
           <div className="flex items-center gap-2">
              <Lock size={11} className="text-vox-primary" />
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">AES-256 Mesh Encrypted</span>
           </div>
        </div>
      </motion.div>
      
      {/* OS Navigation Placeholder (Visual Only) */}
      <div className="fixed bottom-0 left-0 right-0 h-12 flex items-center justify-center gap-4 border-t border-white/5 bg-black/40 backdrop-blur-md opacity-20 pointer-events-none">
         {[...Array(6)].map((_, i) => (
           <div key={i} className="w-8 h-8 rounded-lg bg-white/10" />
         ))}
      </div>
    </div>
  );
};

const AuthInput = ({ icon: Icon, type, placeholder, value, onChange }: any) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-vox-primary transition-colors">
      <Icon size={16} />
    </div>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-mono text-white focus:outline-none focus:border-vox-primary/50 transition-all placeholder:text-white/5 group-hover:border-white/20"
      required
    />
  </div>
);

