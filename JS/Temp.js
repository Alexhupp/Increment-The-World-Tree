var tmp = {

}

function resetTemp() {
    keep = [tmp.el, tmp.prevSave]
    tmp = {

        tab: 0,
        stab: [ 0 ],
        build: {},
    }

    for (let x in BUILDINGS_DATA) tmp.build[x] = {
        bulk: E(0),
        total: E(0),
        bonus: E(0),
        effect: {},
    }   

    tmp.el = keep[0]
    tmp.prevSave = keep[1]
}

resetTemp()

function UpdateLifeTemp() {
    tmp.LifeGain = FORMS.GetLifeGain()
}




function UpdateTemp() {
    
    UpdateLifeTemp()
    
    BUILDINGS.temp()
    
}


