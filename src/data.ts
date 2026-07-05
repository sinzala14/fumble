/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scenario, ChallengeItem, VibeQuizQuestion } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "scen-coffee",
    title: "Coffee Shop Spark",
    difficulty: "Beginner",
    description: "You're in line at a cozy café. She's reading a book you recognize, or ordering something interesting. Spark an authentic conversation.",
    avatar: "☕",
    characterName: "Maya",
    context: "Coffee shop lineup, casual morning vibe",
    initialGreeting: "Hi there! Oh, sorry, didn't mean to block the milk station. Go ahead.",
    promptDirections: "You are Maya, a warm, slightly introverted 24-year-old freelance designer. You're reading 'The Midnight Library' and ordering an oat milk cortado. You appreciate respect, authenticity, and light-hearted observational humor. If the user is overly forward, aggressive, or uses sleazy lines, react with polite distance. If they are humble, nervous but genuine, be supportive and encouraging."
  },
  {
    id: "scen-dating-app",
    title: "The Dead-Chat Revival",
    difficulty: "Intermediate",
    description: "You matched 3 days ago. You had a brief exchange, but she went silent after you asked how her week was going. Re-ignite the fire without sounding needy.",
    avatar: "💬",
    characterName: "Elena",
    context: "Dating app text chat (silent for 72 hours)",
    initialGreeting: "[System: Elena has been inactive. Your last text was: 'So, how has your week been going?']. Elena says nothing.",
    promptDirections: "You are Elena, a sharp, busy 26-year-old marketing manager. You get bombarded on dating apps and quickly lose interest in generic questions ('hey', 'how was your week'). You respond strongly to originality, playful banter, fun hypothetical debates, or pointing out the quietness with self-aware humor. Do not easily give in; the user needs to say something engaging or amusing to get you talking."
  },
  {
    id: "scen-first-date",
    title: "The First Date Slump",
    difficulty: "Intermediate",
    description: "You're 40 minutes into a date at a cozy tapas bar. An awkward silence settles in. Find a way to revive the vibe and transition back to a playful, comfortable flow.",
    avatar: "🍷",
    characterName: "Sophia",
    context: "Cozy tapas bar, seated across from each other",
    initialGreeting: "So... yeah, this patatas bravas is really nice. (She smiles, looks down at her glass, and there is a sudden, heavy quiet between you).",
    promptDirections: "You are Sophia, an expressive 25-year-old high school biology teacher. You are friendly and interested, but also feel slightly anxious about making a good impression. You're waiting to see if the user can handle conversational lulls without panicking, talking about himself non-stop, or asking stiff job-interview questions. You love interesting questions, fun stories, or playful comments about the atmosphere."
  },
  {
    id: "scen-friend-zone",
    title: "The Great Transition",
    difficulty: "Advanced",
    description: "You've been close friends with her for 8 months. You have developed real romantic feelings. Learn how to tell her clearly and respectfully, without giving an ultimatum.",
    avatar: "🎒",
    characterName: "Chloe",
    context: "Sitting on a park bench after a walk together",
    initialGreeting: "That walk was so peaceful! I'm really glad we hung out today. You've been such a reliable friend lately, you know that?",
    promptDirections: "You are Chloe, a kind, emotionally-mature 23-year-old student. You genuinely value your friendship with the user, but you have a subtle inkling he might feel something more. You value absolute honesty, emotional maturity, vulnerability, and respect. If he is too cowardly/vague, or conversely, overly dramatic and demanding ('I can't be friends with you anymore unless you date me'), react with disappointment. If he is honest, warm, and sets a pressure-free environment, react with deep consideration and openness."
  }
];

export const DAILY_CHALLENGES: ChallengeItem[] = [
  {
    id: "chal-comp",
    title: "The Micro-Compliment",
    xp: 15,
    category: "Communication",
    description: "Compliment a complete stranger on an intentional choice they made (e.g., shoes, jacket, hairstyle, book choice).",
    instructions: "Walk up, make quick eye contact, say: 'Hey, those are really cool sneakers, love the colors!' and keep walking. No strings attached, no waiting for a conversation. Just spread a bit of good energy.",
    completed: false
  },
  {
    id: "chal-gaze",
    title: "The Tri-Gaze Check",
    xp: 10,
    category: "Reading Cues",
    description: "Practice maintaining comfortable, non-intimidating eye contact with 3 different people today.",
    instructions: "When interacting with cashiers, servers, or colleagues, look them in the eyes when they speak. Smile gently, then look away casually when there is a natural pause. Avoid staring intensely.",
    completed: false
  },
  {
    id: "chal-space",
    title: "The Open Stance",
    xp: 10,
    category: "Confidence",
    description: "Practice open, confident body posture for at least 15 minutes in a public space.",
    instructions: "Pull your shoulders back slightly, uncross your arms, keep your head level, and take up comfortable physical space. Avoid constantly checking your phone as a social shield. Breathe slowly.",
    completed: false
  },
  {
    id: "chal-detail",
    title: "The Active Echo",
    xp: 20,
    category: "Communication",
    description: "During a conversation today, repeat or reference a specific detail the other person mentioned earlier.",
    instructions: "Listen closely instead of just waiting for your turn to speak. If they mention their cat's name or a weekend trip, circle back later with: 'By the way, how old did you say your cat was?' It shows elite listening skills.",
    completed: false
  },
  {
    id: "chal-groom",
    title: "The Scent & Polish",
    xp: 15,
    category: "Style & Care",
    description: "Upgrade your grooming ritual: style your hair, groom facial hair, iron your shirt, and apply a light high-quality scent.",
    instructions: "Grooming is your physical calling card. Take an extra 10 minutes in front of the mirror. When you look crisp and smell subtle and fresh, your baseline confidence raises naturally.",
    completed: false
  }
];

