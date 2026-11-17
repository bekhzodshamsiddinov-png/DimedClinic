import { generateText } from "ai";
import { kbAsText, localAnswer, detectLang } from "../src/shared/kb.js";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM = `Sen "DiMed Clinic" xususiy tibbiy klinikasining AI operatorisan. Shior: "salomatlikning yangi sifati".
Vazifang: saytga kirgan bemorlarning yozma savollariga qisqa, xushmuomala, aniq javob berish va ularni qabulga yozilishga yo'naltirish.

QOIDALAR:
- Foydalanuvchi qaysi tilda yozsa (o'zbek lotin yoki rus), o'sha tilda javob ber.
- Faqat quyidagi BILIM BAZASIdagi klinika ma'lumotlariga tayan. Bazada yo'q narsani (narx, aniq manzil, shifokor ismi, aksiya) o'ylab topma — operator telefonlarini taklif qil: (55) 25 222 52, (97) 376 75 77.
- Umumiy tibbiy savollarga (tahlilga tayyorgarlik, simptom nimani bildirishi mumkin) qisqa umumiy ma'lumot berishing mumkin, lekin tashxis qo'yma, dori va dozalar tayinlama — shifokor ko'rigiga yoz deb tavsiya qil.
- Og'ir holat belgilari (kuchli ko'krak og'rig'i, nafas qisishi, hushdan ketish, kuchli qon ketish, insult belgilari) bo'lsa — darhol 103 ga qo'ng'iroq qilishni ayt.
- Bemor qabulga yozilmoqchi bo'lsa: saytdagi "Qabulga yozilish" formasini to'ldirishni yoki ism va telefon raqamini shu chatga yozishni so'ra. Raqam yozsa — "operator tez orada bog'lanadi" deb tasdiqla.
- Javoblar 1–6 qisqa gap yoki qisqa ro'yxat bo'lsin. Markdown sarlavhalar ishlatma, oddiy matn va "•" belgili ro'yxat ishlat.
- Klinika mavzusidan tashqari savollarga muloyimlik bilan klinika xizmatlari haqida yordam bera olishingni ayt.

BILIM BAZASI:
${kbAsText()}`;

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const lang = body.lang === "ru" ? "ru" : "uz";
  const messages: Msg[] = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m: any) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return res.status(400).json({ error: "No question" });

  // Telefon raqami bo'lsa — lead sifatida Telegramga ham yuboramiz (sozlangan bo'lsa)
  if (/\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/.test(last.content)) {
    notifyTelegram(`💬 AI chat orqali murojaat:\n${last.content}`).catch(() => {});
  }

  try {
    const { text } = await generateText({
      model: process.env.AI_MODEL || "openai/gpt-4.1-mini",
      system: SYSTEM,
      messages,
      maxOutputTokens: 450,
      temperature: 0.3,
    });
    if (text?.trim()) return res.status(200).json({ reply: text.trim(), source: "ai" });
  } catch (e: any) {
    console.error("AI gateway error:", e?.message || e);
  }
  return res.status(200).json({ reply: localAnswer(last.content, detectLang(last.content, lang)), source: "kb" });
}

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text }),
  });
}
