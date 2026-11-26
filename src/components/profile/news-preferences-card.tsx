"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/lib/store/userStore";
import { DEFAULT_PREFERENCES, effectivePreferences } from "@/lib/preferences";
import { PreferencesForm } from "./preferences-form";

/** Profile section for editing news language and regions at any time. */
export function NewsPreferencesCard() {
  const user = useUserStore((state) => state.user);
  const savePreferences = useUserStore((state) => state.savePreferences);
  const saved = effectivePreferences(user);
  const [language, setLanguage] = useState(saved.language);
  const [regions, setRegions] = useState(saved.regions);
  const [saving, setSaving] = useState(false);

  // Re-sync when the stored preferences change (e.g. after the first-run prompt).
  const savedKey = `${saved.language}|${saved.regions.join(",")}`;
  useEffect(() => {
    setLanguage(saved.language);
    setRegions(saved.regions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedKey]);

  const dirty = language !== saved.language || regions.join(",") !== saved.regions.join(",");

  const save = async () => {
    setSaving(true);
    try {
      await savePreferences({ language, regions, onboarded: true });
      toast.success("News preferences saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't save your preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card id="preferences" className="scroll-mt-24 rounded-3xl border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Newspaper className="h-5 w-5 text-primary" aria-hidden="true" /> News preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PreferencesForm layout="split" language={language} regions={regions} onLanguageChange={setLanguage} onRegionsChange={setRegions} />
      </CardContent>
      <CardFooter className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLanguage(DEFAULT_PREFERENCES.language);
            setRegions(DEFAULT_PREFERENCES.regions);
          }}
          disabled={saving}
        >
          Reset to English + Global
        </Button>
        <Button onClick={() => void save()} disabled={saving || !dirty || regions.length === 0}>
          {saving ? "Saving…" : "Save preferences"}
        </Button>
      </CardFooter>
    </Card>
  );
}
