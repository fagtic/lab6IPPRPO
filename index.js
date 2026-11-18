const winston = require('winston');
const { z } = require('zod');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) =>
            `[${timestamp}] ${level.toUpperCase()}: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});

const UserSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1, 'Имя не может быть пустым'),
    email: z.string().email('Некорректный email'),
    age: z.number().int().min(0).max(120).optional()
});

function validateUser(data) {
    const result = UserSchema.safeParse(data);
    if (!result.success) {
        logger.error(`Валидация не пройдена для ${JSON.stringify(data)}`);
        result.error.errors.forEach(e =>
            logger.error(`  → поле "${e.path.join('.')}": ${e.message}`)
        );
        return false;
    }
    logger.info(`Пользователь валиден: ${result.data.name} <${result.data.email}>`);
    return true;
}

function main() {
    logger.info('== Запуск приложения ==');

    const validUser = { id: 1, name: 'Иван', email: 'ivan@example.com', age: 25 };
    const invalidUser = { id: -1, name: '', email: 'not-an-email' };

    logger.info('--- Проверка корректного пользователя ---');
    validateUser(validUser);

    logger.info('--- Проверка некорректного пользователя ---');
    validateUser(invalidUser);

    logger.info('== Завершение работы ==');
}

if (require.main === module) {
    main();
}
module.exports = { validateUser, UserSchema, logger };
