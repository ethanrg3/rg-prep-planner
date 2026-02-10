// Manual type definitions matching our Supabase schema.
// Replace with auto-generated types via `npx supabase gen types typescript` once connected.

export type TestType = "ACT" | "SAT";
export type StudentStatus = "active" | "inactive" | "completed";
export type ReportType = "baseline" | "predicted" | "actual";
export type PlanStatus = "draft" | "approved" | "archived";
export type SessionStatus = "scheduled" | "completed" | "cancelled";
export type ResourceType = "khan_academy" | "college_board" | "bluebook_test" | "act_pdf" | "worksheet";
export type DifficultyLevel = "foundational" | "intermediate" | "advanced";
export type TimeSlot = "morning" | "afternoon" | "evening";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type WeeklyAvailability = Partial<Record<DayOfWeek, TimeSlot[]>>;

// SAT section scores
export interface SATSectionScores {
  reading_writing: {
    total: number;
    information_and_ideas: number;
    craft_and_structure: number;
    expression_of_ideas: number;
    standard_english_conventions: number;
  };
  math: {
    total: number;
    algebra: number;
    advanced_math: number;
    problem_solving: number;
    geometry_and_trig: number;
  };
}

// ACT section scores
export interface ACTSectionScores {
  english: {
    total: number;
    usage_mechanics: number;
    rhetorical_skills: number;
  };
  math: {
    total: number;
    pre_algebra: number;
    algebra: number;
    geometry: number;
  };
  reading: {
    total: number;
    social_studies_sciences: number;
    arts_literature: number;
  };
  science: {
    total: number;
    data_representation: number;
    research_summaries: number;
    conflicting_viewpoints: number;
  };
}

export type SectionScores = SATSectionScores | ACTSectionScores;

// Assignment in a plan week
export interface PlanAssignment {
  title: string;
  resource_type: ResourceType;
  url?: string;
  estimated_minutes: number;
  focus_area: string;
  instructions: string;
}

// Session agenda item
export interface AgendaItem {
  activity: string;
  minutes: number;
}

// Section prediction
export interface SectionPrediction {
  current: number;
  predicted_low: number;
  predicted_high: number;
}

// Database row types
export interface Tutor {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface Student {
  id: string;
  tutor_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  grade_level: number;
  test_type: TestType;
  test_date: string | null;
  schools_of_interest: string[];
  self_study_hours_per_week: number;
  live_session_hours_per_week: number;
  weekly_availability: WeeklyAvailability;
  sessions_paid: number;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
}

export interface ScoreReport {
  id: string;
  student_id: string;
  report_type: ReportType;
  composite_score: number;
  section_scores: SectionScores;
  prediction_range_low: number | null;
  prediction_range_high: number | null;
  section_predictions: Record<string, SectionPrediction> | null;
  confidence_notes: string | null;
  created_at: string;
}

export interface PrepPlan {
  id: string;
  student_id: string;
  predicted_score_report_id: string | null;
  total_weeks: number;
  status: PlanStatus;
  ai_model_used: string | null;
  generation_prompt_hash: string | null;
  tutor_notes: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanWeek {
  id: string;
  prep_plan_id: string;
  week_number: number;
  theme: string;
  goals: string[];
  self_study_assignments: PlanAssignment[];
  created_at: string;
}

export interface PlanSession {
  id: string;
  plan_week_id: string;
  session_number: number;
  scheduled_date: string | null;
  scheduled_time_start: string | null;
  scheduled_time_end: string | null;
  agenda: AgendaItem[];
  tutor_notes: string | null;
  status: SessionStatus;
  created_at: string;
}

export interface Resource {
  id: string;
  test_type: TestType;
  section: string;
  sub_topic: string;
  resource_type: ResourceType;
  title: string;
  url: string | null;
  description: string | null;
  difficulty_level: DifficultyLevel | null;
  estimated_minutes: number | null;
  created_at: string;
}

export interface HistoricalOutcome {
  id: string;
  test_type: TestType;
  baseline_composite: number;
  final_composite: number;
  baseline_section_scores: SectionScores;
  final_section_scores: SectionScores;
  total_weeks: number;
  self_study_hours_per_week: number | null;
  live_session_hours_per_week: number | null;
  total_sessions: number | null;
  created_at: string;
}

// Joined types for UI
export interface StudentWithScores extends Student {
  baseline_score?: ScoreReport;
  predicted_score?: ScoreReport;
}

export interface StudentWithPlan extends StudentWithScores {
  prep_plan?: PrepPlan;
}

export interface PlanWeekWithSessions extends PlanWeek {
  sessions: PlanSession[];
}

export interface PrepPlanWithWeeks extends PrepPlan {
  weeks: PlanWeekWithSessions[];
}
