var diff = 0;
var date = Date.now();
var Player;

function formatGain(amt, gain) {
    let next = amt.add(gain)
    let rate
    let ooms = next.max(1).log10().div(amt.max(1).log10())
    if (((ooms.gte(10) && amt.gte('ee100')) || ooms.gte(10**0.05) && amt.gte('ee1000'))) {
        ooms = ooms.log10().mul(20)
        rate = "(+"+format(ooms, 4) + " OoMs^2/sec)"
    }else{
		ooms = next.div(amt)
		if ((ooms.gte(10) && amt.gte(1e100))) {
        ooms = ooms.log10().mul(20)
        rate = "(+"+format(ooms, 4) + " OoMs/sec)"
    }
    else rate = "(+"+format(gain, 4)+"/sec)"
	}
    return rate
}


const FORMS = {
    GetLifeGain() {
        let LifeGain = E(0)
        
        LifeGain = LifeGain.add(BUILDINGS.eff("life_1"))
        LifeGain = LifeGain.mul(BUILDINGS.eff("life_2").add(1))
    
        return LifeGain.max(0.0)
    }
}

function loop() {
    diff = Date.now()-date
    UpdatePage()
    UpdateTemp()
    calc(diff) // for when i make a calc function
    date = Date.now()
}

function calc(dt) {
    let multiplier = E(dt).div(1000)

    Player.Life = Player.Life.add(tmp.LifeGain*multiplier)
}