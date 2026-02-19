export interface Puzzle {
  emojis: string[];
  answer: string;
  hint: string;
  category: string;
  alternateAnswers?: string[];
}

export const puzzles: Puzzle[] = [
  {
    emojis: ["🤖", "🧠"],
    answer: "Artificial Intelligence",
    hint: "Machines that think like humans",
    category: "AI & ML",
    alternateAnswers: ["AI", "Machine Intelligence"],
  },
  {
    emojis: ["☁️", "💾"],
    answer: "Cloud Storage",
    hint: "Save your files online",
    category: "Cloud",
    alternateAnswers: ["Cloud Drive", "Online Storage"],
  },
  {
    emojis: ["🔒", "🔑"],
    answer: "Encryption",
    hint: "Protecting data with a key",
    category: "Security",
    alternateAnswers: ["Cryptography", "Password Protection"],
  },
  {
    emojis: ["🕸️", "🌐"],
    answer: "World Wide Web",
    hint: "The internet you browse",
    category: "Networking",
    alternateAnswers: ["WWW", "Internet", "Web"],
  },
  {
    emojis: ["📱", "💻", "⌨️"],
    answer: "Full Stack Development",
    hint: "Building apps front to back",
    category: "Development",
    alternateAnswers: ["Full Stack Dev", "Full-Stack"],
  },
  {
    emojis: ["🐛", "🔍"],
    answer: "Debugging",
    hint: "Finding and fixing code errors",
    category: "Development",
    alternateAnswers: ["Bug Fixing", "Bug Finding"],
  },
  {
    emojis: ["🗄️", "📊"],
    answer: "Database",
    hint: "Where data lives",
    category: "Data",
    alternateAnswers: ["DB", "Data Storage"],
  },
  {
    emojis: ["🔄", "♾️"],
    answer: "Infinite Loop",
    hint: "Code that never stops",
    category: "Programming",
    alternateAnswers: ["Endless Loop", "Loop"],
  },
  {
    emojis: ["🌐", "📡"],
    answer: "Network",
    hint: "Connected computers",
    category: "Networking",
    alternateAnswers: ["Computer Network", "Networking"],
  },
  {
    emojis: ["🤝", "💻"],
    answer: "Peer to Peer",
    hint: "Sharing directly between devices",
    category: "Networking",
    alternateAnswers: ["P2P", "Peer-to-Peer"],
  },
  {
    emojis: ["🧩", "🔧"],
    answer: "API",
    hint: "How apps talk to each other",
    category: "Development",
    alternateAnswers: ["Application Programming Interface", "REST API"],
  },
  {
    emojis: ["🏃", "🔁"],
    answer: "Agile",
    hint: "Fast, iterative development method",
    category: "Methodology",
    alternateAnswers: ["Agile Development", "Scrum"],
  },
  {
    emojis: ["🌊", "📈"],
    answer: "Big Data",
    hint: "Massive volumes of information",
    category: "Data",
    alternateAnswers: ["Large Data", "Data Analytics"],
  },
  {
    emojis: ["🐳", "📦"],
    answer: "Docker",
    hint: "Containerize your apps",
    category: "DevOps",
    alternateAnswers: ["Container", "Containerization"],
  },
  {
    emojis: ["🔀", "🌿"],
    answer: "Git Branch",
    hint: "Separate line of development",
    category: "Version Control",
    alternateAnswers: ["Branch", "Git Branching"],
  },
  {
    emojis: ["👁️", "🤖"],
    answer: "Computer Vision",
    hint: "Machines that can see",
    category: "AI & ML",
    alternateAnswers: ["Image Recognition", "Machine Vision"],
  },
  {
    emojis: ["🔐", "🌐"],
    answer: "VPN",
    hint: "Private tunnel over the internet",
    category: "Security",
    alternateAnswers: ["Virtual Private Network", "Virtual Network"],
  },
  {
    emojis: ["🕵️", "🦠"],
    answer: "Cybersecurity",
    hint: "Protecting digital systems",
    category: "Security",
    alternateAnswers: ["Cyber Security", "Information Security"],
  },
  {
    emojis: ["⚡", "🔌"],
    answer: "Electricity",
    hint: "Power for all electronics",
    category: "Electronics",
    alternateAnswers: ["Electric", "Power"],
  },
  {
    emojis: ["🧮", "➕"],
    answer: "Algorithm",
    hint: "Step-by-step problem solution",
    category: "Programming",
    alternateAnswers: ["Algo", "Process"],
  },
];
