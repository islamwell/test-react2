/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Box, Container, useTheme } from "@material-ui/core";
import { ListItem, RecentlyPlayed, TopChart } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Pagination from "@material-ui/lab/Pagination";

import { useData } from "../../hooks/useData";

import "./style.css"; // this style for the topchat
import { fetchTopChart } from "../../store/slices/playerSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#f7f7f7",
    minWidth: "1100px",
    minHeight: `calc(100vh - 120px)`,
    padding: theme.spacing(5, 0, 10, 0),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  
  title: {
    color: theme.palette.primary.dark,
  },
  
  recentContainer: {
    padding: theme.spacing(3),
    borderRadius: 10,
  },
  
}));

export default function Home() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { offlineMode } = useSelector((state) => state.download);
  const { playing, topChart } = useSelector((state) => state.player);

  const { loading, totalPages, currentPage, audioList, changePage } = useData({ offlineMode: offlineMode });

  const handleChangePage = (_, page) => {
    changePage(page);
  };

  const showPagination = (!loading && audioList.length > 0) || totalPages > 1;
  const matches = useMediaQuery(theme.breakpoints.down("xs"));


  useEffect(() => {
    dispatch(fetchTopChart());
  }, []);

  useEffect(() => {
    window?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div style={playing ? { paddingBottom: 150 } : { paddingBottom: 50 }} className={classes.root}>
      <Container maxWidth="md" >
        <Grid container spacing={3}  >
          <Grid item xs={12} className={classes.pos} >
            <TopChart data={topChart}  />
          </Grid>

          <Grid item xs={12} md={8}>
            <Box className={classes.title} mb={3} ml={1} fontSize="h4.fontSize" fontWeight="fontWeightBold">
              Recently Added
            </Box>
            {audioList.map((item) => {
              return <ListItem currentPlayingPosition="home" key={item.id} data={item} />;
            })}
            {showPagination && (
              <Box py={2} display="flex" justifyContent="flex-end">
                <Pagination
                  onChange={handleChangePage}
                  page={currentPage}
                  count={totalPages}
                  size={matches ? "small" : "large"}
                  variant="outlined"
                  shape="rounded"
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className={classes.title} mb={3} fontSize="h4.fontSize" fontWeight="fontWeightBold">
              History
            </Box>

            <RecentlyPlayed />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
