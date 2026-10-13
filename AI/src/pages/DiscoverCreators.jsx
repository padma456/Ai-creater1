
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  BriefcaseBusiness,
  MapPin,
  X,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import "./DiscoverCreators.css";

const creators = [
  {
    id: 1,
    name: "Aarav Sharma",
    username: "@aarav.creates",
    role: "AI Visual Artist",
    location: "Hyderabad, India",
    bio: "Creates premium product visuals, cinematic compositions, and campaign-ready AI artwork for brands.",
    skills: ["Product Photography", "AI Images", "Branding"],
    tools: ["Midjourney", "Adobe Photoshop"],
    specialization: "Product Photography",
    style: "Photorealistic",
    contentType: "AI Images",
    commercialUse: true,
    rate: 2500,
    experience: "2 years",
    workflow:
      "Understand the creative brief, create prompt variations, refine selected images, and deliver edited final files.",
    portfolio: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
    ],
  },
  {
    id: 2,
    name: "Meera Reddy",
    username: "@meeravisuals",
    role: "AI Fashion Creator",
    location: "Bengaluru, India",
    bio: "Develops fashion concepts, editorial visuals, and creative campaigns with distinctive art direction.",
    skills: ["Fashion Design", "AI Images", "Art Direction"],
    tools: ["Stable Diffusion", "Photoshop"],
    specialization: "Fashion & Beauty",
    style: "Editorial",
    contentType: "AI Images",
    commercialUse: true,
    rate: 4000,
    experience: "3 years",
    workflow:
      "Research visual references, prepare concept boards, generate variations, and refine the chosen direction.",
    portfolio: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700",
    ],
  },
  {
    id: 3,
    name: "Rohan Verma",
    username: "@rohan.motion",
    role: "AI Video Creator",
    location: "Mumbai, India",
    bio: "Creates short promotional videos, social media ads, and motion concepts for digital campaigns.",
    skills: ["Video Editing", "Motion Design", "Social Media"],
    tools: ["Runway", "Adobe Premiere Pro"],
    specialization: "Video & Motion",
    style: "Cinematic",
    contentType: "Videos",
    commercialUse: true,
    rate: 6000,
    experience: "2 years",
    workflow:
      "Prepare a storyboard, create motion scenes, edit the sequence, and export the requested video format.",
    portfolio: [
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=700",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700",
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=700",
    ],
  },
  {
    id: 4,
    name: "Ananya Rao",
    username: "@ananya.designs",
    role: "AI Graphic Designer",
    location: "Chennai, India",
    bio: "Designs social creatives, campaign layouts, digital posters, and visual templates.",
    skills: ["Graphic Design", "Branding", "Social Media"],
    tools: ["Canva", "Adobe Firefly"],
    specialization: "Graphic Design",
    style: "Minimalist",
    contentType: "Templates",
    commercialUse: false,
    rate: 1500,
    experience: "1 year",
    workflow:
      "Review brand guidelines, draft layout concepts, select typography, and prepare editable design files.",
    portfolio: [
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=700",
      "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=700",
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=700",
    ],
  },
  {
    id: 5,
    name: "Kavya Nair",
    username: "@kavya.writes",
    role: "AI Content Creator",
    location: "Kochi, India",
    bio: "Creates campaign copy, engaging captions, article drafts, and content plans for digital brands.",
    skills: ["Copywriting", "Articles", "Social Media"],
    tools: ["ChatGPT", "Grammarly"],
    specialization: "Content & Copywriting",
    style: "Editorial",
    contentType: "Articles",
    commercialUse: true,
    rate: 1800,
    experience: "2 years",
    workflow:
      "Research the audience, develop an outline, draft content, fact-check, and refine the final copy.",
    portfolio: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=700",
    ],
  },
  {
    id: 6,
    name: "Ishaan Gupta",
    username: "@ishaan.3d",
    role: "AI & 3D Artist",
    location: "Pune, India",
    bio: "Explores 3D-inspired product concepts, digital environments, and stylized campaign visuals.",
    skills: ["3D Design", "AI Images", "Product Photography"],
    tools: ["Blender", "Midjourney"],
    specialization: "3D & Digital Art",
    style: "3D Render",
    contentType: "Digital Art",
    commercialUse: true,
    rate: 3500,
    experience: "3 years",
    workflow:
      "Create a concept, model or generate assets, refine materials and lighting, and export presentation-ready work.",
    portfolio: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=700",
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=700",
    ],
  },
];

