class HttpClient {
  constructor() {
    this.get = function (url, callback) {
      let HttpRequest = new XMLHttpRequest();
      HttpRequest.onreadystatechange = function () {
        if (HttpRequest.readyState == 4 && HttpRequest.status == 200)
          callback(HttpRequest.responseText);
      };
      HttpRequest.open("GET", url, true);
      HttpRequest.send(null);
    };
  }
}
