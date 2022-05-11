// async function getData() {
//   let fetchs = await fetch(
//     "https://capsules-asb6.herokuapp.com/api/teacher/mordi"
//   );
//   let data = await fetchs.json();
//   console.log(data);
//   drawTable(data);
// }
// getData();
let cont = document.querySelector(".cont");
let peopleObjArray = [];

async function fetchData() {
  const resp1 = fetch("https://capsules-asb6.herokuapp.com/api/teacher/toam/");
  const resp2 = fetch("https://capsules-asb6.herokuapp.com/api/teacher/mordi");
  const resp = await Promise.all([resp1, resp2]);
  for (let response of resp) {
    const data = await response.json();
    await Promise.all(
      data.map(async (e, i) => {
        let response2 = await fetch(
          `https://capsules-asb6.herokuapp.com/api/user/${data[i].id}`
        );
        let data2 = await response2.json();
        let obj = {
          id: data[i].id,
          firstName: data[i].firstName,
          lastName: data[i].lastName,
          capsule: data2.capsule,
          age: data2.age,
          city: data2.city,
          gender: data2.gender,
          hobby: data2.hobby,
        };
        peopleObjArray.push(obj);
      })
    );
  }
  drawTable(peopleObjArray);
}
fetchData();
function drawTable(peopleObjArray) {
  //todo categories

  console.log(peopleObjArray);
  for (let i = 0; i < peopleObjArray.length; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let item in peopleObjArray[i]) {
      let itemOfRow = document.createElement("div");
      itemOfRow.textContent = peopleObjArray[i][item];
      itemOfRow.classList.add("rowItem");
      row.appendChild(itemOfRow);
    }
    let btn1 = document.createElement("div");
    btn1.textContent = "edit ";
    let btn2 = document.createElement("div");
    btn2.textContent = "delete ";
    row.appendChild(btn1);
    row.appendChild(btn2);
    cont.appendChild(row);
  }
}
