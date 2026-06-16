export interface Organization {
  id: string;
  name: string;
  stripeCustomerId: string | null;
  remainingAIRuns: number;
  remainingUploads: number;
  lastResetAt: string | null;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string | null;
  maxAIRuns: number;
  maxUploads: number;
}

export interface Subscription {
  id: string;
  subscriptionId: string;
  organizationId: string;
  priceId: string;
  status: string;
  createdAt: string;
}
