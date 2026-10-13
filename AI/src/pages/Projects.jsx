import { Link } from "react-router-dom";
import { FolderKanban, ArrowLeft } from "lucide-react";
import "./Projects.css";

export default function Projects() {
  const projects = JSON.parse(
    localStorage.getItem("cs-projects") || "[]"
  );

  return (
    <main className="section-block projects-page">
      <Link to="/dashboard" className="projects-back">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <span className="eyebrow">YOUR WORKSPACE</span>
      <h1 className="page-title">Tracked Projects</h1>
      <p className="page-description">
        View your saved and tracked creative projects.
      </p>

      {projects.length === 0 ? (
        <div className="projects-empty">
          <FolderKanban size={42} />
          <h2>No tracked projects yet</h2>
          <p>
            Projects you track will appear here. Explore creators
            to discover creative opportunities.
          </p>
          <Link to="/marketplace" className="projects-button">
            Discover Creators
          </Link>
        </div>
      ) : (
        projects.map((project, index) => (
          <article
            className="list-row"
            key={project.id || index}
          >
            <div>
              <strong>
                {project.title || project.name || "Creative Project"}
              </strong>
              <p>
                {project.status || "Tracked project"}
              </p>
            </div>
          </article>
        ))
      )}
    </main>
  );
}