window.onload = function () {
  const requestButton = document.getElementById("js-weather-request");
  requestButton.addEventListener("click", async function () {
    //ドロップダウンメニューの都市のidを取得
    const dropDown = document.getElementById("js-choose-city");
    const cityId = dropDown.value;

    //api叩く
    const weatherData = await requestData(cityId);

    //取得したデータをHTMLにする。requestDataが完了するまで実行されない。
    setDataToHtml(weatherData);
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

    console.log(json);
    return {
      cityName: cityName,
      date: date,
      weatherImage: weatherImage,
      maxTemp: maxTemp,
      minTemp: minTemp,
    };
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

//取得したデータをhtml要素に入れる
function setDataToHtml(weatherData) {
  var cityNameText = document.getElementById("js-city-name");
  var dateText = document.getElementById("js-date");
  var image = document.getElementById("js-weather-image");
  if (image.querySelector("img")) {
    var imgElement = image.querySelector("img");
    image.removeChild(imgElement);
  } else {
    var imgElement = document.createElement("img");
  }
  var tempText = document.getElementById("js-temp");

  cityNameText.innerText = weatherData.cityName;
  dateText.innerText = weatherData.date;
  imageUrl = weatherData.weatherImage;
  imgElement.src = weatherData.weatherImage;
  imgElement.alt = "天気のアイコン画像";
  image.appendChild(imgElement);
  tempText.innerText = weatherData.maxTemp + " / " + weatherData.minTemp;
}
