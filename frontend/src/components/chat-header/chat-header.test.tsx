import { render, screen } from "@testing-library/react";
import * as redux from "react-redux";
import { mockReduxFriendsState } from "../../utils/mockData";

import ChatHeader from "./";

const mockOnClickFriendInfo = jest.fn();

describe("Testing the chat-header", () => {
  beforeEach(() => {
    mockOnClickFriendInfo.mockClear();
    /**
     * MOcking the useSelector
     */
    jest.spyOn(redux, "useSelector").mockReturnValue(mockReduxFriendsState);
  });

  test("Shoul display the active-icon", () => {
    render(<ChatHeader onClickFriendInfo={mockOnClickFriendInfo} />);

    expect(screen.getByTestId("active-icon")).toBeInTheDocument();
  });

  test("Should show the is typing message", () => {
    render(<ChatHeader onClickFriendInfo={mockOnClickFriendInfo} />);

    expect(screen.getByText(/Typing/)).toBeInTheDocument();
  });

  test("Should show the current friend's name", () => {
    render(<ChatHeader onClickFriendInfo={mockOnClickFriendInfo} />);

    expect(
      screen.getByText(`${mockReduxFriendsState.currentFriend?.userName}`)
    ).toBeInTheDocument();
  });
});
