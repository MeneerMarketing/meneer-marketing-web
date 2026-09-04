import { LeadsTableClient } from "@/components/dashboard/LeadsTableClient";
import {
  getCities,
  getLeadListItems,
  getTemplates,
  getVerticals,
} from "@/lib/data/dashboard";

export default async function LeadsPage() {
  const [rows, verticals, cities, templates] = await Promise.all([
    getLeadListItems(),
    getVerticals(),
    getCities(),
    getTemplates(),
  ]);

  return (
    <LeadsTableClient
      initialRows={rows}
      verticals={verticals}
      cities={cities}
      templates={templates}
    />
  );
}
