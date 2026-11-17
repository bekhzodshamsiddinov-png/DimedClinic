const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/[<>]/g, "").trim().slice(0, max) : "");

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot

  const name = clean(b.name, 80);
  const phone = clean(b.phone, 30);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || digits.length !== 12 || !digits.startsWith("998")) {
    return res.status(400).json({ error: "Invalid name or phone" });
  }
  const lead = {
    name,
    phone,
    service: clean(b.service, 80) || "—",
    date: clean(b.date, 20) || "—",
    note: clean(b.note, 600) || "—",
    lang: b.lang === "ru" ? "ru" : "uz",
    createdAt: new Date().toISOString(),
  };

  // Har doim Vercel loglariga yoziladi (Vercel → Project → Logs)
  console.log("NEW_APPOINTMENT", JSON.stringify(lead));

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (token && chat) {
    const text =
      `🩺 Yangi ariza — DiMed Clinic\n\n` +
      `👤 Ism: ${lead.name}\n📞 Telefon: ${lead.phone}\n🏥 Xizmat: ${lead.service}\n` +
      `📅 Sana: ${lead.date}\n💬 Izoh: ${lead.note}\n🌐 Til: ${lead.lang.toUpperCase()}\n🕒 ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text }),
      });
      if (!r.ok) console.error("Telegram error", r.status, await r.text());
    } catch (e) {
      console.error("Telegram send failed", e);
    }
  }
  return res.status(200).json({ ok: true });
}
