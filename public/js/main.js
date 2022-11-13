function renderWindowsSelector() {

    console.log("render Windows Selector =", window.windows);
    wins = window.ConfigFile.data.window
    /*     windowSelect.childNodes.forEach(function (child) {
            if (wins[child.value]) {
                //child.innerText = wins[child.value].title;
                delete wins[child.value];
            }
            if (child.value == "") {
                child.remove();
            }
        }); */
    windowSelect.innerHTML = "";
    profileWindowSelect.innerHTML = "";

    for (var i in wins) {
        //console.log(i);
        var option = document.createElement("option");
        option.value = i;
        option.innerText = i;
        windowSelect.appendChild(option.cloneNode(true));
        profileWindowSelect.appendChild(option.cloneNode(true));
    }
    return windowSelect
}


function renderProfilesSelector() {
    return new Promise((resolve, reject) => {
        console.log("Render Proiles Config =", window.ConfigFile.data.profiles);
        profileSelect.innerHTML = "";
        for (var i = 0; i < window.ConfigFile.data.profiles.length; i++) {
            var profile = window.ConfigFile.data.profiles[i];
            var option = document.createElement("option");
            option.value = i;
            option.innerText = profile.name;
            profileSelect.appendChild(option);
        }
        resolve(profileSelect)
    })

}

function renderKeys() {
    console.log("Render Proiles Config =", window.ConfigFile.data);
    keys.innerHTML = "";
    console.log("Render Proiles Config =", window.ConfigFile.data, profileSelect.selectedIndex);
    //var profile = window.ConfigFile.data.profiles[profileSelect.selectedIndex];

    console.log(window.currentProfile);

    if (window.currentProfile == undefined) {
        console.log("dont render keys no profile used");
        return
    }
    var profile = window.currentProfile
    console.log("Render Profile =", profile);
    console.log("Render profile.keys.length =", profile.keys.length);
    console.log("Render profileWindowSelect =", profileWindowSelect);

    profileID.innerHTML = profile.id
    profileNameInput1.value = profile.name
    profileWindowSelect.value = profile.window

    if (profile.keys.length == 0) {
        console.log("profile.keys.length == 0", profile.keys.length == 0);
        var tr = document.createElement("tr");

        var th = document.createElement("th");
        var td = document.createElement("td");
        th.scope = 'row'

        var td_name = td.cloneNode(true)
        var name = document.createElement("p");
        name.innerHTML = "Dieses Profiel hat noch keinen Key welcher ausgeführt werden könnte";
        name.className = 'btn-dark mb-12 center'
        td_name.setAttribute('colspan', 6);
        td_name.appendChild(name)

        tr.appendChild(td_name)

        keys.appendChild(tr);
    }

    for (var i = 0; i < profile.keys.length; i++) {
        var key = profile.keys[i];
        if (typeof key.id != 'undefined') {

            var tr = document.createElement("tr");

            var th = document.createElement("th");
            th.scope = 'row'

            var td = document.createElement("td");
            // option.className = 'input-group'

            var td_name = td.cloneNode(true)
            var name = document.createElement("input");
            name.id = key.id + '_nameInput'
            name.value = key.name
            name.className = 'form-control btn-dark'
            name.onchange = window.selectorHandle
            td_name.appendChild(name)

            var td_gpioselector = td.cloneNode(true)
            var gpioselector = renderGPIOSelect(key.id + '_gpioselector')
            gpioselector.value = key.pin
            gpioselector.className = 'form-select btn-dark'
            gpioselector.onchange = window.selectorHandle
            td_gpioselector.appendChild(gpioselector)

            var td_keyCodeElement = td.cloneNode(true)
            var keyCodeElement = document.createElement("input");
            keyCodeElement.id = key.id + '_keyCodeInput'
            keyCodeElement.value = key.code
            keyCodeElement.className = 'form-control btn-dark'
            keyCodeElement.onkeydown = keyCodeElement.onclick = function (event) {
                window.keyCode(event)
                window.selectorHandle(event)
            }
            td_keyCodeElement.appendChild(keyCodeElement)

            var td_buttonRemove = td.cloneNode(true)
            var buttonRemove = document.createElement("button");
            buttonRemove.innerText = 'remove'
            buttonRemove.id = key.id + '_keyRemove'
            buttonRemove.className = 'btn btn-dark'
            buttonRemove.onclick = function (event) {
                console.log(event);
                window.selectorHandle(event)
                //option.parentNode.removeChild(option);
            }
            td_buttonRemove.appendChild(buttonRemove)

            var td_buttonMoveUp = td.cloneNode(true)
            var buttonMoveUp = document.createElement("button");
            buttonMoveUp.innerText = 'Up'
            buttonMoveUp.id = key.id + '_keyMoveUp'
            buttonMoveUp.className = 'btn btn-dark'
            buttonMoveUp.onclick = async function (event) {
                console.log(event);
                var [id, type] = event.srcElement.id.split('_')
                var index = await window.getKeyIndexById(id)
                console.log('index: ', index);
                console.log('key.id: ', key.id);
                window.moveKey(index, index - 1)
                //option.parentNode.removeChild(option);
                renderKeys()
            }
            td_buttonMoveUp.appendChild(buttonMoveUp)


            var td_buttonMoveDown = td.cloneNode(true)
            var buttonMoveDown = document.createElement("button");
            buttonMoveDown.innerText = 'Down'
            buttonMoveDown.id = key.id + '_keyMoveDown'
            buttonMoveDown.className = 'btn btn-dark'
            buttonMoveDown.onclick = async function (event) {
                console.log(event);
                var [id, type] = event.srcElement.id.split('_')
                var index = await window.getKeyIndexById(id)
                console.log('index: ', index);
                console.log('key.id: ', key.id);

                window.moveKey(index, index + 1)
                //option.parentNode.removeChild(option);
                renderKeys()
            }
            td_buttonMoveDown.appendChild(buttonMoveDown)


            tr.appendChild(td_buttonMoveUp)
            tr.appendChild(td_buttonMoveDown)
            tr.appendChild(td_gpioselector)
            tr.appendChild(td_keyCodeElement)
            tr.appendChild(td_name)
            tr.appendChild(td_buttonRemove)

            keys.appendChild(tr);
        }
    }
}

