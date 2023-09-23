/* BUILDINGS.JS: ORIGINAL BY AAREX */

const BUILDINGS_DATA = {

    life_1: {
        name: "Breath of Life",
        icon: "life",

        get isUnlocked() { return true },
        get autoUnlocked() { return false},
        get noSpend()  {return false},

        get res() {return Player.Life},
        set res(v) { Player.Life = v},

        cost(x=this.level) {
            let q = E(1.15)
            let a = E(10)
            return a.pow(b.level).mul(q.pow(bulk).sub(1)).div(q.sub(1));
        },

        get bulk() {
            let level = this.level 
            
            let q = E(1.15)
            let a = E(10)
            let bulk = this.res.max(1).mul(q.sub(1)).div(a.mul(E(1.15).pow(level))).add(1).log(q).floor()

            bulk = bulk.add(level)
            return bulk;
        },

        get_cost: x => format(x, 2)+" Life",
        get beMultiplicative() { return false },
        
        effect(x) {
            let power = E(1)

            let effect = power.mul(x)
            return {power, effect}
        },
        
        get bonus() {
            let x = E(0)
            return x
        },
        get_power: x=> "+"+format(x.power,2),
        get_effect: x=> "+"+format(x.effect,2)+ " To Life Gain/s",
    },

    life_2: {
        name: "Gasp Of Life",
        icon: "life",

        get isUnlocked() { return Player.build.life_1.amt.gte(E(10))},
        get autoUnlocked() { return false},
        get noSpend() {return false},

        get res() {return Player.Life},
        set res(v) { Player.Life = v},

        cost(x=this.level) {
            return E(100).pow(E(1.05).pow(x))
        },

        get bulk() {
            let bulk = this.res.max(1).log(100).max(1).log(1.05).add(1).floor()

            return bulk
        },

        get_cost: x=> format(x, 2)+" Life",
        get beMultiplicative() { return false },
        

        effect(x, bonus) {
            let pow = E(1)
            let eff = pow.mul(x)
            
            return {power:pow, effect: eff}
        },

        get bonus() {
            let x = E(0)
            return x
        },

        get_power: x=> "+"+format(x.power,2),
        get_effect: x=> "+x"+format(x.effect,2)+" To Life Gain/s",
    },

    /*
    {
        name: "Placeholder",
		icon: "placeholder",

        get isUnlocked() { return false },
        get autoUnlocked() { return false },
        get noSpend() { return false },

        get res() { return Player.mass },
        set res(v) { Player.mass = v },

        cost(x=this.level) {
            return EINF
        },
        get bulk() {
            return E(0)
        },

        get_cost: x => format(x,0),

        effect(x, bonus) {
            let pow = E(1)
            let eff = E(1)
            return {power: pow, effect: eff}
        },

        get bonus() {
            let x = E(0)

            return x
        },

        get_power: x => formatMult(x.power),
        get_effect: x => formatMult(x.effect),
    },
    */
}

const BUILDINGS_ORDER = [
    'life_2','life_1',
]

Object.keys(BUILDINGS_DATA).forEach(i => {
    let b = BUILDINGS_DATA[i]

    Object.defineProperty(b, "level", {
        get() { return Player.build[i].amt },
        set(value) { Player.build[i].amt = value },
    })
});

