import * as Sentry from "@sentry/react";
import { mockEnvironmentVariables } from "test_utils/utils";
import { initializeErrorHandling } from ".";

const { cleanup, mockEnv } = mockEnvironmentVariables();

describe("should initialize error handlers according to release stage", () => {
  beforeEach(() => {
    jest.spyOn(Sentry, "init").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it("development", () => {
    mockEnv("NODE_ENV", "development");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    initializeErrorHandling();

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("production", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      debug: false,
      dsn: "fake-sentry-key",
      environment: "production",
      normalizeDepth: 5,
    });
  });

  it("beta", () => {
    mockEnv("REACT_APP_RELEASE_STAGE", "beta");
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      debug: true,
      dsn: "fake-sentry-key",
      environment: "beta",
      normalizeDepth: 5,
    });
  });

  it("staging", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_RELEASE_STAGE", "staging");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      debug: true,
      dsn: "fake-sentry-key",
      environment: "staging",
      normalizeDepth: 5,
    });
  });
});

describe("should not initialize if the client is already running", () => {
  beforeEach(() => {
    jest.spyOn(Sentry, "init").mockImplementation(jest.fn());
    mockEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it("does not initialize Sentry twice", () => {
    // @ts-expect-error - Type error occurs because the entire return value of getCurrentHub is not mocked
    jest.spyOn(Sentry, "getClient").mockReturnValue(true);
    initializeErrorHandling();
    expect(Sentry.init).not.toHaveBeenCalled();
  });
});
