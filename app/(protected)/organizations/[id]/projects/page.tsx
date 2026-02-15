import Link from 'next/link';
import { fetchProjects } from '@/data/fetchProjects';
import CreateProjectDialog from '@/components/interfaces/organizations/projects/CreateProjectDialog';

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: organizationId } = await params;
  const projects = await fetchProjects(organizationId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Projects
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Choose a project to view feedback, insights, and analytics.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            No projects yet
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Create your first project to start collecting and analyzing feedback.
          </p>
          <CreateProjectDialog organizationId={organizationId} />
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/organizations/${organizationId}/projects/${project.id}/dashboard`}
              className="block bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {project.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    View dashboard, feedback, and insights
                  </p>
                </div>
                <div className="text-blue-600 dark:text-blue-400">→</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="flex justify-end">
          <CreateProjectDialog
            organizationId={organizationId}
            triggerLabel="+ Create New Project"
          />
        </div>
      )}
    </div>
  );
}
