import { formatBytes } from ".";

const kb = 1024;
const mb = kb * 1024;
const gb = mb * 1024;
describe("formatBytes", () => {
  it("should return 0 Bytes for 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });
  it("should format file size in the correct unit", () => {
    expect(formatBytes(1 * kb)).toBe("1 KB");
    expect(formatBytes(1 * mb)).toBe("1 MB");
    expect(formatBytes(1 * gb)).toBe("1 GB");
  });
  describe("should format file size in the correct unit with the correct level of precision", () => {
    it("kilobytes", () => {
      expect(formatBytes(kb + kb / 2, 0)).toBe("2 KB");
      expect(formatBytes(kb + kb / 2, 1)).toBe("1.5 KB");
      expect(formatBytes(kb + kb / 3, 2)).toBe("1.33 KB");
    });
    it("megabytes", () => {
      expect(formatBytes(mb + mb / 2, 0)).toBe("2 MB");
      expect(formatBytes(mb + mb / 2, 1)).toBe("1.5 MB");
      expect(formatBytes(mb + mb / 3, 2)).toBe("1.33 MB");
    });
    it("gigabytes", () => {
      expect(formatBytes(gb + gb / 2, 0)).toBe("2 GB");
      expect(formatBytes(gb + gb / 2, 1)).toBe("1.5 GB");
      expect(formatBytes(gb + gb / 3, 2)).toBe("1.33 GB");
    });
  });
});
