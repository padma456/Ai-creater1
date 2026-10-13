
import { useState } from "react";
import {
  Sparkles,
  Copy,
  RotateCcw,
  FileText,
  Image,
  Video,
} from "lucide-react";
import "./AIStudio.css";

function getTopic(prompt) {
  return prompt
    .replace(
      /^(please\s+)?(give|create|generate|make|write|prepare)\s+(me\s+)?(an?\s+)?(video|film|reel|animation|essay|article|story|paragraph|speech)\s+(of|about|on|showing|regarding)\s+/i,
      ""
    )
    .replace(
      /^(an?\s+)?(video|film|reel|animation|essay|article|story|paragraph|speech)\s+(of|about|on)\s+/i,
      ""
    )
    .replace(/^(about|on|of)\s+/i, "")
    .trim()
    .replace(/[.!?]+$/, "");
}

function createEssay(topic, style) {
  const title = topic.charAt(0).toUpperCase() + topic.slice(1);

  const simple = /simple|easy to understand/i.test(style);

  if (/joint family/i.test(topic)) {
    return `ESSAY: JOINT FAMILY

Introduction

A joint family is a family in which several generations live together, share responsibilities, and support one another. It may include grandparents, parents, uncles, aunts, and children. The joint family system has been an important part of Indian culture for generations.

Meaning of a Joint Family

In a joint family, family members often live in the same house or close to one another. They share household responsibilities, celebrate festivals together, and help each other during difficult times.

Advantages of a Joint Family

1. Love and support: Family members provide emotional support and care for one another.

2. Respect for elders: Children learn values, traditions, and life lessons from grandparents.

3. Shared responsibilities: Household work and family duties can be divided among members.

4. Care for children and elders: Family members can help care for young children and older people.

5. Cultural traditions: Festivals, customs, and family celebrations help preserve cultural values.

Challenges

Living together can sometimes lead to disagreements about responsibilities, privacy, or decisions. Mutual respect, honest communication, and understanding are important for maintaining harmony.

Importance in Modern Society

Even when family members live in different homes, they can maintain the spirit of a joint family by staying connected, helping each other, and spending time together.

Conclusion

A joint family teaches love, cooperation, sharing, and respect. Although family structures are changing, the values of caring for one another and standing together remain important.

Writing style: ${style}`;
  }

  return `${title}

Introduction

${title} is an interesting and meaningful topic. Understanding it helps us learn more about the world around us and recognize its importance in everyday life.

Main Discussion

${title} can be understood by looking at its meaning, important features, and effects on people and society. Learning about this subject helps us develop knowledge, think carefully, and understand different points of view.

Importance

Understanding ${topic} can help people make informed decisions and develop a broader perspective. Its importance depends on how it relates to our lives, our communities, and the challenges we face.

Conclusion

In conclusion, ${topic} is a topic worth learning about. By exploring it carefully and applying what we learn, we can improve our understanding and use our knowledge in a positive way.

Writing style: ${style}

Note: This is a starter draft. Add verified facts and topic-specific examples for a complete assignment.`;
}

