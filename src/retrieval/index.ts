export {
  validateCandidate,
  deduplicateCandidates,
  type ValidatedCandidate,
  type DeduplicatedCandidate,
  type DeduplicationOptions,
  type ScoreCombinationStrategy,
} from "./candidate.js";

export {
  executeRetrievalAdapter,
  type AdapterExecutionResult,
} from "./adapter.js";
