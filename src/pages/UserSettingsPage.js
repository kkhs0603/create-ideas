import React from "react";
import Layout from "../components/templates/Layout/Layout";
import { Button, TextField, Avatar } from "@material-ui/core";
import { useUserSetting } from "../hooks/useUserSetting";

const UserSettingsPage = () => {
  const [
    handleUpdateUserSetting,
    handleUserNameOnChanged,
    username,
    handleGoBack,
    imageUrl,
    handleSaveTempImage,
  ] = useUserSetting();
  return (
    <Layout>
      <div>user settings</div>
      <Avatar alt="user" src={imageUrl} />
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateUserSetting}
      >
        保存
      </Button>
    </Layout>
  );
};

export default UserSettingsPage;
