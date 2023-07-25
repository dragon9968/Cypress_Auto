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
  wiredInterfaces: any[],
  managementInterfaces: any[],
  logicalWiredInterfaces: any[],
  logicalManagementInterfaces: any[],
  physicalWiredInterfaces: any[],
  physicalManagementInterfaces: any[]
}
