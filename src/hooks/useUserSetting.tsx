import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import firebase from "../firebase/firebase";

export const useUserSetting = () => {
  const { user, handleGoBack, updateUser } = useContext(AuthContext);
  const [username, setUserName] = useState(user?.displayName);
  const [tempFile, setTempFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(user?.photoURL);

  const handleUserNameOnChanged = useCallback(
    (event) => {
      setUserName(event.target.value);
    },
    [setUserName]
  );
  //ユーザー情報更新
  const updateUserSetting = async () => {
    try {
      const url =
        tempFile !== null ? await uploadImage(tempFile) : user.photoURL;
      await user.updateProfile({ photoURL: url, displayName: username });
      await updateUser(user.uid, username, url);
      handleGoBack();
    } catch (error) {
      console.log(error);
    }
  };

  //TODO:hooksなど切り出す Util
  //画像をstorageにupload
  const uploadImage = (image) => {
    return new Promise((resolve, reject) => {
      const uploadTask = firebase.storage.ref(`/images/${user.uid}`).put(image);
      uploadTask.on(
        "state_changed",
        // 進行中のsnapshotを得る
        // アップロードの進行度を表示
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
          alert(error);
        },
        // 完了後の処理
        // 画像表示のため、アップロードした画像のURLを取得
        async () => {
          const imageUrl = await firebase.storage
            .ref("images")
            .child(user.uid)
            .getDownloadURL();
          await setImageUrl(imageUrl);
          resolve(imageUrl);
        }
      );
    });
  };

  //画像を一時保存
  const handleSaveTempImage = (event) => {
    try {
      const image = event.target.files[0];
      setTempFile(image);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      console.log("stored profile image");
    } catch (error) {
      console.log(error.message);
    }
  };

  return [
    updateUserSetting,
    handleUserNameOnChanged,
    username,
    handleGoBack,
    imageUrl,
    handleSaveTempImage,
  ];
};
