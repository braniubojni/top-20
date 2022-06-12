import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	@Post('registration')
	async registration(@Body() dto: AuthDto) {}

	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {}
}
