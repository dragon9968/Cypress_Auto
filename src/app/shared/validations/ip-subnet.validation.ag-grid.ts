import { isIPv4 } from 'is-ip';

const _onSuccess = (params: any) => (isExists: boolean) => {
  let data = params.data;
  let field = params.colDef.field;
  data[field] = params.newValue
  params.api.applyTransaction({  update: [data] });
};

const _onFail = (params: any) => (isExists: boolean) => {
  let data = params.data;
  let field = params.colDef.field;
  data[field] = params.oldValue
  params.api.applyTransaction({  update: [data] });
};


export function validatieIP (params: any, newValue: any) {
  let typeOfValidation = ''
  const isSubnet = require("is-subnet");
    if (params.colDef.field === "reserved_ip") {
      const ips = newValue.split(',')
      let isMatch = false
      const category = params.data.category
      let ipNetwork = params.data.network.split('.');
      let validateIp = false
      for (let ip in ips) {
        isMatch = isIPv4(ips[ip])
        if (isMatch || (newValue === "")) {
          if (category === 'public') {
            validateIp = ips[ip].split('.')[0] !== ipNetwork[0]
          } else if (category === 'private') {
            validateIp = (ips[ip].split('.')[0] !== ipNetwork[0]) || (ips[ip].split('.')[1] !== ipNetwork[1])
          } else {
            validateIp = (ips[ip].split('.')[0] !== ipNetwork[0]) || (ips[ip].split('.')[1] !== ipNetwork[1])
            if (!validateIp) {
              validateIp = ips[ip].split('.')[2] > 3
            }
          }
        } else {
          typeOfValidation = 'validation reserved_ip'
        }
      }
      if (validateIp && newValue != '') {
        typeOfValidation = 'ip in network'
        _onFail(false)
      } else {
        _onSuccess(false);
      }
    } else {
      let isExists = false;
      Object.values(params.node.parent.allLeafChildren).forEach((val: any) => {
        if (newValue === val.data.network) {
          isExists = true;
          typeOfValidation = 'network is exists'
        }
      })
      if ((isSubnet(newValue) || isIPv4(newValue)) && !isExists) {
        _onSuccess(isExists);
      } else {
        typeOfValidation = 'validation network'
        _onFail(isExists);
      }
    }

  return typeOfValidation
}

