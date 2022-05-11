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
  //todo categories
  cont.innerHTML = `<div class="category row">
  <div class="categoryItem">ID</div>
  <div class="categoryItem">First Name</div>
  <div class="categoryItem">Last Name</div>
  <div class="categoryItem">Capsule</div>
  <div class="categoryItem">Age</div>
  <div class="categoryItem">City</div>
  <div class="categoryItem">Gender</div>
  <div class="categoryItem">Hobby</div>
  </div>`;

  // console.log(peopleObjArray);
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
    btnEdit.textContent = "edit";
    btnEdit.addEventListener("click", myEditFunc);
    let btnDelete = document.createElement("div");
    btnDelete.textContent = "delete ";
    btnDelete.addEventListener("click", myDeleteFunc);
    let btnCancel = document.createElement("div");
    btnCancel.textContent = "Cancel";
    let btnConfirm = document.createElement("div");
    btnConfirm.textContent = "Confirm";
    btnCancel.style.display = "none";
    btnConfirm.style.display = "none";
    row.appendChild(btnEdit);
    row.appendChild(btnDelete);
    row.appendChild(btnCancel);
    row.appendChild(btnConfirm);
    cont.appendChild(row);
  }
}
function myEditFunc(e) {
  //todo
  // const originalRow = e.target.parentElement;
  rowObj = {};
  for (let i = 1; i < 8; i++) {
    let originalRow = e.target.parentElement.children[i];
    rowObj[i] = originalRow.innerText;
    originalRow.innerHTML = `<input type="text" placeholder="${rowObj[i]}"> `;
  }
  e.target.parentElement.children[8].style.display = "none";
  e.target.parentElement.children[9].style.display = "none";
  // for (let i = 1; i < 8; i++) {
  //   let originalRow = e.target.parentElement.children[i];
  //   const placeholderText = originalRow.innerText;
  //   originalRow.innerHTML = `<input type="text" placeholder="${placeholderText}"> `;
  // }
  // let cancelBtn = e.target.parentElement.children[8];
  // let confirmBtn = e.target.parentElement.children[9];
  // cancelBtn.innerHTML = "Cancel";
  // confirmBtn.innerHTML = "Confirm";
  // cancelBtn.addEventListener("click", () => {
  //   for (let i = 1; i < 8; i++) {
  //     let originalRow = e.target.parentElement.children[i];
  //     const placeholderText = originalRow.innerText;
  //     console.log(placeholderText);
  //     // originalRow.innerHTML = `<div class"rowItem">${placeholderText}</div> `;
  //   }
  // });
}
function myDeleteFunc() {
  //todo
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
  //todo
}
