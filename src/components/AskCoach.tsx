/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CoachPlanResponse } from "../types";
import { 
  Sparkles, ShieldAlert, Award, MessageCircle, Send, 
  Flame, HelpCircle, CheckCircle, Lightbulb, UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AskCoachProps {
  onAddXp: (amount: number) => void;
}

export default function AskCoach({ onAddXp }: AskCoachProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<CoachPlanResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const presetQuestions = [
    "I'm at the gym and there is a girl I keep locking eyes with. How do I start talking to her without looking creepy?",
    "I accidentally sent an overly long double-text last night and she left me on read. How do I recover?",
    "We are going on a first date this Friday. What are 3 good conversational questions to keep things fun?",
    "I want to ask my co-worker out but I don't want to make things awkward if she says no."
  ];

  const handleAsk = async (userQuery: string) => {
    if (!userQuery.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMessage("");
    setResponse(null);

    try {
      const res = await fetch("/api/fumble/ask-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery })
      });

      if (!res.ok) {
        throw new Error("Dating Advice Hotline currently offline. Check your Secrets configuration.");
      }

      const data = await res.json();
      setResponse(data);
      onAddXp(25); // Ask a query gets 25 XP!
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to query the Coach. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ask-coach-container" className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-100 font-sans flex items-center justify-center gap-2">
          <UserCheck className="w-6 h-6 text-amber-500" /> Ask the Fumble Coach
        </h2>
        <p className="text-sm text-neutral-400">
          Got a very specific scenario? Type it below. Receive highly strategic, pressure-free dating advice, 
          actionable blueprints, safe phrases to say, and traps to dodge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Ask Input */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400 font-mono uppercase">Your Situation or Question</label>
            <textarea
              id="txt-coach-query"
              rows={5}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., 'There's a girl in my university class that I want to talk to, but she's always with friends. How do I approach?'"
              className="w-full bg-neutral-950 text-neutral-100 text-sm border border-neutral-800 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-neutral-600 resize-none font-sans leading-relaxed"
            />
          </div>

          <button
            id="btn-ask-coach-submit"
            onClick={() => handleAsk(query)}
            disabled={isLoading || !query.trim()}
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 px-4 rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                Consulting Expert...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Ask Master Coach (+25 XP)
              </>
            )}
          </button>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-mono leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* Preset Questions */}
          <div className="pt-3 border-t border-neutral-800/60 space-y-2.5">
            <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider block">Common Scenarios:</span>
            <div className="space-y-2">
              {presetQuestions.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(preset)}
                  className="w-full text-left bg-neutral-950 hover:bg-neutral-850 border border-neutral-800/80 rounded-lg p-2.5 text-xs text-neutral-400 hover:text-neutral-200 transition-all font-sans leading-snug hover:border-neutral-700 block"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Advice Output */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            {response ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Situation Assessment */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3 shadow-lg">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
                    <span className="text-xs font-bold text-neutral-200 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                      <HelpCircle className="w-4 h-4 text-amber-500 animate-pulse" /> Strategic Blueprint
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-neutral-400 font-mono uppercase">REQUISITE CONFIDENCE</span>
                      <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {response.confidenceScore}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans font-medium italic">
                    "{response.assessment}"
                  </p>
                </div>

                {/* Steps to Execute */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Steps to Take (Action Guide)
                  </h4>
                  <ul className="space-y-2.5">
                    {response.strategicSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed text-xs text-neutral-300">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verbatim Scripts */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-violet-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 animate-pulse" /> Exact Phrasing / Text Templates
                  </h4>
                  <p className="text-[10px] text-neutral-500 leading-none">
                    Tailored templates to say or text. Copy and adapt to your personal style:
                  </p>
                  <div className="space-y-2 pt-1">
                    {response.phrasesToUse.map((phrase, idx) => (
                      <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 italic leading-relaxed select-all">
                        "{phrase}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Traps to Dodge */}
                <div className="bg-neutral-900/40 border border-rose-500/20 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Crucial Traps & Red Flags to Avoid
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-400">
                    {response.trapsToAvoid.map((trap, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed text-rose-300/90">
                        <span className="text-rose-500 font-extrabold shrink-0">⚠️</span>
                        <span>{trap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] border border-dashed border-neutral-800 bg-neutral-900/10 rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-3">
                <Sparkles className="w-12 h-12 text-neutral-700 animate-pulse" />
                <h3 className="text-sm font-semibold text-neutral-400">Consultation Screen</h3>
                <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                  Type your real relationship, text, or social anxiety question on the left. The coach will supply a complete blueprint 
                  complete with psychological insight and direct phrase templates.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
