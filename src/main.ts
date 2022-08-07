import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getMongoConfig } from './configs/mongo.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const PORT = process.env.PORT || 3003;
	app.setGlobalPrefix('api');
	await app.listen(PORT, () => Logger.log(`Server runned on ${PORT}`));
}
bootstrap();
