import useReveal from "../hooks/useReveal.js";
import { ArrowDoodle } from "./Doodles.jsx";

export default function Certifications({ certifications = [] }) {
  const [ref, visible] = useReveal();

  return (
    <section
      className="section section-tight section-glow"
      id="certifications"
      ref={ref}
      style={{ "--glow-color": "color-mix(in srgb, var(--gold) 16%, transparent)" }}
    >
      <div className={`container reveal ${visible ? "is-visible" : ""}`}>
        <div className="eyebrow">Credentials</div>
        <div className="title-row" style={{ marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Certifications
          </h2>
          <div className="section-doodle doodle-gold" aria-hidden="true">
            <ArrowDoodle />
            <span>always learning</span>
          </div>
        </div>
        <p className="section-lede">Formal training that backs up the hands-on work, from ethical hacking to networking fundamentals.</p>

        <div className="case-grid">
          {certifications.map((cert) => (
            <div className="case-card" key={cert.title}>
              <div className="case-icon">
                <img
                  src={cert.image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                />
              </div>
              <div className="case-title">{cert.title}</div>
              <div className="case-org">{cert.org}</div>
              {cert.verifyUrl && (
                <a className="case-link" href={cert.verifyUrl} target="_blank" rel="noreferrer">
                  Verify credential &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
