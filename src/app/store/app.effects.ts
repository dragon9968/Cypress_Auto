import { DomainsEffects } from "./domain/domain.effects";
import { GroupsEffects } from "./group/group.effects";
import { InterfacesEffects } from "./interface/interface.effects";
import { MapEffects } from "./map/map.effects";
import { NodesEffects } from "./node/node.effects";
import { PortGroupsEffects } from "./portgroup/portgroup.effects";
import { ProjectEffects } from "./project/project.effects";

export const effects = [
  MapEffects,
  ProjectEffects,
  NodesEffects,
  PortGroupsEffects,
  InterfacesEffects,
  DomainsEffects,
  GroupsEffects
];