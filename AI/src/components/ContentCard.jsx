
import { BadgeCheck, ArrowUpRight } from "lucide-react";
import "./ContentCard.css";
import "./ContentCard.css";

export default function ContentCard({ item }) {
  return (
    <article className="content-card">
      <div className="content-image">
        <img src={item.image} alt={item.title} />
        <span className="content-type">{item.type}</span>
      </div>

      <div className="content-details">
        <div className="creator-line">
          <div className="avatar">{item.creator.charAt(0)}</div>
          <div>
            <h3>{item.creator}</h3>
            <p>{item.specialization}</p>
          </div>
          {item.verified && (
            <BadgeCheck className="verified-icon" size={19} />
          )}
        </div>

        <h2>{item.title}</h2>
        <p className="muted">{item.description}</p>

        <div className="tag-list">
          {item.tools.map((tool) => (
            <span className="tag" key={tool}>{tool}</span>
          ))}
        </div>

        <div className="card-footer">
          <span className="price">{item.price}</span>
          <button
            className="icon-button"
            aria-label={`View ${item.title}`}
            onClick={() => alert(`${item.title}\nCreator: ${item.creator}`)}
          >
            <ArrowUpRight size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}
