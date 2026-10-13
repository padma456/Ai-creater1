
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

import ContentCard from "../components/ContentCard";
import "./Home.css";

const featured = [
  {
    title: "Future in Bloom",
    creator: "Maya Chen",
    specialization: "AI Filmmaker",
    type: "AI Film",
    description:
      "A cinematic world of futuristic botanical design.",
    tools: ["Runway", "Midjourney"],
    price: "$850",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Liquid Dreams",
    creator: "Alex Rivera",
    specialization: "Generative Artist",
    type: "3D Visuals",
    description:
      "Experimental forms, reflections and vivid materials.",
    tools: ["Blender", "Stable Diffusion"],
    price: "$600",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Beyond Earth",
    creator: "Jordan Lee",
    specialization: "AI Animator",
    type: "Animation",
    description:
      "Otherworldly landscapes for next-generation campaigns.",
    tools: ["Runway", "ComfyUI"],
    price: "$720",
    verified: false,
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=85",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      {/* Hero section */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} />
            THE FUTURE OF CREATIVE WORK
          </span>

          <h1>
            Where AI creativity meets
            <span className="gradient-text">
              {" "}real opportunity.
            </span>
          </h1>

          <p>
            Discover exceptional AI creators, explore their
            workflows, and turn bold brand ideas into
            extraordinary content.
          </p>

          <div className="hero-actions">
            <Link
              to="/marketplace"
              className="button-primary large"
            >
              Explore creators
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/create"
              className="button-secondary large"
            >
              Create a brief
            </Link>
          </div>

          <div className="hero-trust">
            <span>
              <ShieldCheck size={17} />
              Transparent creator profiles
            </span>

            <span>
              <Zap size={17} />
              AI-native workflows
            </span>
          </div>
        </div>

        <div className="hero-art">
          <img
            src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1100&q=90"
            alt="Immersive digital art installation"
          />

          <div className="floating-note">
            <span className="live-dot" />
            Creative possibilities, unlocked
          </div>

          <div className="hero-orbit" />
        </div>
      </section>

      {/* Platform highlights */}
      <section className="stats-row">
        <div>
          <strong>AI-native</strong>
          <span>Creative portfolios</span>
        </div>

        <div>
          <strong>Workflow-first</strong>
          <span>Transparent production</span>
        </div>

        <div>
          <strong>End-to-end</strong>
          <span>Campaign collaboration</span>
        </div>
      </section>

      {/* Featured creators */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              CURATED CREATIVITY
            </span>

            <h2>Discover standout work</h2>

            <p>
              Explore sample creator portfolios and production
              tools.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="text-link"
          >
            View marketplace
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="content-grid">
          {featured.map((item) => (
            <ContentCard
              key={item.title}
              item={item}
            />
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="cta-banner">
        <div>
          <span className="eyebrow">
            HAVE AN IDEA?
          </span>

          <h2>Your next campaign starts here.</h2>

          <p>
            Turn a rough concept into a structured creative
            brief.
          </p>
        </div>

        <Link
          to="/create"
          className="button-primary"
        >
          Build your brief
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
