import { Telegraf, Markup, Context as TelegrafContextBase } from "telegraf"
import type { Update, CallbackQuery } from "telegraf/types"
import { devInfo } from "./data.js"

const BOT_TOKEN = process.env.BOT_TOKEN as string

if (!BOT_TOKEN) {
	console.error("❌ BOT_TOKEN не найден. Инициализация бота невозможна.")
}

export const bot = new Telegraf(BOT_TOKEN)

const BACK_TO_MAIN = "back_to_main"

const createMainMenu = () => {
	// Инлайн-иконки
	const inlineKeyboard = Markup.inlineKeyboard(
		Object.entries(devInfo).map(([key, info]) =>
			Markup.button.callback(info.title, `info_${key}`)
		),
		{ columns: 2 } // Кнопки в 2 столбца
	)

	return inlineKeyboard
}

// Тип для команды /start
type StartCtx = TelegrafContextBase<Update.MessageUpdate>

// Тип для нажатия кнопки action
type CallbackCtx = TelegrafContextBase<
	Update.CallbackQueryUpdate<CallbackQuery>
>
type ExtraReplyMessage = Parameters<StartCtx["reply"]>[1]
type ExtraEditMessageText = Parameters<CallbackCtx["editMessageText"]>[1]

// Генерация основного текста меню
const getMainMessage = (firstName: string) =>
	`👋 Привет, ${firstName}! Я информационный бот для React-разработчиков.

	Здесь ты найдешь все актуальные ссылки и инструкции.

	**Выбери нужный раздел:**`

// handleStart только для /start. Всегда отправляет новое сообщение
const handleStart = (ctx: StartCtx) => {
	const firstName = ctx.from?.first_name || "друг"

	const message = getMainMessage(firstName)

	ctx.reply(message, {
		...createMainMenu(),
		parse_mode: "Markdown",
	})
}

// Async функция для обработки кнопки Назад. Удаляет сообщение раздела и отправляет новое сообщение с главным меню
const handleBackToMain = async (ctx: CallbackCtx) => {
	await ctx.answerCbQuery()

	// Удаляем старое сообщение (то, откуда мы возврашаемся)
	try {
		await ctx.deleteMessage()
	} catch (e) {
		console.warn("Не удалось удалить предыдущее сообщение.")
	}

	const firstName = ctx.from?.first_name || "друг"
	const message = getMainMessage(firstName)

	// Отправляем новое сообщение в главном меню
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
			const moduleButtons = moduleInfo.modules!.map((mod, index) =>
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

// Реакция на ключевые слова в групповом чате
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