import {useEffect, useState, Fragment} from "react";
import {useQuery} from "react-query";
import {gql, request} from "graphql-request";
import {CircularProgress, Backdrop, Grid, List, Typography} from "@mui/material";

import MovieItem from "./movie-item";

const GQL_URL = 'https://tmdb.sandbox.zoosh.ie/dev/graphql';
const {QUERY_UNRELATED, QUERY_RELATED} = {
    QUERY_UNRELATED: gql`
        query SearchMovies($needle: String!) {
            searchMovies(query: $needle) {
                id,name,releaseDate,genres{name},score,runtime,crew(limit: 5) {
                    person{name},role{... on Crew {job}}
                }
            }
        }
    `,
    QUERY_RELATED: gql`
        query getMovie($needle: ID!) {
            movie(id: $needle) {
                recommended {id,name,releaseDate,genres{name},score,runtime,crew(limit: 5) {
                        person{name},role{... on Crew {job}}
                    }
                }
            }
        }
    `
}

const movieFilter: function = ({movie, searchMovies} = {}) => {
    return (movie?.recommended ?? searchMovies ?? []).filter(({crew}) => !!crew?.length);
};

const messageSelect: function = ((items, {needle, relatedTo}) => {
    if (!needle) return;
    const message = !!items?.length ? (!relatedTo ? `Search results` : `Related movies`) : `No results`;
    return `${message} to "${relatedTo ?? needle}"`;
});

const MovieList: function = (
    {
        movieSearchData: {needle, relatedTo},
        setWikiSearchData,
        setOpen
    }) => {
    const [message, setMessage] = useState(null);
    const [movieItems, setMovieItems] = useState(null);

    const {data, status} = useQuery(
        [needle],
        () => request(GQL_URL, (!relatedTo ? QUERY_UNRELATED : QUERY_RELATED), {needle}),
        {enabled: !!needle}
    );

    useEffect(() => {
        setMovieItems(movieFilter(data));
    }, [data]);

    useEffect(() => {
        setMessage(messageSelect(movieItems, {needle, relatedTo}));
    }, [movieItems, needle, relatedTo]);

    if (status === "loading") return <Backdrop open={true}> <CircularProgress/></Backdrop>;

    return (
        <>
            <Grid container sx={{p: 2}}>
                <Typography variant="h5">
                    {message}
                </Typography>
            </Grid>
            {!!movieItems?.length &&
                <List sx={{width: '100%'}} component="div">
                    {movieItems.map(movieItemData =>
                        <Fragment key={movieItemData.id}>
                            <MovieItem movieItemData={movieItemData}
                                       setWikiSearchData={setWikiSearchData}
                                       setOpen={setOpen}
                            />
                        </Fragment>
                    )}
                </List>
            }
        </>
    );
};
export default MovieList;