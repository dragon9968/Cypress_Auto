import { InterfaceState } from "./interface.state";
import { createReducer, on } from "@ngrx/store";
import {
  retrievedInterfacesNotConnectPG,
  retrievedIsInterfaceConnectPG,
  retrievedInterfaceByProjectIdAndCategory,
  retrievedInterfacesConnectedPG,
  retrievedInterfacesBySourceNode,
  retrievedInterfacePkConnectNode,
  retrievedInterfacesByHwNodes,
  retrievedInterfacesByDestinationNode,
  retrievedInterfacesConnectedNode,
  interfacesLoadedSuccess,
  selectInterface,
  unSelectInterface,
  removeInterface,
  updateNodeInInterfaces,
  updatePGInInterfaces,
  logicalInterfaceUpdatedSuccess,
  bulkEditlogicalInterfaceSuccess,
  selectAllInterface,
  unselectAllInterface,
  randomizeIpBulkSuccess
} from "./interface.actions";

const initialState = {} as InterfaceState;

export const interfaceReducerByIds = createReducer(
  initialState,
  on(retrievedInterfaceByProjectIdAndCategory, (state, { data }) => ({
    ...state,
    interfacesByProjectIdAndCategory: data
  })),
  on(retrievedInterfacesNotConnectPG, (state, { interfacesNotConnectPG }) => ({
    ...state,
    interfacesNotConnectPG: interfacesNotConnectPG
  })),
  on(retrievedInterfacesConnectedPG, (state, { interfacesConnectedPG }) => ({
    ...state,
    interfacesConnectedPG: interfacesConnectedPG
  })),
  on(retrievedIsInterfaceConnectPG, (state, { isInterfaceConnectPG }) => ({
    ...state,
    isInterfaceConnectPG: isInterfaceConnectPG
  })),
  on(retrievedInterfacePkConnectNode, (state, { interfacePkConnectNode }) => ({
    ...state,
    interfacePkConnectNode: interfacePkConnectNode
  })),
  on(retrievedInterfacesBySourceNode, (state, { interfacesBySourceNode }) => ({
    ...state,
    interfacesBySourceNode: interfacesBySourceNode
  })),
  on(retrievedInterfacesByDestinationNode, (state, { interfacesByDestinationNode }) => ({
    ...state,
    interfacesByDestinationNode: interfacesByDestinationNode
  })),
  on(retrievedInterfacesByHwNodes, (state, { interfacesByHwNodes }) => ({
    ...state,
    interfacesByHwNodes: interfacesByHwNodes
  })),
  on(retrievedInterfacesConnectedNode, (state, { interfacesConnectedNode }) => ({
    ...state,
    interfacesConnectedNode: interfacesConnectedNode
  })),
  on(interfacesLoadedSuccess, (state, { interfaces, nodes }) => {
    const logicalMapInterfaces: any[] = [];
    const logicalManagementInterfaces: any[] = [];
    const physicalInterfaces: any[] = [];
    const physicalManagementInterfaces: any[] = [];
    const infrastructureNode = nodes.filter((el: any) => el.infrastructure)
    const hwNodes = nodes.filter((el: any) => el.category === 'hw')
    const physicalNodes = hwNodes.concat(infrastructureNode)
    const logicalNodes = nodes.filter((el: any) => !el.infrastructure)
    logicalNodes.map((logicalNode: any) => {
      interfaces.map((i: any) => {
        if (i.node_id === logicalNode.id) {
          if (i.category != 'management') {
            const ip_str = i.ip ? i.ip : '';
            const ip = ip_str.split(".");
            const lastOctet = ip.length == 4 ? `.${ip[3]}` : '';
            const baseCyData = {
              id: `interface-${i.id}`,
              interface_pk: i.id,
              interface_fk: i.interface_id,
              elem_category: "interface",
              zIndex: 999,
              updated: false,
              source: `node-${i.node_id}`,
              target: `pg-${i.port_group_id}`,
              ip_last_octet: i.ip_allocation != "dhcp" ? lastOctet : "DHCP",
              source_label: i.name,
              target_label: ''
            }
            logicalMapInterfaces.push({
              ...i,
              data: { ...i, ...baseCyData },
              locked: i.physical_map?.locked
            });
          } else if (i.category == 'management') {
            logicalManagementInterfaces.push(i);
          }
        }
      })
    })
    physicalNodes.map((node: any) => {
      interfaces.map((i: any) => {
        let targetNode: any;
        if (i.interface_id) {
          targetNode = interfaces.find((el: any) => el.id === i.interface_id)
        }
        if (i.node_id === node.id) {
          if (i.category != 'management') {
            const baseCyData = {
              id: `interface-${i.id}`,
              interface_pk: i.id,
              interface_fk: i.interface_id,
              elem_category: "interface",
              zIndex: 999,
              updated: false,
              source: `node-${i.node_id}`,
              target: i.interface_id ? `node-${targetNode.node_id}` : '',
              source_label: i.name,
              target_label: (i.node_id === node.id) ? i.name : ""
            }
            physicalInterfaces.push({
              ...i,
              data: { ...i, ...baseCyData },
              locked: i.physical_map?.locked
            });
          } else if (i.category == 'management') {
            physicalManagementInterfaces.push(i);
          }
        }
      })
    });
    return {
      ...state,
      logicalMapInterfaces,
      logicalManagementInterfaces,
      physicalInterfaces,
      physicalManagementInterfaces
    }
  }),
  on(selectInterface, (state, { id }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
      logicalMapInterfaces
    }
  }),
  on(unSelectInterface, (state, { id }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(n => {
      if (n.data.id == id) return { ...n, isSelected: false };
      return n;
    })
    return {
      ...state,
      logicalMapInterfaces
    }
  }),
  on(selectAllInterface, (state) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(n => {
      return { ...n, isSelected: true };
    })
    return {
      ...state,
      logicalMapInterfaces
    }
  }),
  on(unselectAllInterface, (state) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(n => {
      return { ...n, isSelected: false };
    })
    return {
      ...state,
      logicalMapInterfaces
    }
  }),
  on(removeInterface, (state, { id }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.filter(i => i.id !== id)
    return {
      ...state,
      logicalMapInterfaces
    }
  }),
  on(updateNodeInInterfaces, (state, { node }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map((i: any) => {
      if (i.node_id == node.id) {
        return {
          ...i,
          node: {
            ...i.node,
            name: node.name
          }
        };
      } else {
        return i;
      }
    });
    return {
      ...state,
      logicalMapInterfaces,
    };
  }),
  on(updatePGInInterfaces, (state, { portgroup }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map((i: any) => {
      if (i.port_group_id == portgroup.id) {
        return {
          ...i,
          port_group: {
            ...i.port_group,
            name: portgroup.name
          }
        };
      } else {
        return i;
      }
    });
    return {
      ...state,
      logicalMapInterfaces,
    };
  }),
  on(logicalInterfaceUpdatedSuccess, (state, { interfaceData }) => {
    if (interfaceData.category == 'management') {
      const logicalManagementInterfaces = state.logicalManagementInterfaces.map((i: any) => (i.id == interfaceData.id) ? { ...i, ...interfaceData } : i);
      return {
        ...state,
        logicalManagementInterfaces
      };
    } else {
      const logicalMapInterfaces = state.logicalMapInterfaces.map((i: any) => (i.id == interfaceData.id) ? { ...i, ...interfaceData } : i);
      return {
        ...state,
        logicalMapInterfaces
      };
    }
  }),

  on(bulkEditlogicalInterfaceSuccess, (state, { interfacesData }) => {
    const logicalMapInterfaces: any = [];
    const logicalManagementInterfaces: any = [];
    const listAllInterfaces = state.logicalMapInterfaces.concat(state.logicalManagementInterfaces)
    listAllInterfaces.map((interfaceData: any) => {
      const updatedInterface = interfacesData.find((i: any) => i.id == interfaceData.id);
      if (interfaceData.category === 'management') {
        if (updatedInterface && updatedInterface.category === 'management') {
          logicalManagementInterfaces.push({...interfaceData, ...updatedInterface})
        } else {
          logicalManagementInterfaces.push(interfaceData)
        }
      } else {
        if (updatedInterface && updatedInterface.category !== 'management') {
          logicalMapInterfaces.push({...interfaceData, ...updatedInterface})
        } else {
          logicalMapInterfaces.push(interfaceData)
        }
      }
    })
    return {
      ...state,
      logicalMapInterfaces,
      logicalManagementInterfaces
    }
  }),
  on(randomizeIpBulkSuccess, (state, { interfacesData }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map((interfaceData: any) => {
      const updatedLogicalMapInterfaces = interfacesData.find((i: any) => i.id == interfaceData.id);
      return updatedLogicalMapInterfaces ? {...interfaceData, ...updatedLogicalMapInterfaces} : interfaceData
    })
    return {
      ...state,
      logicalMapInterfaces
    };
  }),
);
