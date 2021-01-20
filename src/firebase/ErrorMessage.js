const ErrorMessage = (e, method) => {
  switch (e.code) {
    case "auth/cancelled-popup-request":
    case "auth/popup-closed-by-user":
      return null;
    case "auth/email-already-in-use":
      if (method.indexOf("signup") !== -1) {
        return "このメールアドレスは使用されています";
      } else {
        return "メールアドレスまたはパスワードが違います";
      }
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません";
    case "auth/user-disabled":
      return "サービスの利用が停止されています";
    case "auth/user-not-found":
      return "メールアドレスまたはパスワードが違います";
    case "auth/user-mismatch":
      if (method === "signin/popup") {
        return "認証されているユーザーと異なるアカウントが選択されました";
      } else {
        return "メールアドレスまたはパスワードが違います";
      }
    case "auth/weak-password":
      return "パスワードは6文字以上にしてください";
    case "auth/wrong-password":
      return "メールアドレスまたはパスワードが違います";
    case "auth/popup-blocked":
      return "認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください";
    case "auth/operation-not-supported-in-this-environment":
    case "auth/auth-domain-config-required":
    case "auth/operation-not-allowed":
    case "auth/unauthorized-domain":
      return "現在この認証方法はご利用頂けません";
    case "auth/requires-recent-login":
      return "認証の有効期限が切れています";
    case "auth/email-verifying":
      return "ユーザーを登録しました。登録に使用したメールアドレスの受信トレイをご確認ください";
    case "auth/email-not-verified":
      return "メールアドレスの認証ができていません。受信トレイをご確認ください";
    default:
      if (method.indexOf("signin") !== -1) {
        return "認証に失敗しました。しばらく時間をおいて再度お試しください";
      } else {
        return "エラーが発生しました。しばらく時間をおいてお試しください";
      }
  }
};

export default ErrorMessage;
