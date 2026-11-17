// DiMed Clinic AI operatorining bilim bazasi (UZ / RU).
// Server (api/chat.ts) uni LLM uchun kontekst sifatida, brauzer esa
// zaxira (offline) javob beruvchi sifatida ishlatadi.

import type { Lang } from "./content";

export type KbItem = { id: string; keys: string[]; uz: string; ru: string };

const PHONES = "(55) 25 222 52 / (97) 376 75 77";

export const KB: KbItem[] = [
  {
    id: "greet",
    keys: ["salom", "assalom", "hello", "hi", "привет", "здравств", "добрый"],
    uz: "Assalomu alaykum! DiMed Clinic AI operatoriman. Xizmatlar, tahlillar, tayyorgarlik yoki qabulga yozilish haqida so'rashingiz mumkin.",
    ru: "Здравствуйте! Я AI-оператор DiMed Clinic. Спрашивайте об услугах, анализах, подготовке или записи на приём.",
  },
  {
    id: "services",
    keys: ["xizmat", "nima qila", "yo'nalish", "bo'lim", "услуг", "направлен", "отделен", "что делает"],
    uz: "DiMed Clinic xizmatlari:\n• UZI diagnostika (zamonaviy ultratovush apparati)\n• Klinik-diagnostik laboratoriya (40+ turdagi tahlil)\n• Fizioterapiya (elektroforez, UVCH, darsonvalizatsiya, parafin)\n• Shifokor ko'rigi va konsultatsiya\n• Massaj\n• Ingalyatsiya\nQaysi biri bo'yicha batafsil ma'lumot kerak?",
    ru: "Услуги DiMed Clinic:\n• УЗИ-диагностика (современный аппарат)\n• Клинико-диагностическая лаборатория (40+ видов анализов)\n• Физиотерапия (электрофорез, УВЧ, дарсонвализация, парафин)\n• Приём и консультация врача\n• Массаж\n• Ингаляции\nО чём рассказать подробнее?",
  },
  {
    id: "lab",
    keys: ["tahlil", "analiz", "laborator", "qon", "siydik", "biokim", "анализ", "лаборатор", "кров", "моч", "биохим", "gepatit", "гепатит", "torch", "pilori", "пилори", "gemoglobin", "гемоглоб"],
    uz: "Laboratoriyamizda quyidagi tahlillar bor:\n• Batafsil umumiy qon tahlili\n• Umumiy siydik tahlili\n• Keng doirali biokimyoviy tahlillar\n• Koagulogramma, glikogemoglobin\n• Gepatit A, B, C, D\n• Helikobakter Pilori\n• TORCH infeksiyalari (VPG, SMV, rubella, xlamidiya, toksoplazma, ureaplazma, mikoplazma)\n• Elektrolitlar (K, Na, Cl) va umumiy kalsiy\n• CRB, antistreptolizin O, revmatoid faktor\n• IgM, IgG antitanachalari, Immunoglobulin E\nKo'pchilik natijalar shu kunning o'zida tayyor bo'ladi.",
    ru: "В нашей лаборатории проводятся:\n• Развёрнутый общий анализ крови\n• Общий анализ мочи\n• Широкий спектр биохимических анализов\n• Коагулограмма, гликозилированный гемоглобин\n• Гепатиты A, B, C, D\n• Хеликобактер Пилори\n• TORCH-инфекции (ВПГ, ЦМВ, рубелла, хламидия, токсоплазма, уреаплазма, микоплазма)\n• Электролиты (K, Na, Cl) и общий кальций\n• СРБ, антистрептолизин О, ревматоидный фактор\n• Антитела IgM, IgG, иммуноглобулин E\nБольшинство результатов готовы в тот же день.",
  },
  {
    id: "prep_blood",
    keys: ["tayyorlan", "och qorin", "ovqat", "подготов", "натощак", "есть перед", "кушать"],
    uz: "Qon tahliliga tayyorgarlik:\n• Ertalab och qoringa keling (oxirgi ovqatdan 8–12 soat o'tsin)\n• Faqat oddiy suv ichish mumkin\n• Bir kun oldin yog'li ovqat, spirtli ichimlik va og'ir jismoniy yuklamadan saqlaning\n• Doimiy dori ichsangiz, operator yoki shifokorga ayting.",
    ru: "Подготовка к анализу крови:\n• Приходите утром натощак (8–12 часов после еды)\n• Можно пить только простую воду\n• Накануне исключите жирную пищу, алкоголь и тяжёлые нагрузки\n• Если принимаете лекарства — сообщите оператору или врачу.",
  },
  {
    id: "uzi",
    keys: ["uzi", "узи", "ultratovush", "ультразвук"],
    uz: "UZI diagnostika zamonaviy ultratovush apparatida o'tkaziladi. Tayyorgarlik: qorin bo'shlig'i UZIsi — och qoringa; kichik chanoq a'zolari UZIsi — siydik pufagi to'la holatda. Qabulga yozilish uchun formani to'ldiring yoki qo'ng'iroq qiling: " + PHONES,
    ru: "УЗИ проводится на современном ультразвуковом аппарате. Подготовка: УЗИ брюшной полости — натощак; УЗИ малого таза — с наполненным мочевым пузырём. Записаться можно через форму или по телефону: " + PHONES,
  },
  {
    id: "physio",
    keys: ["fizio", "физио", "elektroforez", "электрофорез", "uvch", "увч", "darsonval", "дарсонвал", "parafin", "парафин", "galvan", "гальван"],
    uz: "Fizioterapiya bo'limida:\n• Elektr toki bilan davolash (galvanizatsiya, dori moddalari bilan elektroforez)\n• Yuqori kuchlanishli tok bilan davolash (UVCH, darsonvalizatsiya)\n• Ingalyatsiya\n• Issiqlik bilan davolash (parafin)\n• Massaj\nKurs odatda 5–10 seans, aniq sonini shifokor belgilaydi.",
    ru: "В отделении физиотерапии:\n• Электролечение (гальванизация, лекарственный электрофорез)\n• Высокочастотная терапия (УВЧ, дарсонвализация)\n• Ингаляции\n• Теплолечение (парафин)\n• Массаж\nКурс обычно 5–10 сеансов, точное число назначает врач.",
  },
  {
    id: "massage",
    keys: ["massaj", "массаж"],
    uz: "Klinikamizda davolovchi va tiklovchi massaj muolajalari malakali mutaxassislar tomonidan bajariladi. Kurs va seanslar sonini shifokor tavsiya qiladi.",
    ru: "В клинике проводится лечебный и восстановительный массаж квалифицированными специалистами. Курс и число сеансов рекомендует врач.",
  },
  {
    id: "inhalation",
    keys: ["ingalya", "ингаля", "nafas", "дыхан", "yo'tal", "кашел"],
    uz: "Ingalyatsion terapiya nafas yo'llari kasalliklarida (yo'tal, bronxit va h.k.) qo'llaniladi. Muolajani shifokor ko'rigidan so'ng tayinlaymiz.",
    ru: "Ингаляционная терапия применяется при заболеваниях дыхательных путей (кашель, бронхит и др.). Процедуру назначаем после осмотра врача.",
  },
  {
    id: "hours",
    keys: ["ish vaqt", "soat nech", "qachon ishla", "ochiq", "dam olish", "время работ", "часы", "график", "выходн", "открыт"],
    uz: "Ish vaqtimiz: Dushanba–Shanba, 08:00 dan 17:00 gacha. Yakshanba — dam olish kuni. Tahlil topshirish uchun ertalabki soatlar eng qulay.",
    ru: "Мы работаем: понедельник–суббота, с 08:00 до 17:00. Воскресенье — выходной. Анализы удобнее всего сдавать утром.",
  },
  {
    id: "booking",
    keys: ["yozil", "qabul", "navbat", "ariza", "zapis", "запис", "приём", "прием", "очеред", "заявк"],
    uz: "Qabulga yozilishning 3 usuli:\n1) Saytdagi «Qabulga yozilish» formasini to'ldiring — operator siz bilan bog'lanadi\n2) Qo'ng'iroq qiling: " + PHONES + "\n3) Shu chatda ism va telefon raqamingizni qoldiring.\nOldindan yozilsangiz, navbatsiz qabul qilinasiz.",
    ru: "Записаться можно тремя способами:\n1) Заполните форму «Записаться на приём» — оператор свяжется с вами\n2) Позвоните: " + PHONES + "\n3) Оставьте имя и телефон прямо в этом чате.\nПо предварительной записи — приём без очереди.",
  },
  {
    id: "price",
    keys: ["narx", "nech pul", "qancha", "to'lov", "summa", "цен", "стоим", "сколько стоит", "оплат", "прайс"],
    uz: "Narxlar xizmat va tahlil turiga qarab farq qiladi. Aniq narxlarni operatorlarimiz aytib beradi: " + PHONES + ". Yoki formani to'ldiring — o'zimiz qo'ng'iroq qilamiz.",
    ru: "Цены зависят от вида услуги и анализа. Точную стоимость подскажут наши операторы: " + PHONES + ". Или оставьте заявку — мы перезвоним.",
  },
  {
    id: "results",
    keys: ["natija", "qachon tayyor", "результат", "когда готов"],
    uz: "Ko'pchilik umumiy va biokimyoviy tahlillar natijasi shu kunning o'zida tayyor bo'ladi. Ayrim maxsus tahlillar (masalan, TORCH, gepatitlar) biroz ko'proq vaqt olishi mumkin — aniq muddatni laborant aytadi.",
    ru: "Большинство общих и биохимических анализов готовы в тот же день. Некоторые специальные анализы (например, TORCH, гепатиты) могут занять больше времени — точный срок подскажет лаборант.",
  },
  {
    id: "contact",
    keys: ["telefon", "raqam", "aloqa", "manzil", "qayer", "телефон", "номер", "контакт", "адрес", "где наход"],
    uz: "Bog'lanish uchun telefonlar: " + PHONES + ". Instagram, Telegram va Facebook sahifalarimiz ham bor. Manzil va mo'ljalni operatorlarimiz telefon orqali aniq tushuntirib berishadi.",
    ru: "Телефоны: " + PHONES + ". Также мы есть в Instagram, Telegram и Facebook. Адрес и ориентир подробно подскажут операторы по телефону.",
  },
  {
    id: "doctor",
    keys: ["shifokor", "doktor", "vrach", "terapevt", "врач", "доктор", "терапевт", "консульт"],
    uz: "Klinikamizda tajribali shifokorlar qabul qiladi: ko'rik, konsultatsiya, tahlil natijalarini sharhlash va davolash rejasi. Qabulga yozilish uchun formani to'ldiring yoki " + PHONES + " raqamiga qo'ng'iroq qiling.",
    ru: "В клинике принимают опытные врачи: осмотр, консультация, расшифровка анализов и план лечения. Запишитесь через форму или по телефону " + PHONES + ".",
  },
  {
    id: "thanks",
    keys: ["rahmat", "raxmat", "спасибо", "благодар"],
    uz: "Arzimaydi! Sog'lig'ingiz biz uchun muhim. Yana savollar bo'lsa, bemalol yozing 😊",
    ru: "Пожалуйста! Ваше здоровье важно для нас. Если будут вопросы — пишите 😊",
  },
];

