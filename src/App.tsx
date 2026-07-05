/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, MessageSquare, Brain, Zap, UserCheck, 
  Flame, BookOpen, Star, HelpCircle, Trophy, RefreshCw
} from "lucide-react";
import RizzSandbox from "./components/RizzSandbox";
import ChatAuditor from "./components/ChatAuditor";
import SocialGym from "./components/SocialGym";
import VibeCheck from "./components/VibeCheck";
import AskCoach from "./components/AskCoach";

type Tab = "sandbox" | "auditor" | "gym" | "quiz" | "coach";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("sandbox");
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("fumble_user_xp");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Calculate Level based on XP
  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;
  const xpNeededForNextLevel = 100 - xpInCurrentLevel;

  const getRankName = (lvl: number) => {
    if (lvl >= 10) return "Master Charismatic";
    if (lvl >= 7) return "Elite Conversationalist";
    if (lvl >= 5) return "Smooth Talker";
    if (lvl >= 3) return "Confident Beginner";
    return "Aspiring Guy";
  };

  useEffect(() => {
    try {
      localStorage.setItem("fumble_user_xp", xp.toString());
    } catch (e) {
      console.error(e);
    }
  }, [xp]);

  const handleAddXp = (amount: number) => {
    setXp(prev => Math.max(0, prev + amount));
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your experience points and challenges?")) {
      setXp(0);
      try {
        localStorage.removeItem("fumble_user_xp");
        localStorage.removeItem("fumble_daily_challenges");
      } catch (e) {
        console.error(e);
      }
      window.location.reload();
    }
  };

  return (
    <div id="fumble-app-root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans antialiased selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* Dynamic Header */}
      <header className="bg-neutral-900 border-b border-neutral-850 px-4 md:px-6 py-4 shrink-0 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="bg-amber-500 text-neutral-950 p-2.5 rounded-xl font-black text-xl tracking-tighter flex items-center justify-center shadow-lg shadow-amber-500/10">
              Fm
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-neutral-100 font-sans flex items-center justify-center sm:justify-start gap-1.5">
                FUMBLE <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-widest">Coaching Engine</span>
              </h1>
              <p className="text-[11px] text-neutral-400">Stop fumbling. Level up your dating communication and social intelligence.</p>
            </div>
          </div>

          {/* User Rank Card */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 flex items-center gap-4 w-full sm:w-auto shadow-md">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-neutral-950 font-black text-lg shadow-md">
                {level}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-neutral-900 border border-neutral-800 rounded-full p-0.5" title="Level Up Milestone">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </span>
            </div>

            <div className="flex-1 min-w-[120px] space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-neutral-200">{getRankName(level)}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{xp} XP</span>
              </div>
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-850">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${xpInCurrentLevel}%` }}
                />
              </div>
              <p className="text-[9px] text-neutral-500 font-mono text-right">{xpNeededForNextLevel} XP to level {level + 1}</p>
            </div>

            <button
              id="btn-reset-progress"
              onClick={handleResetProgress}
              title="Reset progress"
              className="p-1.5 hover:bg-neutral-900 text-neutral-600 hover:text-neutral-400 rounded-lg transition-colors border border-transparent hover:border-neutral-800"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Tabs / Navigation Navigation Row */}
      <div className="bg-neutral-900/60 border-b border-neutral-850 px-4 py-2 shrink-0">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2 scrollbar-none py-1">
          
          <button
            id="tab-sandbox"
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border whitespace-nowrap ${
              activeTab === "sandbox"
                ? "bg-amber-500 text-neutral-950 border-amber-400 font-black shadow-md shadow-amber-500/10"
                : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:text-neutral-200 hover:border-neutral-700"
            }`}
          >
            <Brain className="w-4 h-4" /> Rizz Sandbox
          </button>

          <button
            id="tab-auditor"
            onClick={() => setActiveTab("auditor")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border whitespace-nowrap ${
              activeTab === "auditor"
                ? "bg-amber-500 text-neutral-950 border-amber-400 font-black shadow-md shadow-amber-500/10"
                : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:text-neutral-200 hover:border-neutral-700"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Chat Auditor
          </button>

          <button
            id="tab-gym"
            onClick={() => setActiveTab("gym")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border whitespace-nowrap ${
              activeTab === "gym"
                ? "bg-amber-500 text-neutral-950 border-amber-400 font-black shadow-md shadow-amber-500/10"
                : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:text-neutral-200 hover:border-neutral-700"
            }`}
          >
            <Zap className="w-4 h-4" /> Social Gym
          </button>

          <button
            id="tab-quiz"
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border whitespace-nowrap ${
              activeTab === "quiz"
                ? "bg-amber-500 text-neutral-950 border-amber-400 font-black shadow-md shadow-amber-500/10"
                : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:text-neutral-200 hover:border-neutral-700"
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Vibe Check
          </button>

          <button
            id="tab-coach"
            onClick={() => setActiveTab("coach")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border whitespace-nowrap ${
              activeTab === "coach"
                ? "bg-amber-500 text-neutral-950 border-amber-400 font-black shadow-md shadow-amber-500/10"
                : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:text-neutral-200 hover:border-neutral-700"
            }`}
          >
            <UserCheck className="w-4 h-4" /> Coach Hotline
          </button>

        </div>
      </div>

      {/* Main App Workspace */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col">
          {activeTab === "sandbox" && <RizzSandbox onAddXp={handleAddXp} />}
          {activeTab === "auditor" && <ChatAuditor onAddXp={handleAddXp} />}
          {activeTab === "gym" && <SocialGym onAddXp={handleAddXp} userXp={xp} />}
          {activeTab === "quiz" && <VibeCheck onAddXp={handleAddXp} />}
          {activeTab === "coach" && <AskCoach onAddXp={handleAddXp} />}
        </div>
      </main>

      {/* Humble Footer */}
      <footer className="bg-neutral-900/40 border-t border-neutral-900 py-3 text-center shrink-0">
        <p className="text-[10px] text-neutral-500">
          Fumble: Modern Social Skills Simulator & Dating Advice. Practice, test, and improve gracefully.
        </p>
      </footer>

    </div>
  );
}
