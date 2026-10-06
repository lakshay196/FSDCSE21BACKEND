const http = require("http");
const fs = require("fs");
const path = require("path");
const { formPage, listPage } = require("./pages");

const port = Number(process.env.PORT) || 3003;
const dataFile = path.join(__dirname, "students.json");

function readStudents() {
  const raw = fs.readFileSync(dataFile, "utf8");
  const parsed = raw.trim() ? JSON.parse(raw) : [];
  return Array.isArray(parsed) ? parsed : [];
}

function writeStudents(students) {
  fs.writeFileSync(dataFile, `${JSON.stringify(students, null, 2)}\n`);
}

function send(res, status, html) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error("Form is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/") {
      send(res, 200, formPage());
      return;
    }

    if (req.method === "GET" && req.url === "/students") {
      send(res, 200, listPage(readStudents()));
      return;
    }

    if (req.method === "POST" && req.url === "/students") {
      const body = await collectBody(req);
      const fields = new URLSearchParams(body);
      const student = {
        name: (fields.get("name") || "").trim(),
        rollNumber: (fields.get("rollNumber") || "").trim(),
        course: (fields.get("course") || "").trim(),
        email: (fields.get("email") || "").trim(),
      };

      if (!student.name || !student.rollNumber || !student.course || !student.email) {
        send(res, 400, formPage("Fill in every field."));
        return;
      }

      const students = readStudents();
      students.push(student);
      writeStudents(students);
      send(res, 201, formPage("Student saved."));
      return;
    }

    send(res, 404, "<h1>Page not found</h1><p><a href='/'>Back</a></p>");
  } catch (error) {
    console.error(error);
    send(res, 500, "<h1>Something went wrong while saving the record.</h1>");
  }
});

server.listen(port, () => {
  console.log(`Student form is up at http://localhost:${port}`);
});
