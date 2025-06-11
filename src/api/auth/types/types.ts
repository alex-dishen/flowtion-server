export type JwtPayloadT = {
  sub: string;
};

export type JwtTokenDecode = JwtPayloadT & {
  exp?: number; // Expiration time (timestamp in seconds)
  iat?: number; // Issued at (timestamp in seconds)
  nbf?: number; // Not before (timestamp in seconds)
  jti?: string; // JWT ID
};

export type CreateTokensResponse = {
  accessToken: string;
  refreshToken: string;
  refreshTokenKey: string;
  refreshExpiresIn: number;
  hashedRefreshToken: string;
};
