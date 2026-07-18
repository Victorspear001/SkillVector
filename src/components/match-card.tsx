"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin, Briefcase } from "lucide-react";

interface MatchCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    industry: string;
    location: string;
    distance: number;
  };
  onAnalyzeGap: (jobId: string) => void;
  isAnalyzing: boolean;
}

export function MatchCard({ job, onAnalyzeGap, isAnalyzing }: MatchCardProps) {
  // Convert distance (0 to 2) to a percentage score (0 to 100)
  // Closer to 0 means more similar.
  const score = Math.max(0, Math.min(100, Math.round((1 - job.distance / 2) * 100)));
  
  let scoreColor = "text-red-500";
  let progressColor = "bg-red-500";
  if (score >= 80) {
    scoreColor = "text-green-500";
    progressColor = "bg-green-500";
  } else if (score >= 60) {
    scoreColor = "text-yellow-500";
    progressColor = "bg-yellow-500";
  }

  return (
    <Card className="w-full transition-all hover:shadow-md hover:border-primary/50 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" /> {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {job.location}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/5 font-semibold">
            {job.industry}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Match Score</span>
          <span className={`font-bold ${scoreColor}`}>{score}%</span>
        </div>
        <Progress value={score} className="h-2" indicatorClassName={progressColor} />
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full gap-2" 
          variant="secondary"
          onClick={() => onAnalyzeGap(job.id)}
          disabled={isAnalyzing}
        >
          <Briefcase className="w-4 h-4" />
          {isAnalyzing ? "Analyzing Gap..." : "Analyze Skill Gap"}
        </Button>
      </CardFooter>
    </Card>
  );
}
