let cont = document.querySelector(".cont");
let search = document.querySelector("input");
search.addEventListener("keyup", searchFunc);
let select = document.querySelector("select");
select.addEventListener("change", selectSearchFunc);
let btnReset = document.querySelector("#reset");
btnReset.addEventListener("click", resetFunc);
let category = document.querySelector(".category");
category.addEventListener("click", sortTable);
let loader = document.getElementById("loader");
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
  for (let i = 0; i < peopleObjArray.length; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let item in peopleObjArray[i]) {
      row.setAttribute("id", peopleObjArray[i].id);
      let itemOfRow = document.createElement("div");
      itemOfRow.textContent = peopleObjArray[i][item];
      itemOfRow.classList.add("rowItem");
      itemOfRow.dataset.type = item;
      row.appendChild(itemOfRow);
      if (item === "city") {
        itemOfRow.addEventListener("click", fetchWeather);
      }
    }
    let btnCont = document.createElement("div");
    btnCont.classList.add("rowItem");
    btnCont.classList.add("btnCont");
    let btnEdit = document.createElement("div");
    btnEdit.textContent = "edit ";
    btnEdit.classList.add("btnEdit");
    btnEdit.addEventListener("click", myEditFunc);
    let btnDelete = document.createElement("div");
    btnDelete.textContent = "delete ";
    btnDelete.classList.add("btnDelete");
    btnDelete.addEventListener("click", myDeleteFunc);
    let btnCancel = document.createElement("div");
    btnCancel.textContent = "cancel ";
    btnCancel.classList.add("btnDelete");
    let btnConfirm = document.createElement("div");
    btnConfirm.textContent = "confirm ";
    btnConfirm.classList.add("btnDelete");
    btnCancel.style.display = "none";
    btnConfirm.style.display = "none";
    row.appendChild(btnCont);
    btnCont.appendChild(btnEdit);
    btnCont.appendChild(btnDelete);
    btnCont.appendChild(btnCancel);
    btnCont.appendChild(btnConfirm);
    cont.appendChild(row);
  }
  loader.style.display = "none";
}
function myEditFunc(e) {
  const btnEdit = e.target;
  const btnDelete = e.target.parentElement.children[1];
  const btnCancel = e.target.parentElement.children[2];
  const btnConfirm = e.target.parentElement.children[3];
  btnEdit.style.display = "none";
  btnDelete.style.display = "none";
  btnCancel.style.display = "block";
  btnConfirm.style.display = "block";
  let rowObj = {};
  let personObj = peopleObjArray.find(
    (element) => element.id === e.target.parentElement.parentElement.id
  );
  for (let i = 1; i < 8; i++) {
    let originalRow = e.target.parentElement.parentElement.children[i];
    // let type = originalRow.dataset.type;
    rowObj[i] = originalRow.innerText;
    originalRow.innerHTML = `<input type="text" placeholder="${rowObj[i]}"> `;
  }
  btnCancel.addEventListener("click", () => {
    for (let i = 1; i < 8; i++) {
      let originalRow = e.target.parentElement.parentElement.children[i];
      originalRow.innerHTML = `<div class="rowItem">${rowObj[i]}</div>`;
    }
    btnEdit.style.display = "block";
    btnDelete.style.display = "block";
    btnCancel.style.display = "none";
    btnConfirm.style.display = "none";
  });
  btnConfirm.addEventListener("click", () => {
    const fieldInput = document.querySelectorAll("input");
    for (let i = 1; i < 8; i++) {
      let originalRow = e.target.parentElement.parentElement.children[i];
      let type = originalRow.dataset.type;
      if (fieldInput[i].value === "") {
        originalRow.innerHTML = `<div class="rowItem">${rowObj[i]}</div>`;
      } else {
        originalRow.innerHTML = `<div class="rowItem">${fieldInput[i].value}</div>`;
        personObj[type] = fieldInput[i].value;
        rowObj[i] = fieldInput[i].value;
        // console.log(personObj);
      }
    }
    btnEdit.style.display = "block";
    btnDelete.style.display = "block";
    btnCancel.style.display = "none";
    btnConfirm.style.display = "none";
  });
}
function myDeleteFunc(e) {
  // console.log(e.target.parentElement.parentElement.id);
  const foundIndex = peopleObjArray.findIndex(
    (element) => element.id === e.target.parentElement.parentElement.id
  );
  // console.log(found);
  peopleObjArray.splice(foundIndex, 1);
  // console.log(peopleObjArray);
  e.target.parentElement.parentElement.remove();
}

function searchFunc() {
  for (let i = 1; i < cont.children.length; i++) {
    cont.children[i].style.display = "none";
    if (select.value === "all") {
      for (let j = 1; j < 8; j++) {
        if (cont.children[i].children[j].innerText.includes(search.value)) {
          cont.children[i].style.display = "flex";
          break;
        }
      }
    } else {
      if (
        cont.children[i].children[select.value].innerText.includes(search.value)
      ) {
        cont.children[i].style.display = "flex";
      }
    }
  }
}
function selectSearchFunc(e) {
  for (let i = 1; i < cont.children.length; i++) {
    cont.children[i].style.display = "flex";
  }
  searchFunc();
}
function resetFunc() {
  loader.style.display = "";
  const catRow = cont.children[0];
  cont.innerHTML = ``;
  peopleObjArray = [];
  cont.append(catRow);
  // drawTable(peopleObjArray);
  fetchData();
}

function sortTable(e) {
  // console.log(e.target.dataset.type);
  let type = e.target.dataset.type;
  peopleObjArray = peopleObjArray.sort((a, b) => a[type] > b[type]);
  // console.log(peopleObjArray);
  // category.innerHTML = ``;
  // drawTable(peopleObjArray);
  const catRow = cont.children[0];
  cont.innerHTML = ``;
  cont.append(catRow);
  drawTable(peopleObjArray);
  // console.log(cont.children[0]);
}
async function fetchWeather(e) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=4104df9426b64469a92191323221105&q=${e.target.textContent}`
  );
  const data = await response.json();
  // console.log(response.ok);
  if (response.ok) {
    // console.log(data.current.temp_c);
    let city = e.target.textContent;
    e.target.innerText = `Temp: ${data.current.temp_c}c`;
    setTimeout(() => {
      e.target.innerText = `${city}`;
    }, 2500);
  }
}
