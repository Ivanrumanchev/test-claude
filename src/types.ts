export interface WeddingConfig {
  readonly bride: string;
  readonly groom: string;
  readonly date: Date;
  readonly venue: WeddingVenue;
  readonly schedule: readonly ScheduleItem[];
  readonly rsvpEmail: string;
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
  readonly svg: string;
}

export interface CountdownResult {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

export type RSVPStatus = 'attending' | 'not_attending' | 'pending';

export interface RSVPFormData {
  readonly name: string;
  readonly guestsCount: number;
  readonly status: RSVPStatus;
  readonly message?: string;
}
