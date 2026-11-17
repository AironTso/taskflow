import { ProjectList } from "../features/projects/components/ProjectList";

export function Projects() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projetos</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Organize suas tarefas em projetos</p>
      </div>
      <ProjectList />
    </div>
  );
}
