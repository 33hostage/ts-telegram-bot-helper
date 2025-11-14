import { Telegraf } from "telegraf"
import * as dotenv from "dotenv"
import { bot } from '../src/index.js'

dotenv.config()

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || process.env.BOT_TOKEN
const WEBHOOK_URL = process.env.WEBHOOK_URL

if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
	console.error("WEBHOOK_URL или BOT_TOKEN не найдены.")
}

export default async (req: any, res: any) => {
	// Обработка входящего post запроса от telegram
	if (req.method === 'POST' && req.body) {
		try {
			await bot.handleUpdate(req.body)
			res.status(200).send('OK')
		} catch (e) {
			console.error('Ошибка в Serverless-функции:', e)
			res.status(200).send('Error processed')
		}
	} else if (req.method === 'GET') {
		res.status(200).send('Бот запущен и ожидает запросы')
	} else {
		res.status(405).send('Метод не разрешен')
	}
}