// adblock.js
if (typeof $request !== 'undefined') {
  const adKeywords = [
    "ads", "adservice", "doubleclick",
    "googlesyndication", "applovin",
    "adcolony", "unityads", "facebookads"
  ];

  if (adKeywords.some(keyword => $request.url.includes(keyword))) {
    $done({ status: 204, body: "" });
  } else {
    $done({});
  }
} else {
  $done({});
}
