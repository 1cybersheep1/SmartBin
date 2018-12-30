function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function fetchData(url) {
  return fetch(url)
           .then(checkStatus)  
           .then(res => res.json())
}



