import { Participant } from '../types';

export const validateEmail = (email: string): boolean => {
  // Basic email check — good enough for demo input
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isEmailDuplicate = (email: string, participants: Participant[]): boolean => {
  // Normalize casing so we don't allow the same email twice
  return participants.some(p => p.email.toLowerCase() === email.toLowerCase());
};
