import { Sidebar } from "./sidebar";
// import { getCurrentTutor } from "@/lib/supabase/auth-actions";
// import { createClient } from "@/lib/supabase/server";

// TODO: Re-enable Supabase queries once connected
export async function AppShell({ children }: { children: React.ReactNode }) {
  // const tutor = await getCurrentTutor();
  // let pendingPlansCount = 0;
  // if (tutor) {
  //   const supabase = await createClient();
  //   const { count } = await supabase
  //     .from("prep_plans")
  //     .select("*", { count: "exact", head: true })
  //     .eq("status", "draft");
  //   pendingPlansCount = count ?? 0;
  // }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        pendingPlansCount={2}
        tutorName="Ethan Garcia"
      />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
