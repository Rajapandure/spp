import test from "node:test";
import assert from "node:assert/strict";
import { attachOfficialMathsSources } from "../src/curriculum/curriculumService.js";

test("NCERT and CBSE Maths books link to official NCERT and ePathshala sources", () => {
  for (const board of ["NCERT", "CBSE"]) {
    const book = attachOfficialMathsSources({ subjectId: "maths", board, classNum: "10" });
    assert.equal(book.sourceUrl, "https://ncert.nic.in/textbook.php");
    assert.equal(book.supplementarySourceUrl, "https://epathshala.nic.in/topics.php");
    assert.equal(book.contentPolicy, "LINK_TO_OFFICIAL_SOURCE");
  }
});

test("MP Board Maths books link to MPTBC, DIKSHA and MPBSE syllabus", () => {
  const book = attachOfficialMathsSources({ subjectId: "maths", board: "MP_BOARD", classNum: "10" });
  assert.equal(book.sourceUrl, "https://mptbc.mp.gov.in/");
  assert.equal(book.supplementarySourceUrl, "https://diksha.gov.in/");
  assert.equal(book.syllabusUrl, "https://mpbse.nic.in/academics.html");
});

test("Non-Maths books are not assigned Maths source metadata", () => {
  const book = attachOfficialMathsSources({ subjectId: "science", board: "NCERT" });
  assert.equal(book.sourceUrl, undefined);
});
