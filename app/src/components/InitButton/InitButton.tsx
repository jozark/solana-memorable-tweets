import React from "react";

type InitButtonProps = {
  onClickHandler: () => void;
};

export default function InitButton({
  onClickHandler,
}: InitButtonProps): JSX.Element {
  return (
    <div className="connected-container">
      <button className="cta-button submit-gif-button" onClick={onClickHandler}>
        Do One-Time Initialization For GIF Program Account
      </button>
    </div>
  );
}
