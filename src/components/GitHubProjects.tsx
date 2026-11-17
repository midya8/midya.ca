import { motion } from "motion/react";
import { profile } from "../data/profile";
import { SectionHeader } from "./SectionHeader";

export function GitHubProjects() {
  return (
    <section className="section" id="projects">
      <SectionHeader
        number="03"
        eyebrow="Open source"
        title="Selected GitHub projects"
        description="Things I have built to understand how modern AI systems work, from training a GPT from scratch to evaluating LLM and agent outputs."
      />

      <ul className="project-grid">
        {profile.projects.map((project, index) => (
          <motion.li
            key={project.repo}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
          >
            <article className="project-card">
              <div className="project-card__meta">
                <span>Project {String(index + 1).padStart(2, "0")}</span>
                <span>{project.repo}</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.summary}</p>
              <ul className="project-card__tags" aria-label="Topics">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className="project-card__links">
                <a
                  href={`${profile.github}/${project.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} source code on GitHub`}
                >
                  Code <span aria-hidden="true">↗</span>
                </a>
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} live demo`}
                  >
                    Live demo <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            </article>
          </motion.li>
        ))}
      </ul>

      <div className="project-more">
        <a
          className="button button--ghost"
          href={`${profile.github}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
        >
          See all {profile.githubRepoCount} repositories on GitHub
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
