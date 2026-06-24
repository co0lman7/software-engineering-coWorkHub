import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Workspace } from "../lib/database.types";

export function useWorkspaces(filters: { type?: Workspace["type"] } = {}) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from("workspaces").select("*").eq("available", true).order("created_at", { ascending: false });
    if (filters.type) q = q.eq("type", filters.type);
    q.then(({ data }) => { setWorkspaces(data ?? []); setLoading(false); });
  }, [filters.type]);

  return { workspaces, loading };
}

export function useWorkspace(id: string) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("workspaces").select("*").eq("id", id).single()
      .then(({ data }) => { setWorkspace(data); setLoading(false); });
  }, [id]);

  return { workspace, loading };
}
