document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const club = urlParams.get("club");
  
    const tbody = document.querySelector("tbody");
    const totalSumaElement = document.getElementById("total-suma");
    let total = 0;
  
    fetch(`http://localhost:8081/api/plati/sportivi?club=${encodeURIComponent(club)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Eroare la preluarea datelor");
        }
        return response.json();
      })
      .then(data => {
        data.forEach((plata, index) => {
          const tr = document.createElement("tr");
  
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${plata.numeSportiv}</td>
            <td>${plata.categorii || "-"}</td> <!-- ✅ Afișarea categoriilor -->
            <td>${plata.suma} RON</td>
          `;
  
          tbody.appendChild(tr);
          total += plata.suma;
        });
  
        totalSumaElement.textContent = `${total} RON`;
      })
      .catch(error => {
        console.error("Eroare la incarcare:", error);
      });
});


document.getElementById("exportExcel").addEventListener("click", function () {

  // Preluăm numele clubului din link
  const club = new URLSearchParams(window.location.search).get("club") || "NEPRECIZAT";
  const sheetName = `PLATI ${club.toUpperCase()}`;
  const fileName = `${sheetName}.xlsx`;

  const table = document.querySelector("table");
  const ws = XLSX.utils.table_to_sheet(table);

  // Activăm filtre pe header
  ws['!autofilter'] = { ref: ws['!ref'] };

  const range = XLSX.utils.decode_range(ws['!ref']);

  // 🔹 AUTO SIZE PE COLOANE
  const colWidths = [];
  for (let C = range.s.c; C <= range.e.c; C++) {
    let maxWidth = 10;

    for (let R = range.s.r; R <= range.e.r; R++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddress];

      if (cell && cell.v) {
        const value = cell.v.toString();
        const charWidth = value.length * 1.1; // coeficient pentru autosize
        if (charWidth > maxWidth) maxWidth = charWidth;
      }
    }
    colWidths.push({ wch: maxWidth + 2 }); // +2 pentru padding
  }
  ws['!cols'] = colWidths;

  // 🔹 STYLING
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {

      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddress];
      if (!cell) continue;

      if (R === 0) {
        // Header
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { patternType: "solid", fgColor: { rgb: "4A5568" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      } else {
        // Rânduri zebra
        const isEven = R % 2 === 0;
        cell.s = {
          font: { color: { rgb: "FFFFFF" } },
          fill: {
            patternType: "solid",
            fgColor: { rgb: isEven ? "1A365D" : "2C5282" }
          },
          alignment: { horizontal: "center" }
        };
      }
    }
  }

  // Creăm workbook și adăugăm sheet-ul cu nume dinamic
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Salvăm fișierul
  XLSX.writeFile(wb, fileName);
});
