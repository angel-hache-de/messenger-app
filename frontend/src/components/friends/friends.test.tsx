import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as redux from "react-redux";

import { mockFriend, mockFriend2, mockStoreState } from "../../utils/mockData";

import Friends from "./";

const mockDispatch = jest.fn((obj: any) => {});

describe("Testing friends component", () => {
  beforeEach(() => {
    //   Mocks  the react-redux functionality
    jest.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch as any);

    jest
      .spyOn(redux, "useSelector")
      .mockImplementation((callback: any) => callback(mockStoreState));
  });

  test("Should display the mock friends", () => {
    render(<Friends />);

    expect(screen.getAllByRole("img").length).toBe(2);
    expect(screen.getByText(mockFriend.userName)).toBeInTheDocument();
    expect(screen.getByText(mockFriend2.userName)).toBeInTheDocument();

    /**
     * called when the component is rendered the first time
     */
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test("Should dispatch an action when a user is clicked", () => {
    render(<Friends />);

    userEvent.click(screen.getByText(mockFriend2.userName));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  test("Should filter the users wich userName contains the 'dia' string", () => {
    render(<Friends />);

    expect(screen.getByText(mockFriend.userName)).toBeInTheDocument();
    expect(screen.getByText(mockFriend2.userName)).toBeInTheDocument();

    userEvent.type(screen.getByRole("textbox"), "dia");

    expect(screen.queryByText(mockFriend.userName)).toBeNull();
    expect(screen.getByText(mockFriend2.userName)).toBeInTheDocument();
  });
});
