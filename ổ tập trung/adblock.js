if (typeof $request !== 'undefined') {
  const adKeywords = [
    "ads", "adservice", "doubleclick", "googlesyndication",
    "googletagservices", "taboola", "outbrain",
    "applovin", "adcolony", "unityads", "facebookads",
    "tracking", "track", "metrics", "beacons"
  ];

  if (adKeywords.some(keyword => $request.url.toLowerCase().includes(keyword))) {
    console.log("Blocked Ad URL: " + $request.url);
    $done({ status: 204, body: "" });
  } else {
    $done({});
  }
} else {
  console.log("Loaded in wrong context");
  $done({});
}