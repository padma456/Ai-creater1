
import { useState } from "react";
import { BadgeCheck, Camera } from "lucide-react";
import "./Profile.css";
export default function Profile() {
  const [profile, setProfile] = useState(() =>
    JSON.parse(localStorage.getItem("cs-profile") ||
      '{"name":"Creative Member","specialization":"AI Content Creator","bio":"I create imaginative visual experiences using generative tools.","tools":"Midjourney, Runway, Stable Diffusion"}')
  );
  const [message, setMessage] = useState("");

  function update(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  function save(e) {
    e.preventDefault();
    localStorage.setItem("cs-profile", JSON.stringify(profile));
    setMessage("Profile saved in this browser.");
  }

  return (
    <section className="section-block profile-layout">
      <div className="profile-summary">
        <div className="profile-avatar"><Camera size={34} /></div>
        <span className="eyebrow">CREATOR PROFILE</span>
        <h1>{profile.name}</h1>
        <p>{profile.specialization}</p>
        <span className="tag"><BadgeCheck size={14} /> Sample profile</span>
        <p className="muted">
          Verification is not granted by editing this profile.
        </p>
      </div>

      <form className="form-panel" onSubmit={save}>
        <h2>Edit your profile</h2>
        <label>Name<input name="name" value={profile.name} onChange={update} required /></label>
        <label>Specialization<input name="specialization" value={profile.specialization} onChange={update} /></label>
        <label>Bio<textarea name="bio" rows="4" value={profile.bio} onChange={update} /></label>
        <label>AI tools<input name="tools" value={profile.tools} onChange={update} /></label>
        <button className="button-primary full-width">Save profile</button>
        {message && <p className="success-text">{message}</p>}
      </form>
    </section>
  );
}