function createVideo(topic, style) {
  if (/joint family|grandparent|grandmother|grandfather/i.test(topic)) {
    return `VIDEO TITLE: The Beauty of a Joint Family

VIDEO THEME
Love, respect, cooperation, and togetherness across generations.

SUGGESTED DURATION
60–90 seconds

SCENE 1 — A HAPPY FAMILY MORNING (0–15 seconds)

Visual:
Show a warm Indian home in the morning. Grandparents sit in the living room while parents prepare breakfast. Children greet their grandparents respectfully.

Narration:
"A family becomes stronger when generations live together, share happiness, and support one another."

SCENE 2 — SHARING RESPONSIBILITIES (15–30 seconds)

Visual:
The mother prepares breakfast, the father helps with household tasks, the grandmother tells a traditional story, and the grandfather helps a child with homework.

Dialogue:
Child: "Grandpa, can you tell me a story?"
Grandfather: "Of course! Every story teaches us something valuable."

SCENE 3 — LOVE AND CARE (30–45 seconds)

Visual:
The family eats lunch together, shares food, and discusses their day. When a child feels sad, a family member offers comfort.

Narration:
"In a joint family, love, care, traditions, and life lessons are shared every day."

SCENE 4 — CELEBRATING TOGETHER (45–65 seconds)

Visual:
Family members decorate the house for a festival. Children help prepare decorations while adults prepare food. Everyone celebrates together.

Narration:
"During difficult times and joyful moments, family members stand together and help one another."

SCENE 5 — A HEARTWARMING ENDING (65–90 seconds)

Visual:
Three generations sit together in the courtyard at sunset. Children hold their grandparents' hands as the family smiles.

Narration:
"A joint family is more than people living together. It is a home filled with love, respect, cooperation, and belonging."

CLOSING TEXT
TOGETHER WE ARE STRONGER
The Beauty of a Joint Family

VIDEO PRODUCTION NOTES

Visual style: ${style}
Format: 16:9 landscape or 9:16 vertical
Music: Gentle, heartwarming instrumental music
Colors: Warm gold, soft orange, and natural home colors
Editing: Smooth transitions, natural expressions, and clear narration

Note: This is a written storyboard, not a rendered video. Use a video-generation model to create actual footage.`;
  }

  return `VIDEO TITLE
${topic.charAt(0).toUpperCase() + topic.slice(1)}

VIDEO CONCEPT
Create a short video about ${topic}. Explain the main idea through relevant visuals, a clear storyline, and narration appropriate for the intended audience.

SCENE 1 — INTRODUCTION (0–10 seconds)

Visual:
Open with an establishing shot directly related to ${topic}. Introduce the setting, subject, or people involved.

Narration:
"Discover ${topic} and explore what makes it important."

SCENE 2 — DEVELOP THE STORY (10–25 seconds)

Visual:
Show the main activity, key people, or important events connected to ${topic}. Use specific examples rather than unrelated visuals.

Narration:
"Every detail adds to the story. Understanding the subject helps us see its meaning and importance."

SCENE 3 — THE MAIN MESSAGE (25–40 seconds)

Visual:
Highlight the most important point, benefit, challenge, or emotional moment related to ${topic}.

Narration:
"Through knowledge, experience, and understanding, we can discover what makes this subject meaningful."

SCENE 4 — CONCLUSION (40–55 seconds)

Visual:
End with a memorable shot that reinforces the central message.

Narration:
"Explore, understand, and share the story of ${topic}."

CLOSING TEXT
${topic.charAt(0).toUpperCase() + topic.slice(1)}

PRODUCTION NOTES
Visual style: ${style}
Format: 16:9 landscape or 9:16 vertical
Music: Select music that suits the subject
Editing: Relevant shots, clear narration, and smooth transitions

Note: This is a starter storyboard. Add researched, topic-specific details before production.`;
}

function createAdvertisement(topic, style) {
  if (/skincare|skin care|beauty product/i.test(topic)) {
    return `ADVERTISEMENT: SKINCARE CAMPAIGN

CAMPAIGN IDEA
${topic}

HEADLINE
Your Skin, Your Natural Glow.

OPENING
Show the skincare product against a clean background with soft light and botanical details.

PRODUCT PRESENTATION
Display the product packaging, texture, and application. Focus on the features that the brand can substantiate.

LIFESTYLE SCENE
Show a person following a skincare routine in a bright, comfortable setting.

CLOSING
Display the product name and a clear call to action.

CALL TO ACTION
Discover Your Skincare Routine.

VISUAL STYLE
${style}

SUGGESTED DELIVERABLES
• One hero campaign image
• Three social media posts
• One short vertical promotional video

Note: Add the real brand name, verified product details, and approved claims before publishing.`;
  }

  return `ADVERTISEMENT CONCEPT

CAMPAIGN SUBJECT
${topic}

HEADLINE
Make Every Moment Remarkable.

MAIN MESSAGE
Introduce ${topic} with a clear benefit or memorable message that matters to the intended audience.

VISUAL DIRECTION
• Main subject: Keep the product, service, or idea in focus.
• Composition: Use a clean, balanced layout.
• Colors: Choose a palette that suits the brand.
• Typography: Use a clear headline and readable supporting text.

SUGGESTED SCENES
1. Introduce the product or idea.
2. Show its main features or benefits.
3. Present it in a relatable setting.
4. End with the brand message and call to action.

CALL TO ACTION
Discover More Today.

Visual style: ${style}

SUGGESTED DELIVERABLES
• One main campaign visual
• Three social media adaptations
• One short promotional video concept

Note: Replace sample copy with accurate brand and product information.`;
}

function createCreativeBrief(topic, style) {
  return `CREATIVE DIRECTION

PROJECT IDEA
${topic}

CORE CONCEPT
Build a creative experience around ${topic}. Use a clear focal point and supporting elements that communicate the main idea to the intended audience.

VISUAL DIRECTION

• Subject: Make the main subject immediately recognizable.
• Composition: Keep the layout balanced and uncluttered.
• Color palette: Choose colors that reinforce the intended mood.
• Lighting: Use lighting that supports the subject and atmosphere.
• Typography: Keep text clear and readable where needed.

SUGGESTED DELIVERABLES
• One hero visual
• Three social media variations
• One optional campaign adaptation

SUGGESTED FORMATS
• 16:9 for banners and presentations
• 1:1 for square social posts
• 9:16 for stories and reels

PRODUCTION WORKFLOW
1. Define the audience and objective.
2. Develop the concept.
3. Collect visual references.
4. Create and refine the first draft.
5. Review quality and usage rights.

Visual style: ${style}

Note: This is a creative brief, not a generated image.`;
}

