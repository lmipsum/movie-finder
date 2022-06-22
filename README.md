# Fullstack test

A purely front-end (react) JavaScript application to help you find movies!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Technical requirements:

- Outlined, readable, clean code (not 1 file), generated HTML code is structured, non-inline CSS
- English language (both UI and code)
- You can use external libraries (react, ramda, moment, jquery, apollo, lodash etc.), but not the libraries that specifically hide Wikipedia requests and their processing.
- Design should be secondary, minimal (layout, margins, title highlighting, etc.)

## Functional requirements:

- Have a movie title search box on the UI, on enter/click of a button it requests the search results from our graphql sandbox for TMDB:  https://tmdb.sandbox.zoosh.ie/dev/grphql
- It displays the results and some of their data (name, category, score) in a list, titles can be clicked
- By clicking on an address, the app tries to find the related English wikipedia page (with a REST request) and then displays a summary of it in a detail panel (e.g. first paragraph), along with a clickable link that opens in a new window in IMDB and wikipedia
- Bonus: Dual state search engine; a “related” button next to the two links in the movie: this switches the movie list from search results to a list of related movies related to the selected movie

## Levels:

1. A working web page
2. Spinner while loading data from TMDBW or wikipedia
3. Search for related movies
4. Bonus # 1: Use Material-UI library, Material-UI look
5. Bonus # 2: Tests

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.