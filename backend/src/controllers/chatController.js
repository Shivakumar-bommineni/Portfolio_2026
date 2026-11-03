const http = require('http');
const { SHIVAKUMAR_DATA, SYSTEM_PROMPT } = require('../data/shivakumar');
const { query } = require('../config/database');

const OLLAMA_HOST  = process.env.OLLAMA_HOST  || 'localhost';
const OLLAMA_PORT  = parseInt(process.env.OLLAMA_PORT || '11434', 10);
const OLLAMA_MODEL = process.env.OLLAMA_MODEL  || 'llama3.2:latest';

/**
 * Intelligent Document-Grounded Knowledge Engine
 * Dynamically answers any question using local data files + live database tables.
 */
async function generateDocumentResponse(userQuery) {
  const q = (userQuery || '').toLowerCase().trim();

  // Fetch live portfolio config and live projects from DB if available
  let liveProjects = [];
  let liveConfig = null;
  try {
    const [projRes, confRes] = await Promise.all([
      query('SELECT name, client, description, status, tech_stack FROM projects ORDER BY created_at DESC LIMIT 10'),
      query('SELECT config FROM portfolio_config LIMIT 1'),
    ]);
    liveProjects = projRes.rows || [];
    liveConfig = confRes.rows[0]?.config || null;
  } catch (e) {
    // Silently proceed with static data
  }

  // 1. Skills & Tech Stack
  if (
    q.includes('skill') ||
    q.includes('technology') ||
    q.includes('technologies') ||
    q.includes('tech stack') ||
    q.includes('frontend') ||
    q.includes('backend') ||
    q.includes('react') ||
    q.includes('node') ||
    q.includes('language')
  ) {
    const s = SHIVAKUMAR_DATA.skills;
    return `**Shivakumar Bommineni's Core Technical Skills:**

* **Frontend:** ${s.frontend.join(', ')}
* **Backend:** ${s.backend.join(', ')}
* **Databases:** ${s.database.join(', ')}
* **DevOps & Deployment:** ${s.devOps.join(', ')}
* **Developer Tools:** ${s.tools.join(', ')}

He specializes in modern full-stack web applications with React.js, Node.js, Express, PostgreSQL, and secure token-based architectures.`;
  }

  // 2. Projects
  if (
    q.includes('project') ||
    q.includes('built') ||
    q.includes('work') ||
    q.includes('portfolio') ||
    q.includes('bookmyot') ||
    q.includes('giivv') ||
    q.includes('visitor') ||
    q.includes('lms')
  ) {
    let response = `**Key Projects Engineered by Shivakumar:**\n\n`;

    // Static project details
    SHIVAKUMAR_DATA.projects.forEach((p, idx) => {
      response += `${idx + 1}. **${p.name}**\n   ${p.description}\n   *Tech:* ${p.tech.join(', ')}\n\n`;
    });

    if (liveProjects.length > 0) {
      response += `**Active Projects from Database:**\n`;
      liveProjects.slice(0, 3).forEach((lp) => {
        response += `* **${lp.name}** (${lp.status}): ${lp.description || 'Full stack application'}\n`;
      });
      response += `\n`;
    }

    response += `You can explore full interactive demos and source repositories in the Projects section!`;
    return response;
  }

  // 3. Experience & Companies
  if (
    q.includes('experience') ||
    q.includes('company') ||
    q.includes('companies') ||
    q.includes('chrp') ||
    q.includes('perennial') ||
    q.includes('job') ||
    q.includes('career')
  ) {
    let response = `**Shivakumar's Professional Experience:**\n\n`;
    SHIVAKUMAR_DATA.experience.forEach((exp) => {
      response += `* **${exp.role}** at **${exp.company}** (${exp.duration}, ${exp.location})\n  ${exp.description}\n  *Technologies:* ${exp.tech.join(', ')}\n\n`;
    });
    return response.trim();
  }

  // 4. Availability & Hiring
  if (
    q.includes('available') ||
    q.includes('hire') ||
    q.includes('hiring') ||
    q.includes('opportunity') ||
    q.includes('looking for') ||
    q.includes('open to')
  ) {
    return `Yes! **Shivakumar is actively available for full-time roles, contracts, and freelance projects.**

He is comfortable with on-site, hybrid, or remote positions. You can directly reach out via the Contact section below or by sending a message through this portfolio.`;
  }

  // 5. Contact & Socials
  if (
    q.includes('contact') ||
    q.includes('reach') ||
    q.includes('email') ||
    q.includes('github') ||
    q.includes('phone') ||
    q.includes('message') ||
    q.includes('linkedin')
  ) {
    return `**How to Contact Shivakumar:**

* **Portfolio Contact Form:** Fill out the message form in the Contact section at the bottom of this page.
* **GitHub:** [${SHIVAKUMAR_DATA.personal.github}](https://${SHIVAKUMAR_DATA.personal.github})
* **Availability:** ${SHIVAKUMAR_DATA.personal.availability}
* **Response Time:** Typically within 24 hours.`;
  }

  // 6. Security, Authentication & MDM
  if (
    q.includes('security') ||
    q.includes('auth') ||
    q.includes('jwt') ||
    q.includes('cookie') ||
    q.includes('mdm') ||
    q.includes('session')
  ) {
    return `**Security & Authentication Architecture:**

Shivakumar has engineered robust production authentication and security architectures, including:
* **MDM Active Session Limits:** Strict 3-device concurrency per user with remote session displacement.
* **Cookie Isolation:** HttpOnly, SameSite namespaced cookies (\`cp_\`) preventing multi-portal collisions.
* **Real-time Eviction:** WebSocket signals (Socket.IO) terminating displaced devices with instant client synchronization.
* **Audit & Defense:** Bcrypt password hashing, rate limiting, brute-force account locking, and cryptographic OTPs.`;
  }

  // 7. Education
  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('bachelor') || q.includes('study')) {
    const edu = SHIVAKUMAR_DATA.education[0];
    return `**Education:**\n\nShivakumar holds a **${edu.degree}** in **${edu.field}** (${edu.status}).`;
  }

  // 8. General Bio / Introduction
  if (
    q.includes('who is') ||
    q.includes('about') ||
    q.includes('introduce') ||
    q.includes('bio') ||
    q.includes('shivakumar') ||
    q.includes('summary')
  ) {
    return `${SHIVAKUMAR_DATA.bio}

* **Role:** ${SHIVAKUMAR_DATA.personal.title}
* **Location:** ${SHIVAKUMAR_DATA.personal.location}
* **Availability:** ${SHIVAKUMAR_DATA.personal.availability}

Feel free to ask about his specific projects, tech stack, or professional background!`;
  }

  // 9. Default Intelligent Response matching FAQs
  for (const faq of SHIVAKUMAR_DATA.faqs) {
    const words = faq.q.toLowerCase().split(' ').filter((w) => w.length > 3);
    const matchCount = words.filter((w) => q.includes(w)).length;
    if (matchCount >= 2) {
      return faq.a;
    }
  }

  return `Shivakumar Bommineni is a Full Stack Developer specializing in **React.js, Node.js, Express.js, PostgreSQL, and modern web application security**. 

He has built enterprise LMS platforms, hospital booking systems (BookMyOT), e-commerce PWAs (Giivv), and automated visitor management systems.

Would you like to know more about his **projects**, **skills**, **experience**, or **how to contact him**?`;
}

