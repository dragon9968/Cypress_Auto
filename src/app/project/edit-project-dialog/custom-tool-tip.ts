import { ITooltipComp, ITooltipParams } from 'ag-grid-community';

export class CustomTooltip implements ITooltipComp {
  eGui: any;
  init(params: ITooltipParams & { color: string }) {
    const eGui = (this.eGui = document.createElement('div'));
    const color = params.color || 'white';
    const validationMsg = "Expected 4 octets and only decimal digits permitted";
    const validationIsExists = "Network already exists, please enter a different network"
    const valueToDisplay = (params.data['validation'] && !params.data['validation_isExists'])
      ? validationMsg
      : (params.data['validation'] && params.data['validation_isExists']) ? validationIsExists
      : '';
    eGui.classList.add('custom-tooltip');
    //@ts-ignore
    eGui.style['background-color'] = '#ff1a1a';
    eGui.style['color'] = 'white';
    eGui.innerHTML = `
            <p>
                <span class"name">${valueToDisplay}</span>
            </p>
        `;
  }

  getGui() {
    return this.eGui;
  }
}