import { Variable } from '../variable';
import { BaseHtmlangElement } from './htmlangElement';

export class ConstDash extends BaseHtmlangElement {
  static getTagName = () => 'const';

  execute = () => {
    const attr = this.attributes[0];
    if (!attr) return;

    const parentScope = this._getParentScope();
    const variable = new Variable('const', attr.name, attr.value, parentScope);
    parentScope.addVariable(variable);
  };
}
