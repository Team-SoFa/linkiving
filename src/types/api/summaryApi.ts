export type SummaryData = {
  existingSummary: string;
  newSummary: string;
  comparison: string;
};

export type ReSummaryRequest = {
  id: number;
  format: 'CONCISE' | 'DETAILED';
};

export type SummaryResponse = {
  success: boolean;
  status: string;
  message: string;
  data: SummaryData;
  timestamp: string;
};
