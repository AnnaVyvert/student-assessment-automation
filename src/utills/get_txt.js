export async function get_txt(path){
  return fetch(path)
  .then(response => response.text())
  .then((data) => {
    return data
  })
}