import { ITooltipComp, ITooltipParams } from 'ag-grid-community';

export class CustomTooltip implements ITooltipComp {
  eGui: any;
  init(params: ITooltipParams & { color: string }) {
    const eGui = (this.eGui = document.createElement('div'));
    const color = params.color || 'white';
    let validationMsg = "Expected 4 octets and only decimal digits permitted";
    const valueToDisplay = params.data['validation']
      ? validationMsg
      : '';
    eGui.classList.add('custom-tooltip');
    //@ts-ignore
    eGui.style['background-color'] = '#a9a9a9';
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