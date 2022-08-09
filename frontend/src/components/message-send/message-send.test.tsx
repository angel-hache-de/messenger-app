import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as redux from "react-redux";
import { mockStoreState } from "../../utils/mockData";

import MessageSend from "./";

const mockDispatch = jest.fn();
const mockEmit = jest.fn((obj: any) => {});

const mockSocket = {
  current: {
    emit: mockEmit,
  },
};

describe("Testing the message-send component", () => {
  beforeEach(() => {
    /**
     * Mocks the react redux functionality
     */
    jest.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch);

    jest
      .spyOn(redux, "useSelector")
      .mockImplementation((callback: any) => callback(mockStoreState));

    mockDispatch.mockClear();
    mockEmit.mockClear();
  });

  test("Should send a 💘 when the input is empty and the heart is clicked", () => {
    render(<MessageSend socket={mockSocket as any} />);

    // The emojis section to be hide
    expect(screen.queryByText("🤦")).toBeNull();
    expect(screen.getByText("💓")).toBeInTheDocument();
    userEvent.click(screen.getByText("💓"));
    /**
     * Is called twice. 1 when sending the message
     * and another one when cleaning the images
     * IMPORTANT, if the 'messageSentSuccessfully' should
     * be false, otherwise the times that dispatch is called
     * are 4
     */
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  test("Should display the send icon when the input is not empty", () => {
    render(<MessageSend socket={mockSocket as any} />);

    expect(screen.getByText("💓")).toBeInTheDocument();
    expect(screen.queryByTestId("send-icon")).toBeNull();
    userEvent.type(screen.getByRole("textbox"), "s");
    expect(screen.getByTestId("send-icon")).toBeInTheDocument();
    expect(screen.queryByText("💓")).toBeNull();

    /**
     * When the user types, the socket emits the isTyping
     * event. Also emit is exceuted when the components
     * is mounted
     */
    expect(mockEmit).toHaveBeenCalledTimes(2);
  });

  test("Should display the emojis section", () => {
    render(<MessageSend socket={mockSocket as any} />);

    // The emojis section to be hide
    expect(screen.queryByText("🤦")).toBeNull();
    expect(screen.getByText("😄")).toBeInTheDocument();
    userEvent.click(screen.getByText("😄"));
    expect(screen.getByText("🤦")).toBeInTheDocument();
  });
});
