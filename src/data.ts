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
		title: '🗣️ Дейлики',
		desc: 'Ежедневно с понедельника по пятницу в 11:00 по МСК.',
		url: 'https://telemost.yandex.ru/j/30836714828063'
	},
	cross: {
		title: '👥 Кросс-созваны',
		desc: 'Понедельник, вторник, четверг в 16:00 по МСК.',
		url: 'https://telemost.yandex.ru/j/97250210920871'
	},
	crossDocs: {
		title: '📝 Документы для кросс-созванов',
		desc: 'Инструкция, столы.',
		url: 'https://docs.google.com/spreadsheets/d/1WFiVO2HSIGgEWCv-xYcGDBdMkpUjdOXUbp7Alwv3ME4/edit?gid=2134837622#gid=2134837622'
	},
	lecture: {
		title: '🧑‍🏫 Лекция',
		desc: 'Вторник 14:00 по МСК.',
		url: 'https://telemost.yandex.ru/j/94452828446220'
	},
	interviewLog: {
		title: '🗂️ Журнал собесов/созвонов',
		desc: 'Документ, куда необходимо добавлять записи своих собесов и созвонов с техлидами.',
		url: 'https://docs.google.com/spreadsheets/d/1HVf2F-JYsdccNkmdoogU9gLxhSTHFhW9u906KHJQr6s/edit?gid=0#gid=0'
	},
	modules: {
		title: '📚 Серия модулей (1-10)',
		desc: 'Этот материал проходите параллельно с обучением в своем режиме. Нажмите, чтобы увидеть список модулей.',
		isSubMenu: true,
		modules: [
			{ title: 'Модуль 1', url: 'https://cloud.xserver-krv.ru/s/PPZ6cX7nkMmY6m9' },
        { title: 'Модуль 2', url: 'https://cloud.xserver-krv.ru/s/mLMg6DxDXswtszi' },
        { title: 'Модуль 3', url: 'https://cloud.xserver-krv.ru/s/Jm5Pmdb7j8bQLX7' },
        { title: 'Модуль 4', url: 'https://cloud.xserver-krv.ru/s/HqXmZzx3aSin599' },
        { title: 'Модуль 5', url: 'https://cloud.xserver-krv.ru/s/Syp6e7oWRQ9z4cW' },
        { title: 'Модуль 6', url: 'https://cloud.xserver-krv.ru/s/oHwz5mdqwrsoKRt' },
        { title: 'Модуль 7', url: 'https://cloud.xserver-krv.ru/s/LqG9sQiwY6M6s5F' },
        { title: 'Модуль 8', url: 'https://cloud.xserver-krv.ru/s/EKfRywiw2bp7xeD' },
        { title: 'Модуль 9', url: 'https://cloud.xserver-krv.ru/s/zy3MZYSpjHxWXEn' },
        { title: 'Модуль 10', url: 'https://cloud.xserver-krv.ru/s/8mSCWP9RJqHrZ92' },
		],
	}
}