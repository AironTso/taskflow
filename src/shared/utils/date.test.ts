import { describe, it, expect } from "vitest";
import { formatDate, formatRelativeDate, isOverdue, isDueSoon, getPriorityColor, getPriorityLabel, generateId } from "./date";

describe("date utils", () => {
  describe("formatDate", () => {
    it("returns empty string for null", () => {
      expect(formatDate(null)).toBe("");
    });

    it("returns Hoje for today", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(formatDate(today)).toBe("Hoje");
    });

    it("returns Amanhã for tomorrow", () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
      expect(formatDate(tomorrow)).toBe("Amanhã");
    });
  });

  describe("formatRelativeDate", () => {
    it("returns Vence hoje for today", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(formatRelativeDate(today)).toBe("Vence hoje");
    });

    it("returns Atrasado for past dates", () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      expect(formatRelativeDate(yesterday)).toContain("Atrasado");
    });
  });

  describe("isOverdue", () => {
    it("returns false for null", () => {
      expect(isOverdue(null)).toBe(false);
    });

    it("returns true for past dates", () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      expect(isOverdue(yesterday)).toBe(true);
    });

    it("returns false for today", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(isOverdue(today)).toBe(false);
    });
  });

  describe("isDueSoon", () => {
    it("returns true for dates within range", () => {
      const inTwoDays = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];
      expect(isDueSoon(inTwoDays, 3)).toBe(true);
    });

    it("returns false for dates outside range", () => {
      const inFiveDays = new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
      expect(isDueSoon(inFiveDays, 3)).toBe(false);
    });
  });

  describe("getPriorityColor", () => {
    it("returns correct colors for each priority", () => {
      expect(getPriorityColor("low")).toContain("gray");
      expect(getPriorityColor("medium")).toContain("yellow");
      expect(getPriorityColor("high")).toContain("orange");
      expect(getPriorityColor("urgent")).toContain("red");
    });
  });

  describe("getPriorityLabel", () => {
    it("returns Portuguese labels", () => {
      expect(getPriorityLabel("low")).toBe("Baixa");
      expect(getPriorityLabel("medium")).toBe("Média");
      expect(getPriorityLabel("high")).toBe("Alta");
      expect(getPriorityLabel("urgent")).toBe("Urgente");
    });
  });

  describe("generateId", () => {
    it("generates unique ids", () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });
});
