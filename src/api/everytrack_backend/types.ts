import { TRANSACTION_CATEGORIES } from '@consts';

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
  name: string;
  currencyId: string;
  assetProviderId: string;
}
export interface CreateNewAccountResponse extends BaseResponse {}
// PUT /v1/accounts
export interface UpdateAccountRequest {
  balance: string;
  currencyId: string;
  accountTypeId: string;
}
export interface UpdateAccountResponse extends BaseResponse {}
// DELETE /v1/accounts
export interface DeleteAccountRequest {
  accountId: string;
  providerType: ProviderType;
}
export interface DeleteAccountResponse extends BaseResponse {}

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
    refresh: string;
  };
}
// POST /v1/auth/refresh
export interface RefreshResponse extends LoginResponse {}

// ============================================================
// /v1/cash endpoints
// ============================================================
// GET /v1/cash
export interface GetAllCashResponse extends BaseResponse {
  data: Cash[];
}
// POST /v1/cash
export interface CreateNewCashRequest {
  amount: string;
  currencyId: string;
}
export interface CreateNewCashResponse extends BaseResponse {}
// PUT /v1/cash
export interface UpdateCashRequest {
  id: string;
  amount: string;
  currencyId: string;
}
export interface UpdateCashResponse extends BaseResponse {}
// DELETE /v1/cash
export interface DeleteCashRequest {
  cashId: string;
}
export interface DeleteCashResponse extends BaseResponse {}

// ============================================================
// /v1/countries endpoints
// ============================================================
// GET /v1/countries
export interface GetAllCountriesResponse extends BaseResponse {
  data: Country[];
}

// ============================================================
// /v1/currencies endpoints
// ============================================================
// GET /v1/currencies
export interface GetAllCurrenciesResponse extends BaseResponse {
  data: Currency[];
}

// ============================================================
// /v1/fpayments endpoints
// ============================================================
// GET /v1/fpayments
export interface GetAllFuturePaymentsResponse extends BaseResponse {
  data: FuturePayment[];
}
// POST /v1/fpayments
export interface CreateNewFuturePaymentRequest {
  name: string;
  amount: string;
  income: string; // boolean in string
  rolling: string; // boolean in string
  accountId: string;
  currencyId: string;
  scheduledAt: number;
  remarks?: string;
  frequency?: number;
}
export interface CreateNewFuturePaymentResponse extends BaseResponse {}
// PUT /v1/fpayments
export interface UpdateFuturePaymentRequest {
  id: string;
  name: string;
  amount: string;
  income: string; // boolean in string
  rolling: string; // boolean in string
  accountId: string;
  currencyId: string;
  scheduledAt: number;
  remarks?: string;
  frequency?: number;
}
export interface UpdateFuturePaymentResponse extends BaseResponse {}
// DELETE /v1/fpayments
export interface DeleteFuturePaymentRequest {
  futurePaymentId: string;
}
export interface DeleteFuturePaymentResponse extends BaseResponse {}

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
// PUT /v1/stocks/holdings
export interface UpdateStockHoldingRequest {
  unit: string;
  cost: string;
  stockId: string;
  accountId: string;
}
export interface UpdateStockHoldingResponse extends BaseResponse {}
// DELETE /v1/stocks/holdings
export interface DeleteStockHoldingRequest {
  accountStockId: string;
}
export interface DeleteStockHoldingResponse extends BaseResponse {}

// ============================================================
// /v1/transactions endpoints
// ============================================================
// GET /v1/transactions
export interface GetAllTransactionsResponse extends BaseResponse {
  data: Transaction[];
}
// POST /v1/transactions
export interface CreateNewTransactionRequest {
  name: string;
  amount: string;
  income: string; // boolean in string
  category: string;
  executedAt: number;
  currencyId: string;
  remarks?: string;
  accountId?: string;
}
export interface CreateNewTransactionResponse extends BaseResponse {}
// DELETE /v1/transactions
export interface DeleteTransactionRequest {
  transactionId: string;
  revertBalance: boolean;
}
export interface DeleteTransactionResponse extends BaseResponse {}

// ============================================================
// Helper Types
// ============================================================
export interface Account {
  id: string;
  name: string;
  balance: string;
  currencyId: string;
  accountTypeId: string;
  assetProviderId: string;
}

export interface StockHolding {
  id: string;
  unit: string;
  cost: string;
  stockId: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
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

export interface Transaction {
  id: string;
  name: string;
  amount: string;
  income: boolean;
  remarks: string;
  executedAt: number;
  currencyId: string;
  accountId: string | null;
  category: TransactionCategory;
}

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export interface Provider {
  id: string;
  name: string;
  icon: string;
  countryId: string;
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

export interface Cash {
  id: string;
  amount: string;
  currencyId: string;
}

export interface FuturePayment {
  id: string;
  name: string;
  amount: string;
  remarks: string;
  income: boolean;
  rolling: boolean;
  frequency: number; // in milliseconds
  accountId: string;
  currencyId: string;
  scheduledAt: number;
}
