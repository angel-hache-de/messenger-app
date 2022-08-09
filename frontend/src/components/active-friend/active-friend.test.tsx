import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ActiveFriend, { IActiveFriendProps } from "./";

const mockHandleClick = jest.fn();

let componentsProps: IActiveFriendProps = {
  handleClick: mockHandleClick,
  image: "./image.jpg",
  name: "Angel",
};

beforeEach(() => {
  mockHandleClick.mockClear();
});

describe("Testing the active friend", () => {
  test("Should render correctly the component", () => {
    render(
      <ActiveFriend
        handleClick={componentsProps.handleClick}
        image={componentsProps.image}
        name={componentsProps.name}
      />
    );

    userEvent.click(screen.getByRole("img"));

    expect(mockHandleClick).toBeCalledTimes(1);
  });
});
