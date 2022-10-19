import React from "react";

type InputBarProps = {
  inputValue: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setInputValue: (inputValue: string) => void;
};

export default function InputBar({
  inputValue,
  setInputValue,
  handleSubmit,
}: InputBarProps): JSX.Element {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Insert a tweet link!"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <button type="submit" className="cta-button submit-button">
        Submit
      </button>
      <p className="info-text">
        e.g. https://twitter.com/elonmusk/status/1580304724082843648
      </p>
    </form>
  );
}
