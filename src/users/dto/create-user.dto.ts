import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { User } from '../interfaces/user.interface'

export class CreateUserDTO implements Omit<User, 'id'> {
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
