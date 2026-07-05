/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RizzAnalysis {
  score: number; // 0 - 100
  level: "Fumble" | "Average" | "Smooth" | "Rizzler";
  critique: string; // Explains why it did/didn't work
  suggestion: string; // Shows a better alternative approach
}

export interface ConversationMessage {
  id: string;
  sender: "user" | "character";
  text: string;
  timestamp: string;
  rizzAnalysis?: RizzAnalysis;
}

export interface Scenario {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  avatar: string; // Emoji representing character
  characterName: string;
  context: string; // coffee shop, college campus, text chat, first date
  initialGreeting: string;
  promptDirections: string; // AI personality guide
}

export interface ChallengeItem {
  id: string;
  title: string;
  xp: number;
  category: "Confidence" | "Communication" | "Reading Cues" | "Style & Care";
  description: string;
  instructions: string;
  completed: boolean;
}

export interface VibeQuizOption {
  id: string;
  text: string;
  feedback: string;
  score: number; // 0 to 100
  rizzType: "Fumble" | "Deconstructive/Safe" | "Charismatic";
}

export interface VibeQuizQuestion {
  id: string;
  situation: string;
  category: "Body Language" | "Social Cue" | "Text Calibration" | "Date Management";
  options: VibeQuizOption[];
}

export interface ChatAuditResponse {
  originalMessage: string;
  rating: "Severe Fumble" | "Awkward" | "Decent" | "Smooth";
  fumbleCause?: string; // If low score
  critique: string;
  alternativeWarm: string; // Warm/Honest alternative
  alternativePlayful: string; // Humorous/Playful alternative
  goldenRules: string[];
}

export interface CoachPlanResponse {
  assessment: string;
  confidenceScore: number; // 0-100
  strategicSteps: string[];
  phrasesToUse: string[];
  trapsToAvoid: string[];
}
