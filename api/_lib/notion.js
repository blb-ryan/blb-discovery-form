import { Client } from '@notionhq/client';

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || 'be44fd0d7b0b4eac8a4f209571f3345b';

let _notion = null;

function getNotion() {
  if (_notion) return _notion;
  _notion = new Client({ auth: process.env.NOTION_API_KEY });
  return _notion;
}

/**
 * Create a page in the Business Discovery Submissions database.
 * Returns the page URL.
 */
export async function createDiscoveryPage(properties, markdownContent) {
  const notion = getNotion();

  // Build Notion property objects
  const notionProps = {
    'Company Name': { title: [{ text: { content: properties['Company Name'] || 'Unnamed' } }] },
    'Contact Name': { rich_text: [{ text: { content: properties['Contact Name'] || '' } }] },
    'Email': { email: properties['Email'] || null },
    'Phone': { phone_number: properties['Phone'] || null },
    'Status': { select: { name: properties['Status'] || 'New' } },
    'Complexity Score': { number: properties['Complexity Score'] || 0 },
    'Complexity Tier': { select: { name: properties['Complexity Tier'] || 'Low' } },
    'Involvement Level': { select: { name: properties['Involvement Level'] || 'Ryan-Free' } },
    'Business Type': { select: { name: properties['Business Type'] || 'Startup' } },
    'Brand Status': { select: { name: properties['Brand Status'] || 'New Brand' } },
    'Employee Count': { rich_text: [{ text: { content: properties['Employee Count'] || '' } }] },
    'I Dont Know Count': { number: properties['I Dont Know Count'] || 0 },
  };

  // Add deadline if present
  if (properties['date:Deadline:start']) {
    notionProps['Deadline'] = {
      date: { start: properties['date:Deadline:start'] },
    };
  }

  // Split markdown into blocks (Notion max 2000 chars per block)
  const contentBlocks = splitIntoBlocks(markdownContent);

  const page = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    properties: notionProps,
    children: contentBlocks,
  });

  return page.url;
}

/**
 * Split markdown content into Notion paragraph blocks.
 */
function splitIntoBlocks(markdown) {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const blocks = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ text: { content: line.replace(/^# /, '') } }] },
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: line.replace(/^## /, '') } }] },
      });
    } else if (line.startsWith('**') && line.endsWith('**')) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: line.replace(/\*\*/g, '') }, annotations: { bold: true } }],
        },
      });
    } else {
      // Truncate to 2000 chars per block
      const content = line.substring(0, 2000);
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ text: { content } }] },
      });
    }
  }

  // Notion API allows max 100 children per request
  return blocks.slice(0, 100);
}
