# url-shortener

<img src="https://miro.medium.com/max/1132/1*j3xVt5zsYuAB19-QATkk_w.png">
<img width="1290" alt="截圖 2022-08-17 14 44 51" src="https://user-images.githubusercontent.com/109747216/185140827-ca1bef4e-2c25-4ee8-a6cc-f4f44bb8530e.png">

## 專案功能
* 使用者可以在表單輸入原始網址，畫面會回傳格式化後的短網址
* 使用者可以按 Copy 來複製縮短後的網址
* 若使用者沒有輸入內容，就按下了送出鈕，需要防止表單送出並提示使用者

## 開始使用
1.確認已安裝Node.js  

2.將本專案clone進本地終端機

3.安裝套件
```js
npm i express@4.16.4 express-handlebars@3.0.0 
```

4. 資料庫連線設定，在 Terminal 輸入以下內容並替換帳號、密碼
```js
export MONGODB_URI="mongodb+srv://<your account>:<your password>@cluster0.mwwuoe5.mongodb.net/shorten-url?rretryWrites=true&w=majority"
```

5.執行專案
```js
npm run start
```
```js
npm run dev
```

6.瀏覽器上瀏覽專案
```js
App is running on http://localhost:3000

```

7.連接成功，終端機輸出
```js
mongodb connected

```

8.接著在瀏覽器輸入
```js
http://localhost:3000
```
