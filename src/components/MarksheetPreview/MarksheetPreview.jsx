import React from "react";
import "./MarksheetPreview.scss";

const MarksheetPreview = () => {
  return (
    <div className="marksheet-print-container">
      <div className="student-name">Tohiy</div>
      <div className="student-marks">hi</div>

      <button className="print-button" onClick={() => window.print()}>
        Print Marksheet
      </button>
    </div>
  );
};

export default MarksheetPreview;
