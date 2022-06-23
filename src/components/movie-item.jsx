import {useEffect, useState} from "react";
import {ListItemText, Grid, ListItemButton} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const MovieItem: function = (
    {
        movieItemData: {genres, id, name, releaseDate, score, crew},
        setWikiSearchData,
        setOpen
    }) => {
    const [year, setYear] = useState(null);
    const [genreString, setGenreString] = useState(null);
    const [director, setDirector] = useState(null);

    const handleClick: function = () => {
        setOpen(true);
        setWikiSearchData({
            id: id,
            name: name,
            year: year,
            director: director
        });
    };

    useEffect(() => {
        setYear(new Date(releaseDate).getFullYear());
    }, [releaseDate]);

    useEffect(() => {
        setGenreString(!!genres?.length && genres.map(item => item['name']).join(', '));
    }, [genres]);

    useEffect(() => {
        const {person: {name} = {}} = !!crew?.length && (crew.find(({role: {job}}) => job === "Director") ?? {});
        setDirector(name);
    }, [crew]);

    return (
        <ListItemButton onClick={handleClick} data-testid={id}>
            <ListItemText
                primary={`${name} (${year})`}
                secondary={
                    <Grid container component="span" spacing={1}>
                        <Grid item component="span" sx={{display: 'flex'}}>
                            <StarIcon fontSize="small"/>
                            {score}
                        </Grid>
                        <Grid item component="span">{genreString}</Grid>
                    </Grid>
                }
            />
        </ListItemButton>
    );
};
export default MovieItem;