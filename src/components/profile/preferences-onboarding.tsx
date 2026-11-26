"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserStore } from "@/lib/store/userStore";
import { DEFAULT_PREFERENCES, effectivePreferences } from "@/lib/preferences";
import { PreferencesForm } from "./preferences-form";

/**
 * One-time, skippable prompt after sign-in for users who haven't set news
 * preferences. Skipping saves the defaults (English + Global) so it won't reappear.
 */
export function PreferencesOnboarding() {
  const user = useUserStore((state) => state.user);
  const savePreferences = useUserStore((state) => state.savePreferences);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(DEFAULT_PREFERENCES.language);
  const [regions, setRegions] = useState(DEFAULT_PREFERENCES.regions);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && !effectivePreferences(user).onboarded) setOpen(true);
  }, [user]);

  const finish = async (choice: { language: string; regions: string[] }) => {
    setSaving(true);
    try {
      await savePreferences({ ...choice, onboarded: true });
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't save your preferences.");
    } finally {
      setSaving(false);
    }
  };

  const skip = () => void finish({ language: DEFAULT_PREFERENCES.language, regions: DEFAULT_PREFERENCES.regions });

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !saving && skip()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Personalise your news</DialogTitle>
          <DialogDescription>
            Pick your language and the regions you follow. You can change these any time in your profile.
          </DialogDescription>
        </DialogHeader>
        <PreferencesForm language={language} regions={regions} onLanguageChange={setLanguage} onRegionsChange={setRegions} />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={skip} disabled={saving}>Skip for now</Button>
          <Button onClick={() => void finish({ language, regions })} disabled={saving || regions.length === 0}>
            {saving ? "Saving…" : "Save preferences"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
