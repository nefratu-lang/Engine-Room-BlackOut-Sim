// Static mock service to remove API Key dependency

const STATIC_HINTS: Record<string, string> = {
  'HOOK': "Eyes on the clock, sailor! acknowledge the alarm to enter the workspace.",
  'ROOM_EXPLORATION': "Look for anomalies. Smoke usually indicates overheating components.",
  'TERMINOLOGY': "That's a breaker panel. Identify the Main Circuit Breaker to proceed.",
  'MANUAL_ANALYSIS': "Read Section 4 carefully. The pressure limit is a specific number in bar.",
  'SEQUENCE': "Think logically: Valve first, lube second. Don't start a dry engine!",
  'DEFAULT': "Check your standard operating procedures. Stay calm."
};

export const getChiefEngineerHint = async (currentStage: string, userQuery: string): Promise<string> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const hint = STATIC_HINTS[currentStage] || STATIC_HINTS['DEFAULT'];
  return `(Radio Static) ... ${hint} ... (End)`;
};