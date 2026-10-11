import { json } from '@sveltejs/kit';

let cached;
let expires = 0;
const headers = { 'Cache-Control': 'public, max-age=300, s-maxage=3600' };

export async function GET({ fetch }) {
  if (cached && Date.now() < expires) return json(cached, { headers });
  try {
    const response = await fetch('https://github.com/users/JustXutkarsh/contributions', {
      headers: { Accept: 'text/html' },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('GitHub unavailable');
    const html = await response.text();
    const labels = new Map([...html.matchAll(/<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g)].map(([, attrs, label]) => [attrs.match(/\bfor="([^"]+)"/)?.[1], label]));
    const days = [...html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)].map(([, attrs]) => {
      const date = attrs.match(/\bdata-date="([^"]+)"/)?.[1];
      const level = Number(attrs.match(/\bdata-level="(\d)"/)?.[1]);
      const label = labels.get(attrs.match(/\bid="([^"]+)"/)?.[1]);
      const count = label?.startsWith('No contributions') ? 0 : Number(label?.match(/([\d,]+) contributions?\b/)?.[1]?.replaceAll(',', ''));
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(level) || level < 0 || level > 4 || !Number.isInteger(count) || count < 0) throw new Error('Invalid calendar');
      return { date, level, count };
    }).sort((a, b) => a.date.localeCompare(b.date));
    if (!days.length) throw new Error('Empty calendar');
    const start = new Date(`${days.at(-1).date}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay() - 19 * 7);
    cached = { days: days.filter((day) => day.date >= start.toISOString().slice(0, 10)), updated: new Date().toISOString() };
    expires = Date.now() + 3600000;
    return json(cached, { headers });
  } catch {
    return json({ error: 'GitHub activity is temporarily unavailable.' }, { status: 503 });
  }
}