const FALLBACK = {
  uz: "Bu savol bo'yicha aniq ma'lumotni operatorlarimiz beradi: " + PHONES + ". Shuningdek, xizmatlar, tahlillar, tayyorgarlik, ish vaqti yoki qabulga yozilish haqida so'rashingiz mumkin.",
  ru: "Точную информацию по этому вопросу подскажут наши операторы: " + PHONES + ". Также можете спросить об услугах, анализах, подготовке, времени работы или записи.",
};

const EMERGENCY = {
  uz: "⚠️ Agar holat og'ir bo'lsa (kuchli ko'krak og'rig'i, nafas qisishi, hushdan ketish, kuchli qon ketish) — darhol 103 tez yordam xizmatiga qo'ng'iroq qiling!",
  ru: "⚠️ Если состояние тяжёлое (сильная боль в груди, одышка, потеря сознания, сильное кровотечение) — немедленно звоните в скорую помощь 103!",
};

export function detectLang(text: string, fallback: Lang): Lang {
  if (/[а-яё]/i.test(text)) return "ru";
  if (/[a-z]/i.test(text)) return "uz";
  return fallback;
}

export function localAnswer(question: string, lang: Lang): string {
  const q = question.toLowerCase().replace(/[ʻʼ`’]/g, "'");
  const l = detectLang(q, lang);
  if (/(103|tez yordam|скорая|ko'krak og'ri|боль в груди|hushdan|сознани)/.test(q)) return EMERGENCY[l];
  // Telefon raqam yuborilgan bo'lsa — qabulga yozish deb tushunamiz
  if (/(\+?998)?[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/.test(q)) {
    return l === "ru"
      ? "Спасибо! Ваш номер получен — оператор свяжется с вами в ближайшее время для записи. 📞"
      : "Rahmat! Raqamingiz qabul qilindi — operatorimiz tez orada qabulga yozish uchun siz bilan bog'lanadi. 📞";
  }
  let best: KbItem | null = null;
  let bestScore = 0;
  for (const item of KB) {
    let s = 0;
    for (const k of item.keys) if (q.includes(k)) s += k.length > 4 ? 2 : 1;
    if (s > bestScore) {
      bestScore = s;
      best = item;
    }
  }
  return best ? best[l] : FALLBACK[l];
}

export function kbAsText(): string {
  return KB.filter((k) => !["greet", "thanks"].includes(k.id))
    .map((k) => `## ${k.id}\nUZ: ${k.uz}\nRU: ${k.ru}`)
    .join("\n\n");
}