function useProfile(index) {
    //console.log("Use Profile =", select.selectedIndex);


    if (typeof index == 'undefined') {
        window.currentProfile = window.ConfigFile.data.profiles[profileSelect.selectedIndex];
        window.emit_serial("setCurrentProfile", {
            "profile": profileSelect.selectedIndex
        });
    } else {
        window.currentProfile = window.ConfigFile.data.profiles[index];
        profileSelect.selectedIndex = index
        window.emit_serial("setCurrentProfile", {
            "profile": index
        });
    }

    renderKeys()
}

function keyCode(event) {
    event.preventDefault();

    console.log(event);
    console.log(event.keyCode.toString(16));
    console.log(event.code);
    console.log(codes[event.code]);
    event.srcElement.value = codes[event.code].code
    return
}

function renderGPIOSelect(id) {
    console.log('select');
    console.log(id);
    var select = document.createElement("select");
    select.className = 'form-select btn-dark'
    select.id = id || ''
    for (var i of window.ConfigFile.data.gpio) {
        //console.log(i);
        var option = document.createElement("option");
        option.value = i.pin;
        option.innerText = i.pin + ' - ' + i.name;
        select.appendChild(option);
    }
    //select.onchange = window.GPIOSelectorHandle
    // = window.GPIOSelectorHandle;

    return select
}

function changeProfile(times) {
    for (let index = 0; index < times; index++) {

        for (var i = 0; i < window.ConfigFile.data.profiles.length; i++) {
            window.emit_serial("setCurrentProfile", {
                "profile": i
            });
        }
    }
}