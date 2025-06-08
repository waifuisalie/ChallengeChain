import { vi, expect, test } from "vitest";

// NOTE: This test is a simple example to demonstrate mocking functionality.


// Mock the module before importing
vi.mock("../../lib/queryClient", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "../../lib/queryClient";

test("mock works", () => {
  apiRequest("GET", "/test-url");
  expect(apiRequest).toHaveBeenCalled();
});