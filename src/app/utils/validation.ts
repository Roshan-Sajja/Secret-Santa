import { Participant } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isEmailDuplicate = (email: string, participants: Participant[]): boolean => {
  return participants.some(p => p.email.toLowerCase() === email.toLowerCase());
};

