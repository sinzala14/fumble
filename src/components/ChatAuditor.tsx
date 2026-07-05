/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChatAuditResponse } from "../types";
import { 
  ShieldAlert, Sparkles, CheckCircle2, ArrowRight, 
  HelpCircle, MessageSquare, Flame, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatAuditorProps {
  onAddXp: (amount: number) => void;
}

export default function ChatAuditor({ onAddXp }: ChatAuditorProps) {
  const [draftText, setDraftText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<ChatAuditResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const presetExamples = [
    "hey beautiful, what are you up to tonight? send pics",
    "sorry to bother you, but i was wondering if you might maybe want to go out sometime if you aren't too busy?",
    "So are we actually going to meet up or are you just here for validation? Lol",
    "Hey! I noticed you like coffee. Let's grab some soon."
  ];

  const handleAudit = async (textToAudit: string) => {
    if (!textToAudit.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMessage("");
    setAuditResult(null);

    try {
      const response = await fetch("/api/fumble/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAudit })
      });

      if (!response.ok) {
        throw new Error("Unable to reach the Coach. Check your API key settings.");
      }

      const data = await response.json();
      setAuditResult(data);
      onAddXp(15); // Earn 15 XP for auditing a text!
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to audit message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingStyle = (rating: string) => {
    switch (rating) {
      case "Severe Fumble":
        return {
          bg: "bg-rose-500/10 border-rose-500/30",
          text: "text-rose-400",
          badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: <ShieldAlert className="w-5 h-5 text-rose-400" />
        };
      case "Awkward":
        return {
          bg: "bg-amber-500/10 border-amber-500/30",
          text: "text-amber-400",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: <AlertCircle className="w-5 h-5 text-amber-400" />
        };
      case "Decent":
        return {
          bg: "bg-blue-500/10 border-blue-500/30",
          text: "text-blue-400",
          badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          icon: <HelpCircle className="w-5 h-5 text-blue-400" />
        };
      case "Smooth":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30",
          text: "text-emerald-400",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        };
      default:
        return {
          bg: "bg-neutral-500/10 border-neutral-500/30",
          text: "text-neutral-400",
          badge: "bg-neutral-500/20 text-neutral-300",
          icon: null
        };
    }
  };

  return (
    <div id="chat-auditor-container" className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-100 font-sans flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6 text-amber-500" /> Chat Auditor & Rewriter
        </h2>
        <p className="text-sm text-neutral-400">
          Paste a text, opener, or draft message you are planning to send. The AI Coach will rate its appeal, 
          explain the psychological response, and provide two highly-successful alternatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Input Area */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400 font-mono uppercase">Your Draft Message</label>
            <textarea
              id="txt-audit-draft"
              rows={4}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Paste the message here (e.g. 'hey what's up...')"
              className="w-full bg-neutral-950 text-neutral-100 text-sm border border-neutral-800 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-neutral-600 resize-none font-mono"
            />
          </div>

          <button
            id="btn-audit-submit"
            onClick={() => handleAudit(draftText)}
            disabled={isLoading || !draftText.trim()}
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 px-4 rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                Analyzing Pitfalls...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Audit My Message (+15 XP)
              </>
            )}
          </button>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-mono leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* Quick Sandbox / Presets */}
          <div className="pt-3 border-t border-neutral-800/60 space-y-2.5">
            <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider block">Common Fumbles (Click to Paste):</span>
            <div className="space-y-2">
              {presetExamples.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setDraftText(preset)}
                  className="w-full text-left bg-neutral-950 hover:bg-neutral-850 border border-neutral-800/80 rounded-lg p-2.5 text-xs text-neutral-400 hover:text-neutral-200 transition-all font-sans leading-snug hover:border-neutral-700 block"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            {auditResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Score & Main Feedback card */}
                {(() => {
                  const style = getRatingStyle(auditResult.rating);
                  return (
                    <div className={`border rounded-xl p-5 ${style.bg} space-y-3 shadow-lg`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {style.icon}
                          <span className="font-bold text-sm tracking-wide text-neutral-200 uppercase">Audit Assessment</span>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${style.badge}`}>
                          {auditResult.rating}
                        </span>
                      </div>

                      {auditResult.fumbleCause && (
                        <p className="text-xs font-mono text-amber-400 font-semibold bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10 inline-block">
                          Primary Pitfall: {auditResult.fumbleCause}
                        </p>
                      )}

                      <p className="text-xs text-neutral-300 leading-relaxed font-sans mt-2">
                        {auditResult.critique}
                      </p>
                    </div>
                  );
                })()}

                {/* Better Phrasings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Warm / Honest */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4.5 space-y-2.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Style A: Warm & Sincere
                      </div>
                      <p className="text-[10px] text-neutral-500 leading-normal mt-1">
                        High-value, completely honest, zero-pressure formulation.
                      </p>
                    </div>
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 italic leading-relaxed select-all">
                      "{auditResult.alternativeWarm}"
                    </div>
                    <span className="text-[9px] text-neutral-500 font-mono text-right">Click to select & copy</span>
                  </div>

                  {/* Option 2: Playful / Banter */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4.5 space-y-2.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                        <Flame className="w-4 h-4 animate-pulse" /> Style B: Playful Banter
                      </div>
                      <p className="text-[10px] text-neutral-500 leading-normal mt-1">
                        Light, witty, humorous, and instantly engaging approach.
                      </p>
                    </div>
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 italic leading-relaxed select-all">
                      "{auditResult.alternativePlayful}"
                    </div>
                    <span className="text-[9px] text-neutral-500 font-mono text-right">Click to select & copy</span>
                  </div>
                </div>

                {/* Golden Rules */}
                <div className="bg-neutral-900 border border-neutral-850 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 font-mono uppercase tracking-wider">
                    📌 3 Golden Rules For This Text Category
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-400">
                    {auditResult.goldenRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-500 font-bold font-mono shrink-0">{idx + 1}.</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] border border-dashed border-neutral-800 bg-neutral-900/10 rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-3">
                <Sparkles className="w-12 h-12 text-neutral-700 animate-pulse" />
                <h3 className="text-sm font-semibold text-neutral-400">Analysis Console</h3>
                <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                  Enter your draft text in the builder on the left to get a comprehensive structural evaluation. 
                  Learn what signals you are sending, how to bypass awkwardness, and what to write instead.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
