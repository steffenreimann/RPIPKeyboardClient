var ipcRenderer = require('electron').ipcRenderer;
<<<<<<< HEAD
window.monitor = require('active-window');
const fm = require('easy-nodejs-app-settings');
const drivelist = require('drivelist');
window.config = {}
window.windows = {};
//var fs = require('fs');
var fs = require("fs-extra");
var path = require('path');
var windowFind = false;
const {
    v4: uuidv4
} = require('uuid');
const {
    windowManager
} = require("node-window-manager");

/*Watch the active window 
  @callback
  @number of requests; infinity = -1 
  @interval between requests
*/
/* window.monitor.getActiveWindow(function (data) {
    try {


        if (!window.windows[data.app]) {
            window.windows[data.app] = data;
            renderWindowsSelector()
            // console.log("App: ", data);
            // console.log("App: ", data.app);
            // console.log("Title: ", data.title);
        }

    } catch (err) {
        console.log(err);
    }
}, -1, 1); */

//Get the current active window


=======
>>>>>>> parent of 68c0aac (+)

window.TestEvent = async function (data) {
    const result = await ipcRenderer.invoke('TestEvent', data);
    console.log('TestEvent return ', result);
}

<<<<<<< HEAD
window.counter = {}

ipcRenderer.on('serialdata', function (event, data) {
    console.log('serialdata ', data);
    //console.log('data.code + ', data.code + '_keyMoveUp');
    //console.log('data.code + ', document.getElementById(data.code + '_keyMoveUp').parentElement.parentElement);

    switch (data.channel) {
        case 'keyDown':
            //document.getElementById(data.code + '_keyMoveUp').parentElement.parentElement.style = 'background-color: cadetblue !important;'
            document.getElementById(data.code + '_keyMoveUp').parentElement.parentElement.classList.add("table-primary")

            console.log(window.counter);
            console.log(typeof window.counter[data.data.id] == 'undefined');

            if (typeof window.counter[data.data.id] == 'undefined') {
                window.counter[data.data.id] == 1;
                console.log(data.data.id);
            } else {
                window.counter[data.data.id]++;
            }

            break;
        case 'keyUp':
            //document.getElementById(data.code + '_keyMoveUp').parentElement.parentElement.style = 'background-color: ffffff !important;'
            document.getElementById(data.code + '_keyMoveUp').parentElement.parentElement.classList.remove("table-primary")
            break;

        default:
            break;
    }

    //
    //document.getElementById('testFuncCall').innerText = `Button was pressed ${data} times`
});

ipcRenderer.on('counter', function (event, data) {
    console.log('counter ', data);
});



var currentProfileIndex = 0
setInterval(async function (params) {

    if (!autoSwitchProfile.checked) {
        console.log("autoSwitchProfile.checked: ", autoSwitchProfile.checked);
        return;
    }


    var now = windowManager.getActiveWindow();
    //console.log(now);

    var parsed = path.parse(now.path)
    var found = false


    var obj = {}
    obj[parsed.name] = now
    //await window.ConfigFile.push({ window: obj });
    if (typeof window.ConfigFile.data.window[parsed.name] == 'undefined') {
        await window.ConfigFile.push({
            window: obj
        });
    }

    window.ConfigFile.data.profiles.find((o, i) => {
        if (o.window === parsed.name) {
            if (currentProfileIndex != i) {
                currentProfileIndex = i
                console.log('Found ', parsed.name, o.name);
                useProfile(currentProfileIndex)
            }
            found = true
            return true; // stop searching
        }
    });


    if (found) {
        console.log('Profile Found');

    } else if (currentProfileIndex != 0) {
        currentProfileIndex = 0
        useProfile(currentProfileIndex)
        console.log('No Profile Found');


    }

    //console.log('Interval End');

}, 1000);

window.thisWindow = null
window.getNextActiveWindow = function () {
    return new Promise(async (resolve, reject) => {
        //var old = await window.getActive()
        const old = windowManager.getActiveWindow();
        // var newWindow = null
        while (true) {
            var now = windowManager.getActiveWindow();
            //console.log('now');
            if (old.path != now.path && now.path != '') {
                window.thisWindow = now;
                var parsed = path.parse(now.path)
                var obj = {}
                obj[parsed.name] = now
                await window.ConfigFile.push({
                    window: obj
                });
                renderWindowsSelector().value = parsed.name
                resolve(now)
                return
            }
        }
    })
}

window.getActive = async function (params) {
    return new Promise((resolve, reject) => {
        window.monitor.getActiveWindow((data) => {
            console.log("App: ", data);
            console.log("App: ", data.app);
            console.log("Title: ", data.title);

            resolve(data)

        });
    })
}

