export type GoogleIdToken = {
  iss: string; // Issuer (e.g., "accounts.google.com")
  azp: string; // Authorized party
  aud: string; // Audience (your app's client ID)
  sub: string; // Subject (unique identifier for the user)
  email: string; // Email address of the user
  email_verified: boolean; // Whether the user's email is verified
  at_hash?: string; // Access token hash
  name?: string; // Full name of the user
  picture?: string; // URL of the user's profile picture
  given_name?: string; // User's given name
  family_name?: string; // User's family name
  locale?: string; // Locale of the user
  iat: number; // Issued at time (timestamp)
  exp: number; // Expiration time (timestamp)
  jti?: string; // JWT ID (unique identifier for the token)
};
