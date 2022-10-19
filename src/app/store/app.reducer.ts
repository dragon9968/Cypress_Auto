import { configTemplateReducer } from "./config-template/config-template.reducer";
import { deviceReducer } from "./device/device.reducer";
import { domainReducer } from "./domain/domain.reducer";
import { hardwareReducer } from "./hardware/hardware.reducer";
import { iconReducer } from "./icon/icon.reducer";
import { loginProfileReducer } from "./login-profile/login-profile.reducer";
import { mapOptionReducer } from "./map-option/map-option.reducer";
import { mapStyleReducer } from "./map-style/map-style.reducer";
import { mapReducer } from "./map/map.reducer";
import { mapEditReducer } from "./map-edit/map-edit.reducer";
import { projectReducer } from "./project/project.reducer";
import { templateReducer } from "./template/template.reducer";
import { portGroupReducer } from "./portgroup/portgroup.reducer";
import { nodeReducer } from "./node/node.reducer";
import { domainUserReducer } from "./domain-user/domain-user.reducer";
import { ReducerKeys } from "./reducer-keys.enum";
import { mapContextMenuReducer } from "./map-context-menu/map-context-menu.reducer";
import { groupReducer } from "./group/group.reducer";
import { serverConnect } from "./server-connect/server-connect.reducer";
import { interfaceReducerByIds } from "./interface/interface.reducer";

export const reducers = {
    [ReducerKeys.MAP]: mapReducer,
    [ReducerKeys.PROJECT]: projectReducer,
    [ReducerKeys.ICON]: iconReducer,
    [ReducerKeys.DEVICE]: deviceReducer,
    [ReducerKeys.TEMPLATE]: templateReducer,
    [ReducerKeys.HARDWARE]: hardwareReducer,
    [ReducerKeys.DOMAIN]: domainReducer,
    [ReducerKeys.CONFIG_TEMPLATE]: configTemplateReducer,
    [ReducerKeys.LOGIN_PROFILE]: loginProfileReducer,
    [ReducerKeys.MAP_STYLE]: mapStyleReducer,
    [ReducerKeys.MAP_EDIT]: mapEditReducer,
    [ReducerKeys.MAP_OPTION]: mapOptionReducer,
    [ReducerKeys.PORTGROUP]: portGroupReducer,
    [ReducerKeys.MAP_CM]: mapContextMenuReducer,
    [ReducerKeys.NODE]: nodeReducer,
    [ReducerKeys.DOMAIN_USER]: domainUserReducer,
    [ReducerKeys.GROUP]: groupReducer,
    [ReducerKeys.SERVER_CONNECT]: serverConnect,
    [ReducerKeys.INTERFACE]: interfaceReducerByIds
}
