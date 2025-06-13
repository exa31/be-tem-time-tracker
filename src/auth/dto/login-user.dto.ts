import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export default LoginUserDto;
