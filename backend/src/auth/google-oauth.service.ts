import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleAuthService {
  private readonly googleUserInfoURL =
    'https://www.googleapis.com/oauth2/v2/userinfo';

  async validateGoogleAccessToken(accessToken: string) {
    try {
      console.log("token:",accessToken)
      // Call Google UserInfo API
      const response = await axios.get(this.googleUserInfoURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });


      // Extract user information from the response
      const { email, given_name, family_name, picture } = response.data;
      console.log('email:', email);
      return response.data;
    } catch (error) {
      console.log("invalid token")
      throw new HttpException(
        'Invalid Google Access Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
