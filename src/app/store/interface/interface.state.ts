export interface InterfaceState {
  interfacesByProjectIdAndCategory: any[],
  interfacesNotConnectPG: any[],
  interfacesConnectedPG: any[],
  isInterfaceConnectPG: boolean,
  interfacePkConnectPG: any,
  interfacePkConnectNode: any,
  interfacesBySourceNode: any[],
  interfacesByDestinationNode: any[],
  interfacesByHwNodes: any[],
  interfacesConnectedNode: any[],
  logicalMapInterfaces: any[],
  logicalManagementInterfaces: any[],
  physicalInterfaces: any[],
  physicalManagementInterfaces: any[],
  linkedMapInterfaces: any[] | undefined,
  interfacesCommonMapLinks: any[],
  isSelectedFlag: boolean
}
