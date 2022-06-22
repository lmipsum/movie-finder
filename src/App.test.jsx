import {unmountComponentAtNode} from "react-dom";
import {render, createEvent, fireEvent, screen} from "@testing-library/react";

import App from "./App";

let searchInput, searchButton, searchKey;

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<App/>,container);
    searchKey = 'fight club';
    searchInput = screen.getByRole('searchbox');
    searchButton = screen.getByRole('button');
    fireEvent.change(searchInput, {target: {value: searchKey}});
})

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it('should render the search form', () => {
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
})

test('search value change', () => {
    expect(searchInput.value).toEqual(searchKey);
});

test('submit preventDefault', () => {
    const submit = createEvent.submit(searchInput);
    fireEvent(searchInput, submit);
    expect(submit.defaultPrevented).toBe(true);
});