const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "discipline" },
  { text: "Discipline is choosing between what you want now and what you want most.", category: "discipline" },
  { text: "Self-control is strength. Right thought is mastery. Calmness is power.", category: "self-control" },
  { text: "The mind is everything. What you think you become.", category: "focus" },
  { text: "Fall seven times, stand up eight.", category: "discipline" },
  { text: "You will never always be motivated. You have to learn to be disciplined.", category: "discipline" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", category: "discipline" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "discipline" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", category: "self-control" },
  { text: "A man who conquers himself is greater than one who conquers a thousand men in battle.", category: "self-control" },
  { text: "Your body hears everything your mind says. Stay positive.", category: "focus" },
  { text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", category: "focus" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", category: "self-control" },
  { text: "Every morning brings new potential, but if you dwell on the misfortunes of the day before, you tend to overlook tremendous opportunities.", category: "focus" },
  { text: "He who controls others may be powerful, but he who has mastered himself is mightier still.", category: "self-control" },
  { text: "Don't count the days. Make the days count.", category: "discipline" },
  { text: "The only person you are destined to become is the person you decide to be.", category: "discipline" },
  { text: "Your future is created by what you do today, not tomorrow.", category: "focus" },
  { text: "Champions keep playing until they get it right.", category: "discipline" },
  { text: "Mastering others is strength. Mastering yourself is true power.", category: "self-control" },
  { text: "It does not matter how slowly you go as long as you do not stop.", category: "discipline" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "discipline" },
  { text: "Where focus goes, energy flows.", category: "focus" },
  { text: "You are stronger than you think. Believe it.", category: "self-control" },
  { text: "Every day is a new beginning. Take a deep breath and start again.", category: "focus" },
  { text: "A river cuts through rock not because of its power, but because of its persistence.", category: "discipline" },
  { text: "Rule your mind or it will rule you.", category: "self-control" },
  { text: "No one saves us but ourselves. No one can and no one may. We ourselves must walk the path.", category: "self-control" },
  { text: "Small daily improvements over time lead to stunning results.", category: "focus" },
  { text: "Freedom is not the absence of commitments, but the ability to choose yours.", category: "discipline" }
];

export function getDailyQuote() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length] || quotes[0];
}

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getQuotesByCategory(category) {
  return quotes.filter(q => q.category === category);
}

export default quotes;