window.emit_serial = async function (channel, data) {

    const result = await ipcRenderer.invoke('emit_serial', {
        "channel": channel,
        "data": data || {}
    });

    switch (result.channel) {
        case "setCurrentProfile":
            console.log('emit_serial return setCurrentProfile: ', result);
            break;

        default:
            console.log('emit_serial return ', result);
            break;
    }

}

window.newProfile = async function () {
    var profile = {}
    profile.id = uuidv4();
    profile.name = profileNameInput.value;
    profile.window = windowSelect.value;
    profile.keys = []

    //window.ConfigFile.push()
    await window.ConfigFile.push({
        profiles: profile
    });
    if (window.ConfigFile.data.profiles[window.ConfigFile.data.profiles.length - 1].name != profile.name) {
        console.log('profile not same : ', window.ConfigFile.data.profiles);
    }



    console.log('profile.name', profile.name);
    console.log('profile.name on drive ', window.ConfigFile.data.profiles[window.ConfigFile.data.profiles.length - 1].name);

    var selector = await renderProfilesSelector()
    console.log('renderProfilesSelector finish');
    console.log('selector', selector);

    //selector.value = profile.name
    selector.value = window.ConfigFile.data.profiles.length - 1
    renderKeys()

}

window.currentProfile = null;

window.saveProfile = async function () {
    console.log(profileID.innerHTML);

    let obj = window.ConfigFile.data.profiles.find(o => o.id === profileID.innerHTML);

    console.log(obj);

    let obj1 = window.ConfigFile.data.profiles.find((o, i) => {
        if (o.id === profileID.innerHTML) {
            window.ConfigFile.data.profiles[i].name = profileNameInput1.value
            window.ConfigFile.data.profiles[i].window = profileWindowSelect.value
            return true; // stop searching
        }
    });

    console.log(obj1);

    await window.ConfigFile.set(window.ConfigFile.data)

    renderWindowsSelector()
    renderProfilesSelector()
    renderKeys()

}

window.newKey = function (params) {
    //newKeyNameInput
    //newKeyGPIOInput
    //newKeyCodeInput
    var key = {}
    key.id = uuidv4();
    key.pin = newKeyGPIOInput.value;
    key.code = newKeyCodeInput.value;
    key.name = newKeyNameInput.value;
    //key.keys = []

    console.log(key);

    let obj1 = window.ConfigFile.data.profiles.find((o, i) => {
        if (o.id === profileID.innerHTML) {
            window.ConfigFile.data.profiles[i].keys.push(key)
            return true; // stop searching
        }
    });
    window.ConfigFile.set(window.ConfigFile.data)
    renderKeys()
}

window.getKeyIndexById = function (id) {
    return new Promise((resolve, reject) => {
        window.ConfigFile.data.profiles.find((o, i) => {
            if (o.id === profileID.innerHTML) {
                window.ConfigFile.data.profiles[i].keys.find((u, z) => {
                    console.log('getKeyIndexById: ', u, z);
                    if (u.id === id) {
                        //window.ConfigFile.data.profiles[i].keys.splice(z, 1);
                        resolve(z)
                        return true; // stop searching
                    }
                });
                return true; // stop searching
            }
        });
    })

}

window.moveKey = async function (old_index, new_index) {
    //await window.getKeyIndexById
    window.ConfigFile.data.profiles.find((o, i) => {
        if (o.id === profileID.innerHTML) {

            //window.ConfigFile.data.profiles[i].keys.splice(z, 1);
            //resolve(z)
            array_move(window.ConfigFile.data.profiles[i].keys, old_index, new_index)
            return true; // stop searching
        }
    });


}

function array_move(arr, old_index, new_index) {
    console.log(old_index, new_index);
    console.log('last Array Index = ', arr.length - 1);
    console.log('New Array Index = ', new_index);

    if (new_index > arr.length - 1 || new_index == -1) {
        console.log('New Index Out of Range!');
        return arr
    }


    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    console.log(arr);
    return arr; // for testing
};

async function init(params) {
    var data = {
        "profiles": [],
        "macros": {},
        "profileConnections": {}
    }
    var rpipdrive = await findRPIPDrive()
    var keyspath = path.join(rpipdrive.mountpoints[0].path, 'config', 'keys.json')
    console.log('rpipdrive: ', rpipdrive);
    console.log('keyspath: ', keyspath);
    /*     if (findConfigOnDrive(await findRPIPDrive())) {
            console.log('Keys file found');
    
    
        } else {
            console.log('Keys file not found');
        } */

    window.ConfigFile = new fm.File({
        appname: 'RPIPKeyboardClient', // required
        file: 'keys.json', // required
        path: keyspath,
        data: data, // Optional, Set Data on Init only if the file is newly created or overwriteOnInit is true
        overwriteOnInit: false, // Optional, Set true if you want to overwrite the file on init. Attention the whole file will be overwritten!
    });

    await window.ConfigFile.init();
    window.config = window.ConfigFile.data;
    console.log('DataStore File Init Done! File: ', window.ConfigFile);

    //console.log(DataStore.data);

    //CIRCUITPY

    window.currentProfile = window.ConfigFile.data.profiles[0]

    renderWindowsSelector()
    renderProfilesSelector()
    renderKeys()
    renderGPIOSelect()
    newKeyGPIOInputDiv.appendChild(renderGPIOSelect('newKeyGPIOInput'))
}

