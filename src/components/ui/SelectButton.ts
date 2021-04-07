import { Button, IButton } from './Button';
import * as _ from 'lodash';

export class SelectList {
  public buttons: Button[] = [];
  public selected: number;

  constructor(private config: Partial<IButton>, private onClick: (n: number) => void, private onDelete?: (n: number) => void) { }

  public makeButton(label: string, config?: Partial<IButton>) {
    let index = this.buttons.length;
    let button = new Button(_.defaults({label, onClick: () => this.selectButton(index)}, config, this.config));
    this.buttons.push(button);
    return button;
  }

  public selectButton = (index: number) => {
    this.selected = index;
    this.onClick(index);
    this.buttons.forEach((button, i) => button.selected = (i === index));
  }

  public destroyAll = () => {
    while (this.buttons.length > 0) {
      this.buttons.shift().destroy();
    }
  }
}
