import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "..");
const prdPath = path.join(repoRoot, "docs/PRD.md");
const researchPath = path.join(repoRoot, "docs/research.md");

test("docs/PRD.md tracks open questions with explicit owners and decision targets", () => {
  const prd = fs.readFileSync(prdPath, "utf-8");

  // Verify open questions table exists
  assert.match(prd, /## Open questions and decision tracking/i);

  // Check columns: Question, Owner, Decision Target / Date
  assert.match(prd, /\|\s*Question\s*\|\s*Owner\s*\|\s*Decision Target\s*\/\s*Date/i);

  // Verify critical open questions are assigned to Member A or Member B
  assert.match(prd, /Member B.*?S1-05/);
  assert.match(prd, /Member A.*?S1-02/);
  assert.match(prd, /Member B.*?S2-02/);
  assert.match(prd, /Member A.*?S1-04/);
});

test("docs/research.md labels research claims as formal hypotheses", () => {
  const research = fs.readFileSync(researchPath, "utf-8");

  // Verify hypotheses section exists
  assert.match(research, /## Research questions and formal hypotheses/i);

  // Verify explicit H1-H4 hypotheses
  assert.match(research, /Hypothesis 1 \(H1/i);
  assert.match(research, /Hypothesis 2 \(H2/i);
  assert.match(research, /Hypothesis 3 \(H3/i);
  assert.match(research, /Hypothesis 4 \(H4/i);

  // Verify policy statement: working hypotheses until experimental evidence
  assert.match(research, /working hypotheses/i);
  assert.match(research, /No claim of novelty or superiority is accepted without empirical evidence/i);
});

test("docs/research.md includes a literature matrix and ongoing review template", () => {
  const research = fs.readFileSync(researchPath, "utf-8");

  // Verify literature review matrix table exists with required dimensions
  assert.match(research, /### Literature review matrix/i);
  assert.match(
    research,
    /\|\s*Method\s*\|\s*Assumptions\s*\|\s*Metrics\s*\|\s*Limits\s*\|\s*Overlap/i
  );

  // Verify candidate works are audited
  assert.match(research, /Cost-based Optimization of Multistore Query Plans/i);
  assert.match(research, /CHASE/i);
  assert.match(research, /SymRAG/i);
  assert.match(research, /EA-GraphRAG/i);
  assert.match(research, /DYNAMICANN/i);
  assert.match(research, /FreshCache/i);

  // Verify ongoing template exists
  assert.match(research, /### Literature matrix template for ongoing review/i);
});
