import type { ZodType } from 'zod';
import {
  eventTodaySchema,
  forgeHealthSchema,
  giftCodeSchema,
  heroSummarySchema,
  registrationLinkSchema,
  type EventToday,
  type ForgeHealth,
  type GiftCode,
  type HeroSummary,
  type RegistrationLink
} from './contracts.js';

interface ForgeApiClientOptions {
  baseUrl: string;
  serviceToken: string;
  fetchImpl?: typeof fetch;
}

export class ForgeApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly requestId?: string
  ) {
    super(message);
    this.name = 'ForgeApiError';
  }
}

export class ForgeApiClient {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: ForgeApiClientOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  health(): Promise<ForgeHealth> {
    return this.request('/health', forgeHealthSchema);
  }

  createRegistrationLink(input: {
    discordUserId: string;
    discordGuildId?: string;
    discordUsername: string;
  }): Promise<RegistrationLink> {
    return this.request('/identity/registration-link', registrationLinkSchema, {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  getHero(query: string): Promise<HeroSummary> {
    return this.request(`/content/heroes/lookup?q=${encodeURIComponent(query)}`, heroSummarySchema);
  }

  getTodayEvents(): Promise<EventToday> {
    return this.request('/content/events/today', eventTodaySchema);
  }

  getActiveGiftCodes(): Promise<GiftCode[]> {
    return this.request('/content/giftcodes/active', giftCodeSchema.array());
  }

  private async request<T>(path: string, schema: ZodType<T>, init: RequestInit = {}): Promise<T> {
    const response = await this.fetchImpl(`${this.options.baseUrl}${path}`, {
      ...init,
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${this.options.serviceToken}`,
        'content-type': 'application/json',
        'user-agent': 'KSForge-Sentinel/0.1.0',
        ...init.headers
      },
      signal: AbortSignal.timeout(10_000)
    });

    const requestId = response.headers.get('x-request-id') ?? undefined;
    if (!response.ok) {
      throw new ForgeApiError(`KSForge API request failed with status ${response.status}.`, response.status, requestId);
    }

    const payload: unknown = await response.json();
    return schema.parse(payload);
  }
}
