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

export type Project = {
  name: string;
  repo: string;
  summary: string;
  tags: string[];
  demo?: string;
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
  githubRepoCount: "100+",
  projects: [
    {
      name: "ScratchGPT",
      repo: "scratchgpt",
      summary:
        "A small GPT built and trained from scratch in pure NumPy, with its own autograd engine, a trained 419K-parameter character model and a KV-cache inference path. No PyTorch or JAX.",
      tags: ["Transformers", "NumPy", "Autograd"],
      demo: "https://midya8.github.io/scratchgpt/",
    },
    {
      name: "EvalForge",
      repo: "evalforge",
      summary:
        "Local-first evaluation for LLM and agent outputs: deterministic checks, regression gates between runs, and HTML, JUnit and SARIF reports for CI.",
      tags: ["LLM evaluation", "Agents", "CI"],
      demo: "https://midya8.github.io/evalforge/",
    },
    {
      name: "AgentTrace",
      repo: "agenttrace",
      summary:
        "Validates and analyzes AI agent execution traces: step timing, overlapping spans, loops, errors, tokens and cost, with pass/fail gates and HTML reports.",
      tags: ["Agents", "Observability", "Python"],
      demo: "https://midya8.github.io/agenttrace/",
    },
    {
      name: "MoeLab",
      repo: "mixture-of-experts",
      summary:
        "A mixture-of-experts model in pure Python with Switch-style sparse routing, hand-derived gradients verified by finite differences, and a trained dense baseline.",
      tags: ["Mixture of experts", "Routing", "From scratch"],
      demo: "https://midya8.github.io/mixture-of-experts/",
    },
    {
      name: "LoRALab",
      repo: "lora-finetuning",
      summary:
        "Low-rank adaptation from scratch: freeze a trained model, learn only a rank-r update, and compare accuracy, retention and trainable parameters with full fine-tuning.",
      tags: ["LoRA", "Fine-tuning", "From scratch"],
      demo: "https://midya8.github.io/lora-finetuning/",
    },
    {
      name: "SpecLab",
      repo: "speculative-decoding",
      summary:
        "Speculative decoding with small models whose outputs can be checked exactly: a greedy n-gram decoder, an exact stochastic sampler and an interactive stopping lab.",
      tags: ["Inference", "Decoding", "LLMs"],
      demo: "https://midya8.github.io/speculative-decoding/",
    },
  ] satisfies Project[],
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
