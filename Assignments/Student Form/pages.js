function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formPage(notice = "") {
  const note = notice ? `<p class="note">${escapeHtml(notice)}</p>` : "";
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Add a student</title>
  </head>
  <body>
    <h1>Add a student</h1>
    ${note}
    <form method="POST" action="/students">
      <label>Name <input name="name" required /></label><br />
      <label>Roll number <input name="rollNumber" required /></label><br />
      <label>Course <input name="course" required /></label><br />
      <label>Email <input name="email" type="email" required /></label><br />
      <button type="submit">Save</button>
    </form>
    <p><a href="/students">See saved students</a></p>
  </body>
</html>`;
}

function listPage(students) {
  const rows = students.length
    ? students
        .map(
          (student) => `<tr>
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.rollNumber)}</td>
            <td>${escapeHtml(student.course)}</td>
            <td>${escapeHtml(student.email)}</td>
          </tr>`
        )
        .join("")
    : `<tr><td colspan="4">No students yet.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Students</title>
  </head>
  <body>
    <h1>Students</h1>
    <table border="1" cellpadding="8">
      <tr>
        <th>Name</th>
        <th>Roll number</th>
        <th>Course</th>
        <th>Email</th>
      </tr>
      ${rows}
    </table>
    <p><a href="/">Add a student</a></p>
  </body>
</html>`;
}

module.exports = { formPage, listPage };
