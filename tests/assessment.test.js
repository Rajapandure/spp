import test from "node:test";
import assert from "node:assert/strict";
import { buildMockPaper, normalizeAns } from "../src/assessment/examEngine.js";
test("normalizeAns trims, lowercases and collapses whitespace",()=>assert.equal(normalizeAns("  HELLO   World "),"hello world"));
test("chapter test filters by subject and chapter and uses available questions",()=>{
 const pool=[{id:"a",subjectId:"maths",chapterId:"ch-1"},{id:"b",subjectId:"maths",chapterId:"ch-1"},{id:"c",subjectId:"english",chapterId:"ch-1"},{id:"d",subjectId:"maths",chapterId:"ch-2"}];
 const paper=buildMockPaper(pool,{subjectId:"maths",chapterId:"ch-1",templateId:"chapter_test"});
 assert.equal(paper.actualCount,2); assert.ok(paper.questions.every(q=>q.subjectId==="maths"&&q.chapterId==="ch-1"));
});
test("20-question mock paper is capped and has no duplicate IDs",()=>{
 const pool=Array.from({length:25},(_,i)=>({id:String(i)})); const paper=buildMockPaper(pool,{templateId:"mock_20"});
 assert.equal(paper.actualCount,20); assert.equal(new Set(paper.questions.map(q=>q.id)).size,20);
});
