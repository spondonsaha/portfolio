import useReveal from "../hooks/useReveal.js";
import { CircleDoodle } from "./Doodles.jsx";

export default function WorkExperience({ jobs = [] }) {
  const [ref, visible] = useReveal();

  if (!jobs.length) return null;

  return (
    <section
      className="section section-tight section-glow"
      id="experience"
      ref={ref}
      style={{ "--glow-color": "color-mix(in srgb, var(--teal) 14%, transparent)" }}
    >
      <div className={`container reveal ${visible ? "is-visible" : ""}`}>
        <div className="eyebrow">Career</div>
        <div className="title-row" style={{ marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Work experience
          </h2>
          <div className="section-doodle doodle-teal" aria-hidden="true">
            <CircleDoodle />
            <span>the journey</span>
          </div>
        </div>
        <p className="section-lede">Where I've worked and what I've been building along the way.</p>

        <div className="job-list">
          {jobs.map((job) => (
            <article className="job-item" key={`${job.role}-${job.company}`}>
              <div className="job-top">
                <div>
                  <h3 className="job-role">{job.role}</h3>
                  <div className="job-company">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </div>
                </div>
                <span className="job-period">
                  {job.startDate} — {job.endDate || "Present"}
                </span>
              </div>
              {job.bullets?.length > 0 && (
                <ul className="job-bullets">
                  {job.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
