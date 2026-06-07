"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Brain, Upload } from "lucide-react";
import { useFetchOrganization } from "@/lib/api/organizations";
import { createClient } from "@/lib/supabase/client";

type OrgUsage = {
  remainingAIRuns: number;
  remainingUploads: number;
  maxAIRuns: number;
  maxUploads: number;
};

export default function OrgUsageBadge() {
  const [usage, setUsage] = useState<OrgUsage | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<
    "runs" | "uploads" | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const organizationId = typeof params.id === "string" ? params.id : undefined;

  const { data, loading, error, fetchOrganization } = useFetchOrganization();
  const supabase = createClient();

  useEffect(() => {
    if (data)
      setUsage({
        remainingAIRuns: data.remainingAIRuns,
        remainingUploads: data.remainingUploads,
        maxAIRuns: data.maxAIRuns,
        maxUploads: data.maxUploads,
      });
  }, [data]);

  useEffect(() => {
    async function getOrganizationUsage() {
      if (organizationId === undefined) return;
      await fetchOrganization(organizationId);
    }
    getOrganizationUsage();
  }, [organizationId]);

  useEffect(() => {
    if (!activeTooltip) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveTooltip(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveTooltip(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeTooltip]);

  async function handleRealtimeUpdate(payload: {
    eventType: string;
    new: Record<string, unknown>;
  }) {
    if (payload.eventType === "UPDATE") {
      const row = payload.new as {
        id?: string;
        remaining_ai_runs?: number;
        remaining_uploads?: number;
      };
      if (typeof row.id !== "string") return;
      setUsage((prev) =>
        prev
          ? {
              ...prev,
              remainingAIRuns:
                row.remaining_ai_runs ?? prev.remainingAIRuns,
              remainingUploads:
                row.remaining_uploads ?? prev.remainingUploads,
            }
          : prev,
      );
    }
  }

  useEffect(() => {
    if (!organizationId) return;

    const channel = supabase
      .channel(`org-usage:${organizationId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "organizations",
          filter: `id=eq.${organizationId}`,
        },
        (payload) => handleRealtimeUpdate(payload),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, organizationId]);

  if (!organizationId) return null;

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600 tabular-nums whitespace-nowrap">
        <span className="inline-block w-10 h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
      </span>
    );
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-xs text-zinc-400 dark:text-zinc-600 tabular-nums whitespace-nowrap">
        -- / --
      </span>
    );
  }

  if (!usage) return null;

  function toggleTooltip(type: "runs" | "uploads") {
    setActiveTooltip((prev) => (prev === type ? null : type));
  }

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => toggleTooltip("runs")}
        className="relative flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-800 px-2 py-1 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
        aria-label={`${usage.remainingAIRuns} AI runs remaining out of ${usage.maxAIRuns}`}
      >
        <Brain className="h-3.5 w-3.5 shrink-0 text-blue-500 dark:text-blue-400" aria-hidden="true" />
        <span className="tabular-nums">
          {usage.remainingAIRuns}/{usage.maxAIRuns}
        </span>
        <span className="hidden md:inline ml-0.5">AI runs</span>
        {activeTooltip === "runs" ? (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg md:hidden z-50">
            AI runs remaining
          </span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => toggleTooltip("uploads")}
        className="relative flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-800 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
        aria-label={`${usage.remainingUploads} uploads remaining out of ${usage.maxUploads}`}
      >
        <Upload className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
        <span className="tabular-nums">
          {usage.remainingUploads}/{usage.maxUploads}
        </span>
        <span className="hidden md:inline ml-0.5">Uploads</span>
        {activeTooltip === "uploads" ? (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg md:hidden z-50">
            Uploads remaining
          </span>
        ) : null}
      </button>
    </div>
  );
}
