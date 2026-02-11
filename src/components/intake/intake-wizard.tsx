"use client";

import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { StepBasicInfo } from "./step-basic-info";
import { StepTestDetails } from "./step-test-details";
import { StepBaselineScores } from "./step-baseline-scores";
import { StepSchedule } from "./step-schedule";
import { StepReview } from "./step-review";

import {
  intakeFormSchema,
  basicInfoSchema,
  testDetailsSchema,
  satScoresSchema,
  actScoresSchema,
  scheduleSchema,
  type IntakeFormData,
} from "@/lib/schemas/intake-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyForm = any;

const STEPS = [
  { label: "Basic Info", description: "Student details" },
  { label: "Test Details", description: "Date & schools" },
  { label: "Scores", description: "Baseline report" },
  { label: "Schedule", description: "Commitment" },
  { label: "Review", description: "Confirm & submit" },
];

export function IntakeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(intakeFormSchema) as AnyForm,
    defaultValues: {
      basicInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gradeLevel: undefined as unknown as number,
        testType: undefined as unknown as "ACT" | "SAT",
      },
      testDetails: {
        testDate: "",
        notYetScheduled: false,
        schoolsOfInterest: [],
      },
      satScores: undefined,
      actScores: undefined,
      schedule: {
        selfStudyHoursPerWeek: 5,
        liveSessionHoursPerWeek: 2,
        sessionsPaid: 16,
        weeklyAvailability: {},
      },
      generatePlan: true,
    },
    mode: "onTouched",
  });

  const testType = form.watch("basicInfo.testType");

  // Validate current step before moving forward
  async function validateCurrentStep(): Promise<boolean> {
    switch (currentStep) {
      case 0: {
        const values = form.getValues("basicInfo");
        const result = basicInfoSchema.safeParse(values);
        if (!result.success) {
          // Trigger validation on all basicInfo fields
          await form.trigger([
            "basicInfo.firstName",
            "basicInfo.lastName",
            "basicInfo.gradeLevel",
            "basicInfo.testType",
          ]);
          return false;
        }
        // Initialize score object based on test type
        if (values.testType === "SAT" && !form.getValues("satScores")) {
          (form as AnyForm).setValue("satScores", {
            compositeScore: 0,
            readingWriting: {
              total: 0,
              information_and_ideas: 0,
              craft_and_structure: 0,
              expression_of_ideas: 0,
              standard_english_conventions: 0,
            },
            math: {
              total: 0,
              algebra: 0,
              advanced_math: 0,
              problem_solving: 0,
              geometry_and_trig: 0,
            },
          });
        } else if (values.testType === "ACT" && !form.getValues("actScores")) {
          (form as AnyForm).setValue("actScores", {
            compositeScore: 0,
            english: { total: 0, usage_mechanics: 0, rhetorical_skills: 0 },
            math: { total: 0, pre_algebra: 0, algebra: 0, geometry: 0 },
            reading: {
              total: 0,
              social_studies_sciences: 0,
              arts_literature: 0,
            },
            science: {
              total: 0,
              data_representation: 0,
              research_summaries: 0,
              conflicting_viewpoints: 0,
            },
          });
        }
        return true;
      }
      case 1: {
        const values = form.getValues("testDetails");
        const result = testDetailsSchema.safeParse(values);
        if (!result.success) {
          await form.trigger(["testDetails.testDate"]);
          return false;
        }
        return true;
      }
      case 2: {
        if (testType === "SAT") {
          const values = form.getValues("satScores");
          const result = satScoresSchema.safeParse(values);
          if (!result.success) {
            await form.trigger("satScores");
            return false;
          }
        } else {
          const values = form.getValues("actScores");
          const result = actScoresSchema.safeParse(values);
          if (!result.success) {
            await form.trigger("actScores");
            return false;
          }
        }
        return true;
      }
      case 3: {
        const values = form.getValues("schedule");
        const result = scheduleSchema.safeParse(values);
        if (!result.success) {
          await form.trigger([
            "schedule.selfStudyHoursPerWeek",
            "schedule.liveSessionHoursPerWeek",
            "schedule.sessionsPaid",
          ]);
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  }

  async function handleNext() {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function onSubmit(data: FieldValues) {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual Supabase insert via server action
      console.log("Submitting student data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to students list (or to plan generation if generatePlan is true)
      router.push("/students");
    } catch (error) {
      console.error("Failed to create student:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    index < currentStep
                      ? "bg-orange-500 text-white"
                      : index === currentStep
                        ? "bg-orange-500 text-white ring-4 ring-orange-100"
                        : "bg-slate-200 text-slate-500"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 hidden text-xs sm:block",
                    index <= currentStep
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-8 sm:w-12 lg:w-16",
                    index < currentStep ? "bg-orange-500" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="min-h-[400px]">
                {currentStep === 0 && <StepBasicInfo form={form} />}
                {currentStep === 1 && <StepTestDetails form={form} />}
                {currentStep === 2 && <StepBaselineScores form={form} />}
                {currentStep === 3 && <StepSchedule form={form} />}
                {currentStep === 4 && <StepReview form={form} />}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : form.watch("generatePlan") ? (
                      "Create Student & Generate Plan"
                    ) : (
                      "Create Student"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
