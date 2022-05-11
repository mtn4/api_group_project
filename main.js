let cont = document.querySelector(".cont");
let search = document.querySelector("input");
search.addEventListener("keyup", searchFunc);
let select = document.querySelector("select");
select.addEventListener("change", selectSearchFunc);
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
  cont.innerHTML = `<div class="category row">
  <div class="rowItem">ID</div>
  <div class="rowItem">First Name</div>
  <div class="rowItem">Last Name</div>
  <div class="rowItem">Capsule</div>
  <div class="rowItem">Age</div>
  <div class="rowItem">City</div>
  <div class="rowItem">Gender</div>
  <div class="rowItem">Hobby</div>
  </div>`;

  for (let i = 0; i < peopleObjArray.length; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let item in peopleObjArray[i]) {
      row.setAttribute("id", peopleObjArray[i].id);
      let itemOfRow = document.createElement("div");
      itemOfRow.textContent = peopleObjArray[i][item];
      itemOfRow.classList.add("rowItem");
      row.appendChild(itemOfRow);
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
    row.appendChild(btnCont);
    btnCont.appendChild(btnEdit);
    btnCont.appendChild(btnDelete);
    cont.appendChild(row);
  }
}
function myEditFunc() {
  //todo
}
function myDeleteFunc(e) {
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
  cont.innerHTML = ``;
  drawTable(peopleObjArray);
}
