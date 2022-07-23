chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message received: ", request.txt);
    if (request.action == "sort") {
        console.log("Sorting...");
        const title = document.querySelector("#container > h1 > yt-formatted-string").textContent
        const duration = document.querySelector(".ytp-time-duration").textContent
        sendResponse({ title, duration });
    }
});