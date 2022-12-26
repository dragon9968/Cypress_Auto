import { isIPv4 } from 'is-ip';

export const asyncValidateValueSetter = (params: any) => {
  asyncValidator(
    params,
    params.newValue,
    _onSuccess(params),
    _onFail(params)
  );
  return false;
};

const asyncValidator = (
  params: any,
  newValue: any,
  _onSuccess: (isExists: boolean) => void,
  _onFail: (isExists: boolean) => void
) => {
  setTimeout(function() {
    const isSubnet = require("is-subnet");
    if (params.colDef.field === "reserved_ip") {
      const ips = newValue.split(',')
      let isMatch = false
      for (let ip in ips) {
        isMatch = isIPv4(ips[ip])
        if (isMatch || (newValue === "")) {
          _onSuccess(false);
        } else {
          _onFail(false);
        }
      }
    } else {
      let isExists = false;
      Object.values(params.node.parent.allLeafChildren).forEach((val: any) => {
        if (newValue === val.data.network) {
          isExists = true;
        }
      })
      if ((isSubnet(newValue) || isIPv4(newValue)) && !isExists) {
        _onSuccess(isExists);
      } else {
        _onFail(isExists);
      }
    }
  }, 100);
};

const _onSuccess = (params: any) => (isExists: boolean) => {
  let data = params.data;
  let field = params.colDef.field;
  data[field] = params.newValue
  data['validation'] = false
  data['validation_required'] = false
  data['validation_isExists'] = isExists
  params.api.applyTransaction({  update: [data] });
};

const _onFail = (params: any) => (isExists: boolean) => {
  let data = params.data;
  let field = params.colDef.field;
  data[field] = params.oldValue
  data['validation_required'] = params.newValue === '' ? true : false;
  data['validation'] = true
  data['validation_isExists'] = isExists
  params.api.applyTransaction({  update: [data] });
};

