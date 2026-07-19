import { z } from 'zod';

export const forgeHealthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.string(),
  version: z.string().optional()
});

export const registrationLinkSchema = z.object({
  url: z.url(),
  expiresAt: z.string(),
  state: z.string()
});

export const heroSummarySchema = z.object({
  slug: z.string(),
  name: z.string(),
  rarity: z.string().optional(),
  generation: z.number().int().optional(),
  troopType: z.string().optional(),
  summary: z.string().optional(),
  imageUrl: z.url().optional(),
  forgeUrl: z.url()
});

export const eventTodaySchema = z.object({
  generatedAt: z.string(),
  events: z.array(z.object({
    slug: z.string(),
    name: z.string(),
    status: z.string(),
    summary: z.string().optional(),
    forgeUrl: z.url()
  }))
});

export const giftCodeSchema = z.object({
  code: z.string(),
  status: z.string(),
  expiresAt: z.string().nullable().optional(),
  forgeUrl: z.url()
});

export type ForgeHealth = z.infer<typeof forgeHealthSchema>;
export type RegistrationLink = z.infer<typeof registrationLinkSchema>;
export type HeroSummary = z.infer<typeof heroSummarySchema>;
export type EventToday = z.infer<typeof eventTodaySchema>;
export type GiftCode = z.infer<typeof giftCodeSchema>;
