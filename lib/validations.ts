import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null));

const optionalMoney = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? Number(value) : null))
  .pipe(z.number().nonnegative().nullable());

export const idSchema = z.string().uuid("Invalid record id.");

export const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Client name is required.").max(120),
  contact_name: z.string().trim().max(120).optional().default(""),
  contact_email: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null))
    .pipe(z.string().email("Enter a valid contact email.").nullable()),
  status: z.enum(["Lead", "Active", "At risk", "Paused", "Complete"]),
  priority: z.enum(["Low", "Medium", "High"]),
  health_score: z.coerce.number().int().min(0).max(100),
});

export const projectSchema = z.object({
  client_id: idSchema,
  name: z.string().trim().min(2, "Project name is required.").max(140),
  description: z.string().trim().max(400).optional().default(""),
  status: z.enum(["Discovery", "Build", "Review", "Launch", "Complete", "Blocked"]),
  priority: z.enum(["Low", "Medium", "High"]),
  due_date: optionalDate,
  budget: optionalMoney,
  progress: z.coerce.number().int().min(0).max(100),
});

export const taskSchema = z.object({
  project_id: idSchema,
  title: z.string().trim().min(2, "Task title is required.").max(160),
  owner: z.string().trim().max(100).optional().default(""),
  status: z.enum(["Todo", "In progress", "Blocked", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  due_date: optionalDate,
});

export const noteSchema = z.object({
  project_id: idSchema,
  title: z.string().trim().min(2, "Note title is required.").max(140),
  body: z.string().trim().min(3, "Note body is required.").max(1200),
  note_type: z.enum(["Update", "Risk", "Decision", "Client context"]),
});

export const aiSummarySchema = z.object({
  project_id: idSchema,
  summary: z.string().trim().min(10).max(1600),
  risk_level: z.enum(["Low", "Medium", "High"]),
  recommended_next_steps: z.array(z.string().trim().min(3).max(220)).min(1).max(5),
  suggested_follow_up_message: z.string().trim().min(10).max(1000),
});

export const activityLogSchema = z.object({
  client_id: idSchema.nullable().optional(),
  project_id: idSchema.nullable().optional(),
  action: z.string().trim().min(2).max(80),
  detail: z.string().trim().min(5).max(500),
});

export const projectStatusSchema = z.object({
  id: idSchema,
  status: projectSchema.shape.status,
});

export const taskStatusSchema = z.object({
  id: idSchema,
  status: taskSchema.shape.status,
});

export function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function parseFormData<T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData,
) {
  return schema.parse(Object.fromEntries(formData.entries())) as z.infer<T>;
}
