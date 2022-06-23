import {unmountComponentAtNode} from "react-dom";
import {QueryClientProvider, QueryClient} from "react-query";
import {render, screen} from "@testing-library/react";
import * as React from 'react'

import MovieList from "./movie-list";

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
    logger: {
        log: console.log,
        warn: console.warn,
        error: () => {
        },
    }
})

const renderWithClient = (ui) => {
    const testQueryClient = createTestQueryClient();
    const {rerender, ...result} = render(
        <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    )
    return {
        ...result, rerender: (rerenderUi) => rerender(
            <QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>
        ),
    }
};

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

it('renders w/o results', async () => {
    renderWithClient(<MovieList movieSearchData={{needle: "asdasd"}}/>, container)
    expect(await screen.findByText('No results to "asdasd"')).toBeInTheDocument();
})

it('renders w/ unrelated search', async () => {
    renderWithClient(<MovieList movieSearchData={{needle: "Pulp Fiction"}}/>, container)
    expect(await screen.findByText('Search results to "Pulp Fiction"')).toBeInTheDocument();
})