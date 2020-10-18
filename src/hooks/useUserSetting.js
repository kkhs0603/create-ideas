import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import firebase, { storage } from "../firebase/firebase";

export const useUserSetting = () => {
  const { user, handleGoBack } = useContext(AuthContext);
  const [username, setUserName] = useState(user.displayName);
  const [tempUserImage, setTempUserImage] = useState("");
  const imgUrl = tempUserImage === "" ? user.photoURL : tempUserImage;

  const handleUserNameOnChanged = useCallback(
    (event) => {
      setUserName(event.target.value);
    },
    [setUserName]
  );
  //ユーザー情報更新
  const handleUpdateUserSetting = async () => {
    try {
      await user.updateProfile({ photoURL: imgUrl, displayName: username });
    } catch (error) {
      console.log(error);
    }
    handleGoBack();
  };
  //画像をstorageにupload
  const handleUploadImage = (event) => {
    console.log(event);
    const image = event.target.files[0];
    const uploadTask = storage.ref(`/images/${user.uid}`).put(image);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      next,
      error,
      complete
    );
  };
  const next = (snapshot) => {
    // 進行中のsnapshotを得る
    // アップロードの進行度を表示
    const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(percent + "% done");
    console.log(snapshot);
  };
  const error = (error) => {
    // エラーハンドリング
    console.log(error);
  };
  const complete = () => {
    // 完了後の処理
    // 画像表示のため、アップロードした画像のURLを取得
    //TODO:try catch
    //TODO:await
    storage
      .ref("images")
      .child(user.uid)
      .getDownloadURL()
      .then((fireBaseUrl) => {
        setTempUserImage(fireBaseUrl);
      });
  };

  return [
    handleUpdateUserSetting,
    handleUserNameOnChanged,
    username,
    handleGoBack,
    imgUrl,
    handleUploadImage,
  ];
};
