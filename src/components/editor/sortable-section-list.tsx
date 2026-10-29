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
import { Plus, Sparkles, Layers } from "lucide-react";
import { ALL_SECTION_TYPES, SECTION_METAS } from "@/lib/sections/registry";
import { SectionType } from "@/types/profile";

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
        distance: 5,
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

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Layers className="h-3.5 w-3.5" />
          <span>Sections ({config.sections.length})</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="default" className="h-7 gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Section</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Add Profile Section</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ALL_SECTION_TYPES.map((type) => {
              const meta = SECTION_METAS[type];
              return (
                <DropdownMenuItem
                  key={type}
                  onClick={() => addSection(type)}
                  className="flex flex-col items-start gap-0.5 cursor-pointer"
                >
                  <span className="font-medium">{meta.title}</span>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                    {meta.description}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
            {config.sections.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                isActive={section.id === activeSectionId}
                onSelect={() => setActiveSectionId(section.id)}
                onToggle={() => toggleSectionVisibility(section.id)}
                onDuplicate={() => duplicateSection(section.id)}
                onDelete={() => removeSection(section.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
