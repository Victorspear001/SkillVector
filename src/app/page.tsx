"use client";

import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/upload-zone";
import { BrainCircuit, Compass, Target } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleUploadSuccess = (analysisId: string) => {
    router.push(`/dashboard?id=${analysisId}`);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-background overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <main className="w-full max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          ZenithSkill is now live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          Your skills translate <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            across industries.
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Upload your resume and let our AI instantly map your experience to the best-fitting jobs in Healthcare, Tech, Trades, and Finance using semantic meaning.
        </p>

        <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          <UploadZone onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 w-full text-left">
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Semantic AI Matching</h3>
            <p className="text-muted-foreground text-sm">
              We don't look for keywords. We understand the actual meaning of your skills and map them to job requirements in entirely different fields.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Cross-Industry Discovery</h3>
            <p className="text-muted-foreground text-sm">
              A teacher might make a great corporate trainer. A mechanic might excel in manufacturing tech. Discover hidden career paths automatically.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Actionable Gap Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Found a dream job but missing a few skills? We provide a concrete 3-step action plan to bridge your knowledge gaps.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
