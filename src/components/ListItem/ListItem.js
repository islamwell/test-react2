import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, IconButton, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { addToDowanloadingQueue } from "../../store/slices/downloadSlice";
import { changeURL } from "../../store/slices/playerSlice";
import { CheckCircleOutlineOutlined } from "@material-ui/icons";
import PauseCircleOutlineRoundedIcon from "@material-ui/icons/PauseCircleOutlineRounded";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import parse from "html-react-parser"

import { Image } from "../../components";
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    mainContainer: {
        display: "flex",
        marginBottom: theme.spacing(2),
        borderRadius: 10,
        overflow: "hidden",

        [theme.breakpoints.down("sm")]: {
            //padding: theme.spacing(3, 1, 3, 1),
        },

        [theme.breakpoints.up("sm")]: {
            //padding: theme.spacing(1, 1, 1, 1),
        },
    },
    title: {
        cursor: "pointer",
        [theme.breakpoints.down("sm")]: {
            fontSize: 14,
        },

        [theme.breakpoints.up("sm")]: {
            fontSize: 16,
        },
    },

    buttonContianer: {
        height: 26,
        width: 26,
    },
    image: {
        height: 100,
        width: 100,
    },

    buttonOutline: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        border: "solid 0.1rem green",
        height: 15,
        width: 15,
        margin: theme.spacing(0, 1, 0, 1),
        padding: 0,
    },

    button: {
        height: 12,
        width: 12,
        color: "green",
    },
}));

export default function ListItem({ data, currentPlayingPosition }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [isDownloaded, setIsDownloaded] = useState(false);
    const { downloadingIds } = useSelector((state) => state.download);
    const { id: currentPlayingId, playing } = useSelector((state) => state.player);

    const { id, name, link, image, categoryId, category_id, highlightName } = data;

    const handleDownload = async () => {
        if (isDownloaded) {
            try {
                const cache = await caches.open("audio_cache");
                const res = await cache.delete(new Request(link));
                if (res) setIsDownloaded(false);
            } catch (error) {}
        } else {
            dispatch(addToDowanloadingQueue({ name: name, id: id, link: link, progress: 0 }));
        }
    };

    const handlePlay = () => {
        dispatch(
            changeURL({
                name: name,
                link: link,
                id: id,
                image: image,
                categoryId: categoryId || category_id,
                currentPlayingPosition: currentPlayingPosition,
            })
        );
    };

    const togglePlay = () => {
        const player = document.getElementsByTagName("audio")[0];

        if (player) {
            if (player.paused) {
                player.play();
            } else {
                player.pause();
            }
        }
    };

    // useEffect(() => {
    //     caches
    //         .match(new Request(link))
    //         .then((res) => {
    //             if (res) setIsDownloaded(true); //checking whether already downloaaded
    //         })
    //         .catch((e) => {});
    // }, [downloadingIds, link]);

    return (
        <Paper variant="outlined" className={classes.mainContainer}>
            <Image src={image} className={classes.image} />
            <Box pl={1} py={1} display="flex" flexDirection="column" justifyContent="space-between">
                <Box display="flex" justifyContent="center" alignItems="center">
                    {id === currentPlayingId && (
                        <IconButton onClick={togglePlay} size="small">
                            {playing ? (
                                <PauseCircleOutlineRoundedIcon fontSize="large" style={{ color: "#179992" }} />
                            ) : (
                                <PlayCircleOutlineIcon fontSize="large" style={{ color: "#179992" }} />
                            )}
                        </IconButton>
                    )}

                    <Box
                        onClick={handlePlay}
                        className={classes.title}
                        textAlign="left"
                        fontWeight="fontWeightMedium"
                        fontSize="subtitle2.fontSize"
                        ml={1}
                        pr={1}
                    >
                        {highlightName ? parse(highlightName) : name}
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="flex-start">
                    <IconButton disabled={downloadingIds.includes(id)} onClick={handleDownload} size="small">
                        <CheckCircleOutlineOutlined style={isDownloaded ? { color: "green" } : { color: "gray" }} />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
}
