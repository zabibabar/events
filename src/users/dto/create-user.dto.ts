import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  externalId: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  picture: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  locale: string

  @IsBoolean()
  emailVerified: boolean
}
