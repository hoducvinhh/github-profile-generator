"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

interface MarkdownPreviewProps {
  markdown: string;
}

const customSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), "align", "style", "className"],
    p: [...(defaultSchema.attributes?.p || []), "align"],
    h1: [...(defaultSchema.attributes?.h1 || []), "align"],
    h2: [...(defaultSchema.attributes?.h2 || []), "align"],
    h3: [...(defaultSchema.attributes?.h3 || []), "align"],
    img: [
      ...(defaultSchema.attributes?.img || []),
      "align",
      "width",
      "height",
      "style",
      "alt",
      "src",
    ],
    table: [...(defaultSchema.attributes?.table || []), "align", "width"],
    th: [...(defaultSchema.attributes?.th || []), "align"],
    td: [...(defaultSchema.attributes?.td || []), "align"],
  },
};

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  return (
    <div className="w-full h-full overflow-y-auto px-6 py-6 bg-card border rounded-lg shadow-sm">
      <div className="markdown-body max-w-4xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeSanitize, customSanitizeSchema]]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
