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
  const [matches, setMatches] = useState<any[]>([]);
  
  const [analyzingGapId, setAnalyzingGapId] = useState<string | null>(null);
  const [gapData, setGapData] = useState<{ [key: string]: GapAnalysis }>({});

  useEffect(() => {
    if (!analysisId) return;

    async function fetchMatches() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/jobs/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysisId, limit: 10 })
        });
        
        if (!res.ok) throw new Error("Failed to fetch matches");
        
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMatches();
  }, [analysisId]);

  const handleAnalyzeGap = async (jobId: string) => {
    try {
      setAnalyzingGapId(jobId);
      const res = await fetch("/api/analyze/gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, jobId })
      });
      
      if (!res.ok) throw new Error("Failed to run gap analysis");
      
      const data = await res.json();
      setGapData(prev => ({ ...prev, [jobId]: data }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong during gap analysis.");
    } finally {
      setAnalyzingGapId(null);
    }
  };

  // Group matches by industry
  const groupedMatches = matches.reduce((acc, job) => {
    if (!acc[job.industry]) acc[job.industry] = [];
    acc[job.industry].push(job);
    return acc;
  }, {} as Record<string, any[]>);

  if (!analysisId) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <p className="text-muted-foreground mb-4">No analysis ID provided.</p>
        <a href="/" className="text-primary hover:underline">Go back and upload a resume</a>
      </div>
    );
  }

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

      <div className="grid lg:grid-cols-[1fr_450px] gap-12 items-start">
        <div className="space-y-12">
          {isLoading ? (
            <div className="text-center py-24 bg-card border border-border/50 rounded-2xl">
               <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
               <p className="text-muted-foreground">Loading matches from database...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive">
               <p>{error}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-24 bg-card border border-border/50 rounded-2xl">
               <p className="text-muted-foreground">No suitable matches found in the database.</p>
            </div>
          ) : (
            <div>
              {Object.entries(groupedMatches).map(([industry, jobs]) => (
                <IndustryGroup key={industry} industry={industry} count={(jobs as any[]).length}>
                  {(jobs as any[]).map((job) => (
                    <MatchCard 
                      key={job.id} 
                      job={job} 
                      isAnalyzing={analyzingGapId === job.id}
                      onAnalyzeGap={handleAnalyzeGap}
                    />
                  ))}
                </IndustryGroup>
              ))}
            </div>
          )}
        </div>

        <div className="sticky top-24 space-y-8">
           <div className="p-6 rounded-2xl bg-card border border-border/50">
             <h3 className="font-bold text-lg mb-4">Action Plan</h3>
             {Object.entries(gapData).length === 0 ? (
               <p className="text-sm text-muted-foreground">
                 Click "Analyze Skill Gap" on any matching job to generate a custom action plan.
               </p>
             ) : (
               <div className="space-y-8">
                 {Object.entries(gapData).map(([jobId, data]) => {
                   const job = matches.find(j => j.id === jobId);
                   return (
                     <GapAnalysisView key={jobId} data={data} jobTitle={job?.title || "Job"} />
                   );
                 })}
               </div>
             )}
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
