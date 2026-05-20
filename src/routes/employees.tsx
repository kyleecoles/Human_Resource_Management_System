// feat: employee list + detail page UI - Sprint 1 & 2
import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";

// Mock user role - in real app this comes from useRights() hook from M4
const MOCK_ROLE = "ADMIN"; // Change to "USER" or "SUPERADMIN" to test

const employees = [
  { empno: "EMP001", lastname: "Chen", firstname: "Maya", gender: "F", birthdate: "1990-05-12", hiredate: "2021-03-15", sepdate: null, currentJob: "Sr. Designer", stamp: "2024-01-10 09:00:00", status: "ACTIVE" },
  { empno: "EMP002", lastname: "Reed", firstname: "Jordan", gender: "M", birthdate: "1988-11-23", hiredate: "2020-07-01", sepdate: null, currentJob: "Backend Engineer", stamp: "2024-02-14 11:30:00", status: "ACTIVE" },
  { empno: "EMP003", lastname: "Patel", firstname: "Priya", gender: "F", birthdate: "1992-03-08", hiredate: "2019-11-20", sepdate: null, currentJob: "HR Specialist", stamp: "2024-03-05 08:45:00", status: "ACTIVE" },
  { empno: "EMP004", lastname: "O'Connor", firstname: "Liam", gender: "M", birthdate: "1985-07-30", hiredate: "2022-01-10", sepdate: "2023-12-31", currentJob: "Account Executive", stamp: "2024-01-02 10:15:00", status: "INACTIVE" },
  { empno: "EMP005", lastname: "Kim", firstname: "Sara", gender: "F", birthdate: "1995-09-14", hiredate: "2021-06-01", sepdate: null, currentJob: "Content Lead", stamp: "2024-04-20 14:00:00", status: "ACTIVE" },
  { empno: "EMP006", lastname: "Santos", firstname: "Marco", gender: "M", birthdate: "1983-02-17", hiredate: "2018-09-15", sepdate: "2024-01-15", currentJob: "Sales Manager", stamp: "2024-01-16 09:00:00", status: "INACTIVE" },
];

const jobHistoryData: Record<string, Array<{ jobCode: string; jobDesc: string; deptCode: string; deptName: string; effDate: string; salary: number; stamp: string; status: string }>> = {
  "EMP001": [
    { jobCode: "SD01", jobDesc: "Sr. Designer", deptCode: "DSN", deptName: "Design", effDate: "2023-01-01", salary: 95000, stamp: "2023-01-01 09:00:00", status: "ACTIVE" },
    { jobCode: "JD01", jobDesc: "Jr. Designer", deptCode: "DSN", deptName: "Design", effDate: "2021-03-15", salary: 70000, stamp: "2021-03-15 09:00:00", status: "ACTIVE" },
  ],
  "EMP002": [
    { jobCode: "BE02", jobDesc: "Backend Engineer", deptCode: "ENG", deptName: "Engineering", effDate: "2022-06-01", salary: 110000, stamp: "2022-06-01 09:00:00", status: "ACTIVE" },
    { jobCode: "JE01", jobDesc: "Jr. Engineer", deptCode: "ENG", deptName: "Engineering", effDate: "2020-07-01", salary: 80000, stamp: "2020-07-01 09:00:00", status: "ACTIVE" },
  ],
  "EMP003": [
    { jobCode: "HR01", jobDesc: "HR Specialist", deptCode: "HR", deptName: "People Ops", effDate: "2021-01-01", salary: 75000, stamp: "2021-01-01 09:00:00", status: "ACTIVE" },
    { jobCode: "HR00", jobDesc: "HR Associate", deptCode: "HR", deptName: "People Ops", effDate: "2019-11-20", salary: 60000, stamp: "2019-11-20 09:00:00", status: "ACTIVE" },
  ],
  "EMP004": [
    { jobCode: "AE01", jobDesc: "Account Executive", deptCode: "SAL", deptName: "Sales", effDate: "2022-01-10", salary: 85000, stamp: "2022-01-10 09:00:00", status: "INACTIVE" },
  ],
  "EMP005": [
    { jobCode: "CL01", jobDesc: "Content Lead", deptCode: "MKT", deptName: "Marketing", effDate: "2022-03-01", salary: 88000, stamp: "2022-03-01 09:00:00", status: "ACTIVE" },
    { jobCode: "CW01", jobDesc: "Content Writer", deptCode: "MKT", deptName: "Marketing", effDate: "2021-06-01", salary: 65000, stamp: "2021-06-01 09:00:00", status: "ACTIVE" },
  ],
  "EMP006": [
    { jobCode: "SM01", jobDesc: "Sales Manager", deptCode: "SAL", deptName: "Sales", effDate: "2018-09-15", salary: 92000, stamp: "2018-09-15 09:00:00", status: "INACTIVE" },
  ],
};

