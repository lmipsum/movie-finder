import './App.scss';
import {useState} from "react";
import {QueryClientProvider, QueryClient} from "react-query";
import {alpha, InputBase, AppBar, Container, IconButton, FormControl, styled, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import MovieList from "./components/movie-list";
import MovieItemDetail from "./components/movie-item-detail";

const Offset = styled('div')(({theme}) => theme.mixins.toolbar);

const Search = styled(FormControl)(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    margin: 'auto'
}));

const SearchIconButton = styled(IconButton)(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    cursor: 'pointer',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'inherit'
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width')
    }
}));

const App = () => {
    const client: QueryClient = new QueryClient();
    const [searchFilter, setSearchFilter] = useState('');
    const [movieSearchData, setMovieSearchData] = useState({});
    const [wikiSearchData, setWikiSearchData] = useState({});
    const [open, setOpen] = useState(false);

    const handleSubmit: function = (e) => {
        e.preventDefault();
        setMovieSearchData({
            needle: searchFilter
        });
        setSearchFilter('');
    }

    const handleOnchange: function = (e) => {
        setSearchFilter(e.target.value);
    }

    return (
        <>
            <AppBar position="fixed">
                <Toolbar component="form" onSubmit={handleSubmit}>
                    <Search>
                        <SearchIconButton onClick={handleSubmit} disableRipple>
                            <SearchIcon/>
                        </SearchIconButton>
                        <StyledInputBase
                            type="search"
                            placeholder="Movie search…"
                            value={searchFilter}
                            onChange={handleOnchange}
                            label="Movie search…"
                        />
                    </Search>
                </Toolbar>
            </AppBar>
            <Offset/>
            <main>
                <Container maxWidth="md" component="section" id="movie-finder">
                    <QueryClientProvider client={client}>
                        <MovieList
                            movieSearchData={movieSearchData}
                            setWikiSearchData={setWikiSearchData}
                            setOpen={setOpen}
                        />
                    </QueryClientProvider>
                    <MovieItemDetail
                        wikiSearchData={wikiSearchData}
                        open={open}
                        setOpen={setOpen}
                        setMovieSearchData={setMovieSearchData}
                    />
                </Container>
            </main>
        </>
    );
};
export default App;