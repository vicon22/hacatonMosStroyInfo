const translations = {
  ui: {
    filepicker: {
      actions: {
        upload: "Загрузить",
      },
    },
  },

  nav: {
    home: "Главная",
    dashboard: "Обзор",
    projects: "Стройки",
    blueprints: "Проекты",
    documents: "Документы",
    services: "Услуги",
    wiki: "База знаний",
  },
  blueprints: {
    labels: {
      details: "Детали проекта",
      about: "О проекте",
      questions: "Остались вопросы?",
      callback: "Перезвоните мне",
    },
    header: "Варианты проектов",
    item: {
      header: "Проект {{name}}",
    },
    materials: {
      aeratedConcrete: "Газобетон",
      bricks: "Кирпич",
      reinforcedConcret: "Железобетон",
      timber: "Брус",
    },
  },
  projects: {
    states: {
      new: "Подача документов",
      approval: "Ожидает приемки",
      pending: "Идет строительство",
      completed: "Работы завершены",
    },

    confirmation: {
      placeholder: {
        title: "Ура! Стройка завершена!",
        text: "Это финальный этап строительства, на нем необходимо происпектировать постройку и подписать документы приемки-передачи",
      },
      actions: {
        approve: "Подписать документы",
      },
      checklist: {
        title: "Приемка проекта",
        signs: {
          inspected: "Постройка проинспектирована и соответсвует проекту",
          confirmed: "К качеству работ и материалов претензий не имею",
          signed: "Акт приемки-передачи подписан",
        },
        actions: {
          submit: "Подтвердить приемку",
        },
      },
    },

    done: {
      placeholder: {
        title: "Проект завершен",
        text: "Строительство завершено, проект принят в эксплуатацию",
      },
    },

    approval: {
      review: {
        placeholder: {
          title: "Все документы согласованы",
          text: "Теперь можно приступать к строительству. После подтверждения старта строительства, будет сформирована бригада для отправки на локацию объекта",
        },
      },

      placeholder: {
        title: "Проект ожидает подачи документов",
        text: "Это начальный этап стоительства, на нем необходимо загрузить пакет документов, разрешающих строительство, скан договора и паспорта, документы на право собственности на землю, а также схему участка",
      },
      actions: {
        upload: "Загрузить документы",
        construct: "Начать строительство",
      },
      uploader: {
        title: "Подача документов",
        files: {
          contract: { title: "Договор", desc: "Скан всех подписанных листов" },
          passport: {
            title: "Паспорт",
            desc: "Разворот с фотографией и пропиской",
          },
          schema: {
            title: "Схема участка",
            desc: "СПОЗУ с обозначением места будущего дома",
          },
          property: {
            title: "Документы собственности",
            desc: "Правоустанавливающие документы на земельный участок (выписка из ЕГРН)",
          },
        },
        actions: {
          submit: "Отправить",
        },
      },
    },

    stages: {
      approval: "Согласование",
      construction: "Строительство",
      confirmation: "Приемка",
    },

    create: "Новый проект",
    active: {
      header: "Активные стройки",
    },
    form: {
      sections: {
        blueprint: {
          label: "Вариант",
        },
      },
      actions: {
        submit: "Создать",
      },
      fields: {
        address: "Адрес",
        title: "Название",
      },
    },
  },

  documents: {
    states: {
      new: "Новый",
      on_review: "На проверке",
      reviewed: "Проверен",
    },
  },

  admission: {
    login: {
      actions: {
        submit: "Вход",
      },
      fields: {
        username: "Имя пользователя",
        password: "Пароль",
      },
    },
  },

  chat: {
    actions: {
      submit: "Отправить",
    },
    welcome: "Наш менеджер с радостью ответит на все ваши вопросы!",
  },

  dashboard: {
    start_project: "Самое время начать строить!",
  },

  tables: {
    actions: {
      review: "На проверку",
    },
    columns: {
      labels: {
        title: "Название",
        price: "Цена",
        status: "Статус",
        size: "Размер",
        project: "Проект",
        area: "Площадь",
        rooms: "Комнаты",
        floors: "Этажность",
        material: "Материал",
        bedrooms: "Спальни",
        bathrooms: "Санузлы",
      },
    },
  },
};

export default translations;
