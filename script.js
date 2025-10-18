document.addEventListener("DOMContentLoaded", () => {
  const typeSelector = document.getElementById("type");
  const sportivSection = document.getElementById("sportivFields");
  const echipaSection = document.getElementById("echipaFields");
  const clubInput = document.getElementById("club");
  const form = document.getElementById("karateForm");
  const popupModal = document.getElementById("popupModal");
  const popupText = document.getElementById("popupText");
  const closeBtn = document.querySelector(".close-btn");
  const genderSportiv = document.getElementById("genderSportiv");
  const genderEchipa = document.getElementById("genderEchipa");
  
  const showPopup = (message) => {
    popupText.textContent = message;
    popupModal.classList.remove("hidden");
  };

  closeBtn.addEventListener("click", () => {
    popupModal.classList.add("hidden");
  });
  window.addEventListener("click", (event) => {
    if (event.target === popupModal) {
      popupModal.classList.add("hidden");
    }
  });

  const clearSection = (section) => {
    section.querySelectorAll('input:not([type="checkbox"])').forEach(input => {
      if (input !== clubInput) input.value = '';
    });
    section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    section.querySelectorAll('select:not([id*="kyu"]):not([name*="kyu"])')
           .forEach(select => select.selectedIndex = 0);
  };

  const switchSections = (type) => {
    const isSportiv = type === "sportiv";
    isSportiv ? clearSection(echipaSection) : clearSection(sportivSection);
    sportivSection.classList.toggle("hidden", !isSportiv);
    echipaSection.classList.toggle("hidden", isSportiv);
    updateRequiredFields(isSportiv);
  };

  const updateRequiredFields = (isSportiv) => {
    sportivSection.querySelectorAll("input:not([type='checkbox']), select")
                  .forEach(f => f.required = isSportiv);
    echipaSection.querySelectorAll("input:not([type='checkbox']), select")
                 .forEach(f => f.required = !isSportiv);
  };

  // Inițializare club din URL
  const urlParams = new URLSearchParams(window.location.search);
  const clubName = urlParams.get("club");
  if (clubName) clubInput.value = clubName;

  // Init
  switchSections(typeSelector.value);
  typeSelector.addEventListener("change", e => switchSections(e.target.value));

  const validateForm = (data) => {
    if (!data.club) return "Numele clubului este obligatoriu!";
    if (!data.probe.length) return "Selectați cel puțin o probă!";
    if (data.tip === "sportiv") {
      if (!data.nume || !data.varsta || !data.kg || !data.kyu || !data.gen) {
        return "Completați toate datele sportivului!";
      }
    } else {
      if (!data.gen) return "Selectați genul echipei!";
      for (let i = 1; i <= 3; i++) {
        const nm = document.querySelector(`input[name="teamMember${i}"]`).value.trim();
        const vr = document.querySelector(`input[name="age${i}"]`).value.trim();
        const kg = document.querySelector(`input[name="kg${i}"]`).value.trim();
        const ky = document.querySelector(`select[name="kyu${i}"]`).value;
        if (!nm || !vr || !kg || !ky) {
          return `Completați toate datele pentru sportivul ${i}!`;
        }
      }
    }
    return null;
  };

  form.addEventListener("submit", async (e) => {
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    e.preventDefault();

    const type = typeSelector.value;
    const probe = Array.from(document.querySelectorAll('input[name="proba"]:checked'))
                       .map(el => el.value);
    const data = { tip: type, club: clubInput.value, probe };

    if (type === "sportiv") {
      data.nume = document.getElementById("name").value.trim();
      data.varsta = document.getElementById("age").value.trim();
      data.kg = document.getElementById("kg").value.trim();
      data.kyu = document.getElementById("kyu").value;
      data.gen = genderSportiv.value;
    } else {
      data.gen = genderEchipa.value;
      data.membri = Array.from({ length: 3 }, (_, i) => ({
        nume: document.querySelector(`input[name="teamMember${i+1}"]`).value.trim(),
        varsta: document.querySelector(`input[name="age${i+1}"]`).value.trim(),
        kg:    document.querySelector(`input[name="kg${i+1}"]`).value.trim(),
        kyu:   document.querySelector(`select[name="kyu${i+1}"]`).value,
        gen:  genderEchipa.value
      }));
    }

    const err = validateForm(data);
    if (err) {
      showPopup(err);
      return;
    }

    try {
      let res;
      if (type === "sportiv") {
       //res = await fetch('https://sitedbsportdatamicro.onrender.com/api/sportivi/adauga', {
        res = await fetch('http://localhost:8080/api/sportivi/adauga', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    else{
        res = await fetch('http://localhost:8080/api/echipe/adauga', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
      if (!res.ok) {
        throw new Error("Server în mentenanță");
      }
      const result = await res.json();
      let message = `Sportivul ${result.nume} a fost inscris la: ${result.introduse.join(', ') || 'nimic'}.`;
      if (result.nereusite.length) {
        message += `\nNu a fost inscris la: ${result.nereusite.join(', ')}.`;
      }

showPopup(message);

      form.reset();
      switchSections(typeSelector.value); 
    } catch (error) {
      showPopup("Server în mentenanță");
    }
    finally{
      submitBtn.disabled = false;
    }
  });
});

const query = window.location.search;

document.getElementById("plati-sportivi-btn").href = "plati_sportivi.html" + query;
document.getElementById("plati-echipe-btn").href = "plati_echipe.html" + query;