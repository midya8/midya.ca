import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { emailAddress, profile } from "../data/profile";
import { SectionHeader } from "./SectionHeader";

function useTorontoTime() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}

export function Contact() {
  const torontoTime = useTorontoTime();

  return (
    <section className="section section--contact" id="contact">
      <SectionHeader
        number="05"
        eyebrow="Get in touch"
        title="Start a conversation"
        description="Open to conversation, connection, and thoughtful collaboration."
      />

      <motion.div
        className="contact-console"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <div className="contact-console__status">
          <span aria-hidden="true" />
          AVAILABLE TO CONNECT
        </div>
        <h3>Say hello from wherever you are.</h3>
        <div className="contact-console__links">
          <a href={`mailto:${emailAddress}`}>
            <span>
              <small>Email</small>
              {emailAddress}
            </span>
            <b aria-hidden="true">↗</b>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <span>
              <small>LinkedIn</small>
              linkedin.com/in/midyarahmani
            </span>
            <b aria-hidden="true">↗</b>
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            <span>
              <small>GitHub</small>
              github.com/midya8
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </div>
      </motion.div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Midya Rahmani</span>
        <span>Toronto · {torontoTime}</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}
