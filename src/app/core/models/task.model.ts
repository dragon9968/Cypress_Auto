export interface TaskAddModel {
  job_name: string
  category: string
  pks: string
  hypervisor_id: number
  configurator_id?: number
  datasource_id?: number
  backup_vm?: string
  os_customization?: string
  login_profile_id?: string
  snapshot_name?: string
  remote_host?: string
  shell_command?: string
}
