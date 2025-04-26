const submitGrade = document.getElementById("submitGrade");
const selectSubject = document.getElementById("selectSubject");
const selectType = document.getElementById("selectType");
const pointInput = document.getElementById("pointInput");
const maxPointInput = document.getElementById("maxPointInput");
const gradeTitle = document.getElementById("gradeTitle");
// let subject = selectSubject.value
//global variables
let subjectSelected = "";
let TypeSelected = "";
let point = 0;
let maxPoint = 0;
const IDofStudent = window.location.href.split("?")[1];

selectSubject.addEventListener("change", () => {
  subjectSelected = selectSubject.value;
});
selectType.addEventListener("change", () => {
  TypeSelected = selectType.value;
});

pointInput.addEventListener("keyup", (e) => {
  point = e.target.value;
});
maxPointInput.addEventListener("keyup", (e) => {
  maxPoint = e.target.value;
});

const studentData = () => {
  fetch(`http://localhost:3000/student/${IDofStudent}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
      if (data[0] == undefined) {
        window.location.replace("/");
      }
      gradeTitle.innerText = `Add grade for ${data[0].username}`;
    });
  });
};

studentData();


function saveGradeData() {
  fetch("http://localhost:3000/api/save-grade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: IDofStudent,
      subjectSelected,
      TypeSelected,
      point,
      maxPoint,
    }),
  }).then((res) => {
    console.log(res, "this is the response");
  });
}

if (submitGrade) {
  submitGrade.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log({ subjectSelected, TypeSelected, point, maxPoint });

    saveGradeData();
    window.location.replace(`/?${IDofStudent}`);
  });
}

if (!IDofStudent) {
  window.location.replace("/");
} 

// studentData()
