import React, { useState } from "react";
import { contactAPI } from "../../../services/api";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      await contactAPI.send(form);
      setStatus("sent");
    } catch (err) {
      setErrMsg(
        err?.response?.data?.message || "Failed to send. Please try again.",
      );
      setStatus("error");
    }
  };

  if (status === "sent")
    return (
      <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>✅</div>
        <div
          style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: ".4rem" }}
        >
          Message sent!
        </div>
        <div
          style={{
            fontSize: ".875rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          Thanks for reaching out. I'll get back to you at{" "}
          <strong>{form.email}</strong> soon.
        </div>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", email: "", message: "" });
          }}
          className="btn btn-ghost"
          style={{ marginTop: "1.25rem" }}
        >
          Send another →
        </button>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}
    >
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Your Name</label>
        <input
          className="form-input"
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="john@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Message</label>
        <textarea
          className="form-textarea"
          placeholder="Tell me about your project or opportunity…"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>
      {status === "error" && (
        <div
          style={{
            background: "rgba(239,68,68,.1)",
            color: "#ef4444",
            borderRadius: 8,
            padding: ".625rem .875rem",
            fontSize: ".82rem",
            fontWeight: 600,
          }}
        >
          {errMsg}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
        style={{ width: "100%", padding: ".8rem", fontSize: ".925rem" }}
      >
        {status === "sending" ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}
