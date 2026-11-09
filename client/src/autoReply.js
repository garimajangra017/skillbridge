
const replyRules = [
  {
    keywords: ["hi", "hello", "hey", "hii", "helo"],
    replies: [
      "Hey Garima! 👋 Welcome back! How are you?",
      "Hii! 💙 Nice to hear from you. What's up?",
      "Hey there! ✨ What are you working on today?"
    ]
  },
  {
    keywords: ["how are you", "kaise ho", "how r u"],
    replies: [
      "I'm doing great! 💙 How about you?",
      "All good here! 😊 Tell me, how's your day going?"
    ]
  },
  {
    keywords: ["project", "projects", "skillbridge"],
    replies: [
      "That's exciting! 🚀 Tell me about your project idea.",
      "Let's build something amazing! 💙 What technology are you using?",
      "You can share your project details here. I'm ready to help! ✨"
    ]
  },
  {
    keywords: ["study", "exam", "assignment", "college", "dsa"],
    replies: [
      "You've got this! 📚 Which topic are you studying?",
      "Let's make studying easier! 💜 Tell me the topic you're working on.",
      "One step at a time! ✨ What do you need help with?"
    ]
  },
  {
    keywords: ["thank", "thanks", "thankyou"],
    replies: [
      "You're always welcome! 💙😊",
      "Anytime! That's what we're here for. ✨"
    ]
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    replies: [
      "See you soon! 👋 Keep shining! 💙",
      "Bye for now! ✨ Come back anytime."
    ]
  },
  {
    keywords: ["help", "problem", "issue", "error"],
    replies: [
      "I'm here to help! 💙 Tell me a little more about the problem.",
      "No worries! 😊 Share the details and we'll work through it."
    ]
  }
];

export function getAutoReply(message) {
  const text = message.toLowerCase().trim();

  const rule = replyRules.find(item =>
    item.keywords.some(keyword =>
      text.includes(keyword)
    )
  );

  if (rule) {
    return rule.replies[
      Math.floor(Math.random() * rule.replies.length)
    ];
  }

  return "Thanks for your message! 💙 Tell me a little more so we can continue our conversation. 😊";
}