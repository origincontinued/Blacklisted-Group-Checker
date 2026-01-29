<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Roblox Group Ban Checker</title>
  <style>
    * { box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }
    body {
      margin: 0;
      background: #0a0a0a;
      color: #ffffff;
      height: 100vh;
      display: flex;
    }
    .left, .right {
      width: 50%;
      padding: 40px;
    }
    .left {
      border-right: 1px solid #222;
    }
    h1, h2 {
      margin-top: 0;
    }
    input {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
      background: #111;
      border: 1px solid #333;
      color: #fff;
      border-radius: 6px;
    }
    button {
      margin-top: 15px;
      padding: 12px 20px;
      background: #c0392b;
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover { background: #e74c3c; }
    .error { color: #ff6b6b; margin-top: 15px; }
    .result-box {
      border-radius: 8px;
      padding: 25px;
      border: 2px solid;
    }
    .banned {
      border-color: #ff4d4d;
      background: rgba(255, 77, 77, 0.1);
    }
    .clean {
      border-color: #2ecc71;
      background: rgba(46, 204, 113, 0.1);
    }
    ul { margin-top: 15px; }
    .muted { color: #aaa; }
  </style>
</head>
<body>
  <div class="left">
    <h1>Roblox Exploit Group Checker</h1>
    <p class="muted">Paste a Roblox profile link to check if the user is in any banned groups.</p>

    <input id="profileInput" placeholder="https://www.roblox.com/users/USERID/profile" />
    <button onclick="runCheck()">Check User</button>

    <div id="error" class="error"></div>
  </div>

  <div class="right">
    <h2>Result</h2>
    <div id="result" class="muted">Awaiting scan...</div>
  </div>

<script>
// ================= CONFIG =================
const BANNED_GROUP_IDS = [
  4219097,
  34057857,
  34640145
];
// =========================================

function extractUserId(url) {
  const match = url.match(/users\/(\d+)/);
  return match ? match[1] : null;
}

async function runCheck() {
  const input = document.getElementById('profileInput').value.trim();
  const errorDiv = document.getElementById('error');
  const resultDiv = document.getElementById('result');

  errorDiv.textContent = '';
  resultDiv.className = '';
  resultDiv.textContent = 'Scanning user groups...';

  const userId = extractUserId(input);
  if (!userId) {
    errorDiv.textContent = 'Invalid Roblox profile URL.';
    resultDiv.textContent = 'Scan failed.';
    return;
  }

  try {
    const res = await fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
    if (!res.ok) throw new Error('API Error');

    const data = await res.json();
    const userGroups = data.data.map(g => g.group.id);
    const matches = userGroups.filter(id => BANNED_GROUP_IDS.includes(id));

    if (matches.length > 0) {
      resultDiv.className = 'result-box banned';
      resultDiv.innerHTML = `<h3>❌ BANNED USER</h3>
        <p>User is a member of banned groups:</p>
        <ul>${matches.map(id => `<li>Group ID: ${id}</li>`).join('')}</ul>`;
    } else {
      resultDiv.className = 'result-box clean';
      resultDiv.innerHTML = `<h3>✅ CLEAN USER</h3><p>No banned group affiliations detected.</p>`;
    }
  } catch (err) {
    errorDiv.textContent = 'Failed to fetch group data. Roblox API may be blocking requests.';
    resultDiv.textContent = 'Scan error.';
  }
}
</script>
</body>
</html>
