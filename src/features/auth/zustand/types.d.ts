export type AuthSlice = {
  accessToken?: string;
  updateAccessToken: (newAccessToken: string) => void;
};

export type AuthState = AuthSlice;
