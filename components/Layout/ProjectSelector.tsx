'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Project {
  id: string;
  name: string;
}

export default function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const pathMatch = pathname?.match(/\/organizations\/([^/]+)\/projects\/([^/]+)/);
  const orgId = pathMatch?.[1] ?? null;
  const projectIdFromUrl = pathMatch?.[2] ?? null;

  useEffect(() => {
    if (orgId) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [orgId]);

  const fetchProjects = async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        headers: { 'x-organization-id': orgId },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    router.push(`/organizations/${orgId}/projects/${projectId}/dashboard`);
  };

  if (loading) {
    return (
      <div className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={projectIdFromUrl || ''}
        onChange={(e) => handleSelectProject(e.target.value)}
        className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}
