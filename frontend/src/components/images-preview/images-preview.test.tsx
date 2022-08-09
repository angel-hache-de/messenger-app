import { render, screen } from "@testing-library/react";
import * as redux from "react-redux";

import ImagesPreview from "./";
import { mockReduxImagesState } from "../../utils/mockData";
import userEvent from "@testing-library/user-event";

const images = mockReduxImagesState;

const mockDispatch = jest.fn((obj: any) => {});

describe("Testing the images preview component", () => {
  beforeEach(() => {
    jest.spyOn(redux, "useSelector").mockReturnValue(images);

    jest.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch as any);
  });

  test("Should display the 2 images", () => {
    render(<ImagesPreview />);

    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  test("Should dispatch an action when removing an image", () => {
    render(<ImagesPreview />);

    userEvent.click(screen.getAllByTestId("close-icon")[0]);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
