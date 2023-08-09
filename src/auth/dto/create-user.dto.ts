export class CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export class RegisterDto extends CreateUserDto {}
