import React from "react";
import Layout from "../components/templates/Layout/Layout";
import { Button, TextField, Avatar } from "@material-ui/core";
import { useUserSetting } from "../hooks/useUserSetting";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  large: {
    width: "50%",
    height: "50%",
  },
}));

const UserSettingsPage = () => {
  const [
    updateUserSetting,
    handleUserNameOnChanged,
    username,
    handleGoBack,
    imageUrl,
    handleSaveTempImage,
  ] = useUserSetting();
  const classes = useStyles();
  return (
    <Layout>
      <Avatar alt="user" src={imageUrl} className={classes.large} />
      <input type="file" onChange={handleSaveTempImage} />

      <TextField
        // className={classes.textField}
        id="username"
        label="UserName"
        type="text"
        autoComplete="off"
        helperText={""}
        fullWidth
        variant="outlined"
        defaultValue={username}
        onChange={handleUserNameOnChanged}
      />
      <Button variant="contained" onClick={handleGoBack}>
        戻る
      </Button>
      <Button variant="contained" color="primary" onClick={updateUserSetting}>
        保存
      </Button>
    </Layout>
  );
};

export default UserSettingsPage;
