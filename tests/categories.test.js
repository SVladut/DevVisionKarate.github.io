const { test } = require("node:test");
const assert = require("node:assert/strict");
const { categories, getMatches, getCategory, getCategoryCodes } = require("../categories.js");

const codes = (probe, age, grade) => getMatches(probe, age, grade).map(category => category.code);

test("catalogul conține cele 80 de coduri unice din cele șapte probe", () => {
  assert.equal(categories.length, 80);
  assert.equal(new Set(categories.map(category => category.code)).size, 80);
  const counts = {};
  for (const category of categories) counts[category.probe] = (counts[category.probe] || 0) + 1;
  assert.deepEqual(counts, {
    traseu: 10, joc_tehnic: 10, kata: 25, kata_open: 4,
    "kata echipe": 7, kumite: 21, kumite_open: 3
  });
});

test("vârsta și gradul determină codurile exacte", () => {
  assert.deepEqual(codes("traseu", 5, "10 Kyu"), ["T1"]);
  assert.deepEqual(codes("traseu", 6, "8 Kyu"), ["T4"]);
  assert.deepEqual(codes("joc_tehnic", 12, "7 Kyu"), ["MM10"]);
  assert.deepEqual(codes("kata", 8, "6 Kyu"), ["KAT8"]);
  assert.deepEqual(codes("kata", 13, "4 Kyu"), ["KAT18"]);
  assert.deepEqual(codes("kata", 15, "1 Kyu"), ["KAT19"]);
  assert.deepEqual(codes("kata", 16, "1 Dan"), ["KAT22"]);
  assert.deepEqual(codes("kata", 18, "10 Dan"), ["KAT25"]);
  assert.deepEqual(codes("kumite", 8, "8 Kyu"), ["KU1"]);
  assert.deepEqual(codes("kumite", 15, "2 Dan"), ["KU13"]);
  assert.deepEqual(codes("kumite", 18, "4 Kyu"), ["KU19"]);
  assert.deepEqual(codes("kumite", 60, "10 Dan"), ["KU21"]);
});

test("suprapunerea la 9 ani rămâne explicită", () => {
  assert.deepEqual(codes("traseu", 9, "9 Kyu"), ["T5", "T7"]);
  assert.deepEqual(codes("joc_tehnic", 9, "7 Kyu"), ["MM6", "MM8"]);
  assert.deepEqual(codes("kata", 9, "4 Kyu"), ["KAT8", "KAT12"]);
  assert.deepEqual(codes("kumite", 9, "1 Kyu"), ["KU3", "KU6"]);
  assert.deepEqual(codes("kata echipe", 9), ["KTEAM2", "KTEAM3"]);
});

test("probele open și Kata echipe nu au constrângere de grad", () => {
  for (const grade of ["10 Kyu", "1 Kyu", "1 Dan", "10 Dan"]) {
    assert.deepEqual(codes("kata_open", 11, grade), ["KATOPEN1"]);
    assert.deepEqual(codes("kata_open", 13, grade), ["KATOPEN2"]);
    assert.deepEqual(codes("kata_open", 17, grade), ["KATOPEN3"]);
    assert.deepEqual(codes("kata_open", 18, grade), ["KATOPEN4"]);
    assert.deepEqual(codes("kumite_open", 13, grade), ["KUOPEN1"]);
    assert.deepEqual(codes("kumite_open", 16, grade), ["KUOPEN2"]);
    assert.deepEqual(codes("kumite_open", 18, grade), ["KUOPEN3"]);
    assert.deepEqual(codes("kata echipe", 6, grade), ["KTEAM1"]);
    assert.deepEqual(codes("kata echipe", 18, grade), ["KTEAM7"]);
  }
});

test("categoriile absente din tabel și datele invalide nu produc coduri", () => {
  for (const age of [null, undefined, false, "", " ", -1, 8.5, "abc", Infinity]) {
    assert.deepEqual(codes("kata", age, "8 Kyu"), []);
  }
  for (const grade of ["", "0 Kyu", "11 Kyu", "11 Dan", "8", "invalid"]) {
    assert.deepEqual(codes("kata", 8, grade), []);
  }
  assert.deepEqual(codes("traseu", 13, "9 Kyu"), []);
  assert.deepEqual(codes("joc_tehnic", 10, "6 Kyu"), []);
  assert.deepEqual(codes("kata", 5, "6 Kyu"), []);
  assert.deepEqual(codes("kata", 15, "1 Dan"), []);
  assert.deepEqual(codes("kumite", 12, "1 Dan"), []);
  assert.deepEqual(codes("kumite", 18, "9 Kyu"), []);
  assert.deepEqual(codes("kata_open", 10, "1 Dan"), []);
  assert.deepEqual(codes("kumite_open", 12, "1 Dan"), []);
  assert.deepEqual(codes("kata echipe", 5), []);
});

test("toate categoriile sunt accesibile, inclusiv limitele de grad", () => {
  for (const category of categories) {
    const age = category.maxAge === Infinity ? category.minAge : category.maxAge;
    const grades = category.danOnly ? ["1 Dan", "10 Dan"]
      : category.minKyu === null ? ["10 Kyu", "10 Dan"]
      : [`${category.minKyu} Kyu`, `${category.maxKyu} Kyu`];
    for (const grade of grades) {
      assert.ok(codes(category.probe, age, grade).includes(category.code), `${category.code}: ${age}, ${grade}`);
    }
  }
});

test("repartizarea confirmată la 9 ani folosește grupa 9–10", () => {
  assert.equal(getCategory("traseu", 9, "9 Kyu").code, "T7");
  assert.equal(getCategory("kata", 9, "4 Kyu").code, "KAT12");
  assert.deepEqual(getCategoryCodes({
    tip: "sportiv", varsta: "9", kyu: "7 Kyu", probe: ["traseu", "joc_tehnic", "kata", "kumite"]
  }), ["T8", "MM8", "KAT11", "KU4"]);
});

test("echipele sunt repartizate după cel mai mare membru, indiferent de grade", () => {
  const data = { tip: "echipa", probe: ["kata echipe"], membri: [
    { varsta: "6", kyu: "10 Kyu" }, { varsta: "8", kyu: "1 Dan" }, { varsta: "9", kyu: "3 Kyu" }
  ] };
  assert.deepEqual(getCategoryCodes(data), ["KTEAM3"]);
  assert.deepEqual(getCategoryCodes({ ...data, membri: [...data.membri.slice(0, 2), { varsta: 25 }] }), ["KTEAM7"]);
  assert.throws(() => getCategoryCodes({ ...data, membri: [{ varsta: 6 }] }));
  assert.throws(() => getCategoryCodes({ ...data, membri: [{ varsta: "" }, ...data.membri.slice(1)] }));
});

test("payloadul conține numai coduri eligibile, fără duplicate", () => {
  const data = { tip: "sportiv", varsta: 18, kyu: "1 Dan", probe: ["kata", "kata_open", "kumite", "kumite_open", "kata"] };
  assert.deepEqual(getCategoryCodes(data), ["KAT25", "KATOPEN4", "KU21", "KUOPEN3"]);
  assert.throws(() => getCategoryCodes({ ...data, probe: ["traseu"] }), /nu există categorie/);
  assert.throws(() => getCategoryCodes({ ...data, probe: ["kata echipe"] }), /tipului/);
  assert.throws(() => getCategoryCodes({ ...data, probe: ["necunoscut"] }), /tipului/);
  assert.deepEqual(getCategoryCodes({ ...data, probe: [] }), []);
});
