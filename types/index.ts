export type Stats = {
  total: number;
  bySentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  byTopic: Record<string, number>;
  volumeOverTime: Array<{ date: string; count: number }>;
}