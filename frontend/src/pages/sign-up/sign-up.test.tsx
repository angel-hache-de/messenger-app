import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as redux from "react-redux";
import * as alert from "react-alert";

import SignUp from "./";
import { mockStoreState } from "../../utils/mockData";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockAlert = jest.fn();

const mockStore = {
  ...mockStoreState,
};

mockStore.auth.authenticated = false;

/**'
 * Mocking the useNavigate adn the Link component
 */
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockNavigate,
  Link: ({ children }: any) => {
    return <>{children}</>;
  },
}));

/**
 * Mocks the useMounted hoosk
 * return false to avoid warning that causes the
 * setLoading inside the finally
 */
jest.mock("../../hooks/use-mounted", () => () => ({
  current: false,
}));

describe("Testing the sign-up component", () => {
  beforeEach(() => {
    /**
     * Mocking the react-redux functionality
     */
    jest.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch as any);
    jest
      .spyOn(redux, "useSelector")
      .mockImplementation((callback: any) => callback(mockStore));

    /**
     * Mocking the react alert functionality
     */
    jest.spyOn(alert, "useAlert").mockReturnValue({
      error: mockAlert,
    });

    /**
     * Cleaning the mocks
     */
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    mockAlert.mockClear();
  });

  test("Should display an error message if one field is invalid", () => {
    render(<SignUp />);

    userEvent.type(screen.getByLabelText("Email"), "asd");
    userEvent.type(screen.getByLabelText("Password"), "asd");
    userEvent.type(screen.getByLabelText("Confirm Password"), "as");
    /**
     * The username shows error when is empty and the event
     * blur has been exec
     */
    screen.getByLabelText(/username/i).focus();
    screen.getByLabelText(/username/i).blur();

    expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/Min password length is 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter a valid username/i)).toBeInTheDocument();
    expect(screen.getByText(/Passwords must be equal/i)).toBeInTheDocument();

    userEvent.click(screen.getByRole("button"));
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  test("Should not call the dispatch function if the inputs are empty", () => {
    render(<SignUp />);

    userEvent.click(screen.getByRole("button"));
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  test("Should not call the dispatch function if there is no image loaded", () => {
    render(<SignUp />);

    userEvent.type(screen.getByLabelText("Email"), "asd@de.es");
    userEvent.type(screen.getByLabelText("Password"), "asfghj");
    userEvent.type(screen.getByLabelText("Confirm Password"), "asfghj");
    userEvent.type(screen.getByLabelText(/username/i), "Angel");

    userEvent.click(screen.getByRole("button"));
    expect(screen.queryByText(/Enter a valid email/i)).toBeNull();
    expect(screen.queryByText(/Min password length is 6/i)).toBeNull();
    expect(screen.queryByText(/Enter a valid username/i)).toBeNull();
    expect(screen.queryByText(/Passwords must be equal/i)).toBeNull();
    /**
     * When there is no image loaded, alert.error is called
     */
    expect(mockAlert).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  test("Should call the dispatch function when the inputs are valid", async () => {
    render(<SignUp />);

    userEvent.type(screen.getByLabelText("Email"), "asd@de.es");
    userEvent.type(screen.getByLabelText("Password"), "asfghj");
    userEvent.type(screen.getByLabelText("Confirm Password"), "asfghj");
    userEvent.type(screen.getByLabelText(/username/i), "Angel");

    /**
     * Mocking the image upload
     */
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const input = screen.getByLabelText(/select image/i) as HTMLInputElement;
    await userEvent.upload(input, file);
    expect(input.files![0]).toBe(file);
    expect(input.files!.item(0)).toBe(file);
    expect(input.files!).toHaveLength(1);

    expect(screen.queryByText(/Enter a valid email/i)).toBeNull();
    expect(screen.queryByText(/Min password length is 6/i)).toBeNull();
    expect(screen.queryByText(/Enter a valid username/i)).toBeNull();
    expect(screen.queryByText(/Passwords must be equal/i)).toBeNull();

    /**
     * Implicit expect
     * We have to wait until the file reader has done
     */
    await screen.findByRole("img", {}, { interval: 5000 });

    userEvent.click(screen.getByRole("button"));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test("Should redirect if the user is authenticated", () => {
    jest.spyOn(redux, "useSelector").mockReturnValue({ authenticated: true });

    render(<SignUp />);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
