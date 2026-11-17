import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#interests", label: "Interests" },
  { href: "#contact", label: "Contact" },
] as const;

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");

  useEffect(() => {
    const sections = links
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.05, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Midya Rahmani, home">
        <span className="brand__text">Midya</span>
      </a>

      <button
        className="nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-nav"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((current) => !current)}
      >
        <span />
        <span />
      </button>

      <nav
        className={`site-nav${open ? " is-open" : ""}`}
        id="site-nav"
        aria-label="Primary navigation"
      >
        {links.map(({ href, label }) => {
          const sectionId = href.slice(1);
          return (
            <a
              key={href}
              href={href}
              className={active === sectionId ? "is-active" : ""}
              aria-current={active === sectionId ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
