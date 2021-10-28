import { testFunction } from "../GeneralUtils";

describe("testFunction", () => {
  it("should return the correct value", () => {
    expect(testFunction("run <npm test> to see the result")).toBe(
      "this is a testfunction that returns: run <npm test> to see the result"
    );
  });
});
