
Decimal.prototype.format = function (acc=4) { return format(this.clone(), acc) }

function Save() {
    let str = btoa(JSON.stringify(Player))
    if (localStorage.getItem("Save") == '') wipe()
    localStorage.setItem("Save",str)
    tmp.prevSave = localStorage.getItem("Save")
}

function deepNaN(obj, data) {
    for (let k in obj) {
        if (typeof obj[k] == 'string') {
            if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) obj[k] = data[k]
        } else {
            if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
            if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
        }
    }
    return obj
}

function deepUndefinedAndDecimal(obj, data) {
    if (obj == null) return data
    for (let k in data) {
        if (obj[k] === null) continue
        if (obj[k] === undefined) obj[k] = data[k]
        else {
            if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
            else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
        }
    }
    return obj
}

function loadPlayer(load) {
    const DATA = GetPlayerData()
    Player = deepNaN(load, DATA)
    Player = deepUndefinedAndDecimal(Player, DATA)
    checkBuildings()
}

function GetPlayerData() {
    let s = {
        Life: E(10),
        build: {}
    }

    for (let x in BUILDINGS_DATA) s.build[x] = {
        amt: E(0),
        auto: false,

    }

    return s
}

function Wipe(reload=false) {
    if (reload) {
        Wipe()
        Save()
        location.reload()
    }
    else Player = GetPlayerData()
}

function Load(x) {
    if(typeof x == "string" & x != ``){
        loadPlayer(JSON.parse(atob(x)))
        console.log("Load Attempt?")
        console.log(atob(x))
    } else {
        console.log("Why did we try to wipe")
        Wipe()
    }
}

function LoadGame(start = true, gotNaN = false) {
    if (!gotNaN) tmp.prevSave = localStorage.getItem("Save")
    Wipe()
    Load(tmp.prevSave)

	if (start) {
        SetupHTML()
        setupTooltips()

        setInterval(Save,60000)
        for (let x = 0; x < 5; x++) UpdateTemp()

        UpdatePage()
        updateTooltipResHTML(true)
		setInterval(loop, 1000/FPS)
	}
}


function isNaNed(val) {
    return typeof val == "number" ? isNaN(val) : Object.getPrototypeOf(val).constructor.name == "Decimal" ? isNaN(val.mag) : false
}