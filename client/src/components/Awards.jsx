import useReveal from "../hooks/useReveal.js";
import { StarDoodle } from "./Doodles.jsx";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

export default function Awards({ awards = [] }) {
  const [ref, visible] = useReveal();

  return (
    <section
      className="section section-tight section-glow"
      id="awards"
      ref={ref}
      style={{ "--glow-color": "color-mix(in srgb, var(--accent) 16%, transparent)" }}
    >
      <div className={`container reveal ${visible ? "is-visible" : ""}`}>
        <div className="eyebrow">Recognition</div>
        <div className="title-row" style={{ marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Awards &amp; recognitions
          </h2>
          <div className="section-doodle doodle-violet" aria-hidden="true">
            <StarDoodle />
            <span>so proud</span>
          </div>
        </div>
        <p className="section-lede">Organizations that noticed the work — the honor rolls, the wins, the thank-yous.</p>

        <div className="quote-grid">
          {awards.map((award) => (
            <div className="quote-card" key={award.title}>
              {award.image && (
              <div className="quote-logo">
                <img
                  src={award.image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.parentElement.style.display = "none";
                  }}
              />
          </div>
  )}
  <div className="quote-mark">&ldquo;</div>
  <p className="quote-text">{award.description}</p>
              <div className="quote-attribution">
                <span className="quote-name">{award.title}</span>
                <span className="quote-role">
                  {award.tag} &middot; {formatDate(award.date)}
                </span>
                {award.hofUrl && (
                  <a className="quote-link" href={award.hofUrl} target="_blank" rel="noreferrer">
                    {award.hofLabel || "View"} &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
