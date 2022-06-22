import {unmountComponentAtNode} from "react-dom";
import {render, act, fireEvent, screen} from "@testing-library/react";

import MovieItem from "./movie-item";

const setWikiSearchData = jest.fn();
const {MOCK_MOVIE_ITEM} = {
    MOCK_MOVIE_ITEM: {
        genres: [{name: 'Drama'}],
        id: 550,
        name: 'Fight Club',
        releaseDate: '1999-10-15T00:00:00.000Z',
        runtime: 139,
        score: 8.4,
        crew: [{person: {name: "David Fincher"}, role: {job: "Director"}}]
    }
}
const MOCK_MOVIE_ITEM_YEAR = new Date(MOCK_MOVIE_ITEM?.releaseDate).getFullYear();

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
        render(<MovieItem movieItemData={{genres: '', id: '', name: '', releaseDate: '', score: ''}}/>, container);
    });
    expect(await screen.findByText(`(NaN)`)).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => {
        render(<MovieItem movieItemData={MOCK_MOVIE_ITEM}/>, container);
    });
    expect(await screen.findByText(`${MOCK_MOVIE_ITEM?.name} (${MOCK_MOVIE_ITEM_YEAR})`)).toBeInTheDocument();
});

test("prop set by list item click", () => {
    const setOpen = jest.fn();
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
        render(<MovieItem movieItemData={MOCK_MOVIE_ITEM} setWikiSearchData={setWikiSearchData}
                          setOpen={setOpen}/>, container);
    })
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
        const item = screen.getByTestId(MOCK_MOVIE_ITEM.id);
        fireEvent.click(item);
    });
    expect(setWikiSearchData).toHaveBeenCalledTimes(1);
    expect(setWikiSearchData).toBeCalledWith({
        id: MOCK_MOVIE_ITEM.id,
        name: MOCK_MOVIE_ITEM.name,
        year: MOCK_MOVIE_ITEM_YEAR,
        director: MOCK_MOVIE_ITEM.crew[0].person.name
    });
});