/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import categoryStrcture from "../../data/category-strcture";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SubMenu from "./SubMenu";
import { Slide } from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        minHeight: `calc(100vh - 70px)`,
        backgroundColor: "white",
    },
});

export default function MobileDropdownMenu({ open, onSelect }) {
    const classes = useStyles();
    const history = useHistory();

    const handleSelectCategory = (id) => {
        onSelect();
        history.push(`/category/${id}`);
    };

    const handleHomeButtom = () => {
        onSelect();
        history.push("/");
    };

    const rederCategories = useCallback((categories) => {
        return categories.map((category, key) => {
            if (category.subCategories) {
                return (
                    <SubMenu key={key} label={category.name}>
                        {rederCategories(category.subCategories)}
                    </SubMenu>
                );
            }
            return (
                <ListItem key={key} button onClick={() => handleSelectCategory(category.id)}>
                    <ListItemText primary={category.name} />
                </ListItem>
            );
        });
    }, []);

    return (
        <Slide timeout={300} direction="right" in={open} mountOnEnter unmountOnExit>
            <List component="nav" aria-labelledby="nested-sub-menu" className={classes.root}>
                <ListItem button onClick={handleHomeButtom}>
                    <ListItemText primary="Home" />
                </ListItem>
                {rederCategories(categoryStrcture)}
            </List>
        </Slide>
    );
}
