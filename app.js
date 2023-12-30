const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const moment = require("moment-timezone");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path"); // Add this line to require the 'path' module
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
require("dotenv").config();
const ExcelJS = require('exceljs');
dotenv.config({ path: "./config/config.env" });

const app = express();
const port = process.env.PORT || 3000;
app.locals.registrationOpen = false;

app.use(cookieParser());

const static_path = path.join(__dirname, "./public");

app.use(express.static(static_path));

app.use(express.json());
let tokenCounter = 1;

app.set("view engine", "ejs");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

/*token */
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/");
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.redirect("/");
    }

    req.user = user;
    next();
  });
};
/*token  verification*/

const checkRegistrationStatus = (req, res, next) => {
  const registrationOpen = req.app.locals.registrationOpen;

  if (!registrationOpen) {
    req.flash("error", "Registration is closed.");
    return res.redirect("/registration-closed");
  }

  next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate the token
    const token = `mcgk${tokenCounter.toString().padStart(4, "0")}`;

    // Get the current IST time and format it
    const currentISTTime = moment
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD_HH:mm:ss");

    // Combine the token, date/time, and the original file extension
    const sanitizedTime = currentISTTime.replace(/:/g, "-");
    const newFileName = `${sanitizedTime}_${token}.${file.originalname
      .split(".")
      .pop()}`;

    cb(null, newFileName);
  },
});
const upload = multer({ storage });
// api all get requests
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/gallery", (req, res) => {
  res.render("gallery");
});

app.get("/coordinator", (req, res) => {
  res.render("coordinator");
});

app.get("/terms_and_conditions", (req, res) => {
  res.render("terms");
});
app.get("/About", (req, res) => {
  res.render("About");
});
app.get("/terms_and_conditions", (req, res) => {
  res.render("terms");
});

const openingDate = new Date("2024-01-01T00:00:00Z");

app.get("/registration-closed", (req, res) => {
  res.render("admin/registration-closed", { openingDate });
});

