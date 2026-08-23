import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import fallbackProfile from "../data/fallbackProfile.js";

export default function ProjectsPage() {
  const [projects, setProjects] = useState(null);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch(() => {
        if (!cancelled) setProjects(fallbackProfile.projects || []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tags = useMemo(() => {
    if (!projects) return ["All"];
    const set = new Set();
    projects.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (!projects) return [];
    if (activeTag === "All") return projects;
    return projects.filter((p) => p.tags?.includes(activeTag));
  }, [projects, activeTag]);

  return (
    <main className="projects-page">
      <section className="section" style={{ paddingTop: 160, paddingBottom: 60 }}>
        <div className="container">
          <div className="eyebrow">
            <Link to="/" style={{ color: "var(--text-faint)" }}>
              &larr; Back home
            </Link>
          </div>
          <h1 className="section-title" style={{ maxWidth: "18ch", marginBottom: 20 }}>
            Projects & disclosures
          </h1>
          <p className="section-lede" style={{ marginBottom: 44 }}>
            Write-ups, research, and responsibly disclosed vulnerabilities — the detail behind
            the headline findings.
          </p>

          {projects && (
            <div className="tag-filter-row">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-filter ${activeTag === tag ? "active" : ""}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section-tight" style={{ paddingTop: 0 }}>
        <div className="container">
          {!projects && <p style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>Loading projects…</p>}

          {projects && filtered.length === 0 && (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>No projects match that tag yet.</p>
          )}

          <div className="project-list">
            {filtered.map((project) => (
              <article className="project-card" key={project.slug}>
                <div className="project-card-image">
                  <img
                    src={project.image}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="project-card-body">
                  <div className="project-card-meta">
                    <span className="finding-date">{project.year}</span>
                    <span className="severity-dot medium">{project.category}</span>
                  </div>
                  <h2 className="project-card-title">{project.title}</h2>
                  <p className="finding-desc" style={{ marginBottom: 18 }}>
                    {project.description || project.summary}
                  </p>
                  <div className="pill-row" style={{ marginTop: 0, marginBottom: 18 }}>
                    {project.tags?.map((t) => (
                      <span className="pill" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  {project.links?.length > 0 && (
                    <div className="project-card-links">
                      {project.links.map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="case-link">
                          {link.label} &rarr;
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
