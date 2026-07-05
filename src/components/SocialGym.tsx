/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChallengeItem } from "../types";
import { DAILY_CHALLENGES } from "../data";
import { CheckCircle, Shield, Award, Sparkles, BookOpen, Flame, Zap } from "lucide-react";
import { motion } from "motion/react";

interface SocialGymProps {
  onAddXp: (amount: number) => void;
  userXp: number;
}

export default function SocialGym({ onAddXp, userXp }: SocialGymProps) {
  const [challenges, setChallenges] = useState<ChallengeItem[]>(() => {
    // Try to restore from localStorage if exists
    try {
      const saved = localStorage.getItem("fumble_daily_challenges");
      return saved ? JSON.parse(saved) : DAILY_CHALLENGES;
    } catch {
      return DAILY_CHALLENGES;
    }
  });

  const toggleChallenge = (id: string) => {
    const updated = challenges.map((chal) => {
      if (chal.id === id) {
        const isNowCompleted = !chal.completed;
        if (isNowCompleted) {
          onAddXp(chal.xp);
        } else {
          onAddXp(-chal.xp); // subtract if unchecked
        }
        return { ...chal, completed: isNowCompleted };
      }
      return chal;
    });

    setChallenges(updated);
    try {
      localStorage.setItem("fumble_daily_challenges", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Confidence":
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      case "Communication":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Reading Cues":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Style & Care":
        return "text-pink-400 bg-pink-500/10 border-pink-500/20";
      default:
        return "text-neutral-400 bg-neutral-500/10";
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / challenges.length) * 100);

  return (
    <div id="social-gym-container" className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-100 font-sans flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" /> Real-World Social Gym
        </h2>
        <p className="text-sm text-neutral-400">
          Theoretical skills are useless without execution. Complete these lightweight, safe, everyday 
          micro-challenges in your real life to level up your social intelligence and inner confidence.
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5">
            <Award className="w-4 h-4 text-amber-400 animate-bounce" />
            <h3 className="text-sm font-bold text-neutral-100">Daily Training Log</h3>
          </div>
          <p className="text-xs text-neutral-400">
            You've smashed <span className="text-amber-400 font-semibold font-mono">{completedCount} of {challenges.length}</span> exercises today.
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          <div className="flex justify-between text-[11px] font-mono text-neutral-500">
            <span>WORKOUT PROGRESS</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* List of Challenges */}
      <div className="grid grid-cols-1 gap-4">
        {challenges.map((chal) => (
          <motion.div
            key={chal.id}
            layoutId={chal.id}
            className={`border rounded-xl p-5 transition-all duration-200 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg ${
              chal.completed
                ? "bg-neutral-900/30 border-neutral-800/60 opacity-75"
                : "bg-neutral-900 border-neutral-850 hover:border-neutral-700"
            }`}
          >
            {/* Completion Sparkle Line */}
            {chal.completed && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            )}

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${getCategoryColor(chal.category)}`}>
                  {chal.category}
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-0.5 font-bold">
                  <Flame className="w-3 h-3 text-amber-500 shrink-0" /> +{chal.xp} XP
                </span>
              </div>

              <div className="space-y-1">
                <h4 className={`text-base font-bold tracking-tight ${chal.completed ? "text-neutral-400 line-through" : "text-neutral-100"}`}>
                  {chal.title}
                </h4>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">{chal.description}</p>
              </div>

              {/* Step instructions */}
              <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-lg p-3 text-xs text-neutral-300 space-y-1.5 font-sans leading-relaxed">
                <p className="font-semibold text-neutral-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Exact Steps To Execute:
                </p>
                <p className="text-neutral-400 italic font-sans">{chal.instructions}</p>
              </div>
            </div>

            {/* Check Action Button */}
            <button
              id={`btn-complete-${chal.id}`}
              onClick={() => toggleChallenge(chal.id)}
              className={`w-full md:w-auto px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border shrink-0 ${
                chal.completed
                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20"
                  : "bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <CheckCircle className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 ${chal.completed ? "text-amber-500 scale-110" : "text-neutral-500"}`} />
              {chal.completed ? "Completed!" : "Done in Real Life"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Philosophy of Social Skills */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-neutral-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-amber-500" /> Crucial Safety & Integrity Notice
        </h4>
        <div className="text-xs text-neutral-400 space-y-2 leading-relaxed font-sans">
          <p>
            1. **No Ultimatums or Entitlement**: Authentic confidence is entirely outcome-independent. 
            Compliment people with the sole intention of making their day slightly brighter, and never wait 
            for validation or special treatment in return.
          </p>
          <p>
            2. **Respect Physical Boundaries**: Always read body language cues. If someone avoids eye contact, 
            responds with short phrases, or has their body angled away, politely exit the conversation. Respecting her space is 
            the single smoothest, most high-value action you can perform.
          </p>
          <p>
            3. **Be Self-Aware**: Nervousness is completely normal and human. When practicing, it is far more 
            charismatic to admit you're slightly nervous than to pretend you are a robotic, overly slick model. Authenticity wins.
          </p>
        </div>
      </div>
    </div>
  );
}
