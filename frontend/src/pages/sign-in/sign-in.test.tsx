import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as redux from "react-redux";
import * as alert from "react-alert";

import SignIn from ".";
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
jest.mock("../../hooks/use-mounted", () => () => false);

describe("Testing the sign-in component", () => {
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
    jest.spyOn(alert, "useAlert").mockImplementation(mockAlert);

    /**
     * Cleaning the mocks
     */
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    mockAlert.mockClear();
  });

  test("Should display an error message if one field is invalid", () => {
    render(<SignIn />);

    userEvent.type(screen.getByLabelText("Email"), "asd");
    userEvent.type(screen.getByLabelText("Password"), "asd");
    /**
     * The message appears with the onBlur event
     */
    screen.getByLabelText("Password").blur();
    expect(screen.getByText(/Enter a valid email/)).toBeInTheDocument();
    expect(screen.getByText(/Enter a valid password/)).toBeInTheDocument();
  });

  test("Should not call the dispatch function if the inputs are empty", () => {
    render(<SignIn />);

    userEvent.click(screen.getByRole("button"));
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  test("Should call the dispatch function when the inputs are valid", () => {
    render(<SignIn />);

    userEvent.type(screen.getByLabelText("Email"), "asd@de.es");
    userEvent.type(screen.getByLabelText("Password"), "asdfgh");

    userEvent.click(screen.getByRole("button"));

    expect(screen.queryByText(/Enter a valid email/)).toBeNull();
    expect(screen.queryByText(/Enter a valid password/)).toBeNull();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test("Should redirect if the user is authenticated", () => {
    jest.spyOn(redux, "useSelector").mockReturnValue({ authenticated: true });

    render(<SignIn />);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
