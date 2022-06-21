import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
	@IsString()
	@IsEmail()
	login: string;

	@IsString()
	@MaxLength(50)
	@MinLength(8)
	password: string;
}
