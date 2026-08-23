export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-brand">{profile.name}</span>
        <div className="footer-links">
          <span style={{ color: "var(--text-faint)" }}>© {year}</span>
          {profile.contact?.github && (
            <a href={profile.contact.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {profile.contact?.linkedin && (
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {profile.contact?.facebook && (
            <a href={profile.contact.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
