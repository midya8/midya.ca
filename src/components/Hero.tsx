import { motion } from "motion/react";
import { emailAddress, profile } from "../data/profile";

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__content">
        <motion.div
          className="hero__copy"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
        >
          <motion.p className="hero__kicker" variants={rise}>
            {profile.location}
          </motion.p>
          <motion.h1 id="hero-title" variants={rise}>
            Midya Rahmani
          </motion.h1>
          <motion.p className="hero__lede" variants={rise}>
            {profile.hero}
          </motion.p>
          <motion.div className="hero__actions" variants={rise}>
            <a className="button button--primary" href="#about">
              About me
              <span aria-hidden="true">↓</span>
            </a>
            <a
              className="hero__social-link"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              in
            </a>
            <a
              className="hero__social-link"
              href={`mailto:${emailAddress}`}
              aria-label="Email"
            >
              @
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__portrait-system"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.45 }}
        >
          <div className="portrait-frame">
            <img
              src="/midya-photo.webp"
              alt="Midya Rahmani"
              width="512"
              height="512"
              fetchPriority="high"
            />
            <span className="portrait-frame__scan" aria-hidden="true" />
          </div>
        </motion.div>
      </div>

      <a className="scroll-cue" href="#about" aria-label="Scroll to About">
        <span>Scroll to explore</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
