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

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  name: string;
  repo: string;
  /** What it is, in one plain sentence. */
  summary: string;
  /** What it shows about how I work. */
  shows: string;
  tags: string[];
  /** The first link is the primary action. */
  links: ProjectLink[];
  /** Short, checkable facts. Shown on the lead (first) card only. */
  highlights?: string[];
};

export type SideProject = {
  repo: string;
  summary: string;
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
  projects: [
    {
      name: "EvalForge",
      repo: "evalforge",
      summary:
        "Tests an AI model's answers against a set of tasks, compares runs, and fails the build when quality drops.",
      shows:
        "Treating AI quality like any other release check: measured, compared and gated in CI.",
      tags: ["LLM evaluation", "CI", "Python"],
      links: [
        { label: "Code", href: "https://github.com/midya8/evalforge" },
        { label: "Sample report", href: "https://midya8.github.io/evalforge/original-report.html" },
      ],
      highlights: [
        "Works with any model or agent you can run from the command line.",
        "Fails the build when the average score drops past a set limit or a passing task starts failing.",
        "Writes HTML, JUnit, SARIF and Markdown reports for CI dashboards.",
        "More than 100 automated tests, run in CI on Python 3.10 to 3.13.",
      ],
    },
    {
      name: "AgentTrace",
      repo: "agenttrace",
      summary:
        "Reads the step-by-step log of an AI agent run and reports errors, loops, time and cost.",
      shows:
        "Watching AI agents the way you would watch any production service: errors, latency and cost.",
      tags: ["AI agents", "Observability", "Python"],
      links: [
        { label: "Code", href: "https://github.com/midya8/agenttrace" },
        { label: "Sample report", href: "https://midya8.github.io/agenttrace/original-report.html" },
      ],
    },
    {
      name: "kurdistansociology.com",
      repo: "kurdistansociology-website",
      summary:
        "Live website for the Kurdistan International Sociological Association, in English and two Kurdish dialects, one of them written right to left.",
      shows:
        "Delivering for a real organization: built, deployed and live on its own domain.",
      tags: ["Next.js", "Three languages", "Live site"],
      links: [
        { label: "Live site", href: "https://kurdistansociology.com" },
        { label: "Code", href: "https://github.com/midya8/kurdistansociology-website" },
      ],
    },
    {
      name: "ScratchGPT",
      repo: "scratchgpt",
      summary:
        "A small GPT language model written and trained from scratch in NumPy, with no PyTorch. The trained model ships with the code, so you can sample it right away.",
      shows:
        "Knowing how language models work on the inside, not just how to call them.",
      tags: ["Language models", "NumPy", "From scratch"],
      links: [{ label: "Code", href: "https://github.com/midya8/scratchgpt" }],
    },
    {
      name: "PromptGuard",
      repo: "promptguard",
      summary:
        "Scans prompt files for leaked API keys, personal data and prompt-injection text before they ship.",
      shows:
        "Security and privacy guardrails for AI work, in a format GitHub code scanning can read.",
      tags: ["AI security", "Privacy", "CI"],
      links: [{ label: "Code", href: "https://github.com/midya8/promptguard" }],
    },
    {
      name: "LogLens",
      repo: "loglens",
      summary:
        "Answers the first questions in an outage from web server logs: what is failing, where, and since when.",
      shows:
        "Production incident habits, packaged as a tested command-line tool with no dependencies.",
      tags: ["Incident response", "Python", "CLI"],
      links: [{ label: "Code", href: "https://github.com/midya8/loglens" }],
    },
  ] satisfies Project[],
  alsoBuilt: [
    {
      repo: "planbench",
      summary:
        "Checks an AI agent's task plan for cycles and missing inputs, then simulates it with unreliable tools.",
    },
    {
      repo: "sre-toolkit",
      summary:
        "Error budgets, burn-rate alerts, alert triage and postmortem drafts for teams that run services.",
    },
    {
      repo: "flowkit",
      summary:
        "A small workflow runner: jobs defined in JSON, with dependencies, retries, timeouts and a clear pass or fail.",
    },
    {
      repo: "ragline",
      summary:
        "A RAG pipeline's retrieve, answer, cite and check loop in plain Python, with no language model, built to catch answers that cite the wrong source.",
    },
    {
      repo: "structgate",
      summary:
        "Makes a small text generator always produce valid JSON (40 of 40, up from 3 of 40) and measures what that costs.",
    },
    {
      repo: "speculative-decoding",
      summary:
        "Draft-and-verify text generation on small models, with tests that the output matches what the main model alone would produce.",
    },
    {
      repo: "mamba-lite",
      summary:
        "A Mamba-style sequence model in NumPy. Removing its key feature drops full-sequence accuracy from 97% to 0%.",
    },
    {
      repo: "ppo-numpy",
      summary:
        "A reinforcement-learning agent, written from scratch in NumPy, that learns to balance a pole.",
    },
  ] satisfies SideProject[],
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
