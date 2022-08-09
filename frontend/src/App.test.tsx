import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("Testing App", () => {
  render(<App />);

  expect(true).toBe(true);
  // screen.debug();
  // console.log(screen.debug());
});
