const translations = {
    nav: {
        home: 'Главная',
        dashboard: 'Обзор',
        projects: 'Стройки',
        blueprints: 'Проекты',
        documents: 'Документы',
        services: 'Услуги',
        wiki: 'База знаний',
    },
    blueprints: {
        header: 'Варианты проектов',
        item: {
            header: 'Проект {{name}}',
        }
    },
    projects: {
        create: 'Новый проект',
        active: {
            header: 'Активные стройки'
        },
        form: {
            sections: {
                blueprint: {
                    label: 'Вариант'
                }
            },
            actions: {
                submit: 'Создать'
            },
            fields: {
                address: 'Адрес',
                title: 'Название'
            }
        }
    },
    admission: {
        login: {
            actions: {
                submit: 'Вход',
            },
            fields: {
                username: 'Имя пользователя',
                password: 'Пароль',
            },
        },
    },

    chat: {
        actions: {
            submit: 'Отправить'
        }
    },

    dashboard: {
        start_project: 'Самое время начать строить!'
    },

    tables: {
        columns: {
            labels: {
                title: 'Название',
                price: 'Цена',
                status: 'Статус',
                project: 'Проект',
                area: 'Площадь',
                rooms: 'Комнаты',
                floors: 'Этажность',
                material: 'Материал',
                bedrooms: 'Спальни',
                bathrooms: 'Санузлы',
            }
        }
    }
};

export default translations;