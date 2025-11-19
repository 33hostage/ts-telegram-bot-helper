import { Telegraf, Markup, Context as TelegrafContextBase } from "telegraf"
import type { Update, CallbackQuery } from "telegraf/types"

const BOT_TOKEN = '8279788855:AAEPkRsnY_KecRnOD5UHS7VHQw7Dnx4N5cY'

interface InfoItem {
	title: string
	desc: string
	url?: string
	isSubMenu?: boolean
}

interface ModuleItem extends InfoItem {
	modules?: { title: string; url: string }[]
}

export const devInfo: { [key: string]: ModuleItem } = {
	daily: {
		title: "🗣️ Дейлики",
		desc: "Ежедневно с понедельника по пятницу в 11:00 по МСК.",
		url: "https://telemost.yandex.ru/j/30836714828063",
	},
	cross: {
		title: "👥 Кросс-созваны",
		desc: "Понедельник, вторник, четверг в 16:00 по МСК.",
		url: "https://telemost.yandex.ru/j/97250210920871",
	},
	crossDocs: {
		title: "📝 Документы для кросс-созванов",
		desc: "Инструкция, столы.",
		url: "https://docs.google.com/spreadsheets/d/1WFiVO2HSIGgEWCv-xYcGDBdMkpUjdOXUbp7Alwv3ME4/edit?gid=2134837622#gid=2134837622",
	},
	lecture: {
		title: "🧑‍🏫 Лекция",
		desc: "Вторник 14:00 по МСК.",
		url: "https://telemost.yandex.ru/j/94452828446220",
	},
	interviewLog: {
		title: "🗂️ Журнал собесов/созвонов",
		desc: "Документ, куда необходимо добавлять записи своих собесов и созвонов с техлидами.",
		url: "https://docs.google.com/spreadsheets/d/1HVf2F-JYsdccNkmdoogU9gLxhSTHFhW9u906KHJQr6s/edit?gid=0#gid=0",
	},
	modules: {
		title: "📚 Серия модулей (1-10)",
		desc: "Этот материал проходите параллельно с обучением в своем режиме. Нажмите, чтобы увидеть список модулей.",
		isSubMenu: true,
		modules: [
			{
				title: "Модуль 1",
				url: "https://cloud.xserver-krv.ru/s/PPZ6cX7nkMmY6m9",
			},
			{
				title: "Модуль 2",
				url: "https://cloud.xserver-krv.ru/s/mLMg6DxDXswtszi",
			},
			{
				title: "Модуль 3",
				url: "https://cloud.xserver-krv.ru/s/Jm5Pmdb7j8bQLX7",
			},
			{
				title: "Модуль 4",
				url: "https://cloud.xserver-krv.ru/s/HqXmZzx3aSin599",
			},
			{
				title: "Модуль 5",
				url: "https://cloud.xserver-krv.ru/s/Syp6e7oWRQ9z4cW",
			},
			{
				title: "Модуль 6",
				url: "https://cloud.xserver-krv.ru/s/oHwz5mdqwrsoKRt",
			},
			{
				title: "Модуль 7",
				url: "https://cloud.xserver-krv.ru/s/LqG9sQiwY6M6s5F",
			},
			{
				title: "Модуль 8",
				url: "https://cloud.xserver-krv.ru/s/EKfRywiw2bp7xeD",
			},
			{
				title: "Модуль 9",
				url: "https://cloud.xserver-krv.ru/s/zy3MZYSpjHxWXEn",
			},
			{
				title: "Модуль 10",
				url: "https://cloud.xserver-krv.ru/s/8mSCWP9RJqHrZ92",
			},
		],
	},
}

const DUMMY_TOKEN = "DUMMY_TOKEN_FOR_TELEGHRAPH_IF_TOKEN_IS_MISSING"

if (!BOT_TOKEN) {
	console.error("❌ BOT_TOKEN not found. Bot initialization is impossible.")
}

// Безопасная инициализация бота
export const bot = new Telegraf(BOT_TOKEN || DUMMY_TOKEN)

