import { useState } from "react";
import { motion } from "motion/react";
import { profile } from "../data/profile";
import { SectionHeader } from "./SectionHeader";

type CardSize = "lead" | "wide" | "standard";

// How many "Also built" items phones show before the "Show more" button.
// Wider screens always show the full list.
const ALSO_BUILT_MOBILE_COUNT = 3;

// Layout follows data order: the first project is the full-width lead card,
// the next two share a row, and the rest sit three to a row on desktop.
function cardSize(index: number): CardSize {
  if (index === 0) return "lead";
  if (index < 3) return "wide";
  return "standard";
}

function revealDelay(index: number, size: CardSize) {
  const rowStart = size === "lead" ? 0 : size === "wide" ? 1 : 3;
  return ((index - rowStart) % 3) * 0.08;
}

const newTab = <span className="project-sr-only">, opens in a new tab</span>;

export function GitHubProjects() {
  const [showAllAlso, setShowAllAlso] = useState(false);
  const hiddenOnMobile = Math.max(0, profile.alsoBuilt.length - ALSO_BUILT_MOBILE_COUNT);

  return (
    <section className="section" id="projects">
      <SectionHeader
        number="03"
        eyebrow="Personal projects"
        title="Things I've built"
        description="Tested tools for AI quality, agent debugging, prompt security and incident response, plus a language model built from scratch and a live website for a real organization. All of the code is public."
      />

      <ul className="project-grid">
        {profile.projects.map((project, index) => {
          const size = cardSize(index);
          const highlights = size === "lead" ? project.highlights : undefined;

          return (
            <motion.li
              key={project.repo}
              className={`project-grid__item project-grid__item--${size}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: revealDelay(index, size) }}
            >
              <article className={`project-card project-card--${size}`}>
                <div className="project-card__main">
                  <div className="project-card__meta">
                    <span>Project {String(index + 1).padStart(2, "0")}</span>
                    <span>{project.repo}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p className="project-card__summary">{project.summary}</p>
                  <p className="project-card__shows">
                    <span className="project-card__label">
                      What it shows<span className="project-sr-only">:</span>
                    </span>
                    {project.shows}
                  </p>
                  <ul className="project-card__tags" aria-label="Topics">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>

                {highlights ? (
                  <div className="project-card__highlights">
                    <h4 className="project-card__label">At a glance</h4>
                    <ul>
                      {highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <ul className="project-card__links">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <span className="project-sr-only">: {project.name}</span>
                        {newTab}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        className="project-also"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
      >
        <div className="project-also__header">
          <h3>Also built</h3>
          <p>Smaller tools and experiments, for anyone who wants to dig deeper.</p>
        </div>
        <ul
          id="also-built-list"
          className={`project-also__list${showAllAlso ? "" : " is-collapsed"}`}
        >
          {profile.alsoBuilt.map((item, index) => (
            <li
              key={item.repo}
              className={index >= ALSO_BUILT_MOBILE_COUNT ? "project-also__extra" : undefined}
            >
              <a
                href={`${profile.github}/${item.repo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="project-also__name">
                  {item.repo}
                  <span aria-hidden="true"> ↗</span>
                </span>
                <span className="project-also__summary">
                  {item.summary}
                  {newTab}
                </span>
              </a>
            </li>
          ))}
        </ul>
        {hiddenOnMobile > 0 ? (
          <button
            type="button"
            className="project-also__toggle"
            aria-expanded={showAllAlso}
            aria-controls="also-built-list"
            onClick={() => setShowAllAlso((current) => !current)}
          >
            {showAllAlso ? "Show fewer" : `Show ${hiddenOnMobile} more`}
            <span aria-hidden="true">{showAllAlso ? "↑" : "↓"}</span>
          </button>
        ) : null}
      </motion.div>

      <div className="project-more">
        <a
          className="button button--ghost"
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          See my GitHub profile
          {newTab}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

