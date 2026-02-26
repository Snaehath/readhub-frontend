"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIStory } from "@/types";
import Typography from "@/components/ui/custom/typography";
import { toast } from "sonner";

interface StoryReviewProps {
  storyId: string;
  onSuccess?: (updatedStory: AIStory) => void;
}

export default function StoryReview({ storyId, onSuccess }: StoryReviewProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://readhub-backend.onrender.com/api";

      const res = await fetch(`${baseUrl}/story/${storyId}/review`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, review }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Feedback submitted! Thank you for sharing.");
        setRating(0);
        setReview("");
        if (onSuccess) onSuccess(data.story);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none bg-background/60 backdrop-blur-xl shadow-2xl shadow-blue-500/5 overflow-hidden">
      <div className="h-2 bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600" />
      <CardHeader className="pb-3 text-center">
        <Typography
          variant="h4"
          className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-2"
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          Rate Transmissions
        </Typography>
        <CardTitle className="text-xl font-bold mt-2">
          How was the narrative?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating UI */}
        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="group transition-transform active:scale-95"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-amber-500 fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    : "text-zinc-300 dark:text-zinc-700"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            Reflection (Optional)
          </div>
          <Textarea
            placeholder="Share your thoughts on the AI's creative direction..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="bg-background/40 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 transition-colors resize-none h-24"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl font-bold text-base shadow-xl bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Transmitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
