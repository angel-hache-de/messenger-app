import { screen, render } from "@testing-library/react";
import { mockMessage } from "../../utils/mockData";

import { Message } from "./";

const mockOnClick = jest.fn();

describe("Testing Message component", () => {
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test("Should display the mesasge info", () => {
    render(<Message message={mockMessage} onClick={mockOnClick} />);

    expect(screen.getByText(mockMessage.message.text)).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockMessage.createdAt!).toLocaleString())
    ).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByTestId("typing")).toBeNull();
  });

  test("Should display the emitter image", () => {
    render(
      <Message
        emitterImg={"image"}
        message={mockMessage}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test("Shoul display the is typing animation", () => {
    render(
      <Message
        message={mockMessage}
        onClick={mockOnClick}
        emitterImg={"image.jpg"}
        typingMessage={true}
      />
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByTestId("typing")).toBeInTheDocument();
  });
});
