import test from "node:test";
import assert from "node:assert/strict";
import { buildMathsChapterContent } from "../src/curriculum/full_syllabus_generator.js";

test("Class 10 Coordinate Geometry receives only coordinate-geometry questions", () => {
  for (const medium of ["EN", "HI"]) {
    const chapter = buildMathsChapterContent("10", medium, "7. Coordinate Geometry");
    assert.ok(chapter.concepts.some((c) => /Distance Formula/.test(c.term)));
    assert.ok(chapter.concepts.some((c) => /Section Formula/.test(c.term)));
    assert.ok(chapter.questions.length >= 8);
    for (const q of chapter.questions) {
      assert.match(q.q, /coordinate|distance|midpoint|point|area|origin|बिंदु|दूरी|मध्यबिंदु|क्षेत्रफल|अक्ष/);
      assert.doesNotMatch(q.q, /HCF|LCM|factorisation|prime factor|महत्तम समापवर्तक|लघुत्तम समापवर्त्य/i);
    }
  }
});

test("Class 9 Coordinate Geometry stays on the Cartesian plane and quadrants", () => {
  const chapter = buildMathsChapterContent("9", "EN", "3. Coordinate Geometry");
  assert.ok(chapter.questions.some((q) => /Quadrant/.test(q.q)));
  assert.ok(chapter.questions.some((q) => /origin/.test(q.q)));
  assert.ok(chapter.questions.every((q) => !/HCF|LCM|trigonometry|probability/i.test(q.q)));
});

test("HCF and LCM questions are scoped to Real Numbers, not Coordinate Geometry", () => {
  const realNumbers = buildMathsChapterContent("10", "EN", "1. Real Numbers");
  const coordinates = buildMathsChapterContent("10", "EN", "7. Coordinate Geometry");
  assert.ok(realNumbers.questions.some((q) => /HCF|LCM/.test(q.q)));
  assert.ok(coordinates.questions.every((q) => !/HCF|LCM/.test(q.q)));
});

test("Unsupported Maths chapter titles do not receive generic cross-topic questions", () => {
  const chapter = buildMathsChapterContent("8", "EN", "A topic without a mapped question bank");
  assert.equal(chapter.questions.length, 0);
  assert.equal(chapter.exercises.length, 0);
});
