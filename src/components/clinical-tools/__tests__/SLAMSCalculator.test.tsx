import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import SLAMSCalculator from "../SLAMSCalculator";

/**
 * SLAMS Calculator Unit Tests
 * 
 * SLAMS (Stroke - Leg - Arm - sMile - Speech) is a prehospital stroke severity scale
 * for identifying Large Vessel Occlusion (LVO) strokes.
 */
describe("SLAMSCalculator", () => {
  beforeEach(() => {
    cleanup();
  });

  describe("Assessment Fields Display", () => {
    it("renders all four SLAMS assessment categories", () => {
      render(<SLAMSCalculator />);
      
      expect(screen.getByText("Smile/Grimace (Facial Symmetry)")).toBeInTheDocument();
      expect(screen.getByText("Leg Drift (Weakness)")).toBeInTheDocument();
      expect(screen.getByText("Arm Drift (Weakness)")).toBeInTheDocument();
      expect(screen.getByText(/^Speech$/)).toBeInTheDocument();
    });

    it("displays SLAMS acronym explanation", () => {
      render(<SLAMSCalculator />);
      expect(screen.getByText(/SLAMS.*Stroke.*Leg.*Arm.*sMile.*Speech/i)).toBeInTheDocument();
    });

    it("identifies as prehospital stroke severity assessment", () => {
      render(<SLAMSCalculator />);
      expect(screen.getByText(/Prehospital stroke severity assessment/i)).toBeInTheDocument();
    });
  });

  describe("Scoring Options - Facial Symmetry", () => {
    it("provides facial symmetry scoring options (0-1)", () => {
      render(<SLAMSCalculator />);
      
      const smileTrigger = screen.getAllByRole("combobox")[0];
      fireEvent.click(smileTrigger);
      
      expect(screen.getByText("0 - Normal/symmetric")).toBeInTheDocument();
      expect(screen.getByText("1 - Asymmetric (facial droop)")).toBeInTheDocument();
    });
  });

  describe("Scoring Options - Leg Drift", () => {
    it("provides leg weakness scoring options (0-2)", () => {
      render(<SLAMSCalculator />);
      
      const legTrigger = screen.getAllByRole("combobox")[1];
      fireEvent.click(legTrigger);
      
      expect(screen.getByText("0 - No drift")).toBeInTheDocument();
      expect(screen.getByText("1 - Drifts but doesn't hit bed")).toBeInTheDocument();
      expect(screen.getByText("2 - Drifts and hits bed or no movement")).toBeInTheDocument();
    });
  });

  describe("Scoring Options - Arm Drift", () => {
    it("provides arm weakness scoring options (0-2)", () => {
      render(<SLAMSCalculator />);
      
      const armTrigger = screen.getAllByRole("combobox")[2];
      fireEvent.click(armTrigger);
      
      expect(screen.getByText("0 - No drift")).toBeInTheDocument();
    });
  });

  describe("Scoring Options - Speech", () => {
    it("provides speech assessment scoring options (0-2)", () => {
      render(<SLAMSCalculator />);
      
      const speechTrigger = screen.getAllByRole("combobox")[3];
      fireEvent.click(speechTrigger);
      
      expect(screen.getByText("0 - Normal")).toBeInTheDocument();
      expect(screen.getByText("1 - Slurred but understandable")).toBeInTheDocument();
      expect(screen.getByText("2 - Unintelligible or mute")).toBeInTheDocument();
    });
  });

  describe("LVO Probability Reference", () => {
    it("displays clinical reference information", () => {
      render(<SLAMSCalculator />);
      
      // Reference section exists with scoring guidance
      expect(screen.getByText(/Low probability of LVO/i)).toBeInTheDocument();
      expect(screen.getByText(/Moderate probability/i)).toBeInTheDocument();
      expect(screen.getByText(/High probability of LVO/i)).toBeInTheDocument();
    });

    it("recommends thrombectomy-capable center for high scores", () => {
      render(<SLAMSCalculator />);
      expect(screen.getByText(/thrombectomy-capable center/i)).toBeInTheDocument();
    });
  });

  describe("User Interface", () => {
    it("has 4 combobox selectors for assessments", () => {
      render(<SLAMSCalculator />);
      
      const triggers = screen.getAllByRole("combobox");
      expect(triggers).toHaveLength(4);
    });

    it("does not show score result before all selections made", () => {
      render(<SLAMSCalculator />);
      expect(screen.queryByText(/SLAMS Score/)).not.toBeInTheDocument();
    });
  });
});
