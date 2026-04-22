import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import SIRSCalculator from "../SIRSCalculator";

/**
 * SIRS Calculator Unit Tests
 * 
 * Clinical Reference: Bone RC, et al. Chest. 1992;101(6):1644-1655
 */
describe("SIRSCalculator", () => {
  beforeEach(() => {
    cleanup();
  });

  describe("Clinical Criteria Display", () => {
    it("renders all four SIRS criteria fields", () => {
      render(<SIRSCalculator />);
      
      expect(screen.getByText("Temperature")).toBeInTheDocument();
      expect(screen.getByText("Heart Rate")).toBeInTheDocument();
      expect(screen.getByText("Respiratory Rate")).toBeInTheDocument();
      expect(screen.getByText("White Blood Cell Count")).toBeInTheDocument();
    });

    it("displays correct temperature threshold (>38°C or <36°C)", () => {
      render(<SIRSCalculator />);
      expect(screen.getByText(">38°C (100.4°F) or <36°C (96.8°F)")).toBeInTheDocument();
    });

    it("displays correct heart rate threshold (>90 bpm)", () => {
      render(<SIRSCalculator />);
      expect(screen.getByText(">90 beats per minute")).toBeInTheDocument();
    });

    it("displays correct respiratory threshold (>20/min or PaCO2 <32)", () => {
      render(<SIRSCalculator />);
      expect(screen.getByText(">20 breaths/min or PaCO₂ <32 mmHg")).toBeInTheDocument();
    });

    it("displays correct WBC threshold (>12k or <4k or >10% bands)", () => {
      render(<SIRSCalculator />);
      expect(screen.getByText(">12,000/mm³ or <4,000/mm³ or >10% bands")).toBeInTheDocument();
    });
  });

  describe("User Interface", () => {
    it("provides binary scoring options (Normal/Abnormal) for each criterion", () => {
      render(<SIRSCalculator />);
      
      const normalButtons = screen.getAllByRole("button", { name: "Normal (0)" });
      const abnormalButtons = screen.getAllByRole("button", { name: "Abnormal (+1)" });
      
      expect(normalButtons).toHaveLength(4);
      expect(abnormalButtons).toHaveLength(4);
    });

    it("includes a reset calculator button", () => {
      render(<SIRSCalculator />);
      expect(screen.getByRole("button", { name: /Reset Calculator/i })).toBeInTheDocument();
    });

    it("displays SIRS description mentioning ≥2 criteria requirement", () => {
      render(<SIRSCalculator />);
      expect(screen.getByText(/requires ≥2 criteria for diagnosis/)).toBeInTheDocument();
    });
  });

  describe("Clinical Notes Section", () => {
    it("displays clinical education notes", () => {
      render(<SIRSCalculator />);
      expect(screen.getByText("Clinical Notes")).toBeInTheDocument();
    });

    it("mentions SIRS sensitivity vs specificity limitation", () => {
      render(<SIRSCalculator />);
      expect(screen.getByText(/SIRS is sensitive but not specific/i)).toBeInTheDocument();
    });

    it("references Sepsis-3 guidelines (2016 update)", () => {
      render(<SIRSCalculator />);
      expect(screen.getByText(/Sepsis-3.*2016.*SOFA/i)).toBeInTheDocument();
    });

    it("mentions qSOFA as complementary assessment", () => {
      render(<SIRSCalculator />);
      // Multiple elements mention qSOFA - use queryAllBy to verify at least one exists
      const qsofaElements = screen.queryAllByText(/qSOFA/i);
      expect(qsofaElements.length).toBeGreaterThan(0);
    });
  });
});
