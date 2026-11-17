import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { profile } from "../data/profile";
import { SectionHeader } from "./SectionHeader";

export function InterestsSignals() {
  return (
    <section className="section" id="interests">
      <SectionHeader
        number="05"
        eyebrow="Personal interests"
        title="Beyond work"
        description="The topics and activities I keep returning to, from markets and technology to movement and exploration."
      />

      <motion.div
        className="signal-map"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65 }}
      >
        <div className="signal-map__core" aria-hidden="true">
          <span>M</span>
          <i />
          <b />
        </div>
        <ul>
          {profile.interests.map((interest, index) => (
            <motion.li
              key={interest}
              style={{ "--signal-index": index } as CSSProperties}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {interest}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
