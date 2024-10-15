import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  userName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class LoginAuthDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsString()
  password: string;
}

export class ForgetPassDto {
  @IsString()
  email: string;
}
