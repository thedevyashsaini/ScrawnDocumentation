import { ProvideLinksToolSchema } from '../../../lib/inkeep-qa-schema';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  const reqJson = await req.json();

  // Fetch documentation context
  const docsResponse = await fetch(new URL('/llms-full.txt', req.url));
  const docsContext = await docsResponse.text();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are a helpful AI assistant for this documentation site. Use the following documentation content to answer user questions accurately and helpfully.

Documentation content:
${docsContext}

When answering questions:
- Reference specific parts of the documentation when relevant
- If you mention a page or section, use the provideLinks tool to provide helpful links
- Be concise but informative
- If something isn't covered in the documentation, say so clearly
- For the references, redirect the user to /whatever-page, not domain.com/whatever-page`,
    tools: {  
      provideLinks: {
        inputSchema: ProvideLinksToolSchema,
      },
    },
    messages: convertToModelMessages(reqJson.messages, {
      ignoreIncompleteToolCalls: true,
    }),
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
}
