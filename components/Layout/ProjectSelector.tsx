'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
}

export default function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get organization ID from URL
    const pathMatch = window.location.pathname.match(/\/organizations\/([^/]+)/);
    if (pathMatch) {
      fetchProjects();
      // Get selected project from cookie
      const projectCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('project-id='));
      if (projectCookie) {
        setSelectedProjectId(projectCookie.split('=')[1]);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProjects = async () => {
    // Get organization ID from URL
    const pathMatch = window.location.pathname.match(/\/organizations\/([^/]+)/);
    const orgId = pathMatch?.[1];
    
    if (!orgId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        headers: {
          'x-organization-id': orgId,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        
        // Auto-select first project if none selected and projects exist
        if (!selectedProjectId && data.projects?.length > 0) {
          handleSelectProject(data.projects[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (projectId: string | null) => {
    setSelectedProjectId(projectId);
    
    if (projectId) {
      document.cookie = `project-id=${projectId}; path=/; max-age=31536000`;
    } else {
      document.cookie = 'project-id=; path=/; max-age=0';
    }
    
    router.refresh();
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
        value={selectedProjectId || ''}
        onChange={(e) => handleSelectProject(e.target.value || null)}
        className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        <option value="">All Projects</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}
