import { isIPv4 } from 'is-ip';

export const asyncValidateValueSetter = (params: any) => {
  asyncValidator(
    params.newValue,
    _onSuccess(params),
    _onFail(params)
  );
  return false;
};

const asyncValidator = (
  newValue: any,
  _onSuccess: () => void,
  _onFail: () => void
) => {
  setTimeout(function() {
    const isSubnet = require("is-subnet");
    if (newValue.includes(',')) {
      const ips = newValue.split(',')
      let isMatch = false
      for (let ip in ips) {
        isMatch = isIPv4(ips[ip])
        if (isMatch || (newValue === "")) {
          _onSuccess();
        } else {
          _onFail();
        }
      }
    } else {
      if (isSubnet(newValue) || isIPv4(newValue)) {
        _onSuccess();
      } else {
        _onFail();
      }
    }
  }, 100);
};

const _onSuccess = (params: any) => () => {
  let data = params.data;
  let field = params.colDef.field;
  data[field] = params.newValue
  data['validation'] = false
  params.api.applyTransaction({  update: [data] });
};

const _onFail = (params: any) => () => {
  let data = params.data;
  let field = params.colDef.field;
  data[field] = params.oldValue
  data['validation'] = true
  params.api.applyTransaction({  update: [data] });
};

