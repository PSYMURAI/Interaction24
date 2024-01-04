const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const collegeError = document.getElementById("college-error");
const phoneError = document.getElementById("mobile-error");
const submitError = document.getElementById("submit-error");
const submitBtn = document.getElementById("submitBt"); // Corrected the ID




document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});
function validateName() {
  const name = document.getElementById("name").value.trim(); // Trim to remove leading/trailing spaces
  const nameParts = name.split(/\s+/); // Split by spaces to get individual name parts

  if (nameParts.length < 3) {
    showError(nameError, "Please enter first name, middle name, and last name");
    return false;
  }

  // Check if each part is not empty
  for (const part of nameParts) {
    if (part.length === 0) {
      showError(nameError, "Each part of the name should not be empty");
      return false;
    }
  }

  showSuccess(nameError, "Valid name");
  return true;
}

function validateCollegeName() {
  const college = document.getElementById("collegeName").value;
  if (college.length === 0) {
    showError(collegeError, "Please enter college name");
    return false;
  }
  showSuccess(collegeError, "Valid college name");
  return true;
}

function validateContact() {
  const contact = document.getElementById("mobile").value;
  const isValidContact = validatePhoneNumber(contact);

  if (isValidContact) {
    showSuccess(phoneError, "Valid contact");
    return true;
  } else {
    showError(phoneError, "Please enter a valid contact");
    return false;
  }
}

function validatePhoneNumber(contact) {
  const regex = /^\d{10}$/;
  return regex.test(contact);
}

function validateEmail() {
  const email = document.getElementById("email").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    showSuccess(emailError, "Valid email");
    return true;
  } else {
    showError(emailError, "Please enter a valid email");
    return false;
  }
}

function validateform(event) {
  const checkboxId = 'event';
  const checkboxes = document.querySelectorAll('input[id="' + checkboxId + '"]:checked');
  
  if (checkboxes.length === 0) {
    // Using SweetAlert for a more visually appealing alert
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please select at least one event!',

    });
  
    event.preventDefault(); // Prevent form submission immediately
    return false;
  }
  

  if (
    !validateName() ||
    !validateEmail() ||
    !validateCollegeName() ||
    !validateContact() ||
    !isFileUploaded()
  ) {
    showError(submitError, "Please check the details");
    event.preventDefault();
    return false;
  }

  setTimeout(function () {
    submitError.style.display = "none";
  }, 8000);

  return true;
}

function isFileUploaded() {
  const fileInput = document.getElementById("paymentImage");
  // Implement file upload validation if needed
}

function showError(element, message) {
  element.style.color = "red";
  element.innerHTML = message;
}

function showSuccess(element, message) {
  element.style.color = "green";
  element.innerHTML = message;
}
