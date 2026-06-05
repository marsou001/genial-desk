"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFetchOrganization } from "@/lib/api/organizations";
import { createClient } from "@/lib/supabase/client";

type OrgUsage = {
  remainingAIRuns: number;
  remainingUploads: number;
  maxAIRuns: number;
  maxUploads: number;
}

export default function OrgUsageBadge() {
  const [usage, setUsage] = useState<OrgUsage | null>(null);
  const params = useParams();
  const organizationId = typeof params.id === "string" ? params.id : undefined;

  const { data, loading, error, fetchOrganization } = useFetchOrganization();
  const supabase = createClient();


  useEffect(() => {
    if (data) setUsage({
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

  async function handleRealtimeUpdate(
    payload: {
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
              remainingAIRuns: row.remaining_ai_runs ?? prev.remainingAIRuns,
              remainingUploads:
                row.remaining_uploads ?? prev.remainingUploads,
            }
          : prev,
      );
    }
  };

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
  }, [supabase, organizationId, handleRealtimeUpdate]);

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
      <span className="text-xs text-zinc-400 dark:text-zinc-600 tabular-nums whitespace-nowrap">
        <span title="AI runs remaining">-- / --</span>
        <span className="mx-1.5 opacity-40">&middot;</span>
        <span title="Uploads remaining">-- / --</span>
      </span>
    );
  }

  if (!usage) return null;

  return (
    <span className="text-sm text-zinc-500 dark:text-zinc-500 tabular-nums whitespace-nowrap">
      <span title={`${usage.remainingAIRuns} AI runs remaining out of ${usage.maxAIRuns}`}>
        {usage.remainingAIRuns} / {usage.maxAIRuns}
        <span className="hidden md:inline"> AI runs</span>
      </span>
      <span className="mx-1.5 opacity-40">&middot;</span>
      <span title={`${usage.remainingUploads} uploads remaining out of ${usage.maxUploads}`}>
        {usage.remainingUploads} / {usage.maxUploads}
        <span className="hidden md:inline"> uploads</span>
      </span>
    </span>
  );
}