/**
 * Stream text to client in NDJSON chunks matching Ollama format
 */
async function streamDocumentResponse(text, res) {
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  // Split into natural word/sentence chunks for realistic streaming
  const chunks = text.match(/[\s\S]{1,16}/g) || [text];

  for (let i = 0; i < chunks.length; i++) {
    const isLast = i === chunks.length - 1;
    const payload = JSON.stringify({
      message: { role: 'assistant', content: chunks[i] },
      done: isLast,
    }) + '\n';

    res.write(payload);
    // tiny delay for smooth realistic streaming
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  res.end();
}

exports.chat = async (req, res) => {
  const { messages = [] } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const userText = lastUserMessage?.content || '';

  // Attempt Ollama upstream first with quick timeout
  let usedOllama = false;

  const tryOllama = () =>
    new Promise((resolve) => {
      const trimmed = messages.slice(-10);
      const payload = JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
        stream: true,
        options: { temperature: 0.5, num_predict: 512 },
      });

      const ollamaReq = http.request(
        {
          hostname: OLLAMA_HOST,
          port: OLLAMA_PORT,
          path: '/api/chat',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
          timeout: 1500, // fast timeout to not block user
        },
        (ollamaRes) => {
          if (ollamaRes.statusCode === 200) {
            usedOllama = true;
            res.setHeader('Content-Type', 'application/x-ndjson');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('X-Accel-Buffering', 'no');
            ollamaRes.pipe(res);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );

      ollamaReq.on('error', () => resolve(false));
      ollamaReq.on('timeout', () => {
        ollamaReq.destroy();
        resolve(false);
      });

      ollamaReq.write(payload);
      ollamaReq.end();
    });

  const ollamaSuccess = await tryOllama();
  if (ollamaSuccess) return;

  // Seamless Fallback: Document-Grounded Knowledge Engine
  try {
    const docAnswer = await generateDocumentResponse(userText);
    await streamDocumentResponse(docAnswer, res);
  } catch (err) {
    console.error('Chat document fallback error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate response' });
    } else {
      res.end();
    }
  }
};

exports.status = async (req, res) => {
  // Always report online because the Document-Grounded Knowledge Engine is active
  res.json({
    online: true,
    model: 'document-grounded-ai',
    engine: 'Portfolio Document Knowledge Base',
  });
};
