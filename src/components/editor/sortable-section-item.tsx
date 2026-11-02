"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionItem } from "@/types/profile";
import { SECTION_METAS } from "@/lib/sections/registry";
import {
  GripVertical,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  User,
  BookOpen,
  Share2,
  Code,
  BarChart3,
  Flame,
  PieChart,
  FolderGit2,
  Activity,
  Sliders,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  User,
  BookOpen,
  Share2,
  Code,
  BarChart3,
  Flame,
  PieChart,
  FolderGit2,
  Activity,
  Sliders,
};

interface SortableSectionItemProps {
  section: SectionItem;
  isActive: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SortableSectionItem({
  section,
  isActive,
  canMoveUp,
  canMoveDown,
  onSelect,
  onToggle,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = SECTION_METAS[section.type];
  const IconComponent = (meta && ICONS[meta.icon]) || Sliders;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center justify-between rounded-lg border px-2 py-1.5 text-xs transition-all duration-150 select-none",
        isActive
          ? "border-emerald-500/50 bg-emerald-500/[0.06] text-foreground shadow-sm"
          : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground",
        !section.enabled && "opacity-40 italic",
        isDragging && "z-50 scale-[1.02] opacity-90 shadow-2xl border-emerald-500 bg-background"
      )}
    >
      {/* Left: Drag Handle + Selectable Title */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        {/* Prominent Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex h-7 w-6 shrink-0 items-center justify-center rounded border border-border/50 bg-muted/40 text-muted-foreground hover:bg-muted hover:border-emerald-500/40 hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
          title="Kéo thả biểu tượng này để đổi thứ tự"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>

        {/* Section Title & Icon */}
        <button
          type="button"
          onClick={onSelect}
          className="flex items-center gap-2 truncate py-1 text-left flex-1 focus:outline-none"
        >
          <div
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded",
              isActive
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-muted text-muted-foreground group-hover:text-foreground"
            )}
          >
            <IconComponent className="h-3 w-3" />
          </div>
          <span
            className={cn(
              "font-medium truncate",
              isActive ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {section.title}
          </span>
        </button>
      </div>

      {/* Right: Quick Move Up/Down + Toggle + Duplicate + Delete */}
      <div className="flex items-center gap-0.5 shrink-0 ml-1">
        {/* Quick Move Up/Down Buttons */}
        <div className="flex flex-col -space-y-0.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="h-3.5 w-4 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:hover:text-muted-foreground transition-colors"
            title="Di chuyển lên trên"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="h-3.5 w-4 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:hover:text-muted-foreground transition-colors"
            title="Di chuyển xuống dưới"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Visibility Toggle */}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "h-6 w-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
            section.enabled ? "text-emerald-400" : "text-muted-foreground"
          )}
          title={section.enabled ? "Ẩn mục này khỏi README" : "Hiện mục này trong README"}
        >
          {section.enabled ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={onDuplicate}
          className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Nhân bản section"
        >
          <Copy className="h-3 w-3" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Xóa section"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
