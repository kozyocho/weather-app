window.onload = function () {
  const requestButton = document.getElementById("js-weather-request");
  requestButton.addEventListener("click", async function () {
    //入力された文字列を取得
    const inputField = document.getElementById("js-input-city");
    const cityName = inputField.value.trim();

    if (!cityName) {
      alert("都市を入力してください。");
      return;
    }

    //JSONから部分一致する都市名を取得。オブジェクトを返す
    const lnglat = await searchJSON(cityName);

    console.log(lnglat);
    //api叩く
    //const weatherData = await requestData(cityId);

    //取得したデータをHTMLにする。requestDataが完了するまで実行されない。
    //setDataToHtml(weatherData);
  });
};

async function searchJSON(cityName) {
  try {
    // JSONファイルの読み込み
    const response = await fetch("../cityName.json");

    if (!response.ok) {
      throw new Error("JSONファイルの読み込みに失敗しました。");
    }

    const data = await response.json();

    // JSONデータから部分一致するデータを探す
    const result = data.find((item) => item.name.includes(cityName));

    console.log("json取得成功");

    return result ? result.lnglat : null;
  } catch (error) {
    console.error(`エラー： ${error}`);
    return null; // エラー時には null を返す
  }
}

async function requestData(cityId) {
  //フェッチするリソースの定義
  //const url = `https://weather.tsukumijima.net/api/forecast/city/${cityId}`;

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  //openweatherapi
  //const url = `https://api.openweathermap.org/data/2.5/weather?q={city_name}&units=metric&appid=${API_KEY}`;

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&units=metric&appid=${API_KEY}`;

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
