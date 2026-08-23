import { useState } from "react";
import useReveal from "../hooks/useReveal.js";
import { CircleDoodle } from "./Doodles.jsx";

const initialForm = { name: "", email: "", message: "", honeypot: "" };

export default function Contact({ contact, apiOffline }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [ref, visible] = useReveal();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus({ type: "success", message: data.message || "Message sent." });
      setForm(initialForm);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to send message." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className="contact-section section-glow"
      id="contact"
      ref={ref}
      style={{ "--glow-color": "color-mix(in srgb, var(--teal) 18%, transparent)" }}
    >
      <div className={`container-narrow reveal ${visible ? "is-visible" : ""}`}>
        <div className="section-doodle doodle-teal" aria-hidden="true" style={{ justifyContent: "center", marginBottom: 10 }}>
          <CircleDoodle />
          <span>say hi</span>
        </div>
        <h2 className="contact-title">
          Let's make something <em>secure</em>.
        </h2>
        <p className="contact-sub">
          Open to collaborations, security consultations, or just a hello. Drop a message below or reach out
          directly.
        </p>

        <div className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleSubmit}>
            {apiOffline && (
              <div className="form-status error" role="status">
                Backend API not reachable — start the server (see README) to enable message sending.
              </div>
            )}
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required minLength={2} maxLength={100} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required maxLength={200} />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={5000}
              />
            </div>
            <div className="field-hp" aria-hidden="true">
              <label htmlFor="honeypot">Leave this field empty</label>
              <input id="honeypot" name="honeypot" type="text" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={handleChange} />
            </div>

            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ alignSelf: "flex-start" }}>
              {submitting ? "Sending..." : "Send message"}
            </button>

            {status && (
              <div className={`form-status ${status.type}`} role="status">
                {status.message}
              </div>
            )}
          </form>
        </div>

        <div className="contact-links">
          {contact?.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact?.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {contact?.github && (
            <a href={contact.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {contact?.facebook && (
            <a href={contact.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
