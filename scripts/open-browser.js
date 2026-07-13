const { exec } = require("child_process");

const url = process.argv[2] || "http://localhost:2504";
const platform = process.platform;

let command;
if (platform === "win32") {
  command = `powershell -Command "Start-Process '${url}'"`;
} else if (platform === "darwin") {
  command = `open "${url}"`;
} else {
  command = `xdg-open "${url}"`;
}

exec(command, (err) => {
  if (err) {
    console.error("Không thể tự mở trình duyệt:", err.message);
  } else {
    console.log("Đã mở trình duyệt:", url);
  }
});
