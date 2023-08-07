export enum ErrorMessages {
  FIELD_IS_REQUIRED = 'This field is required',
  FIELD_IS_NUMBER = 'This field is number',
  OPTION_NOT_MATCH = 'Option selected is invalid',
  SERIAL_NUMBER_EXIST = 'Serial Number already exists',
  DOMAIN_NAME_EXIST = 'Domain name already exists, please enter a different name',
  DOMAIN_NAME_MUST_NOT_UNDERSCORE = 'Domain name has an underscore character is invalid',
  GROUP_NAME_EXIST = 'Group name already exists, please enter a different name',
  DOMAIN_USER_USERNAME_EXIST = 'Domain username already exists, please enter a different username',
  FIELD_IS_ALPHABET = 'Input must be consists of only letters.',
  FIELD_IS_EXISTING_INVALID_CHAR = 'Field is existing invalid characters',
  RANGE_LENGTH_2_TO_20 = 'Field must be between 2 and 20 characters long.',
  MIN_NUMBER_1 = 'The number of users is a number greater than or equal to one',
  DEVICE_CATEGORY_NAME_EXIST = 'Device category name already exists, please enter a different name',
  NODE_NAME_EXIST = 'Node name already exists, please enter a different name',
  FIELD_IS_IP = 'Expected 4 octets and only decimal digits permitted. Invalid IP Address',
  NETWORK_EXISTS = "Network already exists, please enter a different network",
  IP_IN_NETWORK = 'IP Address not contained in network',
  RANGE_LENGTH_50 = 'Field must be between 3 and 50 characters long.',
  NAME_EXISTS = 'Name already exists, please enter a different name',
  MAIL_EXISTS = 'Email already exists, please enter a different email',
  MIN_MAX_VALUE_1_100 = 'Valid value is between 1 and 100',
  MIN_MAX_VALUE_0_100 = 'Valid value is between 0 and 100',
  MIN_MAX_VALUE_1_4093 = 'Valid value is between 1 and 4093',
  MIN_MAX_VALUE_2_4094 = 'Valid value is between 2 and 4094',
  VLAN_MAX_GREATER_THAN_MIN = 'Max VLAN must be greater than Min VLAN',
  PASSWORD_NOT_MATCH = 'Password do not match',
  VLAN_RANGE_VALUE_0_4095 = 'Must be greater than or equal to 0 and less than or equal to 4095',
  PDF_MD_FORMAT_FILE = 'PDF or Markdown file only!',
  MAIL_INVALID = 'This email is invalid',
  IMAGE_FORMAT_FILE = 'The imported file is invalid, please import a file from a PNG, JPG/JPEG format',
  IMAGE_SIZE = 'The uploaded file likely exceeded the maximum file size (5 MB)',
  DHCP_INVALID = 'DHCP Server is invalid. Should be a system path and no special characters or IP address',
  IP_IS_EXISTING = 'The IP has existing in this port group',
  ADD_NEW_EDGE_FAILED = 'Add new edge failed!',
  CONNECT_EDGE_TO_PG_FAILED = 'Connect Edge to Port Group failed!',
  ADD_TEMPLATE_TO_PROJECT_FAILED = 'Added items from template into project successfully',
}
