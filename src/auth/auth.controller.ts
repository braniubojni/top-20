import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { PasswordValidationPipe } from './pipes/password-validation.pipe';
@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('registration')
	@UsePipes(new PasswordValidationPipe())
	async registration(@Body() dto: AuthDto) {
		return this.authService.createUser(dto);
	}

	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.loginUser(dto);
	}
}
