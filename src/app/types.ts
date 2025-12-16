export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface Exclusion {
  id: string;
  giverId: string;
  receiverId: string;
}

export interface Pairing {
  giver: Participant;
  receiver: Participant;
}

export type GenerationResult = 
  | { success: true; pairings: Pairing[] }
  | { success: false; error: string; reasons: string[] };

