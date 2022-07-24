function totalDurationInSeconds(duration) {
    const units = duration.split(":").reverse();
    let total = 0
    for (let i = 0; i < units.length; i++) {
        total += parseInt(units[i]) * (60 ** i);
    }
    return total;
}

async function sort() {
    try{
        const queryOptions = {
            url: [
                "http://www.youtube.com/watch?*",
                "https://www.youtube.com/watch?*",
                "http://www.youtube.com/shorts*",
                "https://www.youtube.com/shorts*"            
            ],
            currentWindow: true
        };
        const tabs = await chrome.tabs.query(queryOptions);

        let data = await Promise.allSettled(
            tabs.map(async x => {
                const response = await chrome.tabs.sendMessage(x.id, { action: "sort" }); 
                if (!response) return
                x.durationInSeconds = totalDurationInSeconds(response.duration);
                return x
            })
        )

        data = data.filter(response => response.status === 'fulfilled')
        data = data.map(response => response.value)
            .sort((a, b) => a.durationInSeconds - b.durationInSeconds)

        for (let index = 0; index < data.length; index++) {
            try {
                await chrome.tabs.move(data[index].id, { index });
            }
            catch(e) {
                console.log(e)
                continue
            }
        }
    } catch(e) {
        console.log(e)
    }
}

chrome.action.onClicked.addListener(sort);