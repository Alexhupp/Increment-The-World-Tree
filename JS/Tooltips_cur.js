const CUR_TOOLTIP = {
    life: {
        full: "Life Energy",
        desc() {
            let h = `You have `+format(Player.Life, 2)+ ` Life Energy`
            

            return h
        }
    }
    
    
    
    /**
     * desc() {
            let h = ``

            return h
        },
    */
}


function updateTooltipResHTML(start=false) {
    for (let id in CUR_TOOLTIP) {
        if (!start && hover_tooltip.id !== id+'_tooltip') continue;

        let tr_data = CUR_TOOLTIP[id]
        let tr = tmp.el[id+'_tooltip']

        if (tr) tr.setTooltip(`<h3>[ ${tr_data.full} ]</h3>`+(tr_data.desc?"<br class='line'>"+tr_data.desc():""))
    }
}