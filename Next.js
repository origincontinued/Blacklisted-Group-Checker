import { useState } from "react";

// ================= CONFIG =================
// Replace these with REAL Roblox group IDs you want to ban
const BANNED_GROUP_IDS = [
  34057857,
  16040283,
  4219097,
];

// =========================================

export default function RobloxGroupBanChecker() {
  const [profileLink, setProfileLink] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractUserId = (url) => {
    try {
      const match = url.match(/users\/(\d+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const checkGroups = async () => {
    setError(null);
    setStatus(null);

    const userId = extractUserId(profileLink);
    if (!userId) {
      setError("Invalid Roblox profile URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://groups.roblox.com/v2/users/${userId}/groups/roles`
      );

      if (!response.ok) throw new Error("Failed to fetch user groups");

      const data = await response.json();
      const userGroupIds = data.data.map((g) => g.group.id);

      const matchedGroups = userGroupIds.filter((id) =>
        BANNED_GROUP_IDS.includes(id)
      );

      setStatus({
        banned: matchedGroups.length > 0,
        matchedGroups,
      });
    } catch (err) {
      setError("Error checking groups. Roblox API may be rate-limiting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* LEFT SIDE */}
      <div className="w-1/2 p-10 border-r border-neutral-800">
        <h1 className="text-3xl font-bold mb-6">Roblox Exploit Group Checker</h1>
        <p className="text-neutral-400 mb-4">
          Paste a Roblox profile link below to verify whether the user has joined
          any banned groups.
        </p>

        <input
          type="text"
          placeholder="https://www.roblox.com/users/USERID/profile"
          className="w-full p-3 rounded bg-neutral-900 border border-neutral-700 focus:outline-none"
          value={profileLink}
          onChange={(e) => setProfileLink(e.target.value)}
        />

        <button
          onClick={checkGroups}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Run Check"}
        </button>

        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 p-10">
        <h2 className="text-2xl font-semibold mb-6">Result</h2>

        {!status && !loading && (
          <p className="text-neutral-500">Awaiting scan...</p>
        )}

        {status && (
          <div
            className={`p-6 rounded border ${
              status.banned
                ? "border-red-500 bg-red-500/10"
                : "border-green-500 bg-green-500/10"
            }`}
          >
            {status.banned ? (
              <>
                <h3 className="text-red-400 text-xl font-bold mb-2">
                  ❌ BANNED USER
                </h3>
                <p className="text-neutral-300">
                  This user is a member of one or more banned groups.
                </p>
                <ul className="mt-3 list-disc list-inside text-neutral-400">
                  {status.matchedGroups.map((id) => (
                    <li key={id}>Group ID: {id}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h3 className="text-green-400 text-xl font-bold mb-2">
                  ✅ CLEAN USER
                </h3>
                <p className="text-neutral-300">
                  No banned group affiliations detected.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
