import { getRequest } from "./api"

export const initMenu = (router, store) => {
    if(store.state.routes.length > 0) {
        return    
    }
    if(store.state.user) {
        getRequest('/system/authority/listMenus')
        .then(resp => {
            if(resp && resp.code == 200) {
                var fmRoutes = formatRoutes(resp.data);
                router.addRoutes(fmRoutes);
                store.commit('initMenu', fmRoutes);
            }
        })
    }
}

export const formatRoutes = menus => {
    var fmRoutes = []
    menus.forEach(menu => {
        var children = null
        if(menu.children && menu.children instanceof Array) {
            children = formatRoutes(menu.children)
        }
        var fmRoute = {
            path: menu.path,
            name: menu.name,
            component(resolve) {
                if(menu.component) {
                    if(menu.component == 'Home') {
                        require(['../views/Home.vue'], resolve)
                    }
                    else {
                        require(['../views' + menu.component + '.vue'], resolve)
                    }
                }
                else {
                    require(['../views/About.vue'], resolve)
                }
            },
            iconCls: menu.iconCls,
            children: children
        }
        fmRoutes.push(fmRoute)
    })
    return fmRoutes;
}