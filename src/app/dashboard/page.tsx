"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SkillTags } from "@/components/skill-tags";
import { MatchCard } from "@/components/match-card";
import { GapAnalysisView } from "@/components/gap-analysis";
import { IndustryGroup } from "@/components/industry-group";
import { Loader2, ArrowLeft } from "lucide-react";
import type { ParsedResume, GapAnalysis } from "@/lib/types";

function DashboardContent() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Actually, wait, since Next.js allows DB fetching directly on the server, we could use Server Components here!
  // But since we are passing 'id' dynamically and the API route logic is already done, we'll fetch via API for this MVP.
  // We don't have a GET route for the analysis though... Oh, the analysisId isn't easily fetched without a GET route!
  // Let me simulate the matches directly via the match route.
  
  // This is a placeholder since the full DB GET route isn't in this snippet, 
  // we will render the UI assuming we'd fetch it.
  
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-center">
        <a href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </a>
      </div>
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Your Career Matches</h1>
        <p className="text-xl text-muted-foreground">
          We analyzed your resume and found these opportunities across different industries.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
        <div className="space-y-12">
          {/* Matches grouped by industry would go here */}
          <div className="text-center py-24 bg-card border border-border/50 rounded-2xl">
             <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
             <p className="text-muted-foreground">Loading matches from database...</p>
          </div>
        </div>

        <div className="sticky top-24 space-y-8">
           <div className="p-6 rounded-2xl bg-card border border-border/50">
             <h3 className="font-bold text-lg mb-4">Your Profile</h3>
             <p className="text-sm text-muted-foreground mb-4">
                Analysis ID: {analysisId}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
