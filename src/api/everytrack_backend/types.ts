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
export interface LoginResponse extends BaseResponse {
  data: {
    token: string;
  };
}

// ============================================================
// /v1/savings endpoints
// ============================================================
// GET /v1/savings/account
export interface GetAllBankAccountsResponse extends BaseResponse {
  data: BankAccount[];
}
// POST /v1/savings/account
export interface CreateNewAccountRequest {
  currencyId: string;
  accountTypeId: string;
}
export interface CreateNewAccountResponse extends BaseResponse {}
// PUT /v1/savings/account
export interface UpdateAccountRequest {
  balance: string;
  currencyId: string;
  accountTypeId: string;
}
export interface UpdateAccountResponse extends BaseResponse {}

// ============================================================
// /v1/currencies endpoints
// ============================================================
// GET /v1/currencies
export interface GetAllCurrenciesResponse extends BaseResponse {
  data: Currency[];
}

// ============================================================
// /v1/settings endpoints
// ============================================================
// GET /v1/settings
export interface GetAllClientSettingsResponse extends BaseResponse {
  data: ClientSettings;
}
// PUT /v1/settings
export interface UpdateSettingsRequest {
  username: string;
  currencyId: string;
}
export interface UpdateSettingsResponse extends BaseResponse {}

// ============================================================
// /v1/exrate endpoints
// ============================================================
// GET /v1/exrate
export interface GetAllExchangeRatesResponse extends BaseResponse {
  data: ExchangeRate[];
}

// ============================================================
// /v1/providers endpoints
// ============================================================
// GET /v1/providers
export interface GetAllProvidersResponse extends BaseResponse {
  data: Provider[];
}

// ============================================================
// Helper Types
// ============================================================
export type ProviderType = 'savings' | 'broker' | 'credit';

export interface Provider {
  name: string;
  icon: string;
  accountTypes: AccountType[];
}

export interface AccountType {
  id: string;
  name: string;
}

export interface Currency {
  id: string;
  ticker: string;
  symbol: string;
}

export interface BankAccount {
  balance: string;
  currencyId: string;
  accountTypeId: string;
}

export interface ClientSettings {
  username: string;
  currencyId: string;
}

export interface ExchangeRate {
  rate: string;
  baseCurrencyId: string;
  targetCurrencyId: string;
}
