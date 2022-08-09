import { screen, render, fireEvent } from "@testing-library/react";

import * as redux from "react-redux";
import { mockStoreState } from "../../utils/mockData";

import DropFilesSection from "./";

const children = <p>Hi...</p>;
const mockDispatch = jest.fn((obj: any) => {});

describe("Testing the drop file section", () => {
  beforeEach(() => {
    jest.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch as any);

    jest
      .spyOn(redux, "useSelector")
      .mockImplementation((callback: any) => callback(mockStoreState));
  });

  test("Should NOT display the 'show drop section'", () => {
    render(<DropFilesSection>{children}</DropFilesSection>);

    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Hi.../)).toBeInTheDocument();
    expect(screen.queryByText(/Upload file/)).toBeNull();
  });

  test("Should display the 'show drop section' and hide it again", () => {
    render(<DropFilesSection>{children}</DropFilesSection>);
    expect(screen.queryByText(/Upload file/)).toBeNull();

    /**
     * Mocks when drag enter with files
     */
    fireEvent.dragEnter(screen.getByTestId("drop-section"), {
      dataTransfer: {
        items: {
          length: 1,
        },
      },
    });

    expect(screen.getByText(/Upload file/)).toBeInTheDocument();

    /**
     * Mocks the drag leave event
     */
    fireEvent.dragLeave(screen.getByTestId("drop-section"));

    expect(screen.queryByText(/Upload file/)).toBeNull();
  });

  test("Should hide the 'show drop section' when files were dropped", () => {
    render(<DropFilesSection>{children}</DropFilesSection>);
    expect(screen.queryByText(/Upload file/)).toBeNull();

    /**
     * Mocks when drag enter with files
     */
    fireEvent.dragEnter(screen.getByTestId("drop-section"), {
      dataTransfer: {
        items: {
          length: 1,
        },
      },
    });

    expect(screen.getByText(/Upload file/)).toBeInTheDocument();

    /**
     * Mocks when the user drops files
     */
    fireEvent.drop(screen.getByTestId("drop-section"), {
      //Drops 0 files
      dataTransfer: {
        files: {
          length: 0,
        },
      },
    });

    expect(screen.queryByText(/Upload file/)).toBeNull();
  });
});
