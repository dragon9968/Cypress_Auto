export enum ApiPaths {
  ASSETS = '/assets',
  LOGIN = '/api/v1/security/login',
  REFRESH_TOKEN = '/api/v1/security/refresh',
  LOGOUT = '/api/v1/logout',
  GET_MAP_DATA = '/api/v1/map/get_data',
  PROJECTS = '/api/v1/project/',
  SHARE_PROJECT = '/api/v1/shared/',
  PROJECTS_DEVICE_COUNT = '/api/v1/project/device_count/',
  PROJECT_VALIDATE = '/api/v1/project/validate',
  PROJECT_RECENT = '/api/v1/project/recent',
  PROJECT_LINK = '/api/v1/project/link',
  PROJECT_UNLINK = '/api/v1/project/unlink',
  PROJECT_TEMPLATE = '/api/v1/project_template/',
  IMAGE = '/api/v1/image/',
  IMAGE_ADD = '/api/v1/image/add_image',
  DEVICES = '/api/v1/device/',
  DEVICE_CATEGORY = '/api/v1/device_category/',
  TEMPLATES = '/api/v1/template/',
  HARDWARES = '/api/v1/hardware/',
  DOMAINS = '/api/v1/domain/',
  DOMAINS_BULK_EDIT = '/api/v1/domain/bulk_edit',
  DOMAINS_EXPORT = '/api/v1/domain/export',
  DOMAINS_CREATE_USERS = '/api/v1/domain/create_user',
  DOMAINS_VALIDATE = '/api/v1/domain/validate',
  CONFIG_TEMPLATES = '/api/v1/configtemplate/',
  LOGIN_PROFILES = '/api/v1/loginprofile/',
  NODE = '/api/v1/node/',
  NODE_SNAPSHOTS = '/api/v1/map/get_vm_snapshots',
  CLONE_NODE = '/api/v1/node/clone/',
  VALIDATE_NODE = '/api/v1/node/validate',
  PORTGROUP = '/api/v1/portgroup/',
  PORTGROUP_EXPORT  = '/api/v1/portgroup/export',
  MAP_PREF = '/api/v1/mappref/',
  APP_PREF = '/api/v1/apppref/',
  GEN_NODE_DATA = '/api/v1/node/gen_data',
  GEN_PG_DATA = '/api/v1/portgroup/gen_data',
  INTERFACE = '/api/v1/interface/',
  GEN_INTERFACE_DATA = '/api/v1/interface/gen_data',
  GEN_INTERFACE_DATA_CONNECT_PG = '/api/v1/interface/gen_data_connect_pg',
  INTERFACE_DATA_CATEGORY = '/api/v1/interface/get_data/',
  INTERFACE_BY_PKS = '/api/v1/interface/data_by_pks',
  TASK = '/api/v1/task/add',
  TOOL = '/api/v1/tool/add',
  USER_TASK = '/api/v1/user_task/',
  USER_TASK_RERUN = '/api/v1/user_task/rerun_task',
  USER_TASK_REVOKE = '/api/v1/user_task/revoke_task',
  USER_TASK_POST_TASK = '/api/v1/user_task/post_task',
  USER_TASK_REFRESH_TASK = '/api/v1/user_task/refresh',
  USER_TASK_AUTO_REFRESH = '/api/v1/user_task/auto_refresh',
  PORTGROUP_RANDOMIZE_SUBNET = '/api/v1/portgroup/randomize_subnet/',
  PORTGROUP_RANDOMIZE_SUBNET_BULK = '/api/v1/portgroup/randomize_subnet_bulk',
  PORTGROUP_VALIDATE = '/api/v1/portgroup/validate',
  PORTGROUP_COMMON = '/api/v1/portgroup/common',
  INTERFACE_RANDOMIZE_IP = '/api/v1/interface/randomize_ip/',
  INTERFACE_RANDOMIZE_IP_BULK = '/api/v1/interface/randomize_ip_bulk',
  INTERFACE_VALIDATE = '/api/v1/interface/validate',
  SAVE_MAP = '/api/v1/map/save',
  USER = '/api/v1/user/',
  USER_PROFILE = '/api/v1/user/profile',
  ASSOCIATE_ROLE = '/api/v1/user/associate',
  ROLES = '/api/v1/roles/',
  ROLES_USER = '/api/v1/roles/user',
  ROLES_PROTECTED = '/api/v1/roles/protected',
  EXPORT_ROLES = '/api/v1/roles/export',
  IMPORT_ROLES = '/api/v1/roles/import',
  CLONE_ROLES = '/api/v1/roles/clone',
  PERMISSIONS = '/api/v1/permission/',
  ASSOCIATE_ROLES = '/api/v1/roles/associate',
  USER_CREATED_PROJECT = '/api/v1/user/created/',
  SEARCH = '/api/v1/search/map',
  DOMAIN_USER = '/api/v1/domainuser/',
  GROUP = '/api/v1/group/',
  UPDATE_GROUP = '/api/v1/group/update',
  SERVER_CONNECT = '/api/v1/server_connect/',
  ADD_UPDATE_SERVER_CONNECT_FILE = '/api/v1/server_connect/update_file',
  CONNECT_TO_SERVER = '/api/v1/server_connect/connect',
  DISCONNECT_FROM_SERVER = '/api/v1/server_connect/disconnect',
  MAP_STATUS = '/api/v1/map/map_status',
  SAVE_MAP_OVERVIEW = '/api/v1/map/save_map_overview',
  ADD_PROJECT = '/api/v1/project/add',
  DELETE_RESTORE_PROJECT = '/api/v1/project/delete_restore',
  PERMANENT_DELETE_PROJECT = '/api/v1/project/delete',
  ASSOCIATE_PROJECT = '/api/v1/project/associate',
  EXPORT_PROJECT = '/api/v1/project/export',
  IMPORT_PROJECT = '/api/v1/project/import',
  PROJECT_DASHBOARD_UPDATE = '/api/v1/project/dashboard/update',
  CLONE_PROJECT = '/api/v1/project/clone',
  NODE_CLONE = '/api/v1/node/clone_bulk',
  NODE_EXPORT = '/api/v1/node/export/',
  ASSOCIATE = '/api/v1/node/associate',
  CLEAR_PARAMETERS = '/api/v1/server_connect/clear_parameters',
  CONNECTION_EXPORT = '/api/v1/server_connect/export',
  PING_TEST = '/api/v1/server_connect/ping_test',
  LOGIN_CHECK = '/api/v1/server_connect/login_check',
  LOGIN_PROFILE_EXPORT_CSV = '/api/v1/loginprofile/export_csv',
  LOGIN_PROFILE_EXPORT_JSON = '/api/v1/loginprofile/export_json',
  HARDWARE_EXPORT = '/api/v1/hardware/export/',
  IMAGE_UPDATE = '/api/v1/image/update_image/',
  IMAGE_EXPORT = '/api/v1/image/export',
  MAP_PREF_EXPORT = '/api/v1/mappref/export',
  ADD_CONFIG_TEMPLATES = '/api/v1/configtemplate/add_configuration',
  GET_FEATURES = '/api/v1/configtemplate/get_features',
  CONFIG_TEMPLATES_EXPORT = '/api/v1/configtemplate/export',
  DELETE_CONFIG_TEMPLATES = '/api/v1/configtemplate/delete_configuration/',
  DEVICES_ADD = '/api/v1/device/add',
  DEVICES_UPDATE = '/api/v1/device/update',
  DEVICES_EXPORT = '/api/v1/device/export',
  TEMPLATES_EXPORT = '/api/v1/template/export',
  PROJECT_TEMPLATE_ADD = '/api/v1/map/add_template',
  MAP_IMAGE = '/api/v1/mapimage/',
  APP_VERSION = '/api/v1/app/version',
  USER_GUIDE = '/api/v1/guide/',
  USER_GUIDE_UPLOAD = '/api/v1/guide/upload',
  USER_GUIDE_DOWNLOAD = '/api/v1/guide/download_file',
  LDAP_CONFIG = '/api/v1/admin/ldap',
  LOOKUP_FEATURES = '/api/v1/lookupfeatures/',
  LOOKUP_FEATURES_EXPORT = '/api/v1/lookupfeatures/export',
  LOOKUP_FEATURES_IMPORT = '/api/v1/lookupfeatures/import',
  UPDATE_FEATURE = '/api/v1/lookupfeatures/update_feature',
  LOOKUP_NAMES = '/api/v1/lookupname/',
  LOOKUP_NAMES_EXPORT = '/api/v1/lookupname/export',
  LOOKUP_NAMES_IMPORT = '/api/v1/lookupname/import',
}
