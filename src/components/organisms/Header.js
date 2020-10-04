import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../contexts/AuthContext";
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = () => {
  const classes = useStyles();
  const { user, signout, userSetting } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar>
      <Toolbar>
        <div className={classes.root}>
          <div className={classes.title}>Create Ideas</div>
          {user == null ? (
            <></>
          ) : (
            <div>
              {user.displayName + "さん"}
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={userSetting}>設定</MenuItem>
                <MenuItem onClick={signout}>サインアウト</MenuItem>
              </Menu>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
