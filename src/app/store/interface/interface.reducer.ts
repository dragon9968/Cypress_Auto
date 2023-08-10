import { InterfaceState } from "./interface.state";
import { createReducer, on } from "@ngrx/store";
import {
  retrievedInterfacesNotConnectPG,
  retrievedIsInterfaceConnectPG,
  retrievedInterfacesConnectedPG,
  retrievedInterfacesBySourceNode,
  retrievedInterfacePkConnectNode,
  retrievedInterfacesByHwNodes,
  retrievedInterfacesByDestinationNode,
  retrievedInterfacesConnectedNode,
  interfacesLoadedSuccess,
  selectInterface,
  unSelectInterface,
  updateNodeInInterfaces,
  updatePGInInterfaces,
  logicalInterfaceUpdatedSuccess,
  bulkEditlogicalInterfaceSuccess,
  selectAllInterface,
  unSelectAllInterface,
  linkedMapInterfacesLoadedSuccess,
  clearLinkedMapInterfaces,
  interfaceAddedMapLinkToPGSuccess,
  randomizeIpBulkSuccess,
  removeInterfacesSuccess,
  restoreInterfacesSuccess,
  interfaceLogicalMapAddedSuccess,
  addInterfacesNotConnectPG,
  logicalInterfacesAddedSuccess,
  selectPhysicalInterface,
  unSelectPhysicalInterface
} from "./interface.actions";

const initialState = {} as InterfaceState;

const addCYDataToLogicalInterface = (edge: any) => {
  const ip_str = edge.ip ? edge.ip : '';
  const ip = ip_str.split(".");
  const lastOctet = ip.length == 4 ? `.${ip[3]}` : '';
  const baseCyData = {
    id: `interface-${edge.id}`,
    interface_pk: edge.id,
    interface_fk: edge.interface_id,
    elem_category: "interface",
    zIndex: 999,
    updated: false,
    source: `node-${edge.node_id}`,
    target: `pg-${edge.port_group_id}`,
    ip_last_octet: edge.ip_allocation != "dhcp" ? lastOctet : "DHCP",
    source_label: edge.name,
    target_label: ''
  }
  return {
    ...edge,
    data: { ...edge, ...baseCyData, ...edge.logical_map?.map_style },
    locked: edge.logical_map?.locked
  }
}

const addCYDataToMapLinkInterface = (edge: any) => {
  const baseCyData = {
    id: `interface-${edge.id}`,
    interface_pk: edge.id,
    interface_fk: edge.interface_id,
    elem_category: "interface",
    zIndex: 999,
    updated: false,
    source: `project-link-${edge.map_link_id}`,
    target: `pg-${edge.port_group_id}`,
    'line-style': 'dotted'
  }
  return {
    ...edge,
    data: { ...edge, ...baseCyData }
  }
}

