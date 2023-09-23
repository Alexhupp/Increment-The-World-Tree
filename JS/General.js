const FPS = 20
function E(x){return new Decimal(x)}

function SetupHTML() {

	MakeCurrencyHTML()

	// Setup Tabs
	let tabs = new Element("LayerSelection")
	let stabs = new Element("stabs")
	let table = ""
	let table2 = ""
	for (let x = 0; x < LAYERS[1].length; x++) {
		table += `<div>
			<button onclick="LAYERS.choose(${x})" class="btn_tab" id="tab${x}">${LAYERS[1][x].icon ? `<iconify-icon icon="${LAYERS[1][x].icon}" width="72" style="color: ${LAYERS[1][x].color||"white"}"></iconify-icon>` : ""}<div>${LAYERS[1][x].id}</div></button>
		</div>`
		if (LAYERS[2][x]) {
			let a = `<div id="stabs${x}" class="table_center stab_btn">`
			for (let y = 0; y < LAYERS[2][x].length; y++) {
				a += `<div style="width: 160px">
					<button onclick="LAYERS.choose(${y}, true)" class="btn_tab" id="stab${x}_${y}">${LAYERS[2][x][y].id}</button>
				</div>`
			}
			a += `</div>`
			table2 += a
		}
	}

	tabs.setHTML(table)
	stabs.setHTML(table2)

	BUILDINGS.setup()

	tmp.el = {}
	let all = document.getElementsByTagName("*")
	for (let i=0;i<all.length;i++) {
		let x = all[i]
		tmp.el[x.id] = new Element(x)
	}
}






function UpdatePage() {
	updateResourcesHTML()
	updateTabsHTML()
	if (hover_tooltip) updateTooltipResHTML()

	if (tmp.tab == 0) {
		updateTab0()
	}
}

function updateTabsHTML() {
	//let s = !player.options.nav_hide[0]
	tmp.el.stabs_div.setDisplay(LAYERS[2][tmp.tab])
	
	for (let x = 0; x < LAYERS[1].length; x++) {
		let tab = LAYERS[1][x]
		// if (s) {
		// 	tmp.el["tab"+x].setDisplay(tab.unl ? tab.unl() : true)
		// 	tmp.el["tab"+x].setClasses({btn_tab: true, [tab.style ? tab.style : "normal"]: true, choosed: x == tmp.tab})
		// }

		if (tmp.el["tab_frame"+x]) tmp.el["tab_frame"+x].setDisplay(x == tmp.tab)
		if (LAYERS[2][x]) {
			tmp.el["stabs"+x].setDisplay(x == tmp.tab)
			if (x == tmp.tab) for (let y = 0; y < LAYERS[2][x].length; y++)  {
				let stab = LAYERS[2][x][y]
				tmp.el["stab"+x+"_"+y].setDisplay(stab.unl ? stab.unl() : true)
				tmp.el["stab"+x+"_"+y].setClasses({btn_tab: true, [stab.style ? stab.style : "normal"]: true, choosed: y == tmp.stab[x]})
				if (tmp.el["stab_frame"+x+"_"+y]) tmp.el["stab_frame"+x+"_"+y].setDisplay(y == tmp.stab[x])
			}
		}
	}
}