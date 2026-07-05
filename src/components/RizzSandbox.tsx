/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Scenario, ConversationMessage } from "../types";
import { SCENARIOS } from "../data";
import { 
  Send, Sparkles, AlertTriangle, CheckCircle, Flame, 
  ArrowLeft, Brain, User, RefreshCw, MessageSquare, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RizzSandboxProps {
  onAddXp: (amount: number) => void;
}

export default function RizzSandbox({ onAddXp }: RizzSandboxProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coachInsight, setCoachInsight] = useState<{
    score: number;
    level: "Fumble" | "Average" | "Smooth" | "Rizzler";
    critique: string;
    suggestion: string;
  } | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleStartScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCoachInsight(null);
    setMessages([
      {
        id: "msg-init",
        sender: "character",
        text: scenario.initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !selectedScenario) return;

    const userText = inputValue;
    setInputValue("");
    setIsLoading(true);

    const userMsg: ConversationMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/fumble/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: selectedScenario,
          messages: updatedMessages.filter(m => m.id !== "msg-init"), // omit system/init if empty/system
          userMessage: userText
        })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the social simulator. Please ensure the API key is configured.");
      }

      const data = await response.json();

      // Add character message with analysis
      const characterMsg: ConversationMessage = {
        id: `msg-char-${Date.now()}`,
        sender: "character",
        text: data.characterReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rizzAnalysis: data.analysis
      };

      setMessages(prev => [...prev, characterMsg]);
      setCoachInsight(data.analysis);

      // Award XP based on Rizz performance!
      let xpAward = 10; // baseline
      if (data.analysis.level === "Rizzler") xpAward = 30;
      else if (data.analysis.level === "Smooth") xpAward = 20;
      else if (data.analysis.level === "Average") xpAward = 12;
      else xpAward = 5; // Fumble

      onAddXp(xpAward);

    } catch (error: any) {
      console.error(error);
      const errorMsg: ConversationMessage = {
        id: `msg-err-${Date.now()}`,
        sender: "character",
        text: `⚠️ Coaching Link Interrupted: ${error.message || "Failed to contact coach API."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (selectedScenario) {
      handleStartScenario(selectedScenario);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Intermediate":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Advanced":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-400";
    }
  };

  const getRizzLevelBadge = (level: string) => {
    switch (level) {
      case "Rizzler":
        return "bg-violet-500/20 text-violet-400 border border-violet-500/30";
      case "Smooth":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "Average":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "Fumble":
        return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
      default:
        return "bg-neutral-500/20 text-neutral-400";
    }
  };

  return (
    <div id="rizz-sandbox-container" className="h-full flex flex-col">
      {!selectedScenario ? (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-100 font-sans flex items-center justify-center gap-2">
              <Brain className="w-6 h-6 text-amber-500 animate-pulse" /> The Rizz Sandbox
            </h2>
            <p className="text-sm text-neutral-400">
              Practice real-world dating and social conversations. Receive live coaching feedback, 
              numerical charisma scores, and detailed tips on how to improve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {SCENARIOS.map((scen) => (
              <motion.div
                key={scen.id}
                whileHover={{ scale: 1.01, translateY: -2 }}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{scen.avatar}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getDifficultyBadge(scen.difficulty)}`}>
                      {scen.difficulty}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100">{scen.title}</h3>
                    <p className="text-xs text-amber-400 font-mono mt-0.5">Roleplay Partner: {scen.characterName}</p>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{scen.description}</p>
                </div>
                <button
                  id={`btn-start-${scen.id}`}
                  onClick={() => handleStartScenario(scen)}
                  className="w-full bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-xs font-semibold py-2.5 rounded-lg border border-neutral-700 hover:border-amber-400 transition-all duration-200"
                >
                  Enter Practice Lounge
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-neutral-950">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col border-r border-neutral-900 h-full">
            {/* Header */}
            <div className="bg-neutral-900 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  id="btn-back-scenarios"
                  onClick={() => setSelectedScenario(null)}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-100 transition-colors"
                  title="Back to Scenarios"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl">{selectedScenario.avatar}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-100">{selectedScenario.characterName}</h4>
                    <p className="text-[10px] text-neutral-400 leading-none">{selectedScenario.context}</p>
                  </div>
                </div>
              </div>
              <button
                id="btn-reset-scenario"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restart
              </button>
            </div>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950">
              <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-lg p-3 text-center text-xs text-neutral-400 max-w-lg mx-auto space-y-1">
                <p className="font-semibold text-amber-500 flex items-center justify-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Objective
                </p>
                <p>{selectedScenario.description}</p>
              </div>

              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 space-y-1 shadow-md transition-all ${
                      msg.sender === "user"
                        ? "bg-amber-600 text-neutral-950 font-medium rounded-tr-none"
                        : "bg-neutral-900 text-neutral-200 rounded-tl-none border border-neutral-800"
                    }`}
                  >
                    <div className="text-[10px] opacity-60 font-mono flex items-center gap-1">
                      {msg.sender === "user" ? (
                        <>You <User className="w-2.5 h-2.5 inline" /></>
                      ) : (
                        <>{selectedScenario.characterName} {selectedScenario.avatar}</>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    <span className="block text-[9px] opacity-40 text-right mt-1 font-mono">{msg.timestamp}</span>

                    {/* Inline micro score details if character responded */}
                    {msg.sender === "character" && msg.rizzAnalysis && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-neutral-400">Rizz Grade:</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] ${getRizzLevelBadge(msg.rizzAnalysis.level)}`}>
                            {msg.rizzAnalysis.level}
                          </span>
                          <span className="text-amber-400 font-bold">{msg.rizzAnalysis.score}/100</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900 text-neutral-300 rounded-2xl rounded-tl-none border border-neutral-800 px-4 py-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400">{selectedScenario.characterName} is typing...</span>
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="bg-neutral-900 p-3 border-t border-neutral-800 flex gap-2">
              <input
                id="input-rizz-text"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder={`Type your reply to ${selectedScenario.characterName}...`}
                className="flex-1 bg-neutral-950 text-neutral-100 text-sm border border-neutral-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder-neutral-500"
              />
              <button
                id="btn-send-rizz"
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 p-2.5 rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-amber-500 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Coaching & Rizz Review Sidebar */}
          <div className="w-full lg:w-80 bg-neutral-900/60 p-4 border-t lg:border-t-0 border-neutral-900 flex flex-col space-y-4 overflow-y-auto max-h-[400px] lg:max-h-full">
            <div className="flex items-center space-x-2 border-b border-neutral-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <h4 className="text-sm font-bold text-neutral-100 font-sans uppercase tracking-wider">Coach Feedback</h4>
            </div>

            {coachInsight ? (
              <div className="space-y-4">
                {/* Score Dial */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-center space-y-2">
                  <div className="text-[10px] text-neutral-500 font-mono uppercase">CHARISMA SCORE</div>
                  <div className="relative inline-flex items-center justify-center">
                    <span className="text-3xl font-bold font-mono text-neutral-100">{coachInsight.score}</span>
                    <span className="text-xs text-neutral-500 font-mono">/100</span>
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${getRizzLevelBadge(coachInsight.level)}`}>
                      {coachInsight.level}
                    </span>
                  </div>
                </div>

                {/* Critique */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-purple-400" /> Coaching Analysis
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{coachInsight.critique}</p>
                </div>

                {/* Suggestion */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Recommended Phrasing
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-2.5 text-xs text-amber-100 leading-relaxed italic font-sans select-all selection:bg-amber-500/30">
                    "{coachInsight.suggestion}"
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-tight">
                    Tip: Try clicking to copy, or study the structure—authentic confidence starts with being comfortable with yourself!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2 border border-dashed border-neutral-800 rounded-xl">
                <Brain className="w-10 h-10 text-neutral-600" />
                <p className="text-xs text-neutral-400 font-semibold">Ready for Review</p>
                <p className="text-[10px] text-neutral-500 leading-normal">
                  Type your first reply in the chat! The AI Coach will instantly critique your tone, phrasing, and approach.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
