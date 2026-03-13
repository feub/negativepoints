// Database types matching Supabase schema

export interface Group {
  id: string;
  name: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  group_id: string;
  created_at: string;
  total_points: number;
}

export interface PointEvent {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  created_at: string;
  created_by: string | null;
}

// Extended types for UI display
export interface UserWithGroup extends User {
  group?: Group;
}

export interface PointEventWithDetails extends PointEvent {
  user?: User;
  creator_email?: string;
}

export interface ScoreboardEntry {
  id: string;
  name: string;
  total_points: number;
  rank: number;
}

// Input validation types
export interface CreateGroupInput {
  name: string;
}

export interface CreateUserInput {
  name: string;
  group_id: string;
}

export interface CreatePointEventInput {
  user_id: string;
  points: number;
  reason: string;
  created_by: string;
}

// Validation constants
export const VALIDATION = {
  MAX_NAME_LENGTH: 50,
  MAX_REASON_LENGTH: 200,
  MIN_NAME_LENGTH: 1,
  MIN_REASON_LENGTH: 1,
  PRESET_POINTS: [-5, -10, -30, -50] as const,
} as const;

export type ButtonCategory = 'bonus' | 'body' | 'other' | 'crazy';

export interface PresetButton {
  label: string;
  points: number;
  category: ButtonCategory;
}

export const PRESET_BUTTONS: PresetButton[] = [
  { label: '+5', points: 5, category: 'bonus' },
  { label: 'Body -10', points: -10, category: 'body' },
  { label: 'Body -30', points: -30, category: 'body' },
  { label: 'Other -5', points: -5, category: 'other' },
  { label: 'Other -20', points: -20, category: 'other' },
  { label: '-50', points: -50, category: 'crazy' },
];

export const BUTTON_CATEGORY_COLORS: Record<ButtonCategory, string> = {
  bonus: '#27AE60',
  body: '#E67E22',
  other: '#8E44AD',
  crazy: '#C0392B',
};
