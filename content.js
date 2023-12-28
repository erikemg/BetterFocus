let currentUrl = window.location.hostname;
let currentUrlPath = window.location.pathname;
let areYouSure = 1;

function generateHTML(pageName, gifSource, bannedScreenElements, mainPrompt) {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const backgroundColor = isDarkMode ? '#000' : '#fff';
    const textColor = isDarkMode ? '#fff' : '#000';

    let buttonHTML = '';
    let timerHTML = '';

    const firstElement = bannedScreenElements[0];

    if (bannedScreenElements.length > 0) {

        if (firstElement.type === 'timer') {
            timerHTML = `
                <h1 id="timer" style="font-size: 24px; font-family: Arial !important; margin-top: -20px">${firstElement.timerDuration}</h1>
            `;
            buttonHTML = `
                <button id="workPurposesButton" style="padding: 10px 20px; font-size: 16px; margin-top: 15px; border-radius: 30px; borderColor: black; color: black; background-color: white !important;"></button>
            `;
        } else if (firstElement.type === 'question') {
            timerHTML = `
                <h1 id="timer" style="font-size: 24px; font-family: Arial !important; margin-top: -20px"></h1>
            `;
            buttonHTML = `
                <button id="workPurposesButton" style="padding: 10px 20px; font-size: 16px; margin-top: 15px; border-radius: 30px; borderColor: black; color: black; background-color: white !important;">${firstElement.buttonText}</button>
            `;
        }
    } else {
        return `
    <div style="text-align: center; padding-top: 100px; background-color: ${backgroundColor}; color: ${textColor}; height: 90vh">
       <img src="${gifSource}" alt="this slowpoke moves" width="500" style="margin-bottom: 20px;" />
       <h1 style="font-size: 24px; font-family: Arial !important;">${mainPrompt}</h1>
    </div>`;
    }

    return `
    <div style="text-align: center; padding-top: 100px; background-color: ${backgroundColor}; color: ${textColor}; height: 90vh">
       <img src="${gifSource}" alt="this slowpoke moves" width="500" style="margin-bottom: 20px;" />
       <h1 style="font-size: 24px; font-family: Arial !important;">${mainPrompt}</h1>
       <h2 style="font-size: 18px; margin-top: 30px; font-family: Arial !important;" id="areYouSure">${firstElement.message}</h2>
       ${buttonHTML}
       ${timerHTML}
    </div>`;
}

let bannedUrls = null
let urlObj = null

chrome.storage.local.get(null, function(items) {
    bannedUrls = items
    urlObj = items[currentUrl]
    checkForbiddenUrls();
});

function checkForbiddenUrls() {
    const allowedUrlTimestamp = urlObj.timerFinish;
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const [time1, time2] = urlObj.bannedHours.split("-");

    let [time1Hour, time1Minute] = time1.split(":");
    let [time2Hour, time2Minute] = time2.split(":");

    console.log(currentUrl)

    if ((currentHour > time1Hour || (currentHour === time1Hour && currentMinute >= time1Minute)) && (currentHour < time2Hour || (currentHour === time2Hour && currentMinute <= time2Minute)) && urlObj && (!allowedUrlTimestamp || allowedUrlTimestamp < Date.now())) {
        document.body.innerHTML = generateHTML(urlObj.url, urlObj.gifSource, urlObj.bannedScreenElements, urlObj.mainPrompt, );
        document.getElementById("workPurposesButton").addEventListener("click", handleWorkPurposesButtonClick);
    } else if(currentUrl === "www.youtube.com") {
        fetch(chrome.runtime.getURL('content-yt.css'))
        .then(response => response.text())
        .then(css => {
            let style = document.createElement('style');
            style.textContent = css;
            document.head.append(style);
        });
    } else if(currentUrl === "www.reddit.com") {
        fetch(chrome.runtime.getURL('content-reddit.css'))
        .then(response => response.text())
        .then(css => {
            let style = document.createElement('style');
            style.textContent = css;
            document.head.append(style);
        });
    } else if(currentUrl === "www.instagram.com") {
        fetch(chrome.runtime.getURL('content-insta.css'))
        .then(response => response.text())
        .then(css => {
            let style = document.createElement('style');
            style.textContent = css;
            document.head.append(style);
        });
    }
}

let timerInterval;

function handleWorkPurposesButtonClick() {
    document.getElementById("workPurposesButton").style.visibility = "visible";
    document.getElementById("timer").style.visability = "hidden";
    if(areYouSure === urlObj.bannedScreenElements.length) {
        chrome.storage.local.set({[urlObj.url]: {
            url: urlObj.url,
            bannedHours: urlObj.bannedHours,
            gifSource: urlObj.gifSource,
            bannedScreenElements: urlObj.bannedScreenElements,
            allowedTime: urlObj.allowedTime,
            timerFinish: Date.now() + urlObj.allowedTime
        }});
        window.location.href = 'https://' + currentUrl + currentUrlPath;
    } else {
        if(urlObj.bannedScreenElements[areYouSure].type === "timer") {
        document.getElementById("areYouSure").innerHTML = urlObj.bannedScreenElements[areYouSure].message;
        document.getElementById("workPurposesButton").style.visibility = "hidden";
        document.getElementById("timer").style.visability = "visible";
        let secondsLeft = urlObj.bannedScreenElements[areYouSure].timerDuration
        document.getElementById("timer").innerHTML = secondsLeft

        timerInterval = setInterval(() => {
            secondsLeft--;
            document.getElementById("timer").innerHTML = secondsLeft
            if (secondsLeft === 0) {
                clearInterval(timerInterval);
                document.getElementById("timer").innerHTML = "";
                handleWorkPurposesButtonClick();
            }
        }, 1000);
        } else if (urlObj.bannedScreenElements[areYouSure].type === "question") {
            document.getElementById("areYouSure").innerHTML = urlObj.bannedScreenElements[areYouSure].message;
            document.getElementById("workPurposesButton").innerHTML = urlObj.bannedScreenElements[areYouSure].buttonText;
            document.getElementById("workPurposesButton").style.border = "0px";
        }
        areYouSure++;
    }
}