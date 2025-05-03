// adblock.js
const blockedPatterns = [
  "ads", "adservice", "doubleclick", "googlesyndication",
  "applovin", "adcolony", "unityads", "facebookads"
];

if (blockedPatterns.some(p => $request.url.includes(p))) {
  $done({ status: 204, body: "" });
} else {
  $done({});
}