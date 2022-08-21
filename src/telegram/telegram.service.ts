import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';
import { ITelegramOptions } from './telegram.interface';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: ITelegramOptions;
	constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions) {
		this.bot = new Telegraf(options.token);
		this.options = options;
	}

	async sendMessage(msg: string, chatId: string = this.options.chatId) {
		const res = await this.bot.telegram.sendMessage(chatId, msg);
		console.log(res, '<00 res\n');
	}
}
