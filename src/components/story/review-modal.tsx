"use client";

import { useState } from "react";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AIStory } from "@/types";
import { API_BASE_URL } from "@/constants";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  story: AIStory;
  rating: number;
  username?: string;
  onSuccess?: (updatedStory: AIStory) => void;
}

export default function ReviewModal({
  isOpen,
  onOpenChange,
  story,
  rating,
  username,
  onSuccess,
}: ReviewModalProps) {
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setReviewText("");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(
        `${API_BASE_URL}/ai-hub/story/${story.index || story.id}/review`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            review: reviewText,
            reviewerName: username || "Anonymous Reader",
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        toast.success("Thank you for your feedback!");
        onOpenChange(false);
        setReviewText("");
        if (onSuccess) onSuccess(data.story);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            {story.title}
          </DialogTitle>
          <DialogDescription className="text-center font-medium">
            You&apos;ve rated this story. Would you like to give a review for
            the writer agent?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              Feedback (Optional)
            </label>
            <Textarea
              placeholder="The narrative was compelling because..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[120px] bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <DialogFooter className="flex sm:justify-center gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-8 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Transmitting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
