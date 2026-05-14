import { z } from "zod";

export const startupInterestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  role: z.string().max(200).optional().nullable(),
  startupName: z.string().min(1).max(200),
  reason: z.string().min(1).max(5000),
  comments: z.string().max(8000).optional().nullable(),
  preferredContact: z.string().min(1).max(80),
});

export const recruiterMessageSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional().nullable(),
  message: z.string().min(1).max(8000),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional().nullable(),
  subject: z.string().min(1).max(300),
  reason: z.string().max(500).optional().nullable(),
  body: z.string().min(1).max(8000),
});

export const meetingRequestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  role: z.string().max(200).optional().nullable(),
  reason: z.string().min(1).max(5000),
  preferredDate: z.string().min(1).max(100),
  preferredTime: z.string().min(1).max(100),
  message: z.string().max(8000).optional().nullable(),
});

export const recruiterChatSchema = z.object({
  question: z.string().min(2).max(2000),
});
