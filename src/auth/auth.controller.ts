import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserGuard } from './guards/user.guard';
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

	@UseGuards(new UserGuard())
	@Delete(':userId')
	async removeUser(@Param('userId', MongoIdValidationPipe) userId: string) {
		return this.authService.removeUser(userId);
	}
}
