import { Participant, Exclusion, Pairing, GenerationResult } from '../types';

export const generatePairings = (
  participants: Participant[],
  exclusions: Exclusion[]
): GenerationResult => {
  if (participants.length < 2) {
    return {
      success: false,
      error: 'Not enough participants',
      reasons: ['At least 2 participants are required for Secret Santa'],
    };
  }

  // Build exclusion map
  const exclusionMap = new Map<string, Set<string>>();
  participants.forEach(p => {
    exclusionMap.set(p.id, new Set([p.id]));
  });

  exclusions.forEach(e => {
    const set = exclusionMap.get(e.giverId);
    if (set) {
      set.add(e.receiverId);
    }
  });

  // Pre-calc allowed receivers per giver (exclusions applied)
  const allowedReceivers = new Map<string, Participant[]>();
  participants.forEach(giver => {
    const excluded = exclusionMap.get(giver.id) || new Set<string>();
    allowedReceivers.set(
      giver.id,
      participants.filter(receiver => !excluded.has(receiver.id))
    );
  });

  // Try to find a valid assignment using backtracking
  const givers = [...participants];
  const assignment: Map<string, string> = new Map();
  const failureLog = new Set<string>();

  const backtrack = (giverIndex: number): boolean => {
    if (giverIndex === givers.length) {
      return true;
    }

    const giver = givers[giverIndex];
    const allowed = allowedReceivers.get(giver.id) || [];
    const available = allowed.filter(receiver => !assignment.has(receiver.id));

    if (available.length === 0) {
      if (allowed.length === 0) {
        failureLog.add(
          `${giver.name} cannot give to anyone because all recipients are excluded by the rules.`
        );
      } else {
        const allowedNames = allowed.map(r => r.name).join(', ');
        failureLog.add(
          `${giver.name} ran out of available receivers (only allowed: ${allowedNames}).`
        );
      }
      return false;
    }

    for (const receiver of available) {
      assignment.set(receiver.id, giver.id);

      if (backtrack(giverIndex + 1)) {
        return true;
      }

      assignment.delete(receiver.id);
    }

    return false;
  };

  const found = backtrack(0);

  if (!found) {
    const reasons = new Set<string>();

    // Givers with zero or single options are likely the blockers
    participants.forEach(giver => {
      const allowed = allowedReceivers.get(giver.id) || [];
      const excludedNames = participants
        .filter(p => p.id !== giver.id && exclusionMap.get(giver.id)?.has(p.id))
        .map(p => p.name);

      if (allowed.length === 0) {
        reasons.add(
          `${giver.name} has no allowed receivers because they are excluded from everyone (${excludedNames.join(
            ', '
          )}).`
        );
      } else if (allowed.length === 1) {
        reasons.add(`${giver.name} can only give to ${allowed[0].name} based on current exclusions.`);
      }
    });

    // Add dynamic failures from the backtracking attempts
    failureLog.forEach(r => reasons.add(r));

    if (reasons.size === 0) {
      reasons.add('The exclusion rules create a cycle that blocks a valid assignment.');
      reasons.add('Try removing or relaxing one of the exclusions and generate again.');
    }

    return {
      success: false,
      error: 'No valid pairing could be found',
      reasons: Array.from(reasons),
    };
  }

  const pairings: Pairing[] = givers.map(giver => {
    const receiverId = Array.from(assignment.entries()).find(
      ([recId, givId]) => givId === giver.id
    )?.[0];
    if (!receiverId) {
      throw new Error(`No receiver found for giver ${giver.id}`);
    }

    const receiver = participants.find(p => p.id === receiverId);

    if (!receiver) {
      throw new Error(`Receiver ${receiverId} missing from participants list`);
    }

    return { giver, receiver };
  });

  return { success: true, pairings };
};

export const getFeasibility = (
  participants: Participant[],
  exclusions: Exclusion[]
): 'solvable' | 'warning' | 'none' => {
  if (participants.length < 2) return 'none';

  const exclusionMap = new Map<string, number>();
  participants.forEach(p => {
    exclusionMap.set(p.id, 1);
  });

  exclusions.forEach(e => {
    exclusionMap.set(e.giverId, (exclusionMap.get(e.giverId) || 0) + 1);
  });

  const maxExclusions = participants.length - 1;
  const hasProblematic = Array.from(exclusionMap.values()).some(
    count => count >= maxExclusions
  );

  if (hasProblematic) return 'warning';
  
  const totalPossible = participants.length * (participants.length - 1);
  const totalExcluded = exclusions.length + participants.length;
  
  if (totalExcluded > totalPossible * 0.5) return 'warning';

  return 'solvable';
};
