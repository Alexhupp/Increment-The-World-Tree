const Currency_list = {
    life: {
        unl: ()=>true,
        icon: "life",
        
        desc: (gs)=> format(Player.Life, 2)+"</br>"+formatGain(Player.Life, tmp.LifeGain)
    }
}

function MakeCurrencyHTML() {
    let h1 ="", h2 = ""

    for (i in Currency_list) {
        let CD = Currency_list[i]

        h1 += `
        <div id="${i}_res_div">
            <div ${i in CUR_TOOLTIP ? `id="${i}_tooltip" class="tooltip ${CD.class||""}" tooltip-pos="left" tooltip-align="left" tooltip-text-align="left"` : `class="${CD.class||""}"`}>
                <span style="margin-right: 5px; text-align: right;" id="${i}_res_desc">X</span>
                <div><img src="images/${CD.icon||"mass"}.png" ${CD.resetBtn ? `onclick="reset_res_btn('${i}')" style="cursor: pointer;"` : ""}></div>
            </div>
        </div>`
    }  

    new Element("CurrencyDisplay").setHTML(h1)
}

function updateResourcesHTML() {

    for (i in Currency_list) {
        let CD = Currency_list[i]
        let unl = 
        //!player.options.res_hide[i] &&
        CD.unl()

        tmp.el[i+"_res_div"].setDisplay(unl)

        if (unl) {
            tmp.el[i+"_res_desc"].setHTML(CD.desc())
        }
    }
}