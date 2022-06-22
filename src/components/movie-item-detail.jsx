/**
 * @param data - received wikipedia data
 * @param data.extract - text content of received wikipedia data
 * @param data.pageid - page id of received wikipedia data
 * @param data.extlinks - imdb link of received wikipedia data
 */

import {forwardRef, useEffect, useState, ReactElement, Ref} from "react";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Slide,
    Backdrop,
    Button,
    DialogContentText,
    DialogTitle,
    IconButton
} from "@mui/material";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import {TransitionProps} from "@mui/material/transitions";

const getValueOfKey = items => Object.keys(items).map((key) => items[key]);

const Transition = forwardRef(
    (
        props: TransitionProps & {
            children: ReactElement<any, any>;
        },
        ref: Ref<unknown>,
    ) => <Slide direction="up" ref={ref} {...props} />
);

export const REST_URL = 'https://en.wikipedia.org/w/api.php';
export const {params} = {
    params: {
        action: "query",
        format: "json",
        origin: "*",
        prop: "extlinks|templates|extracts",
        generator: "search",
        gsrsort: "relevance",
        gsrlimit: 10,
        ellimit: 500,
        elprotocol: 'https',
        elquery: "www.imdb.com",
        tltemplates: "Template:Infobox film",
        exintro: 1,
        explaintext: 1
    }
};

const fetchWikipedia = async (name, year, director = '', params, url) => {
    const gsrSearchParam = `gsrsearch=${encodeURIComponent(name)} (${year} film) ${encodeURIComponent(director)}`;
    return await axios.get(
        url + "?" + gsrSearchParam,
        {params}
    );
};

const pageFilter: function = (data = {}, name) => {
    const pages = data?.query?.pages || {};
    const contentFilter = new RegExp(name.replaceAll(/\s?[&:]\s?/ig,'|'));
    const sortedByRelevance = getValueOfKey(pages).sort((a, b) => a.index - b.index);
    return sortedByRelevance.find(
        ({templates, extract} = {}) => !!templates && contentFilter.test(extract)
    );
}

const MovieItemDetail: function = ({wikiSearchData: {id, name, year, director}, open, setOpen, setMovieSearchData}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const handleClose: function = () => setOpen(false);

    const handleClick: function = () => {
        setOpen(false);
        setMovieSearchData({
            needle: id,
            relatedTo: name
        });
    };

    useEffect(() => {
        if (!name) return;
        setLoading(true);
        fetchWikipedia(name, year, director, params, REST_URL).then(
            response => setData(pageFilter(response?.data, name) ?? name)
        )
    }, [director, name, year]);

    useEffect(() => {
        if (!data) return;
        setLoading(false);
    }, [data, setOpen]);

    if (loading) return <Backdrop open={loading}><CircularProgress/></Backdrop>;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby={id?.toString()}
            aria-describedby={`${id}-description`}
            disableScrollLock
            hideBackdrop={true}
            PaperProps={{sx: {boxShadow: "none", borderWidth: "1px", borderStyle: "solid"}}}
            TransitionComponent={Transition}
        >
            <DialogTitle>
                {name}
                <IconButton aria-label="close" onClick={handleClose} sx={{position: 'absolute', right: 8, top: 8}}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText id={`${id}-description`} align="justify">
                    {!data?.extract ?
                        'Cannot find page for "' + name + '" on Wikipedia.'
                        : (data?.extract).split('\n')[0]}
                </DialogContentText>
            </DialogContent>
            {!!data?.extract &&
                <DialogActions>
                    <Button
                        href={`https://en.wikipedia.org/?curid=${data?.pageid}`}
                        target="_blank">WIKIPEDIA</Button>
                    {!!data?.extlinks &&
                        <Button
                            href={getValueOfKey(data?.extlinks[0]).toString()}
                            target="_blank">IMDB</Button>
                    }
                    <Button data-testid={`movieSearch-${id}`}
                            onClick={handleClick}>RELATED</Button>
                </DialogActions>
            }
        </Dialog>
    );
};
export default MovieItemDetail;