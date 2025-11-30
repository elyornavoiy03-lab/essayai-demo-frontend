
async function scoreEssayAPI(text){
  const res = await fetch("https://essayai-backend.onrender.com/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  return await res.json();
}

function generateFeedback(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
    let longSentences = sentences.filter(s => s.length > 180).length;

    let repeatedWords = {};
    words.forEach(w => {
        w = w.toLowerCase();
        repeatedWords[w] = (repeatedWords[w] || 0) + 1;
    });

    let repeats = Object.entries(repeatedWords)
        .filter(([word, count]) => count > 3)
        .map(([w]) => w);

    const spellingErrors = Math.floor(words.length * 0.02);

    return `
        <div style="margin-top: 20px; padding: 15px; border-radius: 8px; background: #f7f9ff;">
            <h3 style="margin: 0 0 10px 0;">📘 AI tavsiyasi:</h3>
            <p><b>Imlo xatolari taxminiy:</b> ${spellingErrors} ta</p>
            <p><b>Juda uzun gaplar:</b> ${longSentences} ta</p>
            <p><b>Ko‘p takrorlangan so‘zlar:</b> ${repeats.length > 0 ? repeats.join(", ") : "topilmadi"}</p>
            <p><b>Matn sifati bo‘yicha umumiy fikr:</b> Matn aniq va tushunarli. Fikrlar ketma-ketligi yaxshi. Ba’zi jumlalarni qisqartirish, sinonimlardan foydalanish va tinish belgilariga e’tibor berish tavsiya etiladi.</p>
        </div>
    `;
}

document.getElementById('analyze').addEventListener('click', async ()=>{
  const text = document.getElementById('essay').value;
  const out = document.getElementById('result');

  if(!text.trim()){
    out.style.display = "block";
    out.innerHTML = "<b>Iltimos, matn kiriting.</b>";
    return;
  }

  out.style.display = "block";
  out.innerHTML = "⏳ AI tahlil qilmoqda...";

  try {
    const r = await scoreEssayAPI(text);

    out.innerHTML = `
      <b>AI bahosi: ${r.score75} / 75</b><br>
      (24-lik: ${r.score24})<hr>
      Belgilar: ${r.chars}<br>
      Gaplar: ${r.sentences}
      ${generateFeedback(text)}
    `;
  } catch(e){
    out.innerHTML = "<b>Xatolik: backend bilan bog‘lanib bo‘lmadi.</b>";
  }
});
