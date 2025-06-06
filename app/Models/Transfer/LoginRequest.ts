type LoginRequest = {
  email: string;
  password: string;
};

type GoogleLoginRequest = {
  google_id: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
  email_verified: boolean;
  provider: string;
};

enum AuthProvider {
  DEFAULT = 'DEFAULT',
  GOOGLE = 'google',
  FACEBOOK = 'facebook', // Para implementação futura
}

export default LoginRequest;
export { GoogleLoginRequest, AuthProvider };
