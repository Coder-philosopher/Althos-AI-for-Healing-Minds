// Main export file for all Cloud Functions
// Each function is deployed individually but can be imported from here

// Journal Functions
export { journal, journalById, journalRecent } from './journal';

// AI Functions  
export { 
  aiJournalCoach,
  aiCoping,
  aiWeeklySummary,
  aiKindness,
  aiGrounding,
  aiDistressCheck
} from './ai-coach';

// Test Functions
export {
  testPHQ9,
  testGAD7,
  testInsights,
  testHistory
} from './tests';

// Mood Functions
export {
  moodDaily,
  moodAtlas,
  moodHistory,
  moodTrends
} from './mood';

// Share Functions
export {
  shareCreate,
  shareSummary,
  shareList,
  shareRevoke,
  shareAnalytics
} from './shares';

// Utility Functions
export {
  healthCheck,
  whoami,
  systemStatus
} from './health';