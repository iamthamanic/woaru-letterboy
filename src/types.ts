import { z } from 'zod';

/**
 * Zod schema for validating incoming WOARU messages
 */
export const WoaruMessageSchema = z.object({
  filePath: z.string().min(1, 'File path cannot be empty'),
  lineNumber: z.number().int().positive('Line number must be a positive integer'),
  ruleId: z.string().min(1, 'Rule ID cannot be empty'),
  errorMessage: z.string().min(1, 'Error message cannot be empty'),
  suggestion: z.string().min(1, 'Suggestion cannot be empty'),
});

/**
 * TypeScript type derived from the Zod schema
 */
export type WoaruMessage = z.infer<typeof WoaruMessageSchema>;