function setKey(key) {
    window.ConfigFile.data.profiles.find((o, i) => {
        if (o.id === profileID.innerHTML) {
            window.ConfigFile.data.profiles[i].keys.find((u, z) => {
                if (u.id === key.id) {
                    var thisKey = window.ConfigFile.data.profiles[i].keys[z]
                    window.ConfigFile.data.profiles[i].keys[z].pin = key.pin || thisKey.pin
                    window.ConfigFile.data.profiles[i].keys[z].code = key.code || thisKey.code
                    window.ConfigFile.data.profiles[i].keys[z].name = key.name || thisKey.name

                    return true; // stop searching
                }
            });
            return true; // stop searching
        }
    });
    //window.ConfigFile.set(window.ConfigFile.data)
}

window.selectorHandle = function (select) {
    console.log('select.srcElement.value');
    var [id, type] = select.srcElement.id.split('_')
    var value = select.srcElement.value
    console.log('select.srcElement.value: ', value);
    console.log(id);
    console.log(type);
    switch (type) {
        case 'gpioselector':
            setKey({
                pin: value,
                id: id
            })
            break;
        case 'keyCodeInput':
            setKey({
                code: value,
                id: id
            })
            break;
        case 'nameInput':
            setKey({
                name: value,
                id: id
            })
            break;
        case 'keyRemove':
            window.ConfigFile.data.profiles.find((o, i) => {
                if (o.id === profileID.innerHTML) {
                    window.ConfigFile.data.profiles[i].keys.find((u, z) => {
                        if (u.id === id) {
                            window.ConfigFile.data.profiles[i].keys.splice(z, 1);

                            return true; // stop searching
                        }
                    });
                    return true; // stop searching
                }
            });
            break;

        default:
            break;
    }
}

window.removeProfile = async function () {

    if (window.ConfigFile.data.profiles.length <= 1) {
        console.log("Cant delete last Profile!");

    }

    for (let index = 0; index < window.ConfigFile.data.profiles.length; index++) {
        const element = window.ConfigFile.data.profiles[index];

        console.log(element.id);
        console.log(profileID.innerHTML);
        console.log(element.id === profileID.innerHTML);


        if (element.id === profileID.innerHTML) {
            console.log('o.id === profileID.innerHTML');
            window.ConfigFile.data.profiles.splice(index, 1);
            await window.ConfigFile.set(window.ConfigFile.data)

            //renderWindowsSelector()
            useProfile(index)
            renderProfilesSelector()
            renderKeys()
            break;
        }
    }




}

window.getConfig = async function () {
    //window.emit_serial("getConfig")
    //console.log("loadConfig", params);
    //config = params;
    var data = await fm.Files.DataStore.get()
    window.config = data;
    console.log('TestEvent return ', data);
    renderProfilesSelector()
}

window.TestEvent = async function (data) {
    const result = await ipcRenderer.invoke('TestEvent', data);
    console.log('TestEvent return ', result);
}

window.setConfig = function () {
    window.emit_serial("setConfig", window.config)
}

window.drive = {}
async function findRPIPDrive() {
    return new Promise(async (resolve, reject) => {
        const drives = await drivelist.list();
        //console.log('drives = ', drives);
        var rpipdrive = {}
        drives.forEach((drive) => {
            //console.log(drive);
            if (drive.description == 'Raspberr Pico USB Device') {
                rpipdrive = drive
                window.drive = drive
                resolve(rpipdrive)
            }
        });
        resolve(rpipdrive)
    })
}

function findConfigOnDrive(data) {

    try {
        //console.log('findConfigOnDrive: ', data.mountpoints[0].path);
        //const files = fs.readdirSync(data.mountpoints[0].path + '/config');
        const stats = fs.statSync(data.mountpoints[0].path + '/config/keys.json');
        //console.log('files', files);
        //console.log('stats', stats);
        return true
    } catch (error) {
        return false
    }
}

window.flashCode = async function () {
    const files = fs.readdirSync('./deviceScript');
    console.log(files);
    fs.copy('./deviceScript', window.drive.mountpoints[0].path, function (err) {
        if (err) return console.error(err)
        console.log('success!')
    });
}

//addEventListener('DOMContentLoaded', init());
init()
=======
ipcRenderer.on('TestEvent', function (event, data) {
    console.log('TestEvent ', data);
    document.getElementById('testFuncCall').innerText = `Button was pressed ${data} times`
});
>>>>>>> parent of 68c0aac (+)
