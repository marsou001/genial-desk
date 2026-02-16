export function assertIsError(error: unknown): asserts error is Error {
	if (!(error instanceof Error)) throw new Error("Not an instance of Error");
}