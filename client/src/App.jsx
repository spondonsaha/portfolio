import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Certifications from "./components/Certifications.jsx";
import Experience from "./components/Experience.jsx";
import ProjectsTeaser from "./components/ProjectsTeaser.jsx";
import Awards from "./components/Awards.jsx";
import Contact from "./components/Contact.jsx";
import WorkExperience from "./components/WorkExperience.jsx";
import Footer from "./components/Footer.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";

// Fallback data used if the API is unreachable, so the site still renders.
import fallbackProfile from "./data/fallbackProfile.js";

function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        // slight delay so the target section has rendered/laid out first
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
      }
    } else if (!location.state?.preserveScroll) {
      window.scrollTo(0, 0);
    }
  }, [location]);
  return null;
}

function Home({ profile }) {
  return (
    <main>
      <Hero profile={profile} />
      <About profile={profile} />
      <Awards awards={profile.awards} />
      <Experience experience={profile.experience} />
      <Certifications certifications={profile.certifications} />
      <WorkExperience jobs={profile.workExperience} />
      <ProjectsTeaser projects={profile.projects} />
      <Contact contact={profile.contact} apiOffline={profile.__offline} />
    </main>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) {
          setProfile(fallbackProfile);
          setLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-faint)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        loading profile...
      </div>
    );
  }

  return (
    <>
      <ScrollToHash />
      <Navbar name={profile.name} />
      <Routes>
        <Route path="/" element={<Home profile={{ ...profile, __offline: loadError }} />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
      <Footer profile={profile} />
      <ThemeToggle />
    </>
  );
}
