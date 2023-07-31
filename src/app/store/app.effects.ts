import { AppPrefEffects } from "./app-pref/app-pref.effects";
import { DomainsEffects } from "./domain/domain.effects";
import { GroupsEffects } from "./group/group.effects";
import { InterfacesEffects } from "./interface/interface.effects";
import { MapEffects } from "./map/map.effects";
import { NodesEffects } from "./node/node.effects";
import { PortGroupsEffects } from "./portgroup/portgroup.effects";
import { ProjectEffects } from "./project/project.effects";
import { LookupOsFirmwaresEffects } from "./lookup-os-firmware/lookup-os-firmwares.effects";
import { MapImagesEffects } from "./map-image/map-image.effects";

export const effects = [
  MapEffects,
  ProjectEffects,
  NodesEffects,
  PortGroupsEffects,
  InterfacesEffects,
  DomainsEffects,
  GroupsEffects,
  AppPrefEffects,
  LookupOsFirmwaresEffects,
  MapImagesEffects
];