const BUILDINGS = {
    //Calculation
    tick() {
		for (var [i, b] of Object.entries(BUILDINGS_DATA)) {
			if (b.isUnlocked && b.autoUnlocked && Player.build[i].auto) this.buy(i, true)
		}
	},
    temp() {
		let bt = tmp.build

		for (var i of BUILDINGS_ORDER) {
            let b = BUILDINGS_DATA[i]

			if (b.isUnlocked || b.forceEffect) {
                let bonus = b.bonus
                let total = b.beMultiplicative ? b.level.add(1).mul(bonus.add(1)).sub(1) : b.level.add(bonus)

                bt[i] = {
                    bulk: b.bulk,
                    total: total,
                    bonus: bonus,
                    effect: b.effect(total),
                }
            } else {
                bt[i] = {
                    bulk: E(0),
                    total: E(0),
                    bonus: E(0),
                    effect: {},
                }
            }
		}
	},

    //Reset
    reset(i) { Player.build[i].amt = E(0) },

    //Buying
	buy(i, max=false) {
        let b = BUILDINGS_DATA[i], cost = b.cost()

        if (b.res.lt(cost) || !(b.allowPurchase ?? true)) return

        if (max) {
            let bulk = b.bulk
            if (bulk.lte(b.level)) return
            b.level = bulk

            cost = b.cost(bulk.sub(1))
        } else {
            b.level = b.level.add(1)
        }

        console.log()

		if (!b.noSpend && b.res.gt(cost)) {
			b.res = b.res.sub(cost).max(0) // without .max(0) causes NaN because of negative amount
		}
	},

    //Effect
	eff(i, key="effect", def = E(1)) {
		return tmp.build[i].effect[key] ?? def
	},

    //DOM
	setup() {
		for (var [i, b] of Object.entries(BUILDINGS_DATA)) {
            let el = new Element("building_"+i)

			if (el.el) el.setHTML(`<div class="table_center upgrade" style="width: 100%; margin-bottom: 5px;">
				<div style="width: 300px">
					<div class="resources">
						<img src="images/buildings/${b.icon}.png">
						<span style="margin-left: 5px; text-align: left;"><span id="building_scale_${i}"></span>${b.name} [<span id="building_lvl_${i}"></span>]</span>
					</div>
				</div>
				<button class="btn" id="building_btn_${i}" onclick="BUILDINGS.buy('${i}')" style="width: 300px"><span id="building_cost_${i}"></span></button>
                <button class="btn" onclick="BUILDINGS.buy('${i}', true)" style="width: 120px">Buy Max</button>
				<button class="btn" id="building_auto_${i}" onclick="Player.build.${i}.auto = !Player.build.${i}.auto" style="width: 80px"></button>
				<div style="margin-left: 5px; text-align: left; width: 400px">
					Power: <span id="building_pow_${i}"></span><br>
					Effect: <span id="building_eff_${i}"></span>
				</div>
			</div>`)
		}
	},
	update(i) {
		let b = BUILDINGS_DATA[i], bt = tmp.build[i], unl = b.isUnlocked

        tmp.el["building_"+i].setDisplay(unl)

        if (!unl) return;
		
        tmp.el["building_lvl_"+i].setHTML(b.level.format(0) + (bt.bonus.gt(0) ? (b.beMultiplicative ? " × " : " + ") + bt.bonus.format(0) : "")) //  + " = " + bt.total.format(0)
        tmp.el["building_scale_"+i].setHTML(b.scale ? getScalingName(b.scale) : "")

        let cost = b.cost(), allow = b.allowPurchase ?? true

        tmp.el["building_btn_"+i].setClasses({ btn: true, locked: b.res.lt(cost) || !allow })
        tmp.el["building_cost_"+i].setHTML(allow ? "Cost: "+b.get_cost(cost) : "Locked" + (b.denyPurchaseText??""))

        tmp.el["building_auto_"+i].setDisplay(b.autoUnlocked)
        tmp.el["building_auto_"+i].setHTML(Player.build[i].auto ? "ON" : "OFF")

        let eff = bt.effect

        tmp.el["building_pow_"+i].setHTML(b.get_power(eff))
        tmp.el["building_eff_"+i].setHTML(b.get_effect(eff))
	},
}

function checkBuildings() {
    let b

    // Mass Upgrades
    if (Player.massUpg) for (let x = 1; x <= 4; x++) {
        b = Player.build['mass_'+x]

        if (b.amt.lte(0) && Player.massUpg[x] && Decimal.gt(Player.massUpg[x],0)) {
            b.amt = E(Player.massUpg[x])
            Player.massUpg[x] = undefined;
        }

        b.auto = b.auto || Player.autoMassUpg[x]

        Player.autoMassUpg[x] = false
    }
}