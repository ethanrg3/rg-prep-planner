import { z } from "zod";
import {
  SAT_COMPOSITE_MIN,
  SAT_COMPOSITE_MAX,
  SAT_SECTION_MIN,
  SAT_SECTION_MAX,
  SAT_SUBSCORE_MIN,
  SAT_SUBSCORE_MAX,
  ACT_COMPOSITE_MIN,
  ACT_COMPOSITE_MAX,
  ACT_SECTION_MIN,
  ACT_SECTION_MAX,
  ACT_SUBSCORE_MIN,
  ACT_SUBSCORE_MAX,
} from "@/lib/utils/constants";

// ─── Step 1: Basic Info ──────────────────────────────────────────────────────

export const basicInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  gradeLevel: z.coerce
    .number()
    .int()
    .min(8, "Grade must be 8-12")
    .max(12, "Grade must be 8-12"),
  testType: z.enum(["ACT", "SAT"], {
    message: "Please select a test type",
  }),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;

// ─── Step 2: Test Details ────────────────────────────────────────────────────

export const testDetailsSchema = z.object({
  testDate: z.string().optional(),
  notYetScheduled: z.boolean().default(false),
  schoolsOfInterest: z
    .array(z.string())
    .max(5, "Maximum 5 schools")
    .default([]),
});

export type TestDetailsData = z.infer<typeof testDetailsSchema>;

// ─── Step 3: Baseline Scores ─────────────────────────────────────────────────

export const satScoresSchema = z.object({
  compositeScore: z.coerce
    .number()
    .int()
    .min(SAT_COMPOSITE_MIN, `Minimum ${SAT_COMPOSITE_MIN}`)
    .max(SAT_COMPOSITE_MAX, `Maximum ${SAT_COMPOSITE_MAX}`),
  readingWriting: z.object({
    total: z.coerce
      .number()
      .int()
      .min(SAT_SECTION_MIN)
      .max(SAT_SECTION_MAX),
    information_and_ideas: z.coerce
      .number()
      .int()
      .min(SAT_SUBSCORE_MIN)
      .max(SAT_SUBSCORE_MAX),
    craft_and_structure: z.coerce
      .number()
      .int()
      .min(SAT_SUBSCORE_MIN)
      .max(SAT_SUBSCORE_MAX),
    expression_of_ideas: z.coerce
      .number()
      .int()
      .min(SAT_SUBSCORE_MIN)
      .max(SAT_SUBSCORE_MAX),
    standard_english_conventions: z.coerce
      .number()
      .int()
      .min(SAT_SUBSCORE_MIN)
      .max(SAT_SUBSCORE_MAX),
  }),
  math: z.object({
    total: z.coerce
      .number()
      .int()
      .min(SAT_SECTION_MIN)
      .max(SAT_SECTION_MAX),
    algebra: z.coerce
      .number()
      .int()
      .min(SAT_SUBSCORE_MIN)
      .max(SAT_SUBSCORE_MAX),
    advanced_math: z.coerce
      .number()
      .int()
      .min(SAT_SUBSCORE_MIN)
      .max(SAT_SUBSCORE_MAX),
    problem_solving: z.coerce
      .number()
      .int()
      .min(SAT_SUBSCORE_MIN)
      .max(SAT_SUBSCORE_MAX),
    geometry_and_trig: z.coerce
      .number()
      .int()
      .min(SAT_SUBSCORE_MIN)
      .max(SAT_SUBSCORE_MAX),
  }),
});

export const actScoresSchema = z.object({
  compositeScore: z.coerce
    .number()
    .int()
    .min(ACT_COMPOSITE_MIN, `Minimum ${ACT_COMPOSITE_MIN}`)
    .max(ACT_COMPOSITE_MAX, `Maximum ${ACT_COMPOSITE_MAX}`),
  english: z.object({
    total: z.coerce
      .number()
      .int()
      .min(ACT_SECTION_MIN)
      .max(ACT_SECTION_MAX),
    usage_mechanics: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
    rhetorical_skills: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
  }),
  math: z.object({
    total: z.coerce
      .number()
      .int()
      .min(ACT_SECTION_MIN)
      .max(ACT_SECTION_MAX),
    pre_algebra: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
    algebra: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
    geometry: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
  }),
  reading: z.object({
    total: z.coerce
      .number()
      .int()
      .min(ACT_SECTION_MIN)
      .max(ACT_SECTION_MAX),
    social_studies_sciences: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
    arts_literature: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
  }),
  science: z.object({
    total: z.coerce
      .number()
      .int()
      .min(ACT_SECTION_MIN)
      .max(ACT_SECTION_MAX),
    data_representation: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
    research_summaries: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
    conflicting_viewpoints: z.coerce
      .number()
      .int()
      .min(ACT_SUBSCORE_MIN)
      .max(ACT_SUBSCORE_MAX),
  }),
});

export type SATScoresData = z.infer<typeof satScoresSchema>;
export type ACTScoresData = z.infer<typeof actScoresSchema>;

// ─── Step 4: Schedule & Commitment ───────────────────────────────────────────

const timeSlotEnum = z.enum(["morning", "afternoon", "evening"]);

export const scheduleSchema = z.object({
  selfStudyHoursPerWeek: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(40, "Maximum 40 hours"),
  liveSessionHoursPerWeek: z.coerce
    .number()
    .min(0.5, "At least 0.5 hours")
    .max(20, "Maximum 20 hours"),
  sessionsPaid: z.coerce
    .number()
    .int()
    .min(1, "At least 1 session")
    .max(100, "Maximum 100 sessions"),
  weeklyAvailability: z.record(
    z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
    z.array(timeSlotEnum)
  ),
});

export type ScheduleData = z.infer<typeof scheduleSchema>;

// ─── Combined intake form ────────────────────────────────────────────────────

export const intakeFormSchema = z.object({
  basicInfo: basicInfoSchema,
  testDetails: testDetailsSchema,
  satScores: satScoresSchema.optional(),
  actScores: actScoresSchema.optional(),
  schedule: scheduleSchema,
  generatePlan: z.boolean().default(true),
});

export type IntakeFormData = z.infer<typeof intakeFormSchema>;
