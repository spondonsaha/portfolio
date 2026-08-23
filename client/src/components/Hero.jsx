export default function Hero({ profile }) {
  const [firstWord, ...restWords] = profile.title.split(" ");

  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-inner">
        <div>
          <div className="hero-kicker">Based in Dhaka, Bangladesh</div>
          <h1 className="hero-title">
            {profile.name.split(" ")[0]}, a <em>{profile.title.toLowerCase()}</em> hunting the bugs others miss.
          </h1>
          <p className="hero-sub">{profile.heroLines[0]}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">
              Get in touch
            </a>
            {profile.resumeUrl && (
              <a className="btn btn-outline" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                Download resume
              </a>
            )}
          </div>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={profile.name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div className="hero-photo-placeholder" style={{ display: profile.photo ? "none" : "flex" }}>
              [ add a photo at /public{profile.photo} ]
            </div>
          </div>
          <div className="hero-annotation">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 6C10 22 18 40 34 48C42 52 50 50 54 44"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M46 40L54 44L50 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span>hey, that's&nbsp;me</span>
          </div>
        </div>
      </div>
    </section>
  );
}
