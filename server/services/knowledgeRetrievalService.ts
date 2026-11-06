import { pool } from '../db';

interface KnowledgeArticle {
  id: number;
  title: string;
  category: string;
  content: string;
}

interface PublishedJob {
  id: number;
  title: string;
  department: string;
  job_type: string;
  location: string;
  pay_range: string;
  description: string;
  requirements: string;
}

// In-memory cache for published knowledge articles
let cachedArticles: KnowledgeArticle[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute fallback TTL

export function invalidateKnowledgeCache() {
  cachedArticles = null;
  lastCacheTime = 0;
  console.log('[KnowledgeService] Cache invalidated.');
}

async function getPublishedArticles(): Promise<KnowledgeArticle[]> {
  const now = Date.now();
  if (cachedArticles && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedArticles;
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, title, category, content FROM ai_knowledge_articles WHERE published = 1 AND enabled = 1 ORDER BY id ASC'
    ) as any;
    cachedArticles = rows || [];
    lastCacheTime = now;
    return cachedArticles || [];
  } catch (err) {
    console.error('[KnowledgeService] Error loading articles:', err);
    return cachedArticles || [];
  }
}

/**
 * Retrieve approved public information for a visitor query.
 * Strictly adheres to security rules: parameterized queries, no candidate/admin data,
 * only published job openings and approved public knowledge articles.
 */
export async function retrieveRelevantContext(query: string): Promise<{ contextText: string; references: string[] }> {
  const articles = await getPublishedArticles();
  const lowerQuery = (query || '').toLowerCase();
  const matchedArticles: KnowledgeArticle[] = [];
  const references: string[] = [];

  // Keyword scoring for articles
  const words = lowerQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  for (const art of articles) {
    const titleLower = art.title.toLowerCase();
    const contentLower = art.content.toLowerCase();
    const categoryLower = art.category.toLowerCase();

    let score = 0;
    // Category match
    if (words.some((w) => categoryLower.includes(w))) score += 4;
    // Title match
    for (const w of words) {
      if (titleLower.includes(w)) score += 3;
      if (contentLower.includes(w)) score += 1;
    }

    if (score > 1 || words.length === 0) {
      matchedArticles.push(art);
      references.push(`${art.category}: ${art.title}`);
    }
  }

  // Limit articles to top 4 to fit within model context budget
  const selectedArticles = (matchedArticles.length > 0 ? matchedArticles : articles).slice(0, 4);

  let contextParts: string[] = [];
  for (const art of selectedArticles) {
    contextParts.push(`### [${art.category}] ${art.title}\n${art.content}`);
  }

  // Check if query is asking about job openings or careers
  const jobKeywords = ['job', 'career', 'opening', 'position', 'hire', 'vacancy', 'salary', 'pay', 'rate', 'travel nurse', 'icu', 'er', 'therapist'];
  const isJobQuery = jobKeywords.some((k) => lowerQuery.includes(k));

  if (isJobQuery) {
    try {
      const [jobRows] = await pool.query(`
        SELECT id, title, department, job_type, location, pay_range, description, requirements 
        FROM jobs 
        WHERE status = 'published' 
        ORDER BY created_at DESC 
        LIMIT 5
      `) as any;

      if (jobRows && jobRows.length > 0) {
        contextParts.push('\n### CURRENT ACTIVE JOB OPENINGS (Real database records from Valora Healthcare):');
        for (const j of jobRows as PublishedJob[]) {
          contextParts.push(
            `- **${j.title}** (${j.department} | ${j.job_type} | ${j.location})\n  Pay: ${j.pay_range || 'Competitive'}\n  Requirements: ${j.requirements || 'Contact recruitment for specs'}\n  Apply link: /careers`
          );
          references.push(`Active Job: ${j.title}`);
        }
      }
    } catch (err) {
      console.error('[KnowledgeService] Error loading published jobs:', err);
    }
  }

  // Include approved public website links mapping
  contextParts.push(`
### APPROVED VALORA HEALTHCARE WEBSITE LINKS:
- Homepage: /
- About Valora: /about
- Healthcare Staffing Overview: /staffing-services
- Nursing Staffing & Travel Nursing: /nursing-staffing
- Allied Health Placements: /allied-health-staffing
- Permanent Placement: /permanent-placement
- Why Valora: /why-valora
- Careers & Open Positions: /careers
- Contact & Staffing Request: /contact
- 24/7 Placement Hotline: +1 (800) 555-0199
- Support Email: admin@valorahealthcare.com / contact@valorahealthcare.com
`);

  return {
    contextText: contextParts.join('\n\n'),
    references,
  };
}
