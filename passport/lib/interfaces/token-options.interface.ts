export interface TokenPyaload {
  sub: string | number;
}

export interface VerifyResult {
  valid: boolean;
  reason?: string;
  userId: string;
}
