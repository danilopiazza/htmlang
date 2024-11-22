import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class ForDash extends BaseHtmlangElement {
  static getTagName = () => 'for' as const;

  static observedAttributes = ['('];

  _innerHtml: string | null = null;

  connectedCallback(): void {
    this._innerHtml = this.innerHTML;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (this._innerHtml === null) {
      return;
    }

    if (name === '(') {
      if (oldValue !== newValue) {
        this._loop(newValue);
      }
    }
  }

  execute = (): void => {
    this._loop(this.getAttribute('(') ?? '');
  };

  private _loop(attribute: string): void {
    this.innerHTML = '';
    const { varName, array } = this.getLoopParams(attribute);

    for (const item of array) {
      this.innerHTML += this._innerHtml!.replaceAll(`{${varName}}`, item);
    }
  }

  private getLoopParams(attribute: string): { varName: string; array: Array<any> } {
    const [varName, arrStr] = attribute.split(' of ');

    if (!varName) {
      throw new Array(`Could not parse the variable name from the attribute: ${attribute}`);
    }

    const arrVarName = Variable.getName(arrStr);

    let array: Array<any> | null = null;
    if (arrVarName) {
      const result = this.parentScope.getVariable(arrVarName);
      if (result.found) {
        array = result.variable.value;
      }
    }

    array = array ?? eval(arrStr);

    if (!Array.isArray(array)) {
      throw new Array(`Could not parse iterable from the attribute: ${attribute}. Found: ${array}`);
    }

    return { varName, array };
  }
}
