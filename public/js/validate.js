var nameError = document.getElementById("name-error");
var emailError = document.getElementById("email-error");
var collegeError = document.getElementById("college-error");
var phoneError = document.getElementById("mobile-error");
var submitError = document.getElementById("submit-error");
var submitBtn = document.getElementById("submitBtn");

function validatename() {
  var name = document.getElementById("name").value;
  if (name.length == 0) {
    nameError.style.color = "red";
    nameError.innerHTML = "please enter name";
    return false;
  }
  nameError.style.color = "green";
  nameError.style.animation = "none";
  nameError.innerHTML = "valid name";
  return true;
}

function validateCollegeName() {
  var college = document.getElementById("collegeName").value;
  if (college.length == 0) {
    collegeError.style.color = "red";
    collegeError.innerHTML = "please enter college Name";
    return false;
  }
  collegeError.style.color = "green";
  collegeError.style.animation = "none";
  collegeError.innerHTML = "valid college Name";
  return true;
}

function validatecontact() {
  var contact = document.getElementById("mobile").value;

  function validatePhoneNumber(contact) {
    // Regular expression to match exactly 10 digits and only numeric characters
    var regex = /^\d{10}$/;
    return regex.test(contact);
}


  if (validatePhoneNumber(contact)) {
    phoneError.style.animation = "none";
    phoneError.innerHTML = " valid contact";
    phoneError.style.color = "green";
    return true;
  } else {
    phoneError.style.color = "red";
    phoneError.innerHTML = "please enter valid contact";
    return false;
  } 



  if (contact.length == 0) {
    phoneError.style.color = "red";
    phoneError.innerHTML = "please enter valid contact";
    return false;
  }
  if (contact.length < 10) {
    phoneError.style.color = "red";
    phoneError.innerHTML = "please enter valid contact";
    return false;
  }
  if (contact.length > 10) {
    phoneError.style.color = "red";
    phoneError.innerHTML = "please enter valid contact";
    return false;
  }
  if (contact.length === 10) {
    phoneError.style.animation = "none";
    phoneError.innerHTML = " valid contact";
    phoneError.style.color = "green";
    return true;
  }
}

function validatemail() {
  var email = document.getElementById("email").value;
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    emailError.style.animation = "none";
    emailError.innerHTML = " valid email";
    emailError.style.color = "green";
    return true;
  } else {
    // Invalid email
    emailError.style.color = "red";
    emailError.innerHTML = "please enter valid email";
    return false;
  }
}
const successAlert = document.getElementById("success");
const errorAlert = document.getElementById("error");

function validateform() {
  console.log("hiii");
  if (
    !validatename() ||
    !validatemail() ||
    !validateCollegeName() ||
    !validatecontact() ||
    !isFileUploaded()
  ) {
    submitError.style.color = "red";
    submitError.style.display = "block";
    submitError.innerHTML = "please check the details ";

    setTimeout(function () {
      submitError.style.display = "none";
    }, 3000);
    return false;
  }

  setTimeout(function () {
    submitError.style.display = "none";
  }, 8000);

  return true;
}
function isFileUploaded() {
  const fileInput = document.getElementById("paymentImage");
}
