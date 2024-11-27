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

  console.log("url: " + url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }

    const json = await response.json();

    const data = json["forecasts"][0]["dateLabel"];

    //console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

/*
天気予報アプリ作成手順
1. プルダウンで都市を選択できるようにする　完了
2. 選択した都市をキーとして該当するidを取得　完了
3. 取得したidをurlの末尾に入れる
*/
