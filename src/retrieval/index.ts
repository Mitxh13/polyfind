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

export {
  cosineSimilarity,
  generateDeterministicEmbedding,
  InMemorySpikeVectorStore,
  FileColumnarSpikeVectorStore,
  runVectorSpike,
  SPIKE_FIXTURE_PRODUCTS,
  type VectorRecord,
  type VectorQuery,
  type VectorMatch,
  type VectorStoreCandidate,
  type SpikeComparisonResult,
} from "./vector-spike.js";
