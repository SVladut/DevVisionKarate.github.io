document.addEventListener("DOMContentLoaded", () => {
  const typeSelector = document.getElementById("type");
  const sportivSection = document.getElementById("sportivFields");
  const echipaSection = document.getElementById("echipaFields");
  const enbuSection = document.getElementById("enbuFields");
  const clubInput = document.getElementById("club");
  const form = document.getElementById("karateForm");
  const popupModal = document.getElementById("popupModal");
  const popupText = document.getElementById("popupText");
  const closeBtn = document.querySelector(".close-btn");
  const genderSportiv = document.getElementById("genderSportiv");
  const genderEchipa = document.getElementById("genderEchipa");
  const genderEnbu = document.getElementById("genderEnbu");

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
    if (!section) return;
    section.querySelectorAll('input:not([type="checkbox"])').forEach(input => {
      if (input !== clubInput) input.value = '';
    });
    section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    section.querySelectorAll('select:not([id*="kyu"]):not([name*="kyu"])')
           .forEach(select => select.selectedIndex = 0);
    // în plus, resetează kyu selects
    section.querySelectorAll('select[name*="kyu"], select[id*="kyu"]').forEach(s => s.selectedIndex = 0);
  };

  const showOnlySection = (which) => {
    const sections = { sportiv: sportivSection, echipa: echipaSection, enbu: enbuSection };
    Object.keys(sections).forEach(k => {
      const sec = sections[k];
      if (!sec) return;
      if (k === which) {
        sec.classList.remove("hidden");
        setRequiredForSection(sec, true);
      } else {
        sec.classList.add("hidden");
        setRequiredForSection(sec, false);
        clearSection(sec);
      }
    });
  };

  const setRequiredForSection = (section, required) => {
    if (!section) return;
    // toate inputurile/selecturile din sectiune (except club)
    const controls = section.querySelectorAll('input, select, textarea');
    controls.forEach(ctrl => {
      if (ctrl === clubInput) return;
      if (required) ctrl.setAttribute('required', 'required');
      else ctrl.removeAttribute('required');
    });
  };

  // Inițializare club din URL
  const urlParams = new URLSearchParams(window.location.search);
  const clubName = urlParams.get("club");
  if (clubName) clubInput.value = clubName;

  // Init: arată secțiunea curentă
  showOnlySection(typeSelector.value);

  typeSelector.addEventListener("change", (e) => {
    showOnlySection(e.target.value);
  });

  const validateForm = (data) => {
    if (!data.club) return "Numele clubului este obligatoriu!";
    if (!data.probe || !data.probe.length) return "Selectați cel puțin o probă!";
    if (data.tip === "sportiv") {
      if (!data.nume || !data.varsta || !data.kg || !data.kyu || !data.gen) {
        return "Completați toate datele sportivului!";
      }
    } else if (data.tip === "echipa") {
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
    } else if (data.tip === "enbu") {
      if (!data.gen) return "Selectați genul ENBU!";
      for (let i = 1; i <= 2; i++) {
        const nm = document.querySelector(`input[name="enbuMember${i}"]`).value.trim();
        const vr = document.querySelector(`input[name="enbuAge${i}"]`).value.trim();
        const kg = document.querySelector(`input[name="enbuKg${i}"]`).value.trim();
        const ky = document.querySelector(`select[name="enbuKyu${i}"]`).value;
        if (!nm || !vr || !kg || !ky) {
          return `Completați toate datele pentru sportivul ENBU ${i}!`;
        }
      }
    }
    return null;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    const type = typeSelector.value;
    const probe = Array.from(document.querySelectorAll('input[name="proba"]:checked'))
                       .map(el => el.value);
    const data = { tip: type, club: clubInput.value.trim(), probe };

    if (type === "sportiv") {
      data.nume = document.getElementById("name").value.trim();
      data.varsta = document.getElementById("age").value.trim();
      data.kg = document.getElementById("kg").value.trim();
      data.kyu = document.getElementById("kyu").value;
      data.gen = genderSportiv ? genderSportiv.value : '';
    } else if (type === "echipa") {
      data.gen = genderEchipa ? genderEchipa.value : '';
      data.membri = Array.from({ length: 3 }, (_, i) => ({
        nume: document.querySelector(`input[name="teamMember${i+1}"]`).value.trim(),
        varsta: document.querySelector(`input[name="age${i+1}"]`).value.trim(),
        kg:    document.querySelector(`input[name="kg${i+1}"]`).value.trim(),
        kyu:   document.querySelector(`select[name="kyu${i+1}"]`).value,
        gen:   genderEchipa ? genderEchipa.value : ''
      }));
    } else if (type === "enbu") {
      data.gen = genderEnbu ? genderEnbu.value : '';
      data.membri = Array.from({ length: 2 }, (_, i) => ({
        nume: document.querySelector(`input[name="enbuMember${i+1}"]`).value.trim(),
        varsta: document.querySelector(`input[name="enbuAge${i+1}"]`).value.trim(),
        kg:    document.querySelector(`input[name="enbuKg${i+1}"]`).value.trim(),
        kyu:   document.querySelector(`select[name="enbuKyu${i+1}"]`).value,
        gen:   genderEnbu ? genderEnbu.value : ''
      }));
    }

    const err = validateForm(data);
    if (err) {
      showPopup(err);
      submitBtn.disabled = false;
      return;
    }

    try {
      let endpoint = '';
      let body = null;

      if (type === "sportiv") {
        endpoint ='https://sitedbsportdatamicro.onrender.com/api/sportivi/adauga';
        //  endpoint = 'http://localhost:8081/api/sportivi/adauga';
        body = JSON.stringify(data);
      } else if (type === "echipa") {
        endpoint='https://sitedbsportdatamicro.onrender.com/api/echipe/adauga';
       // endpoint = 'http://localhost:8081/api/echipe/adauga';
        body = JSON.stringify({
          club: data.club,
          probe: data.probe,
          gen: data.gen,
          membri: data.membri
        });
      } else if (type === "enbu") {
        // trimitem formatul care corespunde modelului EchipaENBU din backend
        //endpoint = 'http://localhost:8081/api/enbu/adauga';
        endpoint = 'https://sitedbsportdatamicro.onrender.com/api/enbu/adauga';
        body = JSON.stringify({
          club: data.club,
          probe: data.probe.length ? data.probe : ["enbu"],
          gen: data.gen,
          membri: data.membri
        });
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }

      const result = await res.json();

      // construim mesaj generic, compatibil cu sportiv/echipa/enbu
      let namesText = '';
      if (Array.isArray(result.nume)) {
        namesText = result.nume.join(', ');
      } else if (typeof result.nume === 'string') {
        namesText = result.nume;
      } else if (result.nume && typeof result.nume === 'object') {
        namesText = JSON.stringify(result.nume);
      }

      const introduse = result.introduse && result.introduse.length ? result.introduse.join(', ') : 'nimic';
      const nereusite = result.nereusite && result.nereusite.length ? result.nereusite.join(', ') : null;

      let message = '';
      if (type === 'sportiv') {
        message = `Sportivul ${namesText || data.nume} a fost înscris la: ${introduse}.`;
      } else if (type === 'echipa') {
        message = `Echipa (membri: ${namesText}) a fost înscrisă la: ${introduse}.`;
      } else { // enbu
        message = `ENBU (membri: ${namesText}) a fost înscris la: ${introduse}.`;
      }

      if (nereusite) message += `\nNu a fost înscris la: ${nereusite}.`;

      showPopup(message);

      form.reset();
      showOnlySection(typeSelector.value); // reaplicăm vizibilitatea/required
    } catch (error) {
      console.error(error);
      showPopup("Server în mentenanță sau eroare la trimitere.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  // legare butoane plati cu query-ul curent
  const query = window.location.search;
  const platiSportiviBtn = document.getElementById("plati-sportivi-btn");
  const platiEchipeBtn = document.getElementById("plati-echipe-btn");
  if (platiSportiviBtn) platiSportiviBtn.href = "plati_sportivi.html" + query;
  if (platiEchipeBtn) platiEchipeBtn.href = "plati_echipe.html" + query;
});
