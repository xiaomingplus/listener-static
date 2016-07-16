import store from 'store';
export var  getQuery = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export var countDown = function(seconds,tick,end){
  let timer = setInterval(()=>{
    if(seconds===0){
      clearInterval(timer);
      end(seconds);
      return;
    }
    seconds--;
    tick(seconds);
  },1000);
  tick(seconds);
}

export var checkTel = function(value){
  const reg = /^1[0-9]{10}$/;
  return reg.test(value);
}

export var showError = function(element){
  element.classList.add("error-input");
  element.focus();
}
export var hideError = function(element){
  element.classList.remove("error-input")
}

export var checkValid = function(value){
  const reg = /\d{6}/;
  return reg.test(value);
}
export var request = function(uri, method = "get", body={}) {
  let host = "http://192.168.31.172:3000/",url="";
  let server = {
    'oauth2':"http://192.168.31.172:3001/",
    'api':"http://192.168.31.172:3000/"
  };

    return new Promise(function(s, f) {
      if(typeof uri === 'string'){
        url = host+uri;
      }else{
        if(uri.href){
          url = uri.href;
        }else if(uri.host && uri.path){
          url = uri.host + uri.path;
        }else if(uri.server && uri.path){
          url = server[uri.server]+uri.path;
        }else{
          f('uri params error!');
          return;
        }
      }
      let headers = {
          "Content-Type": "application/json"
      };
      let token = store.get('token');
      if(token){
        headers.Authorization = token;
      }

        var options = {
            method: method,
            headers: headers
        }
        if (method !== 'get' && method !== 'head') {
            options.body = JSON.stringify(body);
        }

        fetch(url, options).then(function(response) {
          // console.log(response);
            if (response.ok) {
                response.json().then(function(data) {
                  s(data);
                  return;
                }).catch(function(e) {
                    f(e);
                    return;
                });
            } else {

              response.json().then(function(data) {
                f(data);
                return;
              }).catch(function(e) {
                  f(e);
                  return;
              })
            }
        }).catch(function(e) {
            // console.log(e);
            f(e);
            return;
        })
    });
}
