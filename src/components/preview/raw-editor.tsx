"use client";

import * as React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { copyMarkdownToClipboard } from "@/lib/export/clipboard";

interface RawEditorProps {
  value: string;
}

export function RawEditor({ value }: RawEditorProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const success = await copyMarkdownToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-full h-full border rounded-lg overflow-hidden bg-background flex flex-col">
      <div className="flex items-center justify-between border-b px-3 py-1.5 bg-muted/40">
        <span className="text-xs font-mono text-muted-foreground">README.md</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 gap-1 text-xs px-2"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[markdown()]}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          editable={false}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: false,
          }}
          className="text-xs font-mono"
        />
      </div>
    </div>
  );
}
