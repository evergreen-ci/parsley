import { findJsonObjects, formatPrettyPrint, parseJson } from ".";

describe("findJsonObjects", () => {
  it("should return an empty array if there are no json objects", () => {
    expect(
      findJsonObjects(
        "[js_test:backup_restore_rolling] 2020-03-02T08:52:04.781+0000 d20521| no json objects in here",
      ),
    ).toStrictEqual([]);
  });

  it("should correctly determine json indices when the line itself is a json object", () => {
    const json = '{"id":12345,"c":"RECOVERY","ctx":"initAndListen"}';
    const result = findJsonObjects(json);

    const openBracket = json.indexOf("{");
    const closedBracket = json.lastIndexOf("}");

    expect(result).toStrictEqual([[openBracket, closedBracket]]);
  });

  it("should correctly determine json indices when there are multiple json objects", () => {
    const logLine =
      '[js_test:backup_restore_rolling] 2020-03-02T08:52:04.781+0000 d20521| {"t":{"$date":"2020-03-02T08:52:04.780+0000"},"s":"I", "c":"RECOVERY","id":23987,"ctx":"initandlisten","msg":"WiredTiger recoveryTimestamp. Ts: {recoveryTimestamp}","attr":{"recoveryTimestamp":{"$timestamp":{"t":0,"i":0}}}}and then some more text{"std_get_0_envDataEntry":"distmod","std_get_1_envDataEntry":"rhel62"}';
    const result = findJsonObjects(logLine);

    const firstOpenBracket = logLine.indexOf("{");
    const lastOpenBracket = logLine.lastIndexOf("{");

    const firstClosedBracket = logLine.lastIndexOf("}", lastOpenBracket);
    const lastClosedBracket = logLine.lastIndexOf("}");

    expect(result).toStrictEqual([
      [firstOpenBracket, firstClosedBracket],
      [lastOpenBracket, lastClosedBracket],
    ]);
  });
});

describe("parseJson", () => {
  it("should not parse malformatted json", () => {
    const invalidJson = '{"this": {"is": "not", "valid":"json"}}}';
    expect(parseJson(invalidJson)).toBe(invalidJson);
  });

  it("should not error upon encountering unconventional fields", () => {
    const uuid = '{"id" : UUID("32a3effc-e9cf-4f26-b7b5-66dfc0a595ca")}';
    expect(parseJson(uuid)).toBe(uuid);
  });

  it("should be able to preserve numbers that would normally be corrupted by JavaScript", () => {
    const bigNumberJson =
      '{"bigNumber":123456789123456789123456789, "bigNumberArray": [987654321987654321987654321]}';
    expect(parseJson(bigNumberJson)).toBe(
      "{\n" +
        '    "bigNumber": 123456789123456789123456789,\n' +
        '    "bigNumberArray": [\n' +
        "        987654321987654321987654321\n" +
        "    ]\n" +
        "}",
    );
  });

  it("should be able to parse valid JSON", () => {
    const validJson =
      '{"buildInfo":{"version":"6.2.0-alpha-874-g9179d0a","gitVersion":"9179d0a7109efb3,4631a6e19a87e055ed4e8c730","openSSLVersion":"OpenSSL 1.1.1 FIPS  11 Sep 2018","modules":["enterprise", "evg", "sandbox"],"allocator":"tcmalloc","environment":{"distmod":"rhel_80","distarch":"x86_64","target_arch":"x86_64"}}}';
    expect(parseJson(validJson)).toBe(
      "{\n" +
        '    "buildInfo": {\n' +
        '        "version": "6.2.0-alpha-874-g9179d0a",\n' +
        '        "gitVersion": "9179d0a7109efb3,4631a6e19a87e055ed4e8c730",\n' +
        '        "openSSLVersion": "OpenSSL 1.1.1 FIPS  11 Sep 2018",\n' +
        '        "modules": [\n' +
        '            "enterprise",\n' +
        '            "evg",\n' +
        '            "sandbox"\n' +
        "        ],\n" +
        '        "allocator": "tcmalloc",\n' +
        '        "environment": {\n' +
        '            "distmod": "rhel_80",\n' +
        '            "distarch": "x86_64",\n' +
        '            "target_arch": "x86_64"\n' +
        "        }\n" +
        "    }\n" +
        "}",
    );
  });
});

describe("prettyPrintFormat", () => {
  it("should remove quotes around fields", () => {
    const logLine =
      'some random text {"id":12345,"c":"RECOVERY","ctx":"initAndListen"}';
    const result = formatPrettyPrint(logLine);
    expect(result).toBe(
      "some random text \n" +
        "{\n" +
        "    id: 12345,\n" +
        '    c: "RECOVERY",\n' +
        '    ctx: "initAndListen"\n' +
        "}\n",
    );
  });

  it("should be able to pretty print multiple JSON objects in a log line", () => {
    const logLine =
      '[js_test:backup_restore_rolling] 2020-03-02T08:52:04.781+0000 d20521| {"t":{"$date":"2020-03-02T08:52:04.780+0000"},"s":"I",  "c":"RECOVERY","id":23987,"bigNum":123456789098765432134,"ctx":"initandlisten","msg":"WiredTiger recoveryTimestamp. Ts: {recoveryTimestamp}","attr":{"recoveryTimestamp":{"$timestamp":{"t":0,"i":0}}}}and then some more text{"std_get_0_envDataEntry":"distmod","std_get_1_envDataEntry":"rhel62"}a little more text';

    const result = formatPrettyPrint(logLine);
    expect(result).toBe(
      "[js_test:backup_restore_rolling] 2020-03-02T08:52:04.781+0000 d20521| \n" +
        "{\n" +
        "    t: {\n" +
        '        $date: "2020-03-02T08:52:04.780+0000"\n' +
        "    },\n" +
        '    s: "I",\n' +
        '    c: "RECOVERY",\n' +
        "    id: 23987,\n" +
        "    bigNum: 123456789098765432134,\n" +
        '    ctx: "initandlisten",\n' +
        '    msg: "WiredTiger recoveryTimestamp. Ts: {recoveryTimestamp}",\n' +
        "    attr: {\n" +
        "        recoveryTimestamp: {\n" +
        "            $timestamp: {\n" +
        "                t: 0,\n" +
        "                i: 0\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "}\n" +
        "and then some more text\n" +
        "{\n" +
        '    std_get_0_envDataEntry: "distmod",\n' +
        '    std_get_1_envDataEntry: "rhel62"\n' +
        "}\n" +
        "a little more text",
    );
  });
});
