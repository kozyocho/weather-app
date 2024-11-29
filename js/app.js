window.onload = function () {
  const requestButton = document.getElementById("js-weather-request");
  requestButton.addEventListener("click", function () {
    //入力された都市名を取得
    //const cityName = document.getElementById("js-input").value;

    //ドロップダウンメニューの都市のidを取得
    const dropDown = document.getElementById("js-choose-city");
    const cityId = dropDown.value;

    //api叩く
    requestData(cityId);
  });
};

async function requestData(cityId) {
  //フェッチするリソースの定義
  const url = `https://weather.tsukumijima.net/api/forecast/city/${cityId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }

    const json = await response.json();

    //都市名取得
    const cityName = json.location.city;

    //日にちを取得
    const date = json.forecasts[0].date;

    //天気画像取得
    const weatherImage = json.forecasts[0].image.url;

    //最高気温取得
    const maxTemp = json.forecasts[0].temperature.max.celsius;

    //最低気温取得
    const minTemp = json.forecasts[0].temperature.min.celsius;

    console.log(cityName);
    console.log(date);
    console.log(weatherImage);
    console.log(maxTemp);
    console.log(minTemp);
  } catch (error) {
    console.error(error.message);
  }
}

//取得したデータをhtml要素に入れる

/*
天気予報アプリ作成手順
1. プルダウンで都市を選択できるようにする　完了
2. 選択した都市をキーとして該当するidを取得　完了
3. 取得したidをurlの末尾に入れる 完了
4. 都市名、日にち、天気画像、最高気温、最低気温を取得
*/
