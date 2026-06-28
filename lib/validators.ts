import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = loginSchema.extend({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Full name must contain only letters and spaces'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const profileSetupSchema = z.object({
  fullName: z.string().min(2).max(50),
  age: z.number().min(1).max(120),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
  weight: z.number().optional(),
  height: z.number().optional(),
  organDonor: z.boolean().default(false),
  conditions: z.string().max(500).optional(),
  allergies: z.string().max(300).optional(),
  medications: z.string().max(300).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  relationship: z.string().min(2, "Relationship must be at least 2 characters").max(50),
  phone: z.string().regex(/^\+?[0-9*]{10,15}$/, "Invalid phone number"),
});

export const emergencyContactsSchema = z.object({
  contacts: z.array(contactSchema).max(3),
});

export const familyMemberSchema = profileSetupSchema.extend({
  memberLabel: z.string().min(2).max(50),
});
