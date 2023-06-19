import { ExportType } from "./common.model";

export interface PortGroupAddModel {
  name: string,
  vlan: number | string,
  category: string,
  domain_id: number,
  subnet_allocation: string,
  subnet: string,
  project_id: number,
  logical_map: any
}

export interface PortGroupPutModel {
  name?: string,
  vlan?: number,
  category?: string,
  domain_id: number,
  subnet_allocation?: string,
  subnet?: string,
  project_id?: number,
  logical_map?: any
}

export interface PortGroupValidateModel {
  pks: number[]
}

export interface PortGroupEditBulkModel {
  ids: number[],
  domain_id: number,
  vlan: string,
  category: string,
  subnet_allocation: string
}

export interface PortGroupGetCommonModel {
  linked_project_id: number
  project_id: number
}

export interface PortGroupRandomizeSubnetModel {
  pks: number[]
  project_id: number
}

export interface PortGroupExportModel {
  pks: number[]
  format: ExportType
}

export interface PortGroupGetRandomModel {
  project_id: number
  category: string
}
