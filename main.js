let cont = document.querySelector(".cont");
let search = document.querySelector("input");
search.addEventListener("keyup", searchFunc);
let select = document.querySelector("select");
let btnReset = document.querySelector("#reset");
btnReset.addEventListener("click", resetFunc);

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
  cont.innerHTML = `<div class="category row">
  <div class="categoryItem">First Name</div>
  <div class="categoryItem">Last Name</div>
  <div class="categoryItem">Capsule</div>
  <div class="categoryItem">Age</div>
  <div class="categoryItem">City</div>
  <div class="categoryItem">Gender</div>
  <div class="categoryItem">Hobby</div>
  </div>`;

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
    let btnEdit = document.createElement("div");
    btnEdit.textContent = "edit ";
    btnEdit.addEventListener("click", myEditFunc);
    let btnDelete = document.createElement("div");
    btnDelete.textContent = "delete ";
    btnDelete.addEventListener("click", myDeleteFunc);
    row.appendChild(btnEdit);
    row.appendChild(btnDelete);
    cont.appendChild(row);
  }
}
function myEditFunc() {
  //todo
}
function myDeleteFunc() {
  //todo
}
function searchFunc() {
  //todo
}
function resetFunc() {
  //todo
}
