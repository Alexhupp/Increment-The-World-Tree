const LAYERS = {
    choose(x, stab=false) {
        if (!stab) {
            if (x==5) tmp.sn_tab = tmp.tab
            tmp.tab = x
            if (x!=5) {
                tmp.sn_tab = tmp.tab
                tree_update = true
            }
        }
        else {
            tmp.stab[tmp.tab] = x
        }
    },
    1: [
        { id: "Main", icon: "mdi:leaf" },

        { id: "Options", icon: "mdi:gear" },
    ],
    2: {
        0: [
            { id: "Life"},
            { id: "Lore"}
        ],
        1: [
            { id: "Settings"}
        ]
    },
}