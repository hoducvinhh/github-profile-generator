"use client";

import * as React from "react";
import { useProfileStore } from "@/stores/use-profile-store";
import { TEMPLATE_LIST } from "@/lib/templates/registry";
import { TemplateId } from "@/types/profile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Check, AlertTriangle } from "lucide-react";

export function TemplateSelector() {
  const { config, setTemplate } = useProfileStore();
  const [pendingTemplate, setPendingTemplate] = React.useState<TemplateId | null>(null);
  const currentTemplate =
    TEMPLATE_LIST.find((t) => t.id === config.templateId) || TEMPLATE_LIST[0];

  const handleSelect = (id: TemplateId) => {
    if (id === config.templateId) return;
    setPendingTemplate(id);
  };

  const confirmSwitch = () => {
    if (pendingTemplate) {
      setTemplate(pendingTemplate);
      setPendingTemplate(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
            <LayoutTemplate className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Template:</span>
            <span className="font-semibold">{currentTemplate.name}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Select Starter Template</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {TEMPLATE_LIST.map((template) => {
            const isSelected = template.id === config.templateId;
            return (
              <DropdownMenuItem
                key={template.id}
                onClick={() => handleSelect(template.id as TemplateId)}
                className="flex flex-col items-start gap-1 cursor-pointer py-2"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">
                    {template.name}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <span className="text-[11px] text-muted-foreground line-clamp-2">
                  {template.description}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={pendingTemplate !== null}
        onOpenChange={(open) => !open && setPendingTemplate(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Switch Profile Template?
            </DialogTitle>
            <DialogDescription>
              Switching templates will reset your current sections to the selected
              starter layout. You can also undo this action afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setPendingTemplate(null)}>
              Keep Current
            </Button>
            <Button variant="destructive" onClick={confirmSwitch}>
              Apply Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
