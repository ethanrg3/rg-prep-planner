-- RG Prep Planner — Initial Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- =============================================================================
-- TUTORS (auth-linked)
-- =============================================================================
CREATE TABLE tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can read own profile"
  ON tutors FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Tutors can update own profile"
  ON tutors FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- =============================================================================
-- STUDENTS
-- =============================================================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 8 AND 12),
  test_type TEXT NOT NULL CHECK (test_type IN ('ACT', 'SAT')),
  test_date DATE,
  schools_of_interest TEXT[] DEFAULT '{}',
  self_study_hours_per_week NUMERIC(3,1) NOT NULL,
  live_session_hours_per_week NUMERIC(3,1) NOT NULL,
  weekly_availability JSONB NOT NULL DEFAULT '{}',
  sessions_paid INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage own students"
  ON students FOR ALL
  USING (
    tutor_id IN (SELECT id FROM tutors WHERE auth_user_id = auth.uid())
  );

-- =============================================================================
-- SCORE REPORTS
-- =============================================================================
CREATE TABLE score_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('baseline', 'predicted', 'actual')),
  composite_score INTEGER NOT NULL,
  section_scores JSONB NOT NULL,
  prediction_range_low INTEGER,
  prediction_range_high INTEGER,
  section_predictions JSONB,
  confidence_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE score_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage score reports for own students"
  ON score_reports FOR ALL
  USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN tutors t ON s.tutor_id = t.id
      WHERE t.auth_user_id = auth.uid()
    )
  );

-- =============================================================================
-- PREP PLANS
-- =============================================================================
CREATE TABLE prep_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  predicted_score_report_id UUID REFERENCES score_reports(id),
  total_weeks INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived')),
  ai_model_used TEXT,
  generation_prompt_hash TEXT,
  tutor_notes TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE prep_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage plans for own students"
  ON prep_plans FOR ALL
  USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN tutors t ON s.tutor_id = t.id
      WHERE t.auth_user_id = auth.uid()
    )
  );

-- =============================================================================
-- PLAN WEEKS
-- =============================================================================
CREATE TABLE plan_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prep_plan_id UUID NOT NULL REFERENCES prep_plans(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  theme TEXT NOT NULL,
  goals TEXT[] NOT NULL DEFAULT '{}',
  self_study_assignments JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prep_plan_id, week_number)
);

ALTER TABLE plan_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage plan weeks for own students"
  ON plan_weeks FOR ALL
  USING (
    prep_plan_id IN (
      SELECT pp.id FROM prep_plans pp
      JOIN students s ON pp.student_id = s.id
      JOIN tutors t ON s.tutor_id = t.id
      WHERE t.auth_user_id = auth.uid()
    )
  );

-- =============================================================================
-- PLAN SESSIONS
-- =============================================================================
CREATE TABLE plan_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_week_id UUID NOT NULL REFERENCES plan_weeks(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  scheduled_date DATE,
  scheduled_time_start TIME,
  scheduled_time_end TIME,
  agenda JSONB NOT NULL DEFAULT '[]',
  tutor_notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE plan_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage sessions for own students"
  ON plan_sessions FOR ALL
  USING (
    plan_week_id IN (
      SELECT pw.id FROM plan_weeks pw
      JOIN prep_plans pp ON pw.prep_plan_id = pp.id
      JOIN students s ON pp.student_id = s.id
      JOIN tutors t ON s.tutor_id = t.id
      WHERE t.auth_user_id = auth.uid()
    )
  );

-- =============================================================================
-- RESOURCES (reference table)
-- =============================================================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type TEXT NOT NULL CHECK (test_type IN ('ACT', 'SAT')),
  section TEXT NOT NULL,
  sub_topic TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('khan_academy', 'college_board', 'bluebook_test', 'act_pdf', 'worksheet')),
  title TEXT NOT NULL,
  url TEXT,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('foundational', 'intermediate', 'advanced')),
  estimated_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);

-- =============================================================================
-- HISTORICAL OUTCOMES (for score prediction calibration)
-- =============================================================================
CREATE TABLE historical_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type TEXT NOT NULL CHECK (test_type IN ('ACT', 'SAT')),
  baseline_composite INTEGER NOT NULL,
  final_composite INTEGER NOT NULL,
  baseline_section_scores JSONB NOT NULL,
  final_section_scores JSONB NOT NULL,
  total_weeks INTEGER NOT NULL,
  self_study_hours_per_week NUMERIC(3,1),
  live_session_hours_per_week NUMERIC(3,1),
  total_sessions INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE historical_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read historical outcomes"
  ON historical_outcomes FOR SELECT
  TO authenticated
  USING (true);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX idx_students_tutor_id ON students(tutor_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_test_type ON students(test_type);
CREATE INDEX idx_score_reports_student_id ON score_reports(student_id);
CREATE INDEX idx_score_reports_report_type ON score_reports(report_type);
CREATE INDEX idx_prep_plans_student_id ON prep_plans(student_id);
CREATE INDEX idx_prep_plans_status ON prep_plans(status);
CREATE INDEX idx_plan_weeks_prep_plan_id ON plan_weeks(prep_plan_id);
CREATE INDEX idx_plan_sessions_plan_week_id ON plan_sessions(plan_week_id);
CREATE INDEX idx_resources_test_type ON resources(test_type);
CREATE INDEX idx_resources_section ON resources(section);
CREATE INDEX idx_historical_outcomes_test_type ON historical_outcomes(test_type);

-- =============================================================================
-- FUNCTION: Auto-update updated_at timestamp
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prep_plans_updated_at
  BEFORE UPDATE ON prep_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