export const VIBE_QUIZ: VibeQuizQuestion[] = [
  {
    id: "q-1",
    situation: "You are talking to a girl at a social event. While you are telling an interesting story about your recent vacation, she crosses her arms, shifts her feet away from you, and starts glancing around the room. What is the correct response?",
    category: "Social Cue",
    options: [
      {
        id: "q1-a1",
        text: "Keep talking but raise your voice and make more expressive hand gestures to win back her attention.",
        feedback: "Fumble! If she is exhibiting closed body language, trying to force her attention by being louder or more animated will likely make her feel cornered or annoyed.",
        score: 10,
        rizzType: "Fumble"
      },
      {
        id: "q1-a2",
        text: "Gently pause your story, take a breath, and hand the conversation over: 'Anyway, I've been talking a ton! Tell me, what's been the best part of your week so far?'",
        feedback: "Charismatic! You read the room perfectly. Spotting a loss of engagement and gracefully stepping back to invite her input shows high emotional intelligence.",
        score: 100,
        rizzType: "Charismatic"
      },
      {
        id: "q1-a3",
        text: "Ask her directly: 'Am I boring you? You seem distracted.'",
        feedback: "Deconstructive/Safe, but high risk. While honest, it can sound overly defensive or put her on the spot in a socially uncomfortable way.",
        score: 50,
        rizzType: "Deconstructive/Safe"
      }
    ]
  },
  {
    id: "q-2",
    situation: "You match with a girl on a dating app. Her profile has a photo of her hiking in a stunning national park and another one holding a massive slice of pizza. What's the best opener?",
    category: "Text Calibration",
    options: [
      {
        id: "q2-a1",
        text: "Hey! You're really cute. How is your Sunday going so far? 😊",
        feedback: "Deconstructive/Safe. It's polite and safe, but unfortunately, it is identical to 95% of the other matches in her inbox. It doesn't invite interest.",
        score: 40,
        rizzType: "Deconstructive/Safe"
      },
      {
        id: "q2-a2",
        text: "Please tell me you didn't drop that massive slice of pizza on the hiking trail. That would be an absolute national tragedy.",
        feedback: "Charismatic! This opener is playful, references two distinct elements of her profile simultaneously, establishes a lighthearted bantering tone, and demands an response.",
        score: 100,
        rizzType: "Charismatic"
      },
      {
        id: "q2-a3",
        text: "I love hiking too! We should go to Yosemite together sometime, let me know when you are free.",
        feedback: "Fumble! Way too fast. Proposing a trip before even saying hello skips vital comfort-building stages and comes off as too aggressive/needy.",
        score: 15,
        rizzType: "Fumble"
      }
    ]
  },
  {
    id: "q-3",
    situation: "You're on a first date. She arrives wearing a beautiful, unique vintage blazer and asks: 'Do you like the jacket? I got it at a vintage fair.' What's the most effective response?",
    category: "Body Language",
    options: [
      {
        id: "q3-a1",
        text: "Yeah, it's nice. Looks comfortable.",
        feedback: "Deconstructive/Safe, but a bit flat. It's safe, but misses an opportunity to show you notice her effort or appreciation for style.",
        score: 45,
        rizzType: "Deconstructive/Safe"
      },
      {
        id: "q3-a2",
        text: "It's awesome! It gives off total 70s rockstar vibes. You pull it off perfectly. Did you have to fight someone for it at the fair?",
        feedback: "Charismatic! It's specific, extremely complimentary without sounding desperate, and launches a playful, imaginative conversation thread.",
        score: 100,
        rizzType: "Charismatic"
      },
      {
        id: "q3-a3",
        text: "My ex had a jacket exactly like that! She loved thrift shopping.",
        feedback: "Severe Fumble! Never, ever bring up your ex on a first date—especially not in response to her outfit. It instantly dampens the mood.",
        score: 5,
        rizzType: "Fumble"
      }
    ]
  },
  {
    id: "q-4",
    situation: "You've had 2 great dates, and you want to plan the 3rd. You aren't sure if she likes outdoor activities or cozy dinners. How do you propose the plan?",
    category: "Date Management",
    options: [
      {
        id: "q4-a1",
        text: "I'd love to take you out again this Thursday. I've got two fun ideas: we can either do a casual sunset mini-golf match, or grab ramen at that new spot. Which vibe are you more in the mood for?",
        feedback: "Charismatic! Highly effective. It shows leadership and organization by presenting concrete plans, but displays consideration by letting her choose the atmosphere.",
        score: 100,
        rizzType: "Charismatic"
      },
      {
        id: "q4-a2",
        text: "Hey, are we hanging out again? I don't know what to do, just let me know whatever you want to do and I'm down.",
        feedback: "Fumble! Placing 100% of the planning burden on her and showing zero initiative is highly unattractive and communicates a lack of interest or confidence.",
        score: 15,
        rizzType: "Fumble"
      },
      {
        id: "q4-a3",
        text: "Hey, I'm booking us a table at an expensive, dress-code steakhouse for Thursday at 8. Wear something fancy.",
        feedback: "Deconstructive/Safe, but slightly heavy. While assertive, being overly bossy/controlling or setting an intense, high-pressure date standard can feel intimidating.",
        score: 55,
        rizzType: "Deconstructive/Safe"
      }
    ]
  }
];
