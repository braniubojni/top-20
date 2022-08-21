import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (
	configService: ConfigService,
): Promise<JwtModuleOptions> => {
	console.log(process.env.NODE_ENV, '<-- jwt');
	return {
		secret: configService.get('JWT_SECRET'),
	};
};
