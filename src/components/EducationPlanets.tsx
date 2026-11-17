import { motion } from "motion/react";
import { profile } from "../data/profile";
import { SectionHeader } from "./SectionHeader";

export function EducationPlanets() {
  return (
    <section className="section" id="education">
      <SectionHeader
        number="04"
        eyebrow="Academic background"
        title="Education"
        description="Graduate and undergraduate studies from two Canadian universities."
      />

      <div className="education-grid">
        {profile.education.map((education, index) => (
          <motion.article
            className={`education-planet education-planet--${education.accent}`}
            key={education.institution}
            initial={{ opacity: 0, y: 34, rotate: index === 0 ? -1.2 : 1.2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.12 }}
          >
            <div className="education-planet__visual" aria-hidden="true">
              <span />
              <i />
              <b />
            </div>
            <div className="education-planet__brand">
              <img
                src={education.logo}
                alt={`${education.institution} logo`}
                width="280"
                height={index === 0 ? "60" : "101"}
                loading="lazy"
              />
            </div>
            <p className="education-planet__orbit">{education.label}</p>
            <h3>{education.institution}</h3>
            <p className="education-planet__degree">{education.degree}</p>
            <dl>
              <div>
                <dt>Period</dt>
                <dd>{education.period}</dd>
              </div>
              <div>
                <dt>GPA</dt>
                <dd>{education.gpa}</dd>
              </div>
            </dl>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
