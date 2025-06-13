import { IsNotEmpty } from 'class-validator';

class LoginGoogleUserDto {
  @IsNotEmpty()
  credential: string;
}

export default LoginGoogleUserDto;
