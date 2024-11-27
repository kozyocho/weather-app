window.onload = function () {
  const requestButton = document.getElementById("js-weather-request");
  requestButton.addEventListener("click", function () {
    //入力された都市名を取得
    const cityName = document.getElementById("js-input").value;

    //api叩く
    requestData();
  });
};

async function requestData() {
  //フェッチするリソースの定義
  const url = "https://weather.tsukumijima.net/api/forecast/city/270000";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }

    const json = await response.json();

    const data = json["forecasts"][0]["dateLabel"];

    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

function searchPlace(cityName) {
  fetch();
}

/*
天気予報アプリ作成手順
1. プルダウンで都市を選択できるようにする
2. 選択した都市をキーとして該当するidを取得
3. 取得したidをurlの末尾に入れる
*/
