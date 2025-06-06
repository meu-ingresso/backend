
type FacebookLoginRequest = {
  facebook_id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  picture: {
    data: {
      url: string;
    };
  };
  email_verified: boolean;
  provider: string;
};

export default FacebookLoginRequest; 