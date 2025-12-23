export type SummaryData = {
  existingSummary: string;
  newSummary: string;
  comparison: string;
};

export type SummaryRes = {
  success: boolean;
  status: string;
  message: string;
  data: SummaryData;
  timestamp: string;
};
