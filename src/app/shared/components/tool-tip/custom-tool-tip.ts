import { ITooltipComp, ITooltipParams } from 'ag-grid-community';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';

export class CustomTooltip implements ITooltipComp {
  eGui: any;
  init(params: ITooltipParams & { color: string }) {
    const eGui = (this.eGui = document.createElement('div'));
    const color = params.color || 'white';
    const valueToDisplay = params.data['validation_required'] 
      ? ErrorMessages.FIELD_IS_REQUIRED 
      : (params.data['validation'] && !params.data['validation_isExists'])
      ? ErrorMessages.FIELD_IS_IP
      : (params.data['validation'] && params.data['validation_isExists']) ? ErrorMessages.NETWORK_EXISTS
      : '';
    eGui.classList.add('custom-tooltip');
    //@ts-ignore
    eGui.style['background-color'] = '#a9a9a9';
    eGui.innerHTML = `
            <p>
                <span class"name">${valueToDisplay}</span>
            </p>
        `;
    params.data['validation_required'] = false
    params.data['validation'] = false
    params.data['validation_isExists'] = false
  }

  getGui() {
    return this.eGui;
  }
}
