import { render, screen } from "@testing-library/react";
import { MESSAGE_STATUS } from "../../store/types/messengerTypes";
import { mockFriend } from "../../utils/mockData";

import Friend from "./";

describe("Testing the friend component", () => {
  beforeEach(() => {});

  test("Should display mock friend info", () => {
    render(<Friend friend={mockFriend} />);

    expect(screen.getByText(mockFriend.userName)).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();

    expect(screen.getByText(/typing/)).toBeInTheDocument();
  });

  test("Should display the last message with status 'seen'", () => {
    const friend = mockFriend;
    friend.isTyping = false;
    friend.uid = "receptor-id";
    friend.lastMessage!.status = MESSAGE_STATUS.SEEN;

    render(<Friend friend={friend} />);

    /**
     * The message content
     */
    expect(
      screen.getByText(
        `${mockFriend.lastMessage?.message.text.slice(0, 10)}...`
      )
    ).toBeInTheDocument();

    /**
     * Friend's image
     */
    expect(screen.getByAltText("Your friend")).toBeInTheDocument();
  });
});
