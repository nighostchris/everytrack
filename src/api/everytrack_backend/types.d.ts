interface BaseResponse {
  success: boolean;
  error?: string;
}

// ============================================================
// /v1/auth endpoints
// ============================================================
// POST /v1/auth/verify
export interface VerifyResponse extends BaseResponse {}
// POST /v1/auth/login
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse extends BaseResponse {}

// ============================================================
// /v1/savings endpoints
// ============================================================
// GET /v1/savings/
export interface GetAllBankDetailsResponse extends BaseResponse {
  data: Record<string, AccountType[]>;
}
// POST /v1/savings/account
export interface CreateNewAccountRequest {
  currencyId: string;
  accountTypeId: string;
}
export interface CreateNewAccountResponse extends BaseResponse {}

// ============================================================
// /v1/currency endpoints
// ============================================================
// GET /v1/currency/
export interface GetAllCurrenciesResponse extends BaseResponse {
  data: Currency[];
}

// ============================================================
// Helper Types
// ============================================================
export interface AccountType {
  id: string;
  name: string;
}

export interface Currency {
  id: string;
  ticker: string;
  symbol: string;
}
