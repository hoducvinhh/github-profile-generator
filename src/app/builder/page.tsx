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
import { Button } from "@/components/ui/button";
import {
  Eye,
  FileCode,
  Columns,
  Smartphone,
  Monitor,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BuilderPage() {
  const { config, undo, redo, canUndo, canRedo } = useProfileStore();
  const [activeTab, setActiveTab] = React.useState<"preview" | "code" | "split">(
    "preview"
  );
  const [deviceMode, setDeviceMode] = React.useState<"desktop" | "mobile">(
    "desktop"
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
        <section className="flex w-full md:w-[480px] lg:w-[540px] xl:w-[600px] shrink-0 border-r bg-card/40 flex-col md:flex-row">
          {/* Section Reorder Column */}
          <div className="w-full md:w-[220px] lg:w-[240px] border-b md:border-b-0 md:border-r p-3 h-[240px] md:h-full overflow-hidden">
            <SortableSectionList />
          </div>

          {/* Section Inspector Column */}
          <div className="flex-1 p-4 h-[calc(100vh-14rem)] md:h-full overflow-hidden">
            <MasterInspector />
          </div>
        </section>

        {/* Right Side: Preview & Code View */}
        <section className="hidden md:flex flex-1 flex-col overflow-hidden bg-muted/20">
          {/* Preview Toolbar */}
          <div className="flex h-11 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-2">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as any)}
                className="w-auto"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="preview" className="h-7 text-xs gap-1.5 px-3">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="h-7 text-xs gap-1.5 px-3">
                    <FileCode className="h-3.5 w-3.5" />
                    <span>Markdown</span>
                  </TabsTrigger>
                  <TabsTrigger value="split" className="h-7 text-xs gap-1.5 px-3">
                    <Columns className="h-3.5 w-3.5" />
                    <span>Split View</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant={deviceMode === "desktop" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setDeviceMode("desktop")}
                title="Desktop View"
              >
                <Monitor className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={deviceMode === "mobile" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setDeviceMode("mobile")}
                title="Mobile View"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Preview Content Area */}
          <div className="flex-1 overflow-hidden p-4">
            <div
              className={cn(
                "h-full mx-auto transition-all duration-200",
                deviceMode === "mobile" ? "max-w-[420px]" : "w-full",
                activeTab === "split" && "grid grid-cols-2 gap-4"
              )}
            >
              {activeTab === "preview" && (
                <MarkdownPreview markdown={markdown} />
              )}

              {activeTab === "code" && (
                <RawEditor value={markdown} />
              )}

              {activeTab === "split" && (
                <>
                  <div className="h-full overflow-hidden">
                    <MarkdownPreview markdown={markdown} />
                  </div>
                  <div className="h-full overflow-hidden">
                    <RawEditor value={markdown} />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
