"use client";

import { Badge } from "@/components/ui/badge";

interface SkillTagsProps {
  skills: string[];
  certifications?: string[];
}

export function SkillTags({ skills, certifications = [] }: SkillTagsProps) {
  if (skills.length === 0 && certifications.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Extracted Capabilities</h3>
      <div className="flex flex-wrap gap-2">
        {certifications.map((cert, i) => (
          <Badge 
            key={`cert-${i}`} 
            variant="default"
            className="px-3 py-1 text-sm bg-primary/90 hover:bg-primary"
          >
            {cert}
          </Badge>
        ))}
        {skills.map((skill, i) => (
          <Badge 
            key={`skill-${i}`} 
            variant="secondary"
            className="px-3 py-1 text-sm transition-all hover:scale-105"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
