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
  removeInterface
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
    const logicalWiredInterfaces: any[] = [];
    const logicalManagementInterfaces: any[] = [];
    const physicalWiredInterfaces: any[] = [];
    const physicalManagementInterfaces: any[] = [];
    const infrastructureNode = nodes.filter((el: any) => el.infrastructure)
    const hwNodes = nodes.filter((el: any) => el.category === 'hw')
    const physicalNodes = hwNodes.concat(infrastructureNode)
    const logicalNodes = nodes.filter((el: any) => !el.infrastructure)
    logicalNodes.map((logicalNode: any) => {
      interfaces.map((i: any) => {
        if (i.node_id === logicalNode.id) {
          if (i.category == 'wired') {
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
            logicalWiredInterfaces.push({ ...i, data: { ...i, ...baseCyData }, locked: i.physical_map?.locked });
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
          if (i.category == 'wired') {
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
            physicalWiredInterfaces.push({ ...i, data: { ...i, ...baseCyData }, locked: i.physical_map?.locked });
          } else if (i.category == 'management') {
            physicalManagementInterfaces.push(i);
          }
        }
      })
    });
    return {
      ...state,
      wiredInterfaces: logicalWiredInterfaces,
      logicalWiredInterfaces,
      logicalManagementInterfaces,
      physicalWiredInterfaces,
      physicalManagementInterfaces
    }
  }),
  on(selectInterface, (state, { id }) => {
    const wiredInterfaces = state.wiredInterfaces.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
      wiredInterfaces
    }
  }),
  on(unSelectInterface, (state, { id }) => {
    const wiredInterfaces = state.wiredInterfaces.map(n => {
      if (n.data.id == id) return { ...n, isSelected: false };
      return n;
    })
    return {
      ...state,
      wiredInterfaces
    }
  }),
  on(removeInterface, (state, { id }) => {
    const wiredInterfaces = state.wiredInterfaces.filter(ele => ele.id !== id)
    return {
      ...state,
      wiredInterfaces
    }
  }),
);
