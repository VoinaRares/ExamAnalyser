const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://static.bacalaureat.edu.ro/2025/rapoarte/rezultate/alfabetic/page_';
  const lastPage = 10796;

  header = [
    "Nr.crt.",
    "Codul candidatului",
    "Pozitie ierarhie judet",
    "Pozitie ierarhie nationala",
    "Unitatea de învăţământ",
    "Judeţ",
    "Promotie anterioară",
    "Forma învăţământ",
    "Specializare",
    "Romana Competenţe",
    "Romana Scris",
    "Romana Contestaţie",
    "Romana Nota finală",
    "Limba materna",
    "Limba modernă studiată",
    "Competente limba straina",
    "Disciplina obligatorie",
    "Disciplina alegere",
    "Competente digitale",
    "Media",
    "Rezultat final",
    "Materna competente",
    "Materna scris",
    "Materna contestatie",
    "Materna finala",
    "nota disciplina obligatorie",
    "contestatie disciplina obligatorie",
    "Nota finală disciplina obligatorie",
    "nota alegere",
    "contestatie alegere",
    "Nota finala alegere"
  ];

  const allData = [header];

  for (let i = 1; i <= lastPage; i++) {
    const url = `${baseUrl}${i}.html`;
    if (i % 100 == 0)
      console.log(`Processing page ${i} / ${lastPage}`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('table.mainTable', { timeout: 10000 });

      const pageData = await page.$$eval('table.mainTable tr', rows => {
        const data = [];
        for (let i = 0; i < rows.length; i += 2) {
          const row1 = rows[i];
          const row2 = rows[i + 1];
          if (!row2) continue;

          const tds1 = Array.from(row1.querySelectorAll('td')).map(td => td.innerText.trim());
          const tds2 = Array.from(row2.querySelectorAll('td')).map(td => td.innerText.trim());

          let combined = tds1.concat(tds2);

          if (combined.length < 31) {
            while (combined.length < 31) combined.push("");
          } else if (combined.length > 31) {
            combined.length = 31;
          }

          data.push({
            row1: tds1,
            row2: tds2,
            combined,
          });
        }
        return data;
      });

      allData.push(...pageData.map(r => r.combined));
    } catch (err) {
      console.warn(`Failed to process page ${i}: ${err.message}`);
    }
  }

  await browser.close();
  fs.writeFileSync('2025.json', JSON.stringify(allData, null, 2), 'utf-8');
  console.log(`✅ Done. Extracted ${allData.length - 1} rows to 2025.json`);
})();
