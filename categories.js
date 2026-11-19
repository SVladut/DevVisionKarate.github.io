// Categorii transcrise din Categorii_karate.xlsx. Intervalele suprapuse sunt păstrate.
(function (root) {
  "use strict";

  const probeLabels = Object.freeze({
    traseu: "Traseu tehnic",
    joc_tehnic: "Makiwara",
    kata: "Kata individual",
    kata_open: "Kata open",
    "kata echipe": "Kata echipe",
    kumite: "Kumite individual",
    kumite_open: "Kumite open"
  });

  // [cod, probă, grupă de vârstă, grad], în ordinea din Excel.
  const rows = [
    ["T1", "traseu", "Sub 6 ani", "10–9 KYU"],
    ["T2", "traseu", "Sub 6 ani", "8–7 KYU"],
    ["T3", "traseu", "6–7 ani", "10–9 KYU"],
    ["T4", "traseu", "6–7 ani", "8–7 KYU"],
    ["T5", "traseu", "8–9 ani", "10–9 KYU"],
    ["T6", "traseu", "8–9 ani", "8–7 KYU"],
    ["T7", "traseu", "9–10 ani", "10–9 KYU"],
    ["T8", "traseu", "9–10 ani", "8–7 KYU"],
    ["T9", "traseu", "11–12 ani", "10–9 KYU"],
    ["T10", "traseu", "11–12 ani", "8–7 KYU"],
    ["MM1", "joc_tehnic", "Sub 6 ani", "10–9 KYU"],
    ["MM2", "joc_tehnic", "Sub 6 ani", "8–7 KYU"],
    ["MM3", "joc_tehnic", "6–7 ani", "10–9 KYU"],
    ["MM4", "joc_tehnic", "6–7 ani", "8–7 KYU"],
    ["MM5", "joc_tehnic", "8–9 ani", "10–9 KYU"],
    ["MM6", "joc_tehnic", "8–9 ani", "8–7 KYU"],
    ["MM7", "joc_tehnic", "9–10 ani", "10–9 KYU"],
    ["MM8", "joc_tehnic", "9–10 ani", "8–7 KYU"],
    ["MM9", "joc_tehnic", "11–12 ani", "10–9 KYU"],
    ["MM10", "joc_tehnic", "11–12 ani", "8–7 KYU"],
    ["KAT1", "kata", "Sub 6 ani", "10–9 KYU"],
    ["KAT2", "kata", "Sub 6 ani", "8–7 KYU"],
    ["KAT3", "kata", "6–7 ani", "10–9 KYU"],
    ["KAT4", "kata", "6–7 ani", "8–7 KYU"],
    ["KAT5", "kata", "6–7 ani", "6–4 KYU"],
    ["KAT6", "kata", "8–9 ani", "10–9 KYU"],
    ["KAT7", "kata", "8–9 ani", "8–7 KYU"],
    ["KAT8", "kata", "8–9 ani", "6–4 KYU"],
    ["KAT9", "kata", "8–9 ani", "3–1 KYU"],
    ["KAT10", "kata", "9–10 ani", "10–9 KYU"],
    ["KAT11", "kata", "9–10 ani", "8–7 KYU"],
    ["KAT12", "kata", "9–10 ani", "6–4 KYU"],
    ["KAT13", "kata", "9–10 ani", "3–1 KYU"],
    ["KAT14", "kata", "11–12 ani", "10–9 KYU"],
    ["KAT15", "kata", "11–12 ani", "8–7 KYU"],
    ["KAT16", "kata", "11–12 ani", "6–4 KYU"],
    ["KAT17", "kata", "11–12 ani", "3–1 KYU"],
    ["KAT18", "kata", "13–15 ani", "10–4 KYU"],
    ["KAT19", "kata", "13–15 ani", "3–1 KYU"],
    ["KAT20", "kata", "16–17 ani", "10–4 KYU"],
    ["KAT21", "kata", "16–17 ani", "3–1 KYU"],
    ["KAT22", "kata", "16–17 ani", "DAN"],
    ["KAT23", "kata", "18 ani și peste", "10–4 KYU"],
    ["KAT24", "kata", "18 ani și peste", "3–1 KYU"],
    ["KAT25", "kata", "18 ani și peste", "DAN"],
    ["KATOPEN1", "kata_open", "11–12 ani", "nu exista constrangere de grad"],
    ["KATOPEN2", "kata_open", "13–15 ani", "nu exista constrangere de grad"],
    ["KATOPEN3", "kata_open", "16–17 ani", "nu exista constrangere de grad"],
    ["KATOPEN4", "kata_open", "18 ani și peste", "nu exista constrangere de grad"],
    ["KTEAM1", "kata echipe", "6–7 ani", "nu exista constrangere de grad"],
    ["KTEAM2", "kata echipe", "8–9 ani", "nu exista constrangere de grad"],
    ["KTEAM3", "kata echipe", "9–10 ani", "nu exista constrangere de grad"],
    ["KTEAM4", "kata echipe", "11–12 ani", "nu exista constrangere de grad"],
    ["KTEAM5", "kata echipe", "13–15 ani", "nu exista constrangere de grad"],
    ["KTEAM6", "kata echipe", "16–17 ani", "nu exista constrangere de grad"],
    ["KTEAM7", "kata echipe", "18 ani și peste", "nu exista constrangere de grad"],
    ["KU1", "kumite", "8–9 ani", "8–7 KYU"],
    ["KU2", "kumite", "8–9 ani", "6–4 KYU"],
    ["KU3", "kumite", "8–9 ani", "3–1 KYU"],
    ["KU4", "kumite", "9–10 ani", "8–7 KYU"],
    ["KU5", "kumite", "9–10 ani", "6–4 KYU"],
    ["KU6", "kumite", "9–10 ani", "3–1 KYU"],
    ["KU7", "kumite", "11–12 ani", "8–7 KYU"],
    ["KU8", "kumite", "11–12 ani", "6–4 KYU"],
    ["KU9", "kumite", "11–12 ani", "3–1 KYU"],
    ["KU10", "kumite", "13–15 ani", "8–7 KYU"],
    ["KU11", "kumite", "13–15 ani", "6–4 KYU"],
    ["KU12", "kumite", "13–15 ani", "3–1 KYU"],
    ["KU13", "kumite", "13–15 ani", "DAN"],
    ["KU14", "kumite", "16–17 ani", "8–7 KYU"],
    ["KU15", "kumite", "16–17 ani", "6–4 KYU"],
    ["KU16", "kumite", "16–17 ani", "3–1 KYU"],
    ["KU17", "kumite", "16–17 ani", "DAN"],
    ["KU18", "kumite", "18 ani și peste", "8–7 KYU"],
    ["KU19", "kumite", "18 ani și peste", "6–4 KYU"],
    ["KU20", "kumite", "18 ani și peste", "3–1 KYU"],
    ["KU21", "kumite", "18 ani și peste", "DAN"],
    ["KUOPEN1", "kumite_open", "13–15 ani", "nu exista constrangere de grad"],
    ["KUOPEN2", "kumite_open", "16–17 ani", "nu exista constrangere de grad"],
    ["KUOPEN3", "kumite_open", "18 ani și peste", "nu exista constrangere de grad"]
  ];

  const categories = Object.freeze(rows.map(([code, probe, ageLabel, gradeLabel]) => {
    const ages = ageLabel.match(/\d+/g).map(Number);
    const minAge = ageLabel.startsWith("Sub") ? 0 : ages[0];
    const maxAge = ageLabel.startsWith("Sub") ? ages[0] - 1 : (ages[1] ?? Infinity);
    const grades = gradeLabel.match(/\d+/g)?.map(Number);
    return Object.freeze({
      code, probe, ageLabel, gradeLabel, minAge, maxAge,
      minKyu: grades ? Math.min(...grades) : null,
      maxKyu: grades ? Math.max(...grades) : null,
      danOnly: gradeLabel === "DAN"
    });
  }));

  function parseGrade(value) {
    const match = /^(10|[1-9]) (Kyu|Dan)$/i.exec(String(value));
    return match ? { value: Number(match[1]), type: match[2].toLowerCase() } : null;
  }

  function getMatches(probe, age, grade) {
    if (age == null || typeof age === "boolean" || String(age).trim() === "") return [];
    const numericAge = Number(age);
    if (!Number.isInteger(numericAge) || numericAge < 0) return [];
    const rank = parseGrade(grade);
    return categories.filter(category => {
      if (category.probe !== probe || numericAge < category.minAge || numericAge > category.maxAge) return false;
      if (category.minKyu === null && !category.danOnly) return true;
      if (!rank) return false;
      if (category.danOnly) return rank.type === "dan";
      return rank.type === "kyu" && rank.value >= category.minKyu && rank.value <= category.maxKyu;
    });
  }

  function getCategory(probe, age, grade) {
    // La 9 ani se folosește grupa 9–10, conform regulii confirmate.
    return getMatches(probe, age, grade).sort((a, b) => b.minAge - a.minAge)[0] || null;
  }

  function getCategoryCodes(registration) {
    const { tip, probe } = registration;
    if (!["sportiv", "echipa"].includes(tip) || !Array.isArray(probe)) {
      throw new Error("Tip de înscriere sau probe invalide.");
    }
    let age = registration.varsta;
    if (tip === "echipa") {
      const members = registration.membri;
      if (!Array.isArray(members) || members.length !== 3 || members.some(member =>
        !member || String(member.varsta ?? "").trim() === "" ||
        !Number.isInteger(Number(member.varsta)) || Number(member.varsta) < 0
      )) {
        throw new Error("Completați vârstele valide ale celor trei membri ai echipei.");
      }
      age = Math.max(...members.map(member => Number(member.varsta)));
    }
    return [...new Set(probe)].map(selectedProbe => {
      if (!Object.hasOwn(probeLabels, selectedProbe) ||
          (tip === "echipa") !== (selectedProbe === "kata echipe")) {
        throw new Error("Proba selectată nu corespunde tipului de înscriere.");
      }
      const category = getCategory(selectedProbe, age, registration.kyu);
      if (!category) {
        throw new Error(`${probeLabels[selectedProbe]}: nu există categorie în tabel pentru vârsta și gradul introduse.`);
      }
      return category.code;
    });
  }

  const api = Object.freeze({ categories, probeLabels, getMatches, getCategory, getCategoryCodes });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.KarateCategories = api;
})(globalThis);
