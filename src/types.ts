export interface WeddingConfig {
  readonly bride: string;
  readonly groom: string;
  readonly date: Date;
  readonly venue: WeddingVenue;
  readonly schedule: readonly ScheduleItem[];
  readonly hashtag: string;
}

export interface WeddingVenue {
  readonly name: string;
  readonly address: string;
  readonly mapUrl: string;
}

export interface ScheduleItem {
  readonly time: string;
  readonly title: string;
  readonly iconUrl: string;
}

export interface CountdownResult {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

