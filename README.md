# **Create Ideas**

<img width="1434" alt="スクリーンショット 2021-02-12 10 28 03" src="https://user-images.githubusercontent.com/47450240/107727731-57de2980-6d2f-11eb-985a-cd11a4870c4c.png">

## **APP URL**

https://create-ideas-cea7b.web.app/

## **概要**

文字、線、付箋を自由に配置し  
リアルタイムにアイデアを創造し共有することができるアプリです。

![共有](https://user-images.githubusercontent.com/47450240/107727415-98897300-6d2e-11eb-9036-4003f361e607.gif)

## **用語**

- Canvas：アイデア出しをするための場所
- Material：Canvas の中に配置するモノ
  - 付箋：背景色のある、文字を入力できるモノ
  - ラベル：背景色はないが、文字入力ができるモノ
  - 線：縦または横に線が引けるモノ

## **機能**

### **ユーザー登録**

Google アカウントもしくはメールアドレスで登録可能

### **ユーザー情報編集**

ユーザー名、プロフィール画像の変更  
 (※テストユーザーは変更不可)  
 <img width="585" alt="スクリーンショット 2021-02-12 10 34 37" src="https://user-images.githubusercontent.com/47450240/107720646-1c872f00-6d1e-11eb-8b41-ed89b7ccb9c8.png">

### **ログイン/ログアウト**

### **Canvas 作成**

作成時にテンプレート(雛形)を適用できる。

- ToDo
- PDCA
- SWOT  
  ![createCanvas](https://user-images.githubusercontent.com/47450240/107724362-0df14580-6d27-11eb-9097-46531995ec64.gif)

### **リアルタイムに共有**

![共有](https://user-images.githubusercontent.com/47450240/107727415-98897300-6d2e-11eb-9036-4003f361e607.gif)

### **Material**

- ### **Material 共通機能**

  新規作成、削除、移動、前面背面へ移動、ロック機能  
   ![material](https://user-images.githubusercontent.com/47450240/107724846-29108500-6d28-11eb-9ea0-c084231324f4.gif)

- ### **付箋**

  新規作成(色を選べる)、サイズの変更、色の変更、文字入力/変更

    <img width="188" alt="スクリーンショット 2021-02-12 11 54 09" src="https://user-images.githubusercontent.com/47450240/107725192-0b8feb00-6d29-11eb-9e02-5f1e449fe010.png">

- ### **ラベル**
  サイズ変更、文字入力/変更  
   <img width="188" alt="スクリーンショット 2021-02-12 11 56 10" src="https://user-images.githubusercontent.com/47450240/107725361-6c1f2800-6d29-11eb-9ece-c2ded53944d8.png">
- ### **線**
  新規作成(横/縦を選べる)  
   <img width="188" alt="スクリーンショット 2021-02-12 11 58 31" src="https://user-images.githubusercontent.com/47450240/107725450-ab4d7900-6d29-11eb-8066-39b547e3ee6d.png">

### **画像出力**

右クリックメニューより png 出力ができます。  
 ![](https://user-images.githubusercontent.com/47450240/107719806-653de880-6d1c-11eb-87b5-63b2cae2c3f6.gif)

## **技術**

- Firebase
  - Authentication：アカウントの権限周り
  - Cloud Firestore：リアルタイムにデータを更新するため
  - Storage：プロフィール画像、Canvas のサムネイルを保存
- React 16.14.0
- TypeScript 4.1.5
- Next.js 10.0.0
