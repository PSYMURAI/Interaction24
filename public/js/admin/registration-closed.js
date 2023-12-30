function updateCountdown(seconds) {
    document.getElementById('countdown').innerText = seconds;
}


function redirectToHome() {
    window.location.href = '/';
}


let countdownValue = 5;


const countdownInterval = setInterval(function () {
    updateCountdown(countdownValue);
    countdownValue--;


    if (countdownValue < 0) {
        clearInterval(countdownInterval);
        redirectToHome();
    }
}, 1000);