export const interfaceReducerByIds = createReducer(
  initialState,
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
  on(addInterfacesNotConnectPG, (state, { edge }) => {
    const interfacesNotConnectPG = state.interfacesNotConnectPG.concat(edge)
    return {
      ...state,
      interfacesNotConnectPG
    }
  }),
  on(interfacesLoadedSuccess, (state, { interfaces, nodes }) => {
    const logicalMapInterfaces: any[] = [];
    const logicalManagementInterfaces: any[] = [];
    const physicalInterfaces: any[] = [];
    const physicalManagementInterfaces: any[] = [];
    const interfacesCommonMapLinks: any[] = [];
    const infrastructureNode = nodes.filter((el: any) => el.infrastructure)
    const hwNodes = nodes.filter((el: any) => el.category === 'hw')
    const physicalNodes = hwNodes.concat(infrastructureNode)
    const logicalNodes = nodes.filter((el: any) => !el.infrastructure)
    const interfaceCommonMapLinksRaw = interfaces.filter((i: any) => i.category == 'link')
    logicalNodes.map((logicalNode: any) => {
      interfaces.map((i: any) => {
        if (i.node_id === logicalNode.id) {
          if (i.category != 'management') {
            const edgeCY = addCYDataToLogicalInterface(i)
            logicalMapInterfaces.push(edgeCY);
          } else if (i.category == 'management') {
            logicalManagementInterfaces.push(i);
          }
        }
      })
    });
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
              data: { ...i, ...baseCyData, ...i.physical_map?.map_style },
              locked: i.physical_map?.locked
            });
          } else if (i.category == 'management') {
            physicalManagementInterfaces.push(i);
          }
        }
      })
    });
    interfaceCommonMapLinksRaw.map((edge: any) => {
      const interfaceCYData = addCYDataToMapLinkInterface(edge)
      interfacesCommonMapLinks.push(interfaceCYData);
    })
    return {
      ...state,
      isSelectedFlag: false,
      logicalMapInterfaces,
      logicalManagementInterfaces,
      physicalInterfaces,
      physicalManagementInterfaces,
      interfacesCommonMapLinks
    }
  }),
  on(linkedMapInterfacesLoadedSuccess, (state, { interfaces, nodes }) => {
    const linkedMapInterfaces: any[] = [];
    nodes.map((node: any) => {
      interfaces.map((i: any) => {
        if (i.node_id === node.id) {
          if (i.category != 'management' && i.port_group_id) {
            const edgeCY = addCYDataToLogicalInterface(i)
            linkedMapInterfaces.push(edgeCY);
          }
        }
      })
    })
    return {
      ...state,
      linkedMapInterfaces
    }
  }),
  on(clearLinkedMapInterfaces, (state) => {
    return {
      ...state,
      linkedMapInterfaces: undefined
    }
  }),
  on(interfaceAddedMapLinkToPGSuccess, (state, { edge }) => {
    const edgeCYData = addCYDataToMapLinkInterface(edge);
    return {
      ...state,
      interfacesCommonMapLinks: state.interfacesCommonMapLinks.concat(edgeCYData)
    }
  }),
  on(interfaceLogicalMapAddedSuccess, (state , { edge }) => {
    const edgeCY = addCYDataToLogicalInterface(edge)
    const logicalMapInterfaces = state.logicalMapInterfaces.concat(edgeCY)
    return {
      ...state,
      logicalMapInterfaces
    }
  }),
  on(logicalInterfacesAddedSuccess, (state, { edges }) => {
    let logicalMapInterfaces = JSON.parse(JSON.stringify(state.logicalMapInterfaces));
    let logicalManagementInterfaces = JSON.parse(JSON.stringify(state.logicalManagementInterfaces));
    edges.map(edge => {
      if (edge.category != 'management' && edge.port_group_id) {
        const edgeCY = addCYDataToLogicalInterface(edge);
        logicalMapInterfaces.push(edgeCY);
      } else if (edge.category == 'management') {
        logicalManagementInterfaces.push(edge);
      }
    })
    return {
      ...state,
      logicalMapInterfaces,
      logicalManagementInterfaces
    }
  }),
  on(selectInterface, (state, { id }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
      isSelectedFlag: true,
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
      isSelectedFlag: true,
      logicalMapInterfaces
    }
  }),
  on(selectPhysicalInterface, (state, { id }) => {
    const physicalInterfaces = state.physicalInterfaces.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
      isSelectedFlag: true,
      physicalInterfaces
    }
  }),
  on(unSelectPhysicalInterface, (state, { id }) => {
    const physicalInterfaces = state.physicalInterfaces.map(n => {
      if (n.data.id == id) return { ...n, isSelected: false };
      return n;
    })
    return {
      ...state,
      isSelectedFlag: true,
      physicalInterfaces
    }
  }),
  on(selectAllInterface, (state) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(n => {
      return { ...n, isSelected: true };
    })
    return {
      ...state,
      isSelectedFlag: true,
      logicalMapInterfaces
    }
  }),
  on(unSelectAllInterface, (state) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(n => {
      return { ...n, isSelected: false };
    })
    return {
      ...state,
      isSelectedFlag: true,
      logicalMapInterfaces
    }
  }),
  on(removeInterfacesSuccess, (state, { ids }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(i => ids.includes(i.id) ? { ...i, isDeleted: true } : i);
    return {
      ...state,
      isSelectedFlag: false,
      logicalMapInterfaces,
    };
  }),
  on(restoreInterfacesSuccess, (state, { ids }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map(i => ids.includes(i.id) ? { ...i, isDeleted: false } : i);
    return {
      ...state,
      isSelectedFlag: false,
      logicalMapInterfaces,
    };
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
      isSelectedFlag: false,
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
      isSelectedFlag: false,
      logicalMapInterfaces,
    };
  }),
  on(logicalInterfaceUpdatedSuccess, (state, { interfaceData }) => {
    if (interfaceData.category == 'management') {
      const logicalManagementInterfaces = state.logicalManagementInterfaces.map((i: any) => (i.id == interfaceData.id) ? { ...i, ...interfaceData } : i);
      return {
        ...state,
        isSelectedFlag: false,
        logicalManagementInterfaces
      };
    } else {
      const interfaceCY = addCYDataToLogicalInterface(interfaceData)
      const logicalMapInterfaces = state.logicalMapInterfaces.map((i: any) => (i.id == interfaceData.id) ? { ...i, ...interfaceCY } : i);
      return {
        ...state,
        isSelectedFlag: false,
        logicalMapInterfaces
      };
    }
  }),
  on(bulkEditlogicalInterfaceSuccess, (state, { interfacesData }) => {
    if (interfacesData.category == 'management') {
      const logicalManagementInterfaces = state.logicalManagementInterfaces.map((interfaceData: any) => {
        const updatedLogicalManagementInterfaces = interfacesData.find((i: any) => i.id == interfaceData.id);
        return updatedLogicalManagementInterfaces ? {...interfaceData, ...updatedLogicalManagementInterfaces} : interfaceData
      })
      return {
        ...state,
        isSelectedFlag: false,
        logicalManagementInterfaces
      };
    } else {
      const logicalMapInterfaces = state.logicalMapInterfaces.map((interfaceData: any) => {
        const updatedLogicalMapInterfaces = interfacesData.find((i: any) => i.id == interfaceData.id);
        return updatedLogicalMapInterfaces ? {...interfaceData, ...updatedLogicalMapInterfaces} : interfaceData
      })
      return {
        ...state,
        isSelectedFlag: false,
        logicalMapInterfaces
      };
    }
  }),
  on(randomizeIpBulkSuccess, (state, { interfacesData }) => {
    const logicalMapInterfaces = state.logicalMapInterfaces.map((interfaceData: any) => {
      const updatedLogicalMapInterfaces = interfacesData.find((i: any) => i.id == interfaceData.id);
      return updatedLogicalMapInterfaces ?
      {
        ...interfaceData,
        ...updatedLogicalMapInterfaces,
        node: interfaceData.node,
        port_group: interfaceData.port_group,
        netmask: interfaceData.netmask
      } : interfaceData
    })
    return {
      ...state,
      isSelectedFlag: false,
      logicalMapInterfaces
    };
  }),
);
