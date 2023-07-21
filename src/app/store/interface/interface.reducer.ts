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
  unSelectInterface
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
  on(interfacesLoadedSuccess, (state, { interfaces }) => {
    const wiredInterfaces: any[] = [];
    const managementInterfaces: any[] = [];
    interfaces.map((i: any) => {
      if (i.category == 'wired') {
        const ip_str = i.ip ? i.ip : '';
        const ip = ip_str.split(".");
        const lastOctet = ip.length == 4 ? `.${ip[3]}` : '';
        const baseCyData = {
          id: `interface-${i.id}`,
          interface_pk: i.id,
          interface_fk: i.inteface_id,
          elem_category: "interface",
          zIndex: 999,
          updated: false,
          source: `node-${i.node_id}`,
          target: i.port_group_id ? `pg-${i.port_group_id}` : undefined,
          ip_last_octet: i.ip_allocation != "dhcp" ? lastOctet : "DHCP",
          source_label: i.name,
          target_label: ''
        }
        wiredInterfaces.push({ ...i, data: { ...i, ...baseCyData }, locked: i.logical_map?.locked });
      } else if (i.category == 'management') {
        managementInterfaces.push(i);
      }
    });
    return {
      ...state,
      wiredInterfaces,
      managementInterfaces,
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
);
