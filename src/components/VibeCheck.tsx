/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { VibeQuizQuestion } from "../types";
import { VIBE_QUIZ } from "../data";
import { Check, X, ShieldCheck, RefreshCw, Award, Sparkles, Brain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VibeCheckProps {
  onAddXp: (amount: number) => void;
}

export default function VibeCheck({ onAddXp }: VibeCheckProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answersLog, setAnswersLog] = useState<{ qIdx: number; score: number; chosenOptionId: string }[]>([]);

  const currentQuestion = VIBE_QUIZ[currentQuestionIdx];

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isAnswered) return;
    
    const option = currentQuestion.options.find(o => o.id === selectedOptionId);
    if (!option) return;

    setIsAnswered(true);
    setTotalScore(prev => prev + option.score);
    setAnswersLog(prev => [...prev, { qIdx: currentQuestionIdx, score: option.score, chosenOptionId: selectedOptionId }]);

    // Award XP proportional to the quiz performance
    if (option.score === 100) {
      onAddXp(20); // Golden answer
    } else if (option.score >= 50) {
      onAddXp(10); // Solid answer
    } else {
      onAddXp(2); // Fumbled answer
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);

    if (currentQuestionIdx + 1 < VIBE_QUIZ.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setTotalScore(0);
    setQuizFinished(false);
    setAnswersLog([]);
  };

  const getScoreSummary = (averageScore: number) => {
    if (averageScore >= 90) {
      return {
        title: "The Ultimate Rizzler",
        desc: "You have exceptionally high social intuition! You read body language clearly, respect personal boundaries, and communicate with relaxed charisma.",
        emoji: "👑"
      };
    } else if (averageScore >= 60) {
      return {
        title: "Socially Intelligent Companion",
        desc: "You understand the basics and make solid, respectful choices, but you sometimes fall into safe or slightly awkward routines. With more practice, you'll be lethal.",
        emoji: "🎩"
      };
    } else {
      return {
        title: "The Fumble Master",
        desc: "You are heavily prone to missing social cues, over-pushing boundaries, or using generic/stiff conversation formulas. Don't sweat it—social intelligence is a muscle, keep practicing here!",
        emoji: "🎒"
      };
    }
  };

  const getOptionBorderClass = (optionId: string) => {
    if (!isAnswered) {
      return selectedOptionId === optionId 
        ? "border-amber-500 bg-amber-500/5 text-neutral-100" 
        : "border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-850 text-neutral-300";
    }

    const option = currentQuestion.options.find(o => o.id === optionId);
    if (!option) return "";

    if (optionId === selectedOptionId) {
      if (option.score === 100) return "border-emerald-500 bg-emerald-500/10 text-emerald-100";
      if (option.score >= 50) return "border-amber-500 bg-amber-500/10 text-amber-100";
      return "border-rose-500 bg-rose-500/10 text-rose-100";
    }

    if (option.score === 100) {
      return "border-emerald-500/40 bg-emerald-500/5 text-neutral-400"; // show correct one dimly
    }

    return "border-neutral-800/40 bg-neutral-900/40 text-neutral-500 opacity-60";
  };

  const getOptionBadge = (score: number) => {
    if (score === 100) return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase shrink-0">Charismatic</span>;
    if (score >= 50) return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase shrink-0">Deconstructive/Safe</span>;
    return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase shrink-0">Fumble</span>;
  };

  return (
    <div id="vibe-check-container" className="max-w-3xl mx-auto p-4 md:p-6 space-y-6 overflow-y-auto h-full flex flex-col justify-between">
      <div className="text-center max-w-xl mx-auto space-y-2 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-100 font-sans flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-amber-500" /> Vibe Check: Calibration Quiz
        </h2>
        <p className="text-sm text-neutral-400">
          Put your social intuition and emotional IQ to the test. Understand how women perceive common situations, 
          and calibrate your approach to absolute smoothness.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-neutral-900 border border-neutral-850 rounded-xl p-5 md:p-6 space-y-6 shadow-lg flex-1 flex flex-col justify-between"
          >
            {/* Quiz Info Bar */}
            <div className="flex justify-between items-center text-xs font-mono pb-3 border-b border-neutral-800/60 shrink-0">
              <span className="text-neutral-500">QUESTION {currentQuestionIdx + 1} OF {VIBE_QUIZ.length}</span>
              <span className="text-amber-500 font-bold">{currentQuestion.category}</span>
            </div>

            {/* Question Situation */}
            <div className="py-2 space-y-3 flex-1 flex flex-col justify-center">
              <h3 className="text-base md:text-lg font-bold text-neutral-100 leading-relaxed font-sans">
                {currentQuestion.situation}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  id={`btn-opt-${opt.id}`}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-sm leading-relaxed flex justify-between items-center gap-3 ${getOptionBorderClass(opt.id)}`}
                >
                  <span className="font-sans flex-1">{opt.text}</span>
                  {isAnswered ? (
                    getOptionBadge(opt.score)
                  ) : (
                    selectedOptionId === opt.id && (
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0 animate-ping" />
                    )
                  )}
                </button>
              ))}
            </div>

            {/* Interactive Feedback Panel */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-neutral-950/80 border border-neutral-850 rounded-xl p-4 text-xs leading-relaxed space-y-2 mt-4 shrink-0"
                >
                  <div className="flex items-center gap-1.5 font-bold text-neutral-300">
                    <Award className="w-4 h-4 text-amber-500" /> Lesson Analysis:
                  </div>
                  <p className="text-neutral-400">
                    {currentQuestion.options.find(o => o.id === selectedOptionId)?.feedback}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next / Submit buttons */}
            <div className="pt-4 border-t border-neutral-800/60 flex justify-end shrink-0 mt-4">
              {!isAnswered ? (
                <button
                  id="btn-confirm-answer"
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOptionId}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2.5 px-6 rounded-lg transition-all disabled:opacity-40"
                >
                  Verify Calibration
                </button>
              ) : (
                <button
                  id="btn-next-question"
                  onClick={handleNextQuestion}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs py-2.5 px-6 rounded-lg transition-all border border-neutral-700"
                >
                  {currentQuestionIdx + 1 < VIBE_QUIZ.length ? "Next Challenge" : "See Final Score"}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-850 rounded-xl p-6 text-center space-y-6 shadow-lg flex-1 flex flex-col justify-center items-center"
          >
            {(() => {
              const averageScore = Math.round(totalScore / VIBE_QUIZ.length);
              const summary = getScoreSummary(averageScore);

              return (
                <div className="max-w-md space-y-6">
                  {/* Big Emoji */}
                  <div className="text-6xl animate-bounce">{summary.emoji}</div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase block">QUIZ COMPLETED</span>
                    <h3 className="text-xl md:text-2xl font-black text-neutral-100 tracking-tight font-sans">
                      {summary.title}
                    </h3>
                  </div>

                  {/* Score breakdown */}
                  <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 flex justify-around items-center">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono block">ACCURACY SCORE</span>
                      <span className="text-2xl font-black text-amber-400 font-mono">{averageScore}%</span>
                    </div>
                    <div className="w-px h-8 bg-neutral-800" />
                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono block">RATING</span>
                      <span className="text-xs font-bold text-neutral-300 uppercase">
                        {averageScore >= 90 ? "Charismatic" : averageScore >= 50 ? "Average" : "Severe Fumble"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {summary.desc}
                  </p>

                  <div className="pt-2">
                    <button
                      id="btn-restart-quiz"
                      onClick={handleRestartQuiz}
                      className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs py-2.5 px-6 rounded-lg transition-all border border-neutral-700 font-mono"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-Calibrate Quiz
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
