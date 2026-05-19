// feat: employee list page UI - Sprint 1

import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/employees")({
  head: () => ({ meta: [{ title: "Employees — Hope, Inc. HR" }] }),
  component: () => (
    <PlaceholderPage
      title="Employees"
      description="Directory of all team members across Hope, Inc."
      icon={Users}
      columns={["Name", "Email", "Department", "Role", "Status"]}
      rows={[
        { Name: "Maya Chen", Email: "maya@hope.inc", Department: "Design", Role: "Sr. Designer", Status: "Active" },
        { Name: "Jordan Reed", Email: "jordan@hope.inc", Department: "Engineering", Role: "Backend Eng.", Status: "Active" },
        { Name: "Priya Patel", Email: "priya@hope.inc", Department: "People Ops", Role: "HR Specialist", Status: "Active" },
        { Name: "Liam O'Connor", Email: "liam@hope.inc", Department: "Sales", Role: "AE", Status: "Active" },
        { Name: "Sara Kim", Email: "sara@hope.inc", Department: "Marketing", Role: "Content Lead", Status: "On leave" },
      ]}
    />
  ),
});
