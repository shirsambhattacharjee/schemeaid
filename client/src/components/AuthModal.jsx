import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../config/firebase';

export default function AuthModal({ isOpen, onClose, darkMode }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className={`w-full max-w-md border rounded-2xl p-6 space-y-4 relative shadow-2xl ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold">{authMode === 'login' ? 'Sign In to SchemeAid' : 'Create Account'}</h3>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded-lg text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs cursor-pointer">
            {authMode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/40">
          <button 
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
            className="text-xs text-emerald-500 font-semibold hover:underline"
          >
            {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}