//サーバーサイド実装

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 静的ファイルの配信設定(publicフォルダの中身を公開)
app.use(express.static(path.join(__dirname, "public")));

// サーバー起動時に一度だけ読み込む
let cityData = [];
try {
  const jsonFilePath = path.join(__dirname, "data", "cityName.json");
  const fileData = fs.readFileSync(jsonFilePath, "utf-8");
  cityData = JSON.parse(fileData);
} catch (error) {
  console.error("Error reading cityName.json at startup:", error);
  // ファイルがなければから配列にしておく
  cityData = [];
}

// /api/cities エンドポイント
app.get("/api/cities", (req, res) => {
  try {
    // cityDataは既に読み込まれているので、直接返すだけ
    res.json(cityData);
  } catch (error) {
    console.error("Error returning cityData:", error);
    res.status(500).json({ error: "Failed to fetch city data" });
  }
});

// 天気APIエンドポイント
app.get("/weather", async (req, res) => {
  try {
    // .envで読み込んだAPIキーを使用
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    // クエリで受け取る
    // /weather?lnglat=${lnglat}
    const lnglat = req.query.lnglat;

    // lnglatをカンマで分割して数値に変換
    const [longitude, latitude] = lnglat.split(",").map(Number);

    // 天気APIのURLを組み立て
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }

    const json = await response.json();

    // クライアント側に必要なデータのみレスポンスとして返す
    res.json({ weather: json });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Node.jsのExpressサーバーを起動する
// PORT（3000）番ポートでサーバーの待ち受けを開始します
app.listen(PORT, () => {
  // サーバーが正常に起動したら実行される
  // ブラウザからhttp://localhost:3000にアクセスできるようになる
  console.log(`Server is running on http://localhost:${PORT}`);
});
