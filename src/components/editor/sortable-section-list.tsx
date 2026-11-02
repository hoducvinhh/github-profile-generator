"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useProfileStore } from "@/stores/use-profile-store";
import { SortableSectionItem } from "./sortable-section-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Layers, ArrowUpDown } from "lucide-react";
import { ALL_SECTION_TYPES, SECTION_METAS } from "@/lib/sections/registry";

export function SortableSectionList() {
  const {
    config,
    activeSectionId,
    setActiveSectionId,
    reorderSections,
    toggleSectionVisibility,
    duplicateSection,
    removeSection,
    addSection,
  } = useProfileStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSections(String(active.id), String(over.id));
    }
  };

  const handleMove = (id: string, direction: -1 | 1) => {
    const index = config.sections.findIndex((s) => s.id === id);
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < config.sections.length) {
      reorderSections(id, config.sections[targetIndex].id);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-2.5">
      {/* Top Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span>Sections</span>
          </div>
          <span className="rounded-full bg-muted/80 px-1.5 py-0.2 text-xs font-mono font-medium text-muted-foreground border border-border/60">
            {config.sections.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs px-2.5 border-border/80 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
            >
              <Plus className="h-3 w-3" />
              <span>Add Section</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-1.5">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Add New Section
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ALL_SECTION_TYPES.map((type) => {
              const meta = SECTION_METAS[type];
              return (
                <DropdownMenuItem
                  key={type}
                  onClick={() => addSection(type)}
                  className="flex flex-col items-start gap-0.5 cursor-pointer text-xs py-2"
                >
                  <span className="font-medium text-foreground">{meta.title}</span>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                    {meta.description}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Helper cue */}
      <div className="flex items-center gap-1.5 px-1 py-1 text-[11px] text-muted-foreground/80 bg-muted/30 rounded border border-border/40">
        <ArrowUpDown className="h-3 w-3 text-emerald-400 shrink-0" />
        <span className="truncate">Kéo biểu tượng ⋮⋮ hoặc bấm ▲▼ để đổi thứ tự</span>
      </div>

      {/* Sortable List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={config.sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {config.sections.map((section, index) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                isActive={section.id === activeSectionId}
                canMoveUp={index > 0}
                canMoveDown={index < config.sections.length - 1}
                onSelect={() => setActiveSectionId(section.id)}
                onToggle={() => toggleSectionVisibility(section.id)}
                onDuplicate={() => duplicateSection(section.id)}
                onDelete={() => removeSection(section.id)}
                onMoveUp={() => handleMove(section.id, -1)}
                onMoveDown={() => handleMove(section.id, 1)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
