import { TagList } from "../features/tags/components/TagList";

export function Tags() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tags</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Categorize suas tarefas com tags personalizadas</p>
      </div>
      <TagList />
    </div>
  );
}
