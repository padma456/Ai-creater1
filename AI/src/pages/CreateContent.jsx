
import { useState } from "react";
import "./CreateContent.css";

export default function CreateContent() {
  const [brief, setBrief] = useState({
    title: "", description: "", type: "Video",
    style: "Cinematic", ratio: "16:9",
    budget: "1000", deadline: "", commercialUse: "Required"
  });
  const [saved, setSaved] = useState(null);

  function update(e) {
    setBrief({ ...brief, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    const record = { ...brief, id: `BR-${Date.now()}`, status: "Draft" };
    const existing = JSON.parse(localStorage.getItem("cs-briefs") || "[]");
    localStorage.setItem("cs-briefs", JSON.stringify([record, ...existing]));
    setSaved(record);
  }

  return (
    <section className="section-block">
      <span className="eyebrow">BRAND WORKSPACE</span>
      <h1 className="page-title">Create a creative brief.</h1>
      <p className="page-description">Define the campaign before inviting creators.</p>

      <form className="form-panel brief-form" onSubmit={submit}>
        <label>Campaign title
          <input name="title" required value={brief.title} onChange={update}
            placeholder="Summer product launch" />
        </label>
        <label>Campaign idea and audience
          <textarea name="description" required rows="4" value={brief.description}
            onChange={update} placeholder="Describe the goal, audience and message..." />
        </label>
        <div className="form-grid">
          <label>Content type
            <select name="type" value={brief.type} onChange={update}>
              <option>Video</option><option>Image</option>
              <option>Animation</option><option>3D Design</option>
            </select>
          </label>
          <label>Visual style
            <select name="style" value={brief.style} onChange={update}>
              <option>Cinematic</option><option>Minimalist</option>
              <option>Photorealistic</option><option>Surreal</option>
              <option>Editorial</option>
            </select>
          </label>
          <label>Aspect ratio
            <select name="ratio" value={brief.ratio} onChange={update}>
              <option>16:9</option><option>9:16</option>
              <option>1:1</option><option>4:5</option>
            </select>
          </label>
          <label>Budget (USD)
            <input type="number" min="1" name="budget" value={brief.budget} onChange={update} required />
          </label>
          <label>Deadline
            <input type="date" name="deadline" value={brief.deadline} onChange={update} />
          </label>
          <label>Commercial-use rights
            <select name="commercialUse" value={brief.commercialUse} onChange={update}>
              <option>Required</option><option>Negotiable</option><option>Not required</option>
            </select>
          </label>
        </div>
        <button className="button-primary full-width">Save creative brief</button>
        {saved && <div className="success-panel">
          <strong>Brief saved: {saved.id}</strong>
          <p>{saved.title} — {saved.type}, {saved.ratio}, ${saved.budget}</p>
          <p>Status: Draft. This version is stored in this browser only.</p>
        </div>}
      </form>
    </section>
  );
}
