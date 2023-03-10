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
import { deviceCategoryReducer } from "./device-category/device-category.reducer";
import { userTaskReducer } from "./user-task/user-task.reducer";
import { mapSelectionReducer } from "./map-selection/map-selection.reducer";
import { mapImagesReducer } from "./map-image/map-image.reducer";
import { isChangeDomainUserReducer } from "./domain-user-change/domain-user-change.reducer";
import { deviceChangeReducer } from "./device-change/device-change.reducer";
import { appPrefReducer } from "./app-pref/app-pref.reducer";
import { mapPrefReducer } from "./map-pref/map-pref.reducer";
import { userReducer } from "./user/user.reducer";
import { userGuideReducer } from "./user-guide/user-guide.reducer";
import { userProfileReducer } from "./user-profile/user-profile.reducer";
import { lookupFeaturesReducer } from "./lookup-features/lookup-features.reducer";
import { LookupNamesReducer } from "./lookup-names/lookup-names.reducer";

export const reducers = {
    [ReducerKeys.MAP]: mapReducer,
    [ReducerKeys.PROJECT]: projectReducer,
    [ReducerKeys.ICON]: iconReducer,
    [ReducerKeys.DEVICE]: deviceReducer,
    [ReducerKeys.DEVICE_CHANGE]: deviceChangeReducer,
    [ReducerKeys.DEVICE_CATEGORY]: deviceCategoryReducer,
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
    [ReducerKeys.INTERFACE]: interfaceReducerByIds,
    [ReducerKeys.USER_TASK]: userTaskReducer,
    [ReducerKeys.MAP_SELECTION]: mapSelectionReducer,
    [ReducerKeys.MAP_IMAGE]: mapImagesReducer,
    [ReducerKeys.DOMAIN_USER_CHANGE]: isChangeDomainUserReducer,
    [ReducerKeys.APP_PREF]: appPrefReducer,
    [ReducerKeys.MAP_PREFS]: mapPrefReducer,
    [ReducerKeys.USERS]: userReducer,
    [ReducerKeys.USER_PROFILE]: userProfileReducer,
    [ReducerKeys.USER_GUIDE]: userGuideReducer,
    [ReducerKeys.LOOKUP_FEATURES]: lookupFeaturesReducer,
    [ReducerKeys.LOOKUP_NAMES]: LookupNamesReducer
}
