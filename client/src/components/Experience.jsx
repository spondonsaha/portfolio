import useReveal from "../hooks/useReveal.js";
import { ArrowDoodle } from "./Doodles.jsx";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}

export default function Experience({ experience = [] }) {
  const [ref, visible] = useReveal();

  return (
    <section
      className="section section-tight section-glow"
      id="work"
      ref={ref}
      style={{ "--glow-color": "color-mix(in srgb, var(--pink) 16%, transparent)" }}
    >
      <div className={`container reveal ${visible ? "is-visible" : ""}`}>
        <div className="eyebrow">Selected work</div>
        <div className="title-row" style={{ marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Findings &amp; disclosures
          </h2>
          <div className="section-doodle doodle-pink" aria-hidden="true">
            <ArrowDoodle />
            <span>the fun part</span>
          </div>
        </div>
        <p className="section-lede">A few vulnerabilities I've responsibly disclosed — the process matters as much as the discovery.</p>

        <div>
          {experience.map((item, i) => (
            <article className="finding-row" key={item.title}>
              <div className="finding-index">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="finding-title">{item.title}</h3>
                <p className="finding-desc">{item.description}</p>
              </div>
              <div className="finding-meta">
                <span className={`severity-dot ${item.severity}`}>{item.severity}</span>
                <span className="finding-date">{formatDate(item.date)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
