import { PipelineKanbanBoard } from "@/components/dashboard/PipelineKanbanBoard";
import {
  getCities,
  getPipelineKanbanItems,
  getVerticals,
} from "@/lib/data/dashboard";

export default async function PipelinePage() {
  const [rows, verticals, cities] = await Promise.all([
    getPipelineKanbanItems(),
    getVerticals(),
    getCities(),
  ]);

  return (
    <PipelineKanbanBoard initialRows={rows} verticals={verticals} cities={cities} />
  );
}
