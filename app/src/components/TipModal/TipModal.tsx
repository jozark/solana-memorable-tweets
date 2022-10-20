import React, { useRef } from "react";
import { FaCreditCard, FaTimes } from "react-icons/fa";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import "./TipModal.css";
import NumericInput from "react-numeric-input";

type TipModalProps = {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
  tipAmount: number;
  setTipAmount: (num: number | null) => void;
  handleTipSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function TipModal({
  showModal,
  setShowModal,
  tipAmount,
  setTipAmount,
  handleTipSubmit,
}: TipModalProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowModal(false));

  return (
    <>
      {showModal && (
        <div className="background">
          <div className="modal-wrapper" ref={ref}>
            <div className="credit-wrapper">
              <FaCreditCard className="credit" color="white" />
            </div>
            <div className="modal-content">
              <h1>Send Tip</h1>
              <p>Choose the amount that you want to send the submitter.</p>
              <form className="form-wrapper" onSubmit={handleTipSubmit}>
                <NumericInput
                  className="tipInput"
                  type="number"
                  placeholder="Enter SOL Amount"
                  value={tipAmount}
                  onChange={(event) => setTipAmount(event)}
                  style={false}
                />
                <button className="send-button cta-button" type="submit">
                  Send
                </button>
              </form>
            </div>
            <FaTimes
              className="close"
              color="white"
              onClick={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
