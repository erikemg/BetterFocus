document.getElementById("addButton").addEventListener("click", handleAddButtonClick);

function handleAddButtonClick() {
    const url = document.getElementById("newSiteInput").value;
    if(url !== "") {
    const cleanedUrl = url.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");
    chrome.storage.local.set({ [`${cleanedUrl}`]: {
        url: cleanedUrl,
        gifSource: "https://media.giphy.com/media/LAKIIRqtM1dqE/giphy.gif",
        bannedHours: "9:00-17:00",
        allowedTime: 1800000,
        timerFinish: 0,
        mainPrompt: "Sorry, you can't access this page during work hours",
        bannedScreenElements: [
            {
                type: "question",
                message: "Are you accessing this page for work purposes?",
                buttonText: "Yes"
            },
            {
                type: "question",
                message: "Are you sure you're accessing this page for work purposes?",
                buttonText: "Yes, I'm sure"
            },
            {
                type: "question",
                message: "Are you really sure?",
                buttonText: "Yes, I'm really sure"
            },
            {
                type: "timer",
                message: "Then you don't mind waiting 15 seconds?",
                timerDuration: 15
            },
            {
                type: "question",
                message: "Still want to access the page?",
                buttonText: "Yes, I still want to access the page"
            }
        ]
    } }, () => {
        location.reload();
    });
}
}
chrome.storage.local.get(null, function(items) {
    Object.keys(items).forEach(url => {
        const button = document.createElement("button");
        button.textContent = url;
        button.style.backgroundColor = "white";
        button.style.border = "1px solid black";
        button.style.borderRadius = "5px";
        button.style.width = "100%";
        button.style.color = "black";
        button.style.marginTop = "5px";
        button.style.textAlign = "left";
        button.style.backgroundImage = "url('arrow.png')";
        button.style.backgroundRepeat = "no-repeat";
        button.style.backgroundPosition = "right center";
        button.style.backgroundSize = "20px";
        button.addEventListener("click", () => {
            document.getElementById("pageContainer").innerHTML = "";
            const header = document.createElement("h1");
            header.textContent = url;
            document.getElementById("pageContainer").innerHTML = `
            <div class="container">
                <div class="row" style="display: flex; justify-content: space-between; align-items: center">
                    <h1 style="font-size: 20px">${url}</h1>
                    <button id="remove" style="background-color: white; border: 1px solid black; margin-left: 10px; height: 30px; width: 30px; justify-content: center; align-items: center; padding: 0px;"><img src="remove.png" alt="remove" width="10px" height="10px"></button>
                </div>
                <div class="row" id='timerContainer' style='justify-content: center; align-items: center; align-self: center; display: flex; flex-direction: column;'>
                    <h1 style='font-size: 50px; text-align: center; justify-content: center;' id='timer'></h1>
                    <button id='stopTimer' style='background-color: white; border: 1px solid black; margin-left: 10px; height: 30px; width: 30px; justify-content: center; align-items: center; padding: 0px; display: flex; align-self: center;'><img src="reset.png" alt="remove" width="10px" height="10px; margin-top: 5px;"></button>
                </div>
                <div class="row">
                    <h3 style='margin-bottom: 0px'>Allowed Time (in minutes)</h3>
                    <div id="inputContainer" style="display: flex; justify-content: start; align-items: center; margin-bottom: 5px">
                      <input type="text" id="allowedTime" placeholder='Enter a allowed time' value='' style="width: 400px; height: 30px; border: 1px solid black; border-radius: 5px;"/>
                    </div>
                    <h5 style='margin-top: 0px'>The time that you are allowed to access a page after clicking the button to enter.</h5>
                </div>
                <div class="row">
                    <h3 style='margin-bottom: 0px'>GIF Source</h3>
                    <div id="inputContainer" style="display: flex; justify-content: start; align-items: center; margin-bottom: 5px">
                      <input type="text" id="gifSource" placeholder='Enter GIF url' value='' style="width: 400px; height: 30px; border: 1px solid black; border-radius: 5px;"/>
                    </div>
                    <h5 style='margin-top: 0px'>Should look something like https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif</h5>
                </div>
                <div class="row" style='margin-top: 20px'>
                    <h3 style='margin-bottom: 0px'>Banned Hours</h3>
                    <div id="inputContainer" style="display: flex; justify-content: start; align-items: center">
                      <input type="text" id="bannedHoursInput" placeholder='Enter banned hours' value='' style="width: 400px; height: 30px; border: 1px solid black; border-radius: 5px;"/>
                    </div>
                </div>
                <div class="row" style='margin-top: 20px'>
                    <h3 style='margin-bottom: 0px'>Main Prompt</h3>
                    <div id="inputContainer" style="display: flex; justify-content: start; align-items: center">
                      <input type="text" id="mainPromptInput" placeholder='Enter main prompt' value='' style="width: 400px; height: 30px; border: 1px solid black; border-radius: 5px;"/>
                    </div>
                </div>
                <div class="row" style='margin-top: 20px'>
                    <h3 style='margin-bottom: 0px'>Banned Screen Elements</h3>
                    <div id="elementsContainer">
                        <div class="element">
                        </div>
                    </div>
                    <button id="addElementButton" style="background-color: white; border: 1px solid black; color: black; border-radius: 50px; padding: 0px; height: 30px; width: 30px; font-size: 20px; margin-bottom: 5px; margin-top: 5px;">+</button>
                </div>
                <a href="popup.html"><button class="button" style="border-radius: 5px;">Back to home</button></a>
            </div>
            `;

            

            document.getElementById("gifSource").value = items[url].gifSource;
            document.getElementById("bannedHoursInput").value = items[url].bannedHours;
            document.getElementById("mainPromptInput").value = items[url].mainPrompt;
            document.getElementById("allowedTime").value = items[url].allowedTime / 60000;

            const mainPromptInput = document.getElementById("mainPromptInput");
console.log(mainPromptInput);

            const timerElement = document.getElementById("timer");
            const timerContainer = document.getElementById("timerContainer");
            const allowedTime = items[url].timerFinish - Date.now();
            let remainingTime = allowedTime;

            document.getElementById("stopTimer").addEventListener("click", function() {
              items[url].timerFinish = 0;
              remainingTime = 0;
              updateTimer();
            });

            function updateTimer(timerInterval) {
                const minutes = Math.floor(remainingTime / 60000);
                const seconds = Math.floor((remainingTime % 60000) / 1000);
                timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                if (remainingTime <= 0) {
                    timerContainer.style.display = "none";
                    clearInterval(timerInterval);
                } else {
                  remainingTime -= 1000;
             }
            }

            if(remainingTime > 0) {
                const timerInterval = setInterval(updateTimer, 1000);
                updateTimer(timerInterval);
            } else {
                timerContainer.style.display = "none";
            }
            

            document.getElementById("remove").addEventListener("click", function() {
    chrome.storage.local.remove(url, function() {
        if (chrome.runtime.lastError) {
            console.log('Error: ', chrome.runtime.lastError);
        } else {
            console.log('Data removed successfully');
            // Remove the button
            this.parentElement.parentElement.remove();
            document.location.reload();
        }
    }.bind(this));
});

            
            
            const backButton = document.querySelector(".button");
            backButton.addEventListener("click", () => {
                const gifSource = document.getElementById("gifSource");
                const bannedHoursInput = document.getElementById("bannedHoursInput");
                const mainPromptInput = document.getElementById("mainPromptInput");
                const allowedTimeElement = document.getElementById("allowedTime");
                const allowedTime = parseInt(allowedTimeElement.value, 10);


                const data = {
                    url: url,
                    gifSource: gifSource.value,
                    bannedHours: bannedHoursInput.value,
                    mainPrompt: mainPromptInput.value,
                    bannedScreenElements: bannedScreenElements,
                    allowedTime: allowedTime * 60000,
                    timerFinish: items[url].timerFinish
                };

                chrome.storage.local.set({ [url]: data }, function() {
                    console.log("Local storage object updated");
                });
            });

            window.onblur = () => {
                const gifSource = document.getElementById("gifSource");
                const bannedHoursInput = document.getElementById("bannedHoursInput");
                const mainPromptInput = document.getElementById("mainPromptInput");
                const allowedTimeElement = document.getElementById("allowedTime");
                const allowedTime = parseInt(allowedTimeElement.value, 10);

                const data = {
                    url: url,
                    gifSource: gifSource.value,
                    bannedHours: bannedHoursInput.value,
                    mainPrompt: mainPromptInput.value,
                    bannedScreenElements: bannedScreenElements,
                    allowedTime: allowedTime * 60000,
                    timerFinish: items[url].timerFinish
                };

                chrome.storage.local.set({ [url]: data }, function() {
                    console.log("Local storage object updated");
                });
            }

            
            const bannedScreenElements = [...items[url].bannedScreenElements];
            for(let i = 0; i < bannedScreenElements.length; i++) {
                if(bannedScreenElements[i].type === "question") {
                    const div = document.createElement("div");
                    const row1 = document.createElement("div");
                    const row2 = document.createElement("div");
                    const messageText = document.createElement("h5");
                    messageText.textContent = "Message";
                    const buttonText = document.createElement("h5");
                    buttonText.textContent = "Button Text";
                    const inputField1 = document.createElement("input");
                    inputField1.type = "text";
                    inputField1.placeholder = "Enter your message";
                    const inputField2 = document.createElement("input");
                    inputField2.type = "text";
                    inputField2.placeholder = "Enter your button text";

                    inputField1.style.marginRight = "5px";
                    inputField1.style.width = "175px";
                    inputField1.style.height = "30px"; 
                    inputField1.style.borderRadius = "5px";
                    inputField1.style.marginTop = "0px";
                    inputField1.style.marginTop = "0px";
                    inputField1.style.border = "1px solid black";
                    inputField2.style.width = "175px";
                    inputField2.style.height = "30px";
                    inputField2.style.borderRadius = "5px";
                    inputField2.style.marginTop = "0px";
                    inputField2.style.marginTop = "0px";
                    inputField2.style.border = "1px solid black";
                    row2.style.marginTop = "0px";
                    row2.style.display = "flex";
                    row2.style.justifyContent = "space-between";
                    row2.style.alignItems = "center";
                    row2.style.flexDirection = "row";
                    row2.style.marginTop = "0px";
                    row1.style.marginRigth = "40px";
                    row2.style.marginRight = "40px";
                    row1.style.height = "40px";
                    row1.style.marginTop = "-10px";
                    row1.style.display = "flex";
                    row1.style.flexDirection = "row";
                    row1.style.marginBottom = "0px";
                    row1.style.marginBottom = "0px";
                    row2.style.marginTop = "0px";
                    row2.style.height = "10px";
                    row2.style.marginBottom = "20px";
                    messageText.style.marginRight = "130px";

                    

                    inputField1.value = bannedScreenElements[i].message;
                    inputField2.value = bannedScreenElements[i].buttonText;

                    inputField1.addEventListener("input", function() {
                        bannedScreenElements[i].message = inputField1.value;
                    });

                    inputField2.addEventListener("input", function() {
                        bannedScreenElements[i].buttonText = inputField2.value;
                    });

                    row1.appendChild(messageText);
                    row1.appendChild(buttonText);
                    row2.appendChild(inputField1);
                    row2.appendChild(inputField2);

                    const removeButton = document.createElement("button");
                    removeButton.innerHTML = "<img src='remove.png' alt='Remove' style='height: 15px; width: 15px; justify-content: center; align-items: center;'>";
                    removeButton.style.height = "30px";
                    removeButton.style.width = "30px";
                    removeButton.style.justifyContent = "center";
                    removeButton.style.alignItems = "center";
                    removeButton.style.padding = "5px";
                    removeButton.style.marginLeft = "10px";
                    removeButton.addEventListener("click", function() {
                        const index = bannedScreenElements.findIndex(element => element.message === inputField1.value && element.buttonText === inputField2.value);
                        if (index !== -1) {
                            bannedScreenElements.splice(index, 1);
                            div.remove();
                        }
                        console.log(bannedScreenElements, index)
                    });

                    row2.appendChild(removeButton);

                    div.appendChild(row1);
                    div.appendChild(row2);
                    document.getElementById("elementsContainer").appendChild(div);
                    } else if(bannedScreenElements[i].type === "timer") {
                    const div = document.createElement("div");
                    const row1 = document.createElement("div");
                    const row2 = document.createElement("div");
                    const messageText = document.createElement("h5");
                    messageText.textContent = "Message";
                    const buttonText = document.createElement("h5");
                    buttonText.textContent = "Timer Duration";
                    const inputField1 = document.createElement("input");
                    inputField1.type = "text";

                    inputField1.placeholder = "Enter your message";
                    const inputField2 = document.createElement("input");
                    inputField2.type = "number";
                    inputField2.placeholder = "Timer duration in minutes";

                    inputField1.style.marginRight = "5px";
                    inputField1.style.width = "175px";
                    inputField1.style.height = "30px";
                    inputField1.style.borderRadius = "5px";
                    inputField1.style.marginTop = "0px";
                    inputField1.style.marginTop = "0px";
                    inputField1.style.border = "1px solid black";
                    inputField2.style.width = "175px";
                    inputField2.style.height = "30px";
                    inputField2.style.borderRadius = "5px";
                    inputField2.style.marginTop = "0px";
                    inputField2.style.marginTop = "0px";
                    inputField2.style.border = "1px solid black";
                    row2.style.marginTop = "0px";
                    row2.style.display = "flex";
                    row2.style.justifyContent = "space-between";
                    row2.style.alignItems = "center";
                    row2.style.flexDirection = "row";
                    row2.style.marginTop = "0px";
                    row1.style.marginRigth = "40px";
                    row2.style.marginRight = "40px";
                    row1.style.height = "40px";
                    row1.style.marginTop = "-10px";
                    row1.style.display = "flex";
                    row1.style.flexDirection = "row";
                    row1.style.marginBottom = "0px";
                    row1.style.marginBottom = "0px";
                    row2.style.marginTop = "0px";
                    row2.style.height = "10px";
                    row2.style.marginBottom = "20px";
                    messageText.style.marginRight = "130px";

                    inputField1.value = bannedScreenElements[i].message;
                    inputField2.value = bannedScreenElements[i].timerDuration;

                    inputField1.addEventListener("input", function() {
                        bannedScreenElements[i].message = inputField1.value;
                    });

                    inputField2.addEventListener("input", function() {
                        bannedScreenElements[i].timerDuration = parseInt(inputField2.value);
                    });
                    
                    row1.appendChild(messageText);
                    row1.appendChild(buttonText);
                    row2.appendChild(inputField1);
                    row2.appendChild(inputField2);

                    const removeButton = document.createElement("button");
                    removeButton.innerHTML = "<img src='remove.png' alt='Remove' style='height: 15px; width: 15px; justify-content: center; align-items: center;'>";
                    removeButton.style.height = "30px";
                    removeButton.style.width = "30px";
                    removeButton.style.justifyContent = "center";
                    removeButton.style.alignItems = "center";
                    removeButton.style.padding = "5px";
                    removeButton.style.marginLeft = "10px";
                    removeButton.addEventListener("click", function() {
                        const index = bannedScreenElements.findIndex(element => element.message === inputField1.value);
                        if (index !== -1) {
                            bannedScreenElements.splice(index, 1);
                            div.remove();
                        }
                        console.log(bannedScreenElements, index);
                    });

                    row2.appendChild(removeButton);

                    div.appendChild(row1);
                    div.appendChild(row2);
                    document.getElementById("elementsContainer").appendChild(div);
                }
            }


            const addElementButton = document.getElementById("addElementButton");
            addElementButton.addEventListener("click", function() {
                const selectContainer = document.createElement("div");
                selectContainer.classList.add("selectContainer");
                addElementButton.style.display = "none";

                const selectButton1 = document.createElement("button");
                selectButton1.textContent = "Add Question";
                selectButton1.style.backgroundColor = "white";
                selectButton1.style.border = "1px solid black";
                selectButton1.style.borderRadius = "50px";
                selectButton1.style.borderTopRightRadius = "0px";
                selectButton1.style.borderBottomRightRadius = "0px";
                selectButton1.style.color = "black";
                selectButton1.style.padding = "0";
                selectButton1.style.height = "30px";
                selectButton1.style.fontSize = "10px";
                selectButton1.style.padding = "0 10px";
                selectButton1.style.marginTop = "5px";
                selectButton1.style.marginBottom = "5px";

                const selectButton2 = document.createElement("button");
                selectButton2.textContent = "Add Timer";
                selectButton2.style.backgroundColor = "white";
                selectButton2.style.border = "1px solid black";
                selectButton2.style.borderRadius = "50px";
                selectButton2.style.borderTopLeftRadius = "0px";
                selectButton2.style.borderBottomLeftRadius = "0px";
                selectButton2.style.color = "black";
                selectButton2.style.padding = "0px";
                selectButton2.style.height = "30px";
                selectButton2.style.fontSize = "10px";
                selectButton2.style.padding = "0px 10px";
                selectButton1.style.marginTop = "5px";
                selectButton1.style.marginBottom = "5px";

                selectContainer.appendChild(selectButton1);
                selectContainer.appendChild(selectButton2);

                let i = bannedScreenElements.length;

                selectButton1.addEventListener("click", function() {
                    selectButton1.style.display = "none";
                    selectButton2.style.display = "none";
                    let j = i;
                    i++;

                    const div = document.createElement("div");
                    const row1 = document.createElement("div");
                    const row2 = document.createElement("div");
                    const messageText = document.createElement("h5");
                    messageText.textContent = "Message";
                    const buttonText = document.createElement("h5");
                    buttonText.textContent = "Button Text";
                    const inputField1 = document.createElement("input");
                    inputField1.type = "text";
                    inputField1.placeholder = "Enter your message";
                    const inputField2 = document.createElement("input");
                    inputField2.type = "text";
                    inputField2.placeholder = "Enter your button text";

                    inputField1.style.marginRight = "5px";
                    inputField1.style.width = "175px";
                    inputField1.style.height = "30px";
                    inputField1.style.borderRadius = "5px";
                    inputField1.style.marginTop = "0px";
                    inputField1.style.marginTop = "0px";
                    inputField1.style.border = "1px solid black";
                    inputField2.style.width = "175px";
                    inputField2.style.height = "30px";
                    inputField2.style.borderRadius = "5px";
                    inputField2.style.marginTop = "0px";
                    inputField2.style.marginTop = "0px";
                    inputField2.style.border = "1px solid black";
                    row2.style.marginTop = "0px";
                    row2.style.display = "flex";
                    row2.style.justifyContent = "space-between";
                    row2.style.alignItems = "center";
                    row2.style.flexDirection = "row";
                    row2.style.marginTop = "0px";
                    row1.style.marginRigth = "40px";
                    row2.style.marginRight = "40px";
                    row1.style.height = "40px";
                    row1.style.marginTop = "-10px";
                    row1.style.display = "flex";
                    row1.style.flexDirection = "row";
                    row1.style.marginBottom = "0px";
                    row1.style.marginBottom = "0px";
                    row2.style.marginTop = "0px";
                    row2.style.height = "10px";
                    row2.style.marginBottom = "20px";
                    messageText.style.marginRight = "130px";

                    bannedScreenElements.push({
                        type: "question",
                        message: "",
                        buttonText: ""
                    });

                    inputField1.addEventListener("input", function() {
                        bannedScreenElements[j].message = inputField1.value;
                    });

                    inputField2.addEventListener("input", function() {
                        bannedScreenElements[j].buttonText = inputField2.value;
                    });

                    row1.appendChild(messageText);
                    row1.appendChild(buttonText);
                    row2.appendChild(inputField1);
                    row2.appendChild(inputField2);

                    const removeButton = document.createElement("button");
                    removeButton.innerHTML = "<img src='remove.png' alt='Remove' style='height: 15px; width: 15px; justify-content: center; align-items: center;'>";
                    removeButton.style.height = "30px";
                    removeButton.style.width = "30px";
                    removeButton.style.justifyContent = "center";
                    removeButton.style.alignItems = "center";
                    removeButton.style.padding = "5px";
                    removeButton.style.marginLeft = "10px";
                    removeButton.addEventListener("click", function() {
                        const index = bannedScreenElements.findIndex(element => element.message === inputField1.value && element.buttonText === inputField2.value);
                        if (index !== -1) {
                            bannedScreenElements.splice(index, 1);
                            div.remove();
                        }
                        console.log(bannedScreenElements, index)
                    });

                    row2.appendChild(removeButton);

                    div.appendChild(row1);
                    div.appendChild(row2);
                    selectContainer.appendChild(div);
                    addElementButton.style.display = "flex";
                    addElementButton.style.alignItems = "center";
                    addElementButton.style.justifyContent = "center";
                });

                selectButton2.addEventListener("click", function() {
                    selectButton1.style.display = "none";
                    selectButton2.style.display = "none";
                    let j = i;
                    i++;

                    const div = document.createElement("div");
                    const row1 = document.createElement("div");
                    const row2 = document.createElement("div");
                    const messageText = document.createElement("h5");
                    messageText.textContent = "Message";
                    const buttonText = document.createElement("h5");
                    buttonText.textContent = "Timer Duration";
                    const inputField1 = document.createElement("input");
                    inputField1.type = "text";
                    inputField1.placeholder = "Enter your message";
                    const inputField2 = document.createElement("input");
                    inputField2.type = "number";
                    inputField2.placeholder = "Timer duration in minutes";

                    inputField1.style.marginRight = "5px";
                    inputField1.style.width = "175px";
                    inputField1.style.height = "30px";
                    inputField1.style.borderRadius = "5px";
                    inputField1.style.marginTop = "0px";
                    inputField1.style.marginTop = "0px";
                    inputField1.style.border = "1px solid black";
                    inputField2.style.width = "175px";
                    inputField2.style.height = "30px";
                    inputField2.style.borderRadius = "5px";
                    inputField2.style.marginTop = "0px";
                    inputField2.style.marginTop = "0px";
                    inputField2.style.border = "1px solid black";
                    row2.style.marginTop = "0px";
                    row2.style.display = "flex";
                    row2.style.justifyContent = "space-between";
                    row2.style.alignItems = "center";
                    row2.style.flexDirection = "row";
                    row2.style.marginTop = "0px";
                    row1.style.marginRigth = "40px";
                    row2.style.marginRight = "40px";
                    row1.style.height = "40px";
                    row1.style.marginTop = "-10px";
                    row1.style.display = "flex";
                    row1.style.flexDirection = "row";
                    row1.style.marginBottom = "0px";
                    row1.style.marginBottom = "0px";
                    row2.style.marginTop = "0px";
                    row2.style.height = "10px";
                    row2.style.marginBottom = "20px";
                    messageText.style.marginRight = "130px";
                    
                    bannedScreenElements.push({
                        type: "timer",
                        message: "",
                        timerDuration: ""
                    });

                    inputField1.addEventListener("input", function() {
                        bannedScreenElements[j].message = inputField1.value;
                    });

                    inputField2.addEventListener("input", function() {
                        bannedScreenElements[j].timerDuration = inputField2.value;
                    });

                    row1.appendChild(messageText);
                    row1.appendChild(buttonText);
                    row2.appendChild(inputField1);
                    row2.appendChild(inputField2);

                    const removeButton = document.createElement("button");
                    removeButton.innerHTML = "<img src='remove.png' alt='Remove' style='height: 15px; width: 15px; justify-content: center; align-items: center;'>";
                    removeButton.style.height = "30px";
                    removeButton.style.width = "30px";
                    removeButton.style.justifyContent = "center";
                    removeButton.style.alignItems = "center";
                    removeButton.style.padding = "5px";
                    removeButton.style.marginLeft = "10px";
                    removeButton.addEventListener("click", function() {
                        const index = bannedScreenElements.findIndex(element => element.message === inputField1.value);
                        if (index !== -1) {
                            bannedScreenElements.splice(index, 1);
                            div.remove();
                        }
                        console.log(bannedScreenElements, index);
                    });

                    row2.appendChild(removeButton);

                    div.appendChild(row1);
                    div.appendChild(row2);
                    selectContainer.appendChild(div);
                    addElementButton.style.display = "flex";
                    addElementButton.style.alignItems = "center";
                    addElementButton.style.justifyContent = "center";
                });

                document.getElementById("elementsContainer").appendChild(selectContainer);
                
            document.getElementById("elementsContainer").childNodes.forEach(item => {
                console.log("bajs " + item);
            });
        });
    });
        document.getElementById("sites").appendChild(button);
    });
});

