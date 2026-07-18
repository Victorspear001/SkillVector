"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IndustryGroupProps {
  industry: string;
  count: number;
  children: React.ReactNode;
}

export function IndustryGroup({ industry, count, children }: IndustryGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full mb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full pb-3 mb-4 border-b border-border hover:border-primary/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">{industry}</h2>
          <Badge variant="secondary" className="group-hover:bg-primary/20">{count}</Badge>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>
      
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}
