"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { SortableSectionList } from "@/components/editor/sortable-section-list";
import { MasterInspector } from "@/components/editor/section-inspectors/master-inspector";
import { MarkdownPreview } from "@/components/preview/markdown-preview";
import { RawEditor } from "@/components/preview/raw-editor";
import { useProfileStore } from "@/stores/use-profile-store";
import { serializeProfileMarkdown } from "@/lib/markdown/serializer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  FileCode,
  Columns,
  Sparkles,
} from "lucide-react";

export default function BuilderPage() {
  const { config, undo, redo, canUndo, canRedo } = useProfileStore();
  const [activeTab, setActiveTab] = React.useState<"preview" | "code" | "split">(
    "preview"
  );

  // Global hotkeys (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        if (canRedo) redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  const markdown = React.useMemo(() => {
    return serializeProfileMarkdown(config);
  }, [config]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        {/* Left Side: Editor Workspace (Section List + Active Inspector) */}
        <section className="flex w-full md:w-[500px] lg:w-[580px] xl:w-[640px] shrink-0 border-r border-border/80 bg-background flex-col md:flex-row">
          {/* Section Reorder Column */}
          <div className="w-full md:w-[240px] lg:w-[260px] border-b md:border-b-0 md:border-r border-border/70 p-3 h-[240px] md:h-full overflow-hidden bg-background">
            <SortableSectionList />
          </div>

          {/* Section Inspector Column */}
          <div className="flex-1 p-3.5 h-[calc(100vh-14rem)] md:h-full overflow-hidden bg-background">
            <MasterInspector />
          </div>
        </section>

        {/* Right Side: Preview & Code View */}
        <section className="hidden md:flex flex-1 flex-col overflow-hidden bg-background">
          {/* Preview Toolbar */}
          <div className="flex h-11 items-center justify-between border-b border-border/70 bg-background px-4">
            <div className="flex items-center gap-2">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as any)}
                className="w-auto"
              >
                <TabsList className="h-7.5 bg-muted/60 p-0.5 border border-border/60">
                  <TabsTrigger value="preview" className="h-6.5 text-xs gap-1.5 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Eye className="h-3 w-3 text-emerald-400" />
                    <span>Live Preview</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="h-6.5 text-xs gap-1.5 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <FileCode className="h-3 w-3" />
                    <span>Markdown Code</span>
                  </TabsTrigger>
                  <TabsTrigger value="split" className="h-6.5 text-xs gap-1.5 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Columns className="h-3 w-3" />
                    <span>Split View</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Real-time Sync</span>
            </div>
          </div>

          {/* Canvas Area with clean framing */}
          <div className="flex-1 overflow-hidden p-3 lg:p-4 bg-muted/15">
            {activeTab === "preview" && (
              <div className="h-full w-full">
                <MarkdownPreview markdown={markdown} />
              </div>
            )}

            {activeTab === "code" && (
              <div className="h-full w-full rounded-xl border border-border/80 overflow-hidden shadow-lg">
                <RawEditor value={markdown} />
              </div>
            )}

            {activeTab === "split" && (
              <div className="grid h-full grid-cols-2 gap-3">
                <div className="h-full overflow-hidden">
                  <MarkdownPreview markdown={markdown} />
                </div>
                <div className="h-full rounded-xl border border-border/80 overflow-hidden shadow-lg">
                  <RawEditor value={markdown} />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
