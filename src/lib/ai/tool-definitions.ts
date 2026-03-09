import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export const predictScoreTool: Tool = {
  name: "predict_score",
  description:
    "Predict score ranges for a student based on baseline scores, study plan parameters, and historical outcome data.",
  input_schema: {
    type: "object" as const,
    properties: {
      predicted_composite_low: {
        type: "number",
        description: "Lower bound of predicted composite score",
      },
      predicted_composite_high: {
        type: "number",
        description: "Upper bound of predicted composite score",
      },
      section_predictions: {
        type: "object",
        description:
          "Per-section predictions. Keys are section names (e.g., 'reading_writing', 'math' for SAT; 'english', 'math', 'reading', 'science' for ACT)",
        additionalProperties: {
          type: "object",
          properties: {
            current: {
              type: "number",
              description: "Current baseline score for this section",
            },
            predicted_low: {
              type: "number",
              description: "Lower bound of predicted section score",
            },
            predicted_high: {
              type: "number",
              description: "Upper bound of predicted section score",
            },
          },
          required: ["current", "predicted_low", "predicted_high"],
        },
      },
      confidence_notes: {
        type: "string",
        description:
          "Detailed explanation of prediction confidence, key factors, and comparison to historical outcomes",
      },
    },
    required: [
      "predicted_composite_low",
      "predicted_composite_high",
      "section_predictions",
      "confidence_notes",
    ],
  },
};

export const extractScoreReportTool: Tool = {
  name: "extract_score_report",
  description:
    "Extract scores from a College Board SAT score report PDF. Return all scores exactly as shown in the report.",
  input_schema: {
    type: "object" as const,
    properties: {
      report_label: {
        type: "string",
        description:
          "The practice test label shown on the report (e.g., 'Practice 6', 'PSAT 1')",
      },
      report_date: {
        type: "string",
        description:
          "The date shown on the report in ISO format (YYYY-MM-DD)",
      },
      composite_score: {
        type: "number",
        description: "Total SAT score (400-1600)",
      },
      reading_writing_total: {
        type: "number",
        description: "Reading and Writing section total (200-800)",
      },
      math_total: {
        type: "number",
        description: "Math section total (200-800)",
      },
      rw_subscores: {
        type: "object",
        description:
          "Reading & Writing domain scores (each 1-7, representing filled boxes in 'Knowledge and Skills' section)",
        properties: {
          information_and_ideas: {
            type: "number",
            description: "Information and Ideas domain score (1-7)",
          },
          craft_and_structure: {
            type: "number",
            description: "Craft and Structure domain score (1-7)",
          },
          expression_of_ideas: {
            type: "number",
            description: "Expression of Ideas domain score (1-7)",
          },
          standard_english_conventions: {
            type: "number",
            description:
              "Standard English Conventions domain score (1-7)",
          },
        },
        required: [
          "information_and_ideas",
          "craft_and_structure",
          "expression_of_ideas",
          "standard_english_conventions",
        ],
      },
      math_subscores: {
        type: "object",
        description:
          "Math domain scores (each 1-7, representing filled boxes in 'Knowledge and Skills' section)",
        properties: {
          algebra: {
            type: "number",
            description: "Algebra domain score (1-7)",
          },
          advanced_math: {
            type: "number",
            description: "Advanced Math domain score (1-7)",
          },
          problem_solving: {
            type: "number",
            description:
              "Problem-Solving and Data Analysis domain score (1-7)",
          },
          geometry_and_trig: {
            type: "number",
            description:
              "Geometry and Trigonometry domain score (1-7)",
          },
        },
        required: [
          "algebra",
          "advanced_math",
          "problem_solving",
          "geometry_and_trig",
        ],
      },
    },
    required: [
      "report_label",
      "report_date",
      "composite_score",
      "reading_writing_total",
      "math_total",
      "rw_subscores",
      "math_subscores",
    ],
  },
};

