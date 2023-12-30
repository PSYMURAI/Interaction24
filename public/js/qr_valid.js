document
    .getElementById("generateQR")
    .addEventListener("click", function () {
        // Clear existing QR code
        clearQRCode();

        const selectedEvents = [];
        const day1 = document.getElementsByName("eventDay1");
        const day2 = document.getElementsByName("eventDay2");
        const day3 = document.getElementsByName("eventDay3");

        // Collect selected events
        if (day1) {
            for (let i = 0; i < day1.length; i++) {
                if (day1[i].checked) {
                    if (day1[i].value == "none") console.log("You select none1");
                    else selectedEvents.push(day1[i].value);
                }
            }
        }
        if (day2) {
            for (let i = 0; i < day2.length; i++) {
                if (day2[i].checked) {
                    if (day2[i].value == "none") console.log("you select none2");
                    else selectedEvents.push(day2[i].value);
                }
            }
        }
        if (day3) {
            for (let i = 0; i < day3.length; i++) {
                if (day3[i].checked) {
                    if (day3[i].value == "none") console.log("you select none3");
                    else selectedEvents.push(day3[i].value);
                }
            }
        }

        // Check if there are any selected events
        if (selectedEvents.length > 0) {
            // Calculate the total amount
            const amount = selectedEvents.length * 100;

            // Create the UPI string
            const upiString = `upi://pay?pa=chaitanyadesh2001@oksbi&pn=Chaitanya Deshpande&mc=1234&tid=5678&tr=Invoice123&tn=Event%20Payment&am=${amount}&cu=INR`;

            // Generate QR code 
            const qrcode = new QRCode(document.getElementById("qrcode"), {
                text: upiString,
                width: 200,
                height: 200,
            });
        } else {
            console.log("No events selected. QR code not generated.");
        }
    });

// Function to clear the existing QR code
function clearQRCode() {
    const qrCodeElement = document.getElementById("qrcode");
    while (qrCodeElement.firstChild) {
        qrCodeElement.removeChild(qrCodeElement.firstChild);
    }
}
