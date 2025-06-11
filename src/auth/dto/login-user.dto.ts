import { IsEmail, IsNotEmpty, Min } from 'class-validator';

class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @Min(8)
  password: string;
}

export default LoginUserDto;
