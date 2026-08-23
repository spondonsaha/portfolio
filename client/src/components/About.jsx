import useReveal from "../hooks/useReveal.js";
import { ArrowDoodle } from "./Doodles.jsx";

export default function About({ profile }) {
  const [ref, visible] = useReveal();

  return (
    <section className="section intro section-glow" id="about" ref={ref} style={{ "--glow-color": "color-mix(in srgb, var(--teal) 16%, transparent)" }}>
      <div className={`container reveal ${visible ? "is-visible" : ""}`}>
        <div className="eyebrow">About</div>
        <p className="intro-quote" style={{ marginBottom: 12 }}>
          I break things <em className="hl-pink">on purpose</em> — so the people who'd break them for the wrong
          reasons never get the chance.
        </p>
        <div className="section-doodle doodle-teal about-doodle" aria-hidden="true">
          <ArrowDoodle />
          <span>real talk</span>
        </div>

        <div className="intro-body" style={{ marginTop: 56 }}>
          <div>
            <div className="pill-label">Technical skills</div>
            <div className="pill-row">
              {profile.skills.technical.map((s) => (
                <span className="pill" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="pill-label">Tools</div>
            <div className="pill-row">
              {profile.skills.tools.map((s) => (
                <span className="pill" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="intro-details">
            {profile.about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
