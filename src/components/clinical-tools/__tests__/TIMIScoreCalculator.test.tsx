import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import TIMIScoreCalculator from "../TIMIScoreCalculator";

/**
 * TIMI Score Calculator Unit Tests
 * 
 * Clinical References:
 * - NSTEMI: Antman EM, et al. JAMA. 2000;284(7):835-842
 * - STEMI: Morrow DA, et al. Circulation. 2000;102(17):2031-2037
 */
describe("TIMIScoreCalculator", () => {
  beforeEach(() => {
    cleanup();
  });

  describe("NSTEMI/UA Tab - Clinical Criteria", () => {
    it("renders all 7 NSTEMI TIMI criteria", () => {
      render(<TIMIScoreCalculator />);
      
      expect(screen.getByText("Age ≥ 65 years")).toBeInTheDocument();
      expect(screen.getByText(/≥ 3 CAD risk factors/)).toBeInTheDocument();
      expect(screen.getByText(/Known CAD/)).toBeInTheDocument();
      expect(screen.getByText(/ASA use in past 7 days/)).toBeInTheDocument();
      expect(screen.getByText(/Severe angina/)).toBeInTheDocument();
      expect(screen.getByText(/ST changes ≥ 0.5mm/)).toBeInTheDocument();
      expect(screen.getByText(/Positive cardiac biomarker/)).toBeInTheDocument();
    });

    it("displays CAD risk factors detail", () => {
      render(<TIMIScoreCalculator />);
      expect(screen.getByText(/HTN.*DM.*dyslipidemia.*smoking.*family history/i)).toBeInTheDocument();
    });

    it("specifies coronary stenosis threshold for known CAD", () => {
      render(<TIMIScoreCalculator />);
      expect(screen.getByText(/stenosis ≥ 50%/i)).toBeInTheDocument();
    });

    it("defines severe angina as ≥2 episodes in 24 hours", () => {
      render(<TIMIScoreCalculator />);
      expect(screen.getByText(/≥ 2 episodes in 24 hrs/i)).toBeInTheDocument();
    });
  });

  describe("User Interface", () => {
    it("has NSTEMI/UA and STEMI tabs", () => {
      render(<TIMIScoreCalculator />);
      
      expect(screen.getByRole("tab", { name: "NSTEMI/UA" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "STEMI" })).toBeInTheDocument();
    });

    it("provides Calculate and Reset buttons", () => {
      render(<TIMIScoreCalculator />);
      
      expect(screen.getByRole("button", { name: "Calculate" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    });

    it("displays clinical application guidance", () => {
      render(<TIMIScoreCalculator />);
      
      expect(screen.getByText(/Clinical Application/i)).toBeInTheDocument();
      expect(screen.getByText(/aggressive interventional strategies/i)).toBeInTheDocument();
    });
  });

  describe("Score Calculation", () => {
    it("shows NSTEMI score denominator of 7", () => {
      render(<TIMIScoreCalculator />);
      
      fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
      expect(screen.getByText(/\/7$/)).toBeInTheDocument();
    });
  });
});
