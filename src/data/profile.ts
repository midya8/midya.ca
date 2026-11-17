export type Experience = {
  organization: string;
  period: string;
  location: string;
  active?: boolean;
};

export type Education = {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  logo: string;
  accent: "gold" | "red";
  label: string;
};

export const profile = {
  name: "Midya Rahmani",
  location: "Toronto, Ontario",
  yearsExperience: "12+",
  linkedin: "https://www.linkedin.com/in/midyarahmani/",
  github: "https://github.com/midya8",
  email: {
    user: "midya.ra",
    domain: "gmail.com",
  },
  hero:
    "Toronto-based technology professional with 12+ years of experience across technology, financial services, and telecommunications. My work is guided by a deep curiosity about AI and how it is changing the way we work, build, and think. I explore practical applications of large language models, workflow automation, and agentic systems, while keeping a close eye on investing, markets, and the broader direction of technology.",
  about: [
    "My graduate studies at the University of Waterloo and undergraduate education at York University strengthened a habit of asking careful questions, learning continuously, and connecting technical ideas with real-world context.",
    "I am especially interested in the practical side of AI: how large language models can support useful workflow automation, how agentic systems are evolving, and where thoughtful experimentation can lead.",
    "Beyond technology, I follow investing and markets with the same curiosity. Basketball, motorcycles, and travel offer a change of pace, fresh perspective, and plenty of room to keep learning.",
  ],
  experience: [
    {
      organization: "Adaptavist",
      period: "Feb 2021 — Present",
      location: "Remote",
      active: true,
    },
    {
      organization: "CIBC",
      period: "2016 — 2021",
      location: "Toronto",
    },
    {
      organization: "Group of Gold Line",
      period: "Oct 2012 — Aug 2015",
      location: "Markham",
    },
  ] satisfies Experience[],
  education: [
    {
      institution: "University of Waterloo",
      degree: "MSc — Management Science",
      period: "2021 — 2023",
      gpa: "3.9 / 4.0",
      logo: "/waterloo-logo.svg",
      accent: "gold",
      label: "Graduate studies",
    },
    {
      institution: "York University",
      degree: "BCom (Hons) — Commerce & IT",
      period: "2011 — 2016",
      gpa: "3.3 / 4.0",
      logo: "/york-logo.svg",
      accent: "red",
      label: "Undergraduate studies",
    },
  ] satisfies Education[],
  interests: [
    "Artificial intelligence",
    "Investing",
    "Markets",
    "Basketball",
    "Motorcycles",
    "Travel",
    "Emerging technology",
  ],
} as const;

export const emailAddress = `${profile.email.user}@${profile.email.domain}`;
