import {unmountComponentAtNode} from "react-dom";
import {render, act, fireEvent, screen} from "@testing-library/react";

import MovieItemDetail from "./movie-item-detail";

const setMovieSearchData = jest.fn();
const setOpen = jest.fn();
const MOCK_SEARCH_DATA = {id: 550, name: "Fight Club", year: 1999};

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders with or without a data", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => {
        render(<MovieItemDetail wikiSearchData={{id: '', name: '', year: ''}} open={true}/>, container);
    });
    expect(await screen.findByText(`Cannot find page for "" on Wikipedia.`)).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => {
        render(<MovieItemDetail wikiSearchData={MOCK_SEARCH_DATA} open={true}/>, container);
    }).then(async () => {
        expect(await screen.findByText(MOCK_SEARCH_DATA.name)).toBeInTheDocument();
    });
});

test("prop set by related button click", async () => {
    render(<MovieItemDetail
        wikiSearchData={MOCK_SEARCH_DATA}
        open={true}
        setOpen={setOpen}
        setMovieSearchData={setMovieSearchData}
    />, container);
    expect(await screen.findByTestId(`movieSearch-${MOCK_SEARCH_DATA.id}`)).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-unnecessary-act
   await act(() => {
       const related_button = screen.getByTestId(`movieSearch-${MOCK_SEARCH_DATA.id}`);
       fireEvent.click(related_button);
       expect(setMovieSearchData).toHaveBeenCalledTimes(1);
       expect(setMovieSearchData).toBeCalledWith({
           needle: MOCK_SEARCH_DATA.id,
           relatedTo: MOCK_SEARCH_DATA.name
       });
       expect(setOpen).toHaveBeenCalledTimes(1);
       expect(setOpen).toHaveBeenCalledWith(false);
   });
});