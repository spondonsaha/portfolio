import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal.js";

export default function ProjectsTeaser({ projects = [] }) {
  const [ref, visible] = useReveal();
  const featured = projects.slice(0, 3);

  if (!featured.length) return null;

  return (
    <section className="section section-tight" id="projects" ref={ref}>
      <div className={`container reveal ${visible ? "is-visible" : ""}`}>
        <div className="eyebrow">Showcase</div>
        <h2 className="section-title">Projects & write-ups</h2>
        <p className="section-lede">
          A closer look at how a few of these findings came together — full write-ups on the
          <Link to="/projects" style={{ color: "var(--accent)", marginLeft: 4 }}>
            projects page &rarr;
          </Link>
        </p>

        <div className="case-grid">
          {featured.map((project) => (
            <Link to="/projects" className="case-card project-teaser-card" key={project.slug}>
              <div className="project-teaser-tag">{project.category}</div>
              <div className="case-title">{project.title}</div>
              <p className="case-org" style={{ marginBottom: 14 }}>
                {project.summary}
              </p>
              <span className="case-link">View details &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
