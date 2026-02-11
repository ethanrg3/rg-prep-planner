import { IntakeWizard } from "@/components/intake/intake-wizard";

export default function NewStudentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">New Student</h1>
        <p className="text-muted-foreground">
          Add a new student and generate their prep plan
        </p>
      </div>

      <IntakeWizard />
    </div>
  );
}