export const Route = createFileRoute("/employees")({
  head: () => ({ meta: [{ title: "Employees – Hope, Inc. HR" }] }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const isUser = MOCK_ROLE === "USER";
  const isAdminOrSuper = MOCK_ROLE === "ADMIN" || MOCK_ROLE === "SUPERADMIN";

  const visibleEmployees = isUser ? employees.filter((e) => e.status === "ACTIVE") : employees;

  const [selectedEmp, setSelectedEmp] = useState<typeof employees[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<typeof employees[0] | null>(null);
  const [viewDetail, setViewDetail] = useState<typeof employees[0] | null>(null);

  // Job History state
  const [showAddJobHistory, setShowAddJobHistory] = useState(false);
  const [selectedJobHistory, setSelectedJobHistory] = useState<any>(null);
  const [showDeleteJobHistory, setShowDeleteJobHistory] = useState<any>(null);

  // DETAIL VIEW
  if (viewDetail) {
    const jobHistory = (jobHistoryData[viewDetail.empno] || []).sort(
      (a, b) => new Date(b.effDate).getTime() - new Date(a.effDate).getTime()
    );

    return (
      <AppShell title="Employee Detail">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => setViewDetail(null)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
          </button>
        </div>

        {/* Employee Profile Card */}
        <div className="mb-6 rounded-xl border border-border bg-card shadow-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-primary text-primary-foreground text-xl font-bold shadow-elegant">
                {viewDetail.firstname[0]}{viewDetail.lastname[0]}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">{viewDetail.firstname} {viewDetail.lastname}</h2>
                <p className="text-sm text-muted-foreground">Emp No: {viewDetail.empno}</p>
                <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${viewDetail.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {viewDetail.status}
                </span>
              </div>
            </div>
            {isAdminOrSuper && (
              <button
                onClick={() => setSelectedEmp(viewDetail)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition"
              >
                <Pencil className="h-4 w-4" />
                Edit Employee
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Gender", value: viewDetail.gender === "M" ? "Male" : "Female" },
              { label: "Birth Date", value: viewDetail.birthdate },
              { label: "Hire Date", value: viewDetail.hiredate },
              { label: "Sep Date", value: viewDetail.sepdate || "—" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</p>
                <p className="mt-1 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {!isUser && (
            <div className="mt-4 rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Stamp</p>
              <p className="mt-1 font-mono text-xs">{viewDetail.stamp}</p>
            </div>
          )}
        </div>

        {/* Job History Panel */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-display text-lg font-bold">Job History</h3>
            {isAdminOrSuper && (
              <button
                onClick={() => setShowAddJobHistory(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4" />
                Add Job History
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Job Code</th>
                  <th className="px-5 py-3">Job Description</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Eff Date</th>
                  <th className="px-5 py-3">Salary</th>
                  {!isUser && <th className="px-5 py-3">Stamp</th>}
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobHistory.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">No job history found</td></tr>
                ) : (
                  jobHistory.map((jh, i) => (
                    <tr key={i} className="hover:bg-secondary/50 transition">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{jh.jobCode}</td>
                      <td className="px-5 py-3 font-medium">{jh.jobDesc}</td>
                      <td className="px-5 py-3">{jh.deptName}</td>
                      <td className="px-5 py-3">{jh.effDate}</td>
                      <td className="px-5 py-3">${jh.salary.toLocaleString()}</td>
                      {!isUser && <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{jh.stamp}</td>}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {isAdminOrSuper && (
                            <button onClick={() => setSelectedJobHistory(jh)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-secondary transition">
                              <Pencil className="h-3 w-3" />Edit
                            </button>
                          )}
                          {MOCK_ROLE === "SUPERADMIN" && (
                            <button onClick={() => setShowDeleteJobHistory(jh)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition">
                              <Trash2 className="h-3 w-3" />Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Job History Modal */}
        {showAddJobHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elegant">
              <h3 className="mb-4 font-display text-lg font-bold">Add Job History</h3>
              <div className="space-y-3">
                {["Job Code", "Department Code", "Effective Date", "Salary"].map((field) => (
                  <div key={field}>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">{field}</label>
                    <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder={`Enter ${field.toLowerCase()}`} />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setShowAddJobHistory(false)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary transition">Cancel</button>
                <button onClick={() => setShowAddJobHistory(false)} className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Job History Modal */}
        {selectedJobHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elegant">
              <h3 className="mb-4 font-display text-lg font-bold">Edit Job History</h3>
              <div className="space-y-3">
                {[
                  { label: "Job Code", value: selectedJobHistory.jobCode },
                  { label: "Department Code", value: selectedJobHistory.deptCode },
                  { label: "Effective Date", value: selectedJobHistory.effDate },
                  { label: "Salary", value: String(selectedJobHistory.salary) },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
                    <input defaultValue={field.value} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setSelectedJobHistory(null)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary transition">Cancel</button>
                <button onClick={() => setSelectedJobHistory(null)} className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elegant">
              <h3 className="mb-4 font-display text-lg font-bold">Edit Employee — {selectedEmp.firstname} {selectedEmp.lastname}</h3>
              <div className="space-y-3">
                {[
                  { label: "Last Name", value: selectedEmp.lastname },
                  { label: "First Name", value: selectedEmp.firstname },
                  { label: "Gender", value: selectedEmp.gender },
                  { label: "Hire Date", value: selectedEmp.hiredate },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
                    <input defaultValue={field.value} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setSelectedEmp(null)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary transition">Cancel</button>
                <button onClick={() => setSelectedEmp(null)} className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    );
  }

  // LIST VIEW
  return (
    <AppShell title="Employees">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Employees</h2>
            <p className="text-sm text-muted-foreground">Directory of all team members across Hope, Inc.</p>
          </div>
        </div>
        {isAdminOrSuper && (
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition">
            <Plus className="h-4 w-4" />Add Employee
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Emp No.</th>
                <th className="px-5 py-3">Last Name</th>
                <th className="px-5 py-3">First Name</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Hire Date</th>
                <th className="px-5 py-3">Sep Date</th>
                <th className="px-5 py-3">Current Job</th>
                <th className="px-5 py-3">Status</th>
                {!isUser && <th className="px-5 py-3">Stamp</th>}
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleEmployees.map((emp) => (
                <tr key={emp.empno} className={`hover:bg-secondary/50 transition cursor-pointer ${emp.status === "INACTIVE" ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{emp.empno}</td>
                  <td className="px-5 py-3 font-medium">
                    <button onClick={() => setViewDetail(emp)} className="hover:text-primary hover:underline text-left">
                      {emp.lastname}
                    </button>
                  </td>
                  <td className="px-5 py-3">{emp.firstname}</td>
                  <td className="px-5 py-3">{emp.gender}</td>
                  <td className="px-5 py-3">{emp.hiredate}</td>
                  <td className="px-5 py-3">{emp.sepdate || "—"}</td>
                  <td className="px-5 py-3">{emp.currentJob}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${emp.status === "ACTIVE" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                      {emp.status}
                    </span>
                  </td>
                  {!isUser && <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{emp.stamp}</td>}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {isAdminOrSuper && (
                        <button onClick={() => setSelectedEmp(emp)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-secondary transition">
                          <Pencil className="h-3 w-3" />Edit
                        </button>
                      )}
                      {MOCK_ROLE === "SUPERADMIN" && emp.status === "ACTIVE" && (
                        <button onClick={() => setShowDeleteConfirm(emp)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition">
                          <Trash2 className="h-3 w-3" />Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elegant">
            <h3 className="mb-4 font-display text-lg font-bold">Add Employee</h3>
            <div className="space-y-3">
              {["Last Name", "First Name", "Gender", "Hire Date"].map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{field}</label>
                  <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder={`Enter ${field.toLowerCase()}`} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary transition">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elegant">
            <h3 className="mb-4 font-display text-lg font-bold">Edit Employee — {selectedEmp.firstname} {selectedEmp.lastname}</h3>
            <div className="space-y-3">
              {[
                { label: "Last Name", value: selectedEmp.lastname },
                { label: "First Name", value: selectedEmp.firstname },
                { label: "Gender", value: selectedEmp.gender },
                { label: "Hire Date", value: selectedEmp.hiredate },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
                  <input defaultValue={field.value} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setSelectedEmp(null)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary transition">Cancel</button>
              <button onClick={() => setSelectedEmp(null)} className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-elegant">
            <h3 className="mb-2 font-display text-lg font-bold text-red-600">Delete Employee</h3>
            <p className="mb-5 text-sm text-muted-foreground">Are you sure you want to deactivate <span className="font-medium text-foreground">{showDeleteConfirm.firstname} {showDeleteConfirm.lastname}</span>? This will set their status to INACTIVE.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(null)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary transition">Cancel</button>
              <button onClick={() => setShowDeleteConfirm(null)} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition">Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}