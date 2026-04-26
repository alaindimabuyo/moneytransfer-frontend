export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export type QuoteStatus = "active" | "expired" | "consumed";

export interface Quote {
  id: string;
  userId: string;
  rateSnapshotId: string;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: string;
  targetAmount: string;
  feeAmount: string;
  rate: string;
  expiresAt: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

export type TransferStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface TransferRequest {
  id: string;
  userId: string;
  quoteId: string;
  status: TransferStatus;
  submittedAt: string;
  recipientName: string | null;
  recipientAccount: string | null;
  recipientCountry: string | null;
  recipientEmail: string | null;
  createdAt: string;
  updatedAt: string;
  quote?: Quote;
}

export interface ApiError {
  error: { code: string; message: string; details?: unknown };
}
