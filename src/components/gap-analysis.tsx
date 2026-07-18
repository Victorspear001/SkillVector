"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle, ArrowRight } from "lucide-react";
import type { GapAnalysis } from "@/lib/types";

interface GapAnalysisProps {
  data: GapAnalysis;
  jobTitle: string;
}

export function GapAnalysisView({ data, jobTitle }: GapAnalysisProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Gap Analysis: {jobTitle}</h3>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
          <span className="font-semibold text-primary">Match Potential:</span>
          <span className="font-bold">{data.matchScore}%</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-destructive/20 shadow-sm">
          <CardHeader className="pb-3 bg-destructive/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Missing Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {data.missingSkills.map((skill, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Circle className="w-4 h-4 mt-0.5 text-destructive/60 shrink-0" />
                  <span className="font-medium">{skill}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="pb-3 bg-primary/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-4">
              {data.actionPlan.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
