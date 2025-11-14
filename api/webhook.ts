import { bot } from '../src/index.js'

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