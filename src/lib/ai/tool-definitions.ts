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