app.post(
  "/register",
  checkRegistrationStatus,
  upload.single("paymentImage"),
  (req, res) => {
    const {
      name,
      collegeName,
      mobile,
      email,
      eventDay1,
      eventDay2,
      eventDay3,
    } = req.body;

    if (
      !name ||
      !collegeName ||
      !mobile ||
      !email ||
      !eventDay1 ||
      !eventDay2 ||
      !eventDay3
    ) {
      req.flash("error", "All fields are required");
      return res.redirect("/register");
    }

    // Check if the mobile and email already exist in the database
    db.query(
      "SELECT * FROM display WHERE mobile = ? OR email = ?",
      [mobile, email],
      (selectErr, results) => {
        if (selectErr) {
          console.error(selectErr);
          req.flash("error", selectErr);
          return res.redirect("/register");
        }

        if (results.length > 0) {
          console.log("mobile no not matched");
          req.flash("error", "Mobile or email already exists");
          return res.redirect("/register");
        }

        const paymentImage = req.file ? req.file.filename : "";

        const token = `mcgk${tokenCounter.toString().padStart(4, "0")}`;

        tokenCounter++;

        const currentISTTime = moment
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss");

        const formData = {
          name,
          collegeName,
          mobile,
          email,
          eventDay1,
          eventDay2,
          eventDay3,
          paymentImage,
          token,
          date_time_submit: currentISTTime,
        };

        db.query("INSERT INTO adddata SET ?", formData, (err, result) => {
          if (err) {
            req.flash("error", "internal server error" + err);
            return res.redirect("/register");
          } else {
            req.flash("success", "Thank You for register");
            return res.redirect("/register");
          }
        });
      }
    );
  }
);
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/register", checkRegistrationStatus, (req, res) => {
  res.render("form.ejs", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++admin panel api
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use("/uploads", express.static("uploads"));

app.get("/admin/dashboard/participants", authenticateToken, (req, res) => {
  // Retrieve user information from your database (e.g., MySQL)
  db.query("SELECT * FROM admin_record", (err, results) => {
    if (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("/admin/dashboard");
    }

    // Render the admin dashboard template with the user data
    res.render("admin/admin-participants", {
      users: results,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  });
});

const secretKey = "your-secret-key";

// Predefined admin credentials
const adminCredentials = {
  username: process.env.ADMIN_ID,
  password: process.env.ADMIN_PASS,
};

app.get("/admin", (req, res) => {
  res.render("admin/admin-login");
});
app.get("/admin/dashboard/user",authenticateToken, (req, res) => {
  db.query("SELECT * FROM admin_record", (err, results) => {
    if (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("/admin/dashboard");
    }

    // Render the admin dashboard template with the user data
    res.render("admin/user", {
      users: results,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  });
  
});

app.get('/admin/download-excel', authenticateToken, (req, res) => {
  db.query('SELECT * FROM admin_record', (err, results) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Internal server error');
      return res.redirect('/admin/dashboard');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Participants');

    // Define the columns in the Excel sheet
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'College Name', key: 'collegeName', width: 30 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Event Day 1', key: 'eventDay1', width: 20 },
      { header: 'Event Day 2', key: 'eventDay2', width: 20 },
      { header: 'Event Day 3', key: 'eventDay3', width: 20 },
      { header: 'Payment Image', key: 'paymentImage', width: 30 },
      { header: 'Date and Time', key: 'date_time_submit', width: 25 },
    ];

    // Add data to the Excel sheet
    results.forEach((user) => {
      // Convert date_time_submit to a formatted date and time string
      user.date_time_submit = moment(user.date_time_submit).format('YYYY-MM-DD HH:mm:ss');
      worksheet.addRow(user);
    });

    const excelFileName = `participants_${Date.now()}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename=${excelFileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch((writeErr) => {
        console.error(writeErr);
        req.flash('error', 'Internal server error');
        return res.redirect('/admin/dashboard');
      });
  });
});




app.get("/admin/dashboard", authenticateToken, (req, res) => {
  // Retrieve total participant count from your database (e.g., MySQL)
  db.query(
    "SELECT COUNT(*) as participantCount FROM admin_record",
    (countErr, countResults) => {
      if (countErr) {
        console.error(countErr);
        req.flash("error", "Internal server error");
        return res.redirect("/admin");
      }

      // Retrieve user information from your database (e.g., MySQL)
      db.query("SELECT * FROM admin_record", (userErr, userResults) => {
        if (userErr) {
          console.error(userErr);
          req.flash("error", "Internal server error");
          return res.redirect("/admin");
        }

        const totalAmountCollected = userResults.reduce((total, user) => {
          // Assuming eventPrice is 100 for events and 0 for none
          const eventPrice1 =
            user.eventDay1 && user.eventDay1.toLowerCase() !== "none" ? 100 : 0;
          const eventPrice2 =
            user.eventDay2 && user.eventDay2.toLowerCase() !== "none" ? 100 : 0;
          const eventPrice3 =
            user.eventDay3 && user.eventDay3.toLowerCase() !== "none" ? 100 : 0;
          return total + eventPrice1 + eventPrice2 + eventPrice3;
        }, 0);

        // Render the admin dashboard template with the user data and participant count
        res.render("admin/admin", {
          users: userResults,
          success: req.flash("success"),
          error: req.flash("error"),
          participantCount: countResults[0].participantCount,
          totalAmountCollected: totalAmountCollected,
        });
      });
    }
  );
});

app.get("/admin/dashboard/events", authenticateToken, (req, res) => {
  db.query("SELECT * FROM admin_record", (err, results) => {
    if (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("/admin/dashboard1");
    }
    // Pass the 'username' variable to the template
    res.render("admin/admin-events", {
      users: results,
      success: req.flash("success"),
      error: req.flash("error"),
      registrationOpen: req.app.locals.registrationOpen,
      username: req.user.username, // Add this line
    });
  });
});

app.post("/admin/update-registration", authenticateToken, (req, res) => {
  const { action } = req.body;

  if (action === "open") {
    req.app.locals.registrationOpen = true;
    req.flash("success", "Registration opened successfully.");
  } else if (action === "close") {
    req.app.locals.registrationOpen = false;
    req.flash("success", "Registration closed successfully.");
  } else {
    // If no action specified, default to opening registration
    req.app.locals.registrationOpen = true;
  }

  res.redirect("/admin/dashboard/events");
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  // Check admin credentials
  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    // Generate a JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    // Set the token as a cookie
    res.cookie("token", token, { maxAge: 6000000 });

    return res.redirect("/admin/dashboard");
  } else {
    req.flash("success", "Invalid username or password.");
    res.render("admin-login", { error: "Invalid username or password" });
  }
});

// Protected admin dashboard route

// Logout route
app.get("/admin/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin");
});

app.get("/download/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT paymentImage FROM admin_record WHERE id = ?",
    userId,
    (selectErr, results) => {
      if (selectErr) {
        console.error(selectErr);
        req.flash("error", "Internal server error");
        res.redirect("/admin/dashboard"); // Redirect to the admin page or appropriate page
      } else if (results.length === 0) {
        req.flash("error", "User not found");
        res.redirect("/admin/dashboard"); // Redirect to the admin page or appropriate page
      } else {
        const imageFilename = results[0].paymentImage;
        // Define the path to the directory where user images are stored
        const imagePath = path.join(__dirname, "uploads", imageFilename);

        // Check if the file exists
        if (fs.existsSync(imagePath)) {
          // Set the appropriate headers to indicate the file download
          res.setHeader(
            "Content-disposition",
            "attachment; filename=" + imageFilename
          );
          res.setHeader("Content-type", "image/png"); // You can set the appropriate content type

          // Stream the file to the response
          const fileStream = fs.createReadStream(imagePath);
          fileStream.pipe(res);
        } else {
          req.flash("error", "File not found");
          res.redirect("/admin/dashboard/participants"); // Redirect to the admin page or appropriate page
        }
      }
    }
  );
});

//*****************************************************************************************************event management */

// Add this route after your other routes

app.post("/admin/update-registration", (req, res) => {
  const { action } = req.body;

  
  if (action === "open") {
    return true
  } else if (action === "close") {
    return false
  }

  
  res.redirect("/admin/dashboard");
});

//*****************************************************************************************************event management */

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
