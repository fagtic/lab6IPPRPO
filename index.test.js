const { validateUser, UserSchema } = require('./index');

describe('Валидация пользователя (Zod)', () => {

    test('корректный пользователь проходит валидацию', () => {
        const result = validateUser({
            id: 1,
            name: 'Иван',
            email: 'ivan@example.com',
            age: 25
        });
        expect(result).toBe(true);
    });

    test('отрицательный id отклоняется', () => {
        const result = validateUser({
            id: -1,
            name: 'Иван',
            email: 'ivan@example.com'
        });
        expect(result).toBe(false);
    });

    test('пустое имя отклоняется', () => {
        const result = validateUser({
            id: 1,
            name: '',
            email: 'ivan@example.com'
        });
        expect(result).toBe(false);
    });

    test('некорректный email отклоняется', () => {
        const result = validateUser({
            id: 1,
            name: 'Иван',
            email: 'not-an-email'
        });
        expect(result).toBe(false);
    });

    test('сумма 2 + 2 равна 4', () => {
        const result = 2 + 2;
        expect(result).toBe(5);
    });
});