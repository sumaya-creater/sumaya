
const userNameInput = document.getElementById("userNameId");
const locationInput = document.getElementById("locationId");
const ageInput = document.getElementById("ageId");
const submitForm = document.getElementById("editStudentId");


const IDofStudent = window.location.href.split("?")[1];
let newUsername = ''
let newUserLocation = ''
let newUserAge = 0

const studentData = () => {
  fetch(`http://localhost:3000/student/${IDofStudent}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
    //   console.log("this is data :", data[0]);
      if (data[0] == undefined) {
        studentModel.classList = "hideTable";
        window.location.replace("/");
      }
      userNameInput.value = data[0].username;
      locationInput.value = data[0].location;
      ageInput.value = data[0].age;
      newUserLocation = locationInput.value

    });
  });
};
studentData()

userNameInput.addEventListener('keyup',(e)=>{
    newUsername = e.target.value
})
locationInput.addEventListener('keyup',(e)=>{
    newUserLocation = e.target.value
})
ageInput.addEventListener('keyup',(e)=>{
    newUserAge = e.target.value
})

function saveUserData() {
    if ((newUsername == "") | (newUserLocation == "") | (newUserAge == "")) {
      return console.log("you must provide all field");
    }
  
    fetch(`http://localhost:3000/api/update/${IDofStudent}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName:newUsername, userLocation:newUserLocation, userAge:newUserAge }),
    }).then((res) => {
      console.log(res, "this is the response");
    });
  }

submitForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    saveUserData()
    console.log({newUsername,newUserLocation,newUserAge});
    
})
console.log("hello", IDofStudent);
