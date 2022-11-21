import axios from "axios";
// import { getLocalIP } from "../utills/get_local_ip";
// const ip = await getLocalIP()

const xhr = new XMLHttpRequest();

// var base = `http://${get_ip()}:8080`
// var base = 'http://192.168.182.150:8080'
const base = "http://localhost:8080/api/";


export function get_req(url) {
  try {
    xhr.open("GET", base + url, false); // false for synchronous request
    xhr.send();
  } catch {
    return [{}];
  }

  return xhr.response === "" ? [{}] : JSON.parse(xhr.response);
}

export async function async_get(url) {
  const answer = await axios.get(base + url).then(function (response) {
    return response.data;
  });
  return answer;
}

export function post_req(url, data) {
  xhr.open("POST", base + url);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(data);
}

export async function async_post(url, data) {
  await axios.post(base + url, data, { "Content-Type": "application/json" });
}

export function del_req(url, data) {
  xhr.open("DELETE", base + url);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  // xhr.onload = () => {
  //     if (xhr.status !== 200) console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`)
  // }
  xhr.send(data);
}

export function put_req(url, data) {
  xhr.open("PUT", base + url);
  xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhr.send(data);
}

export async function async_put(url) {
  await axios.put(base + url);
}

export function account_req(login, password) {
  const acc_data = get_req(`/api/account/${login}/${password}`)[0];
  // console.log(Object.keys(acc_data).length)
  if (Object.keys(acc_data).length === 1) {
    acc_data.empty = true;
  } else {
    acc_data.empty = false;
    window.localStorage.login = acc_data.login;
    window.localStorage.password = acc_data.password;
  }
  acc_data.rights = JSON.stringify(acc_data.role.default);
  window.localStorage.rights = acc_data.rights;
  window.localStorage.special = JSON.stringify(acc_data.role.special);
  acc_data.special_rights = JSON.stringify(acc_data.role.special);
  return acc_data;
}

export function account_validate() {
  if (window.localStorage.login && window.localStorage.password) {
    const acc_data = account_req(window.localStorage.login, window.localStorage.password);
    return acc_data.role;
  } else {
    const rights = get_req("/api/account/guest/rights")[0];
    // console.log(rights)
    window.localStorage.rights = JSON.stringify(rights.role.default);
    return rights.role;
  }
}

export async function get_ip() {
  const res = await axios.get("https://geolocation-db.com/json/");
  console.log(res.data);
  return res.data.IPv4;
}

// xhr.onload = function() {
//     if (xhr.status !== 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
//       alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
//     } else { // если всё прошло гладко, выводим результат
//       alert(`Готово, получили ${xhr.response.length} байт`); // response -- это ответ сервера
//     }
//   };

//   xhr.onprogress = function(event) {
//     if (event.lengthComputable) {
//       alert(`Получено ${event.loaded} из ${event.total} байт`);
//     } else {
//       alert(`Получено ${event.loaded} байт`); // если в ответе нет заголовка Content-Length
//     }

//   };

//   xhr.onerror = function() {
//     alert("Запрос не удался");
//   };

// const https = require('http');

// const options = {
//   hostname: 'localhost',
//   port: 8080,
//   path: '/api/competition',
//   method: 'GET',
// };

// const req = https.request(options, res => {
//   console.log(`statusCode: ${res.statusCode}`);

//   res.on('data', d => {
//     process.stdout.write(d);
//   });
// });

// req.on('error', error => {
//   console.error(error);
// });

// req.end();
