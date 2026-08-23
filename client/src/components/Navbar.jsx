import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SECTION_LINKS = [
  { href: "#about", label: "About" },
  { href: "#certifications", label: "Certifications" },
  { href: "#work", label: "Work" },
  { href: "#awards", label: "Awards" },
];

export default function Navbar({ name }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open, and allow Escape to close it.
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      function onKeyDown(e) {
        if (e.key === "Escape") setOpen(false);
      }
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener("keydown", onKeyDown);
      };
    }
    return undefined;
  }, [open]);

  // Close the mobile menu automatically if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 760) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const firstName = (name || "").split(" ")[0];

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-bg" aria-hidden="true" />
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          {firstName}
        </Link>

        <button
          className="nav-toggle"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "≡"}
        </button>

        <ul className={`nav-links ${open ? "open" : ""}`}>
          {isHome &&
            SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          <li>
            <Link to="/projects" onClick={() => setOpen(false)}>
              Projects
            </Link>
          </li>
          <li>
            <a href={isHome ? "#contact" : "/#contact"} className="nav-cta" onClick={() => setOpen(false)}>
              Get in touch
            </a>
          </li>
        </ul>
      </div>

      <div className={`nav-backdrop ${open ? "open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
    </header>
  );
}
