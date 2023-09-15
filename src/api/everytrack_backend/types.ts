interface BaseResponse {
  success: boolean;
  error?: string;
}

// ============================================================
// /v1/accounts endpoints
// ============================================================
// GET /v1/accounts
export interface GetAllAccountsResponse extends BaseResponse {
  data: Account[];
}
// POST /v1/accounts
export interface CreateNewAccountRequest {
  currencyId: string;
  accountTypeId: string;
}
export interface CreateNewAccountResponse extends BaseResponse {}
// PUT /v1/accounts
export interface UpdateAccountRequest {
  balance: string;
  currencyId: string;
  accountTypeId: string;
}
export interface UpdateAccountResponse extends BaseResponse {}

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
// /v1/stocks endpoints
// ============================================================
// GET /v1/stocks
export interface GetAllStocksResponse extends BaseResponse {
  data: Stock[];
}
// GET /v1/stocks/holdings
export interface GetAllStockHoldingsResponse extends BaseResponse {
  data: AccountStockHolding[];
}
// POST /v1/stocks/holdings
export interface CreateNewStockHoldingRequest {
  unit: string;
  cost: string;
  stockId: string;
  accountId: string;
}
export interface CreateNewStockHoldingResponse extends BaseResponse {}

// ============================================================
// Helper Types
// ============================================================
export interface Account {
  id: string;
  balance: string;
  currencyId: string;
  accountTypeId: string;
}

export interface StockHolding {
  id: string;
  unit: string;
  cost: string;
  stockId: string;
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

export interface ClientSettings {
  username: string;
  currencyId: string;
}

export interface ExchangeRate {
  rate: string;
  baseCurrencyId: string;
  targetCurrencyId: string;
}

export interface Provider {
  name: string;
  icon: string;
  accountTypes: AccountType[];
}

export type ProviderType = 'savings' | 'broker' | 'credit';

export interface Stock {
  id: string;
  name: string;
  ticker: string;
  countryId: string;
  currencyId: string;
  currentPrice: string;
}

export interface AccountStockHolding {
  accountId: string;
  holdings: StockHolding[];
}
