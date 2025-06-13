import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @MinLength(3)
  name: string;
}

export default RegisterUserDto;
