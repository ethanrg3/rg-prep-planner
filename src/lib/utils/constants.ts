// SAT score ranges and domains
export const SAT_COMPOSITE_MIN = 400;
export const SAT_COMPOSITE_MAX = 1600;
export const SAT_SECTION_MIN = 200;
export const SAT_SECTION_MAX = 800;
export const SAT_SUBSCORE_MIN = 1;
export const SAT_SUBSCORE_MAX = 15;

export const SAT_RW_SUBSCORES = [
  { key: "information_and_ideas", label: "Information & Ideas" },
  { key: "craft_and_structure", label: "Craft & Structure" },
  { key: "expression_of_ideas", label: "Expression of Ideas" },
  { key: "standard_english_conventions", label: "Standard English Conventions" },
] as const;

export const SAT_MATH_SUBSCORES = [
  { key: "algebra", label: "Algebra" },
  { key: "advanced_math", label: "Advanced Math" },
  { key: "problem_solving", label: "Problem Solving & Data Analysis" },
  { key: "geometry_and_trig", label: "Geometry & Trigonometry" },
] as const;

// ACT score ranges and domains
export const ACT_COMPOSITE_MIN = 1;
export const ACT_COMPOSITE_MAX = 36;
export const ACT_SECTION_MIN = 1;
export const ACT_SECTION_MAX = 36;
export const ACT_SUBSCORE_MIN = 1;
export const ACT_SUBSCORE_MAX = 18;

export const ACT_ENGLISH_SUBSCORES = [
  { key: "usage_mechanics", label: "Usage & Mechanics" },
  { key: "rhetorical_skills", label: "Rhetorical Skills" },
] as const;

export const ACT_MATH_SUBSCORES = [
  { key: "pre_algebra", label: "Pre-Algebra / Elementary Algebra" },
  { key: "algebra", label: "Algebra / Coordinate Geometry" },
  { key: "geometry", label: "Plane Geometry / Trigonometry" },
] as const;

export const ACT_READING_SUBSCORES = [
  { key: "social_studies_sciences", label: "Social Studies / Sciences" },
  { key: "arts_literature", label: "Arts / Literature" },
] as const;

export const ACT_SCIENCE_SUBSCORES = [
  { key: "data_representation", label: "Data Representation" },
  { key: "research_summaries", label: "Research Summaries" },
  { key: "conflicting_viewpoints", label: "Conflicting Viewpoints" },
] as const;

// Grade levels
export const GRADE_LEVELS = [
  { value: 8, label: "8th Grade" },
  { value: 9, label: "9th Grade (Freshman)" },
  { value: 10, label: "10th Grade (Sophomore)" },
  { value: 11, label: "11th Grade (Junior)" },
  { value: 12, label: "12th Grade (Senior)" },
] as const;

// Time slots for availability
export const TIME_SLOTS = [
  { key: "morning", label: "AM", description: "8am–12pm" },
  { key: "afternoon", label: "PM", description: "12pm–5pm" },
  { key: "evening", label: "Eve", description: "5pm–9pm" },
] as const;

export const DAYS_OF_WEEK = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const;

// Common schools list (top 50 for autocomplete)
export const COMMON_SCHOOLS = [
  "Harvard University",
  "Stanford University",
  "MIT",
  "Yale University",
  "Princeton University",
  "Columbia University",
  "University of Chicago",
  "Duke University",
  "Northwestern University",
  "Johns Hopkins University",
  "Caltech",
  "Dartmouth College",
  "Brown University",
  "Vanderbilt University",
  "Rice University",
  "Cornell University",
  "University of Notre Dame",
  "UCLA",
  "UC Berkeley",
  "University of Michigan",
  "University of Virginia",
  "Georgetown University",
  "Carnegie Mellon University",
  "Emory University",
  "University of Southern California",
  "New York University",
  "University of Florida",
  "University of North Carolina",
  "Boston College",
  "Boston University",
  "University of Georgia",
  "Georgia Tech",
  "Georgia State University",
  "Auburn University",
  "University of Alabama",
  "Clemson University",
  "University of South Carolina",
  "Florida State University",
  "University of Central Florida",
  "University of Texas at Austin",
  "Texas A&M University",
  "Ohio State University",
  "Penn State University",
  "University of Wisconsin",
  "University of Illinois",
  "Purdue University",
  "University of Washington",
  "Arizona State University",
  "University of Colorado",
  "University of Oregon",
] as const;
