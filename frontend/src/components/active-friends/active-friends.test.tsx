import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as redux from "react-redux";
import { mockReduxFriendsState } from "../../utils/mockData";

import ActiveFriends from "./";

const mockDispatch = jest.fn((obj: any) => {});

describe("Testing Active Friends component", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    jest.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch as any);
  });

  test("Should render the user", () => {
    jest.spyOn(redux, "useSelector").mockReturnValue(mockReduxFriendsState);
    render(<ActiveFriends />);
    userEvent.click(screen.getByRole("img"));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test("Should not return anything if there is not active users", () => {
    jest.spyOn(redux, "useSelector").mockReturnValue({
      friends: {},
      activeFriends: {},
    });
    render(<ActiveFriends />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