export default function AIStudio() {
  const [idea, setIdea] = useState("");
  const [contentType, setContentType] = useState("Auto detect");
  const [style, setStyle] = useState("Professional");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");

  function generateContent() {
    const prompt = idea.trim();

    if (!prompt) {
      setMessage("Please describe your idea first.");
      setResult("");
      return;
    }

    const topic = getTopic(prompt);
    const lowerPrompt = prompt.toLowerCase();

    let type = contentType;

    if (type === "Auto detect") {
      if (
        /\b(essay|article|story|paragraph|speech|blog|write)\b/.test(
          lowerPrompt
        )
      ) {
        type = "Text";
      } else if (
        /\b(video|film|reel|animation|storyboard)\b/.test(lowerPrompt)
      ) {
        type = "Video";
      } else if (
        /\b(advertisement|advert|commercial|promotion|marketing)\b/.test(
          lowerPrompt
        )
      ) {
        type = "Advertisement";
      } else {
        type = "Creative";
      }
    }

    let generated = "";

    if (type === "Text") {
      generated = createEssay(topic || prompt, style);
    } else if (type === "Video") {
      generated = createVideo(topic || prompt, style);
    } else if (type === "Advertisement") {
      generated = createAdvertisement(topic || prompt, style);
    } else {
      generated = createCreativeBrief(topic || prompt, style);
    }

    setResult(generated);
    setMessage("");
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result);
      setMessage("Content copied successfully.");
    } catch {
      setMessage(
        "Copy was unsuccessful. Select the generated text and copy it manually."
      );
    }
  }

  function resetStudio() {
    setIdea("");
    setContentType("Auto detect");
    setStyle("Professional");
    setResult("");
    setMessage("");
  }

  return (
    <section className="section-block studio-layout">
      <div className="studio-heading">
        <span className="eyebrow">
          <Sparkles size={15} />
          CREATOR STUDIO
        </span>

        <h1 className="page-title">
          Ideas into{" "}
          <span className="gradient-text">creative direction.</span>
        </h1>

        <p className="page-description">
          Describe your idea and create a tailored draft for your
          essay, advertisement, video storyboard, or campaign.
        </p>
      </div>

      <div className="studio-workspace">
        <div className="form-panel studio-form">
          <label htmlFor="studio-idea">Describe your idea</label>

          <textarea
            id="studio-idea"
            rows={7}
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="Example: Give a video of a joint family celebrating an Indian festival..."
          />

          <label htmlFor="content-type">Content type</label>

          <select
            id="content-type"
            value={contentType}
            onChange={(event) => setContentType(event.target.value)}
          >
            <option>Auto detect</option>
            <option>Text</option>
            <option>Advertisement</option>
            <option>Video</option>
            <option>Creative</option>
          </select>

          <label htmlFor="studio-style">Writing or visual style</label>

          <select
            id="studio-style"
            value={style}
            onChange={(event) => setStyle(event.target.value)}
          >
            <option>Professional</option>
            <option>Simple and easy to understand</option>
            <option>Creative</option>
            <option>Cinematic</option>
            <option>Academic</option>
            <option>Friendly</option>
          </select>

          <button
            type="button"
            className="button-primary full-width studio-generate"
            onClick={generateContent}
          >
            <Sparkles size={18} />
            Generate content
          </button>

          {message && <p className="studio-message">{message}</p>}
        </div>

        <div className="form-panel studio-result">
          <div className="result-heading">
            <div>
              <span className="eyebrow">YOUR RESULT</span>
              <h2>Generated content</h2>
            </div>

            <FileText size={23} />
          </div>

          {result ? (
            <>
              <pre className="generated-output">{result}</pre>

              <div className="result-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={copyResult}
                >
                  <Copy size={16} />
                  Copy content
                </button>

                <button
                  type="button"
                  className="button-secondary"
                  onClick={resetStudio}
                >
                  <RotateCcw size={16} />
                  Start again
                </button>
              </div>
            </>
          ) : (
            <div className="studio-empty">
              <div className="studio-empty-icon">
                <Sparkles size={28} />
              </div>

              <h3>Your ideas start here</h3>

              <p>
                Enter your idea, choose a content type and style,
                then generate your draft.
              </p>

              <div className="studio-examples">
                <span>
                  <FileText size={15} />
                  Essays and articles
                </span>

                <span>
                  <Image size={15} />
                  Campaign concepts
                </span>

                <span>
                  <Video size={15} />
                  Video storyboards
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
