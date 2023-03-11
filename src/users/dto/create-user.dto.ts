import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { User } from '../interfaces/user.interface'

export class CreateUserDTO implements Omit<User, 'id'> {
  @IsString()
  @IsNotEmpty()
  externalId: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  picture: string

  @IsString()
  @IsNotEmpty()
  locale: string

  @IsBoolean()
  emailVerified: boolean
}
