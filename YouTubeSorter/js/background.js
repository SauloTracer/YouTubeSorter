function totalDurationInSeconds(duration) {
    const units = duration.split(":").reverse();
    let total = 0
    for (let i = 0; i < units.length; i++) {
        total += parseInt(units[i]) * (60 ** i);
    }
    return total;
}

async function sort() {
    const queryOptions = {
        url: [
            "http://www.youtube.com/watch?*",
            "https://www.youtube.com/watch?*"
        ],
        currentWindow: true
    };
    const tabs = await chrome.tabs.query(queryOptions);

    const data = await Promise.all(
        tabs.map(async x => {
            const response = await chrome.tabs.sendMessage(x.id, { action: "sort", txt: "Hello from bg" }); 
            if (!response) return
            x.durationInSeconds = totalDurationInSeconds(response.duration);
            return x
        })
    )

    data.sort((a, b) => a.durationInSeconds - b.durationInSeconds)

    for (let index = 0; index < data.length; index++) {
        await chrome.tabs.move(data[index].id, { index });
    }
}

chrome.action.onClicked.addListener(sort);