if (BOT_TOKEN) {
	const BACK_TO_MAIN = "back_to_main"

	const createMainMenu = () => {
		const inlineKeyboard = Markup.inlineKeyboard(
			Object.entries(devInfo).map(([key, info]) =>
				Markup.button.callback(info.title, `info_${key}`)
			),
			{ columns: 2 }
		)
		return inlineKeyboard
	}

	type StartCtx = TelegrafContextBase<Update.MessageUpdate>
	type CallbackCtx = TelegrafContextBase<
		Update.CallbackQueryUpdate<CallbackQuery>
	>
	type ExtraReplyMessage = Parameters<StartCtx["reply"]>[1]

	const getMainMessage = (firstName: string) =>
		`👋 Привет, ${firstName}! Я информационный бот для React-разработчиков.

        Здесь ты найдешь все актуальные ссылки и инструкции.

        **Выбери нужный раздел:**`

	const handleStart = (ctx: StartCtx) => {
		const firstName = ctx.from?.first_name || "друг"
		const message = getMainMessage(firstName)

		ctx.reply(message, {
			...createMainMenu(),
			parse_mode: "Markdown",
		} as ExtraReplyMessage)
	}

	const handleBackToMain = async (ctx: CallbackCtx) => {
		await ctx.answerCbQuery()

		try {
			await ctx.deleteMessage()
		} catch (e) {
			console.warn("Не удалось удалить предыдущее сообщение.")
		}

		const firstName = ctx.from?.first_name || "друг"
		const message = getMainMessage(firstName)

		await ctx.reply(message, {
			...createMainMenu(),
			parse_mode: "Markdown",
		} as ExtraReplyMessage)
	}

	// Привязываем обработчики к командам
	bot.start(handleStart)
	bot.action(BACK_TO_MAIN, handleBackToMain)

	Object.entries(devInfo).forEach(([key, info]) => {
		if (info.isSubMenu && info.modules) {
			bot.action(`info_${key}`, async ctx => {
				await ctx.answerCbQuery()

				try {
					await ctx.deleteMessage()
				} catch (e) {
					console.warn("Не удалось удалить сообщение раздела.")
				}

				const moduleInfo = devInfo[key]
				const message = `**${moduleInfo.title}**\n\n${moduleInfo.desc}\n\nВыберите модуль:`
				const moduleButtons = moduleInfo.modules!.map(mod =>
					Markup.button.url(mod.title, mod.url)
				)
				const backButton = Markup.button.callback("↩️ Назад", BACK_TO_MAIN)
				const moduleKeyboard = Markup.inlineKeyboard(
					[...moduleButtons, backButton],
					{ columns: 2 }
				)

				await ctx.reply(message, {
					...moduleKeyboard,
					parse_mode: "Markdown",
				} as ExtraReplyMessage)
			})
			return
		}

		bot.action(`info_${key}`, async ctx => {
			await ctx.answerCbQuery()

			try {
				await ctx.deleteMessage()
			} catch (e) {
				console.warn("Не удалось удалить сообщение раздела.")
			}

			const itemInfo = devInfo[key]
			let response = `**${itemInfo.title}**\n\n${itemInfo.desc}`
			if (itemInfo.url) {
				response += `\n\n🔗 **Ссылка**: [Перейти](${itemInfo.url})`
			}
			const buttons = []
			if (itemInfo.url) {
				buttons.push(Markup.button.url("↗️ Перейти по ссылке", itemInfo.url))
			}
			buttons.push(Markup.button.callback("↩️ Назад в меню", BACK_TO_MAIN))

			const keyboard = Markup.inlineKeyboard(buttons, { columns: 1 })

			await ctx.reply(response, {
				...keyboard,
				parse_mode: "Markdown",
				disable_web_page_preview: !itemInfo.url,
			} as ExtraReplyMessage)
		})
	})

	bot.hears(["дейлик", "кросс", "лекция", "модули", "ссылки"], ctx => {
		if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
			const botUsername = ctx.botInfo.username
			ctx.reply(
				`Привет! Всю актуальную информацию и ссылки можно получить в личном чате с ботом.
                
                👉 Просто перейди ко мне в ЛС (@${botUsername}) и нажми /start.`,
				{
					reply_to_message_id: ctx.message.message_id,
				} as ExtraReplyMessage
			)
		}
	})
}

export default async (req: any, res: any) => {
	// Обработка входящего post запроса от telegram
	if (req.method === "POST" && req.body) {
		res.status(200).send("OK")
		try {
			await bot.handleUpdate(req.body)
		} catch (e) {
			console.error("Ошибка в Serverless-функции:", e)
		}
	} else if (req.method === "GET") {
		res.status(200).send("Бот запущен и ожидает запросы")
	} else {
		res.status(405).send("Метод не разрешен")
	}
}