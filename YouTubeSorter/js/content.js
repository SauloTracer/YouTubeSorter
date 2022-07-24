chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "sort") {
        console.log("Sorting...");
        const videoType = window.location.href.includes("/shorts/") ? "shorts" : "watch";
        const duration = videoType == "watch" ? document.querySelector(".ytp-time-duration").textContent : document.querySelector(".html5-main-video").duration.toString()
        sendResponse({ duration });
    }
});