export const generateInsightsTool: Tool = {
  name: "generate_insights",
  description:
    "Analyze a student's score progression across multiple practice tests to identify priority focus areas, time allocation recommendations, strengths, and risk alerts.",
  input_schema: {
    type: "object" as const,
    properties: {
      summary: {
        type: "string",
        description:
          "2-3 sentence executive summary of the student's progress and key recommendations",
      },
      priority_areas: {
        type: "array",
        description:
          "Ordered list of areas to focus on, ranked by potential score impact",
        items: {
          type: "object",
          properties: {
            section: {
              type: "string",
              description:
                "Section name (e.g., 'reading_writing', 'math')",
            },
            subscore: {
              type: "string",
              description:
                "Specific subscore domain (e.g., 'geometry_and_trig', 'expression_of_ideas')",
            },
            reason: {
              type: "string",
              description: "Why this area should be prioritized",
            },
            impact_estimate: {
              type: "string",
              description:
                "Estimated composite score impact if improved (e.g., '+30-50 points')",
            },
            recommended_resources: {
              type: "array",
              items: { type: "string" },
              description:
                "2-3 specific resource or activity suggestions",
            },
          },
          required: [
            "section",
            "subscore",
            "reason",
            "impact_estimate",
            "recommended_resources",
          ],
        },
      },
      time_allocation: {
        type: "object",
        description:
          "Recommended percentage of study time per section (values should sum to 100)",
        additionalProperties: {
          type: "number",
          description: "Percentage of study time (0-100)",
        },
      },
      strengths: {
        type: "array",
        description: "Areas where the student is performing well",
        items: {
          type: "object",
          properties: {
            section: { type: "string" },
            subscore: { type: "string" },
            note: {
              type: "string",
              description:
                "Brief note about performance and maintenance advice",
            },
          },
          required: ["section", "subscore", "note"],
        },
      },
      risk_alerts: {
        type: "array",
        description: "Areas showing decline or stagnation that need attention",
        items: {
          type: "object",
          properties: {
            section: { type: "string" },
            subscore: { type: "string" },
            alert: {
              type: "string",
              description: "Description of the risk",
            },
            severity: {
              type: "string",
              enum: ["high", "medium"],
              description: "How urgent this risk is",
            },
          },
          required: ["section", "subscore", "alert", "severity"],
        },
      },
    },
    required: [
      "summary",
      "priority_areas",
      "time_allocation",
      "strengths",
      "risk_alerts",
    ],
  },
};

export const generatePrepPlanTool: Tool = {
  name: "generate_prep_plan",
  description:
    "Generate a structured, week-by-week test prep plan with session agendas and self-study assignments.",
  input_schema: {
    type: "object" as const,
    properties: {
      weeks: {
        type: "array",
        description: "Array of weekly plan objects",
        items: {
          type: "object",
          properties: {
            week_number: {
              type: "number",
              description: "Week number starting from 1",
            },
            theme: {
              type: "string",
              description:
                "Short theme for the week (e.g., 'Algebra Foundations & Grammar Review')",
            },
            goals: {
              type: "array",
              items: { type: "string" },
              description:
                "2-4 specific, measurable goals for the week",
            },
            self_study_assignments: {
              type: "array",
              description: "Self-study assignments for the week",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Assignment title",
                  },
                  resource_type: {
                    type: "string",
                    enum: [
                      "khan_academy",
                      "college_board",
                      "bluebook_test",
                      "act_pdf",
                      "worksheet",
                    ],
                    description: "Type of resource",
                  },
                  estimated_minutes: {
                    type: "number",
                    description: "Estimated completion time in minutes",
                  },
                  focus_area: {
                    type: "string",
                    description:
                      "The test section/subsection this targets (e.g., 'math.algebra')",
                  },
                  instructions: {
                    type: "string",
                    description:
                      "Specific instructions for the student",
                  },
                },
                required: [
                  "title",
                  "resource_type",
                  "estimated_minutes",
                  "focus_area",
                  "instructions",
                ],
              },
            },
            sessions: {
              type: "array",
              description: "Live tutoring sessions for the week",
              items: {
                type: "object",
                properties: {
                  session_number: {
                    type: "number",
                    description:
                      "Session number within the week (1, 2, etc.)",
                  },
                  agenda: {
                    type: "array",
                    description: "Minute-by-minute session agenda",
                    items: {
                      type: "object",
                      properties: {
                        activity: {
                          type: "string",
                          description:
                            "Description of the activity",
                        },
                        minutes: {
                          type: "number",
                          description:
                            "Duration of the activity in minutes",
                        },
                      },
                      required: ["activity", "minutes"],
                    },
                  },
                },
                required: ["session_number", "agenda"],
              },
            },
          },
          required: [
            "week_number",
            "theme",
            "goals",
            "self_study_assignments",
            "sessions",
          ],
        },
      },
    },
    required: ["weeks"],
  },
};
