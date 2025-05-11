document.addEventListener("DOMContentLoaded", function () {
  // extragem clubul din URL (query string)
  const urlParams = new URLSearchParams(window.location.search);
  const club = urlParams.get("club");

  const tbody = document.querySelector("tbody");
  const totalSumaElement = document.getElementById("total-suma");
  let total = 0;

   fetch(`https://sitedbsportdatamicro.onrender.com/api/plati/echipe?club=${encodeURIComponent(club)}`)
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
          <td>${plata.suma} RON</td>
          <td>${plata.categorii}</td>
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
