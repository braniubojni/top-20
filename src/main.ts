import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const PORT = process.env.PORT || '3003';
	app.setGlobalPrefix('api');
	await app.listen(PORT, () => new ConsoleLogger(`Server runned on ${PORT}`));
}
bootstrap();
