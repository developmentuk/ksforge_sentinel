import { z } from 'zod';

export const forgeHealthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.string(),
  version: z.string().optional()
});

export const registrationLinkSchema = z.object({
  url: z.url(),
  expiresAt: z.string().datetime(),
  state: z.string().min(16)
});

export const identityStatusSchema = z.object({
  discordUserId: z.string().min(1),
  status: z.enum([
    'unlinked',
    'registration_pending',
    'linked',
    'player_verified',
    'alliance_pending',
    'alliance_verified'
  ]),
  forgeUserId: z.string().uuid().nullable().optional(),
  playerProfileId: z.string().uuid().nullable().optional(),
  displayName: z.string().nullable().optional(),
  kingdomNumber: z.number().int().positive().nullable().optional(),
  allianceTag: z.string().nullable().optional(),
  updatedAt: z.string().datetime()
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
export type IdentityStatus = z.infer<typeof identityStatusSchema>;
export type HeroSummary = z.infer<typeof heroSummarySchema>;
export type EventToday = z.infer<typeof eventTodaySchema>;
export type GiftCode = z.infer<typeof giftCodeSchema>;
