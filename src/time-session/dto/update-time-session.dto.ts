import { IsNotEmpty, MinLength } from 'class-validator';

class UpdateTimeSessionDto {
  @IsNotEmpty()
  @MinLength(5)
  description: string;
}

export default UpdateTimeSessionDto;