const allSkills = [
  ...new Set(creators.flatMap((creator) => creator.skills)),
].sort();

const allTools = [
  ...new Set(creators.flatMap((creator) => creator.tools)),
].sort();

const allStyles = [
  ...new Set(creators.map((creator) => creator.style)),
].sort();

export default function DiscoverCreators() {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("All");
  const [tool, setTool] = useState("All");
  const [style, setStyle] = useState("All");
  const [contentType, setContentType] = useState("All");
  const [commercialOnly, setCommercialOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState("All");
  const [selectedCreator, setSelectedCreator] = useState(null);

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const searchable = [
        creator.name,
        creator.role,
        creator.bio,
        creator.location,
        creator.specialization,
        ...creator.skills,
        ...creator.tools,
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchable.includes(search.toLowerCase()) &&
        (skill === "All" || creator.skills.includes(skill)) &&
        (tool === "All" || creator.tools.includes(tool)) &&
        (style === "All" || creator.style === style) &&
        (contentType === "All" || creator.contentType === contentType) &&
        (!commercialOnly || creator.commercialUse) &&
        (maxBudget === "All" || creator.rate <= Number(maxBudget))
      );
    });
  }, [
    search,
    skill,
    tool,
    style,
    contentType,
    commercialOnly,
    maxBudget,
  ]);

  function clearFilters() {
    setSearch("");
    setSkill("All");
    setTool("All");
    setStyle("All");
    setContentType("All");
    setCommercialOnly(false);
    setMaxBudget("All");
  }

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

  return (
    <main className="discover-page">
      <section className="discover-hero">
        <div className="discover-hero-copy">
          <span className="discover-eyebrow">
            <Sparkles size={15} /> CREATOR DISCOVERY
          </span>

          <h1>
            Discover creators.
            <br />
            <span>Bring ideas to life.</span>
          </h1>

          <p>
            Find AI creators by their skills, tools, visual style, and
            specializations. Explore their portfolios and find the right
            creative partner for your next brief.
          </p>

          <div className="discover-hero-stats">
            <div>
              <strong>{creators.length}</strong>
              <span>Demo creators</span>
            </div>
            <div>
              <strong>{allSkills.length}</strong>
              <span>Skills available</span>
            </div>
            <div>
              <strong>{allTools.length}</strong>
              <span>Tools listed</span>
            </div>
          </div>
        </div>

        <div className="discover-hero-art">
          <div className="discover-orb">
            <Sparkles size={52} />
          </div>
          <span className="discover-orb-tag tag-one">AI Art</span>
          <span className="discover-orb-tag tag-two">Design</span>
          <span className="discover-orb-tag tag-three">Video</span>
        </div>
      </section>

      <section className="discover-main">
        <div className="discover-heading">
          <div>
            <span className="discover-eyebrow">YOUR CREATIVE NETWORK</span>
            <h2>Find your creator</h2>
            <p>
              Search profiles and combine filters to find a closer match.
            </p>
          </div>
          <span className="discover-result-count">
            {filteredCreators.length} of {creators.length} creators
          </span>
        </div>

        <div className="discover-filters">
          <label className="discover-search">
            <Search size={19} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search creators, skills, tools..."
              aria-label="Search creators"
            />
          </label>

          <div className="discover-filter-grid">
            <label>
              Skill
              <select value={skill} onChange={(event) => setSkill(event.target.value)}>
                <option value="All">All skills</option>
                {allSkills.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              AI tool / software
              <select value={tool} onChange={(event) => setTool(event.target.value)}>
                <option value="All">All tools</option>
                {allTools.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Visual style
              <select value={style} onChange={(event) => setStyle(event.target.value)}>
                <option value="All">All styles</option>
                {allStyles.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Content type
              <select
                value={contentType}
                onChange={(event) => setContentType(event.target.value)}
              >
                <option value="All">All content types</option>
                {["AI Images", "Videos", "Templates", "Articles", "Digital Art"].map(
                  (item) => <option key={item} value={item}>{item}</option>
                )}
              </select>
            </label>

            <label>
              Budget per project
              <select
                value={maxBudget}
                onChange={(event) => setMaxBudget(event.target.value)}
              >
                <option value="All">Any budget</option>
                <option value="2000">Up to ₹2,000</option>
                <option value="3000">Up to ₹3,000</option>
                <option value="5000">Up to ₹5,000</option>
                <option value="10000">Up to ₹10,000</option>
              </select>
            </label>

            <label className="discover-commercial-filter">
              <span>Usage rights</span>
              <span className="discover-checkbox-line">
                <input
                  type="checkbox"
                  checked={commercialOnly}
                  onChange={(event) => setCommercialOnly(event.target.checked)}
                />
                Commercial use available
              </span>
            </label>
          </div>

          <div className="discover-filter-bottom">
            <span>
              <SlidersHorizontal size={16} />
              Combine filters to refine your results.
            </span>
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        </div>

        {filteredCreators.length > 0 ? (
          <div className="creator-grid">
            {filteredCreators.map((creator) => (
              <article className="creator-card" key={creator.id}>
                <div className="creator-card-top">
                  <div className="creator-avatar">
                    {creator.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <span className="creator-role">{creator.role}</span>
                </div>

                <div className="creator-card-content">
                  <h3>{creator.name}</h3>
                  <div className="creator-username">
                    {creator.username}
                    <BadgeCheck size={15} />
                  </div>

                  <div className="creator-location">
                    <MapPin size={15} />
                    {creator.location}
                  </div>

                  <p className="creator-bio">{creator.bio}</p>

                  <div className="creator-specialization">
                    <BriefcaseBusiness size={15} />
                    {creator.specialization}
                  </div>

                  <div className="creator-tags">
                    {creator.skills.slice(0, 3).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <div className="creator-tools">
                    <span>TOOLS</span>
                    <p>{creator.tools.join(" · ")}</p>
                  </div>

                  <div className="creator-card-footer">
                    <div>
                      <span>Starting rate</span>
                      <strong>{formatPrice(creator.rate)}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCreator(creator)}
                    >
                      View portfolio <ExternalLink size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="discover-empty">
            <Search size={34} />
            <h3>No matching creators found</h3>
            <p>
              Try removing a filter or using a broader search to see more
              creators.
            </p>
            <button type="button" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {selectedCreator && (
        <div
          className="creator-modal-backdrop"
          onClick={() => setSelectedCreator(null)}
        >
          <section
            className="creator-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="creator-profile-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="creator-modal-close"
              onClick={() => setSelectedCreator(null)}
              aria-label="Close profile"
            >
              <X size={21} />
            </button>

            <div className="creator-profile-header">
              <div className="creator-avatar creator-avatar-large">
                {selectedCreator.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div>
                <span className="discover-eyebrow">CREATOR PROFILE</span>
                <h2 id="creator-profile-title">{selectedCreator.name}</h2>
                <p>{selectedCreator.role} · {selectedCreator.location}</p>
              </div>
            </div>

            <p className="creator-profile-bio">{selectedCreator.bio}</p>

            <div className="creator-profile-details">
              <div>
                <span>Specialization</span>
                <strong>{selectedCreator.specialization}</strong>
              </div>
              <div>
                <span>Visual style</span>
                <strong>{selectedCreator.style}</strong>
              </div>
              <div>
                <span>Content type</span>
                <strong>{selectedCreator.contentType}</strong>
              </div>
              <div>
                <span>Experience</span>
                <strong>{selectedCreator.experience}</strong>
              </div>
              <div>
                <span>Project rate</span>
                <strong>{formatPrice(selectedCreator.rate)}</strong>
              </div>
              <div>
                <span>Commercial use</span>
                <strong>
                  {selectedCreator.commercialUse ? "Available — confirm terms" : "Not currently offered"}
                </strong>
              </div>
            </div>

            <h3>Skills</h3>
            <div className="creator-tags creator-profile-tags">
              {selectedCreator.skills.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <h3>AI tools & software</h3>
            <p>{selectedCreator.tools.join(" · ")}</p>

            <h3>Workflow</h3>
            <p>{selectedCreator.workflow}</p>

            <h3>Portfolio samples</h3>
            <div className="creator-portfolio-grid">
              {selectedCreator.portfolio.map((image, index) => (
                <a
                  href={image}
                  target="_blank"
                  rel="noreferrer"
                  key={`${selectedCreator.id}-${index}`}
                  aria-label={`Open portfolio sample ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${selectedCreator.name} portfolio sample ${index + 1}`}
                    loading="lazy"
                  />
                </a>
              ))}
            </div>

            <p className="creator-demo-note">
              Demo profile and portfolio samples. Confirm actual usage
              permissions with a creator before commercial use.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
