import { IsEmail, IsNotEmpty, Min } from 'class-validator';

class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Min(8)
  password: string;

  @IsNotEmpty()
  @Min(3)
  name: string;
}

export default RegisterUserDto;
