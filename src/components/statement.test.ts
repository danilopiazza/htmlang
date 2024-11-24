import { ElementGraph } from '../elementGraph';
import { globalScope } from '../main';
import { StatementDash } from './statement';

describe('statement', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('assignment', () => {
    it('should reassign a let variable', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <let- i="2"></let->
        <statement- (="i = 3")></statement->
      `;
      document.body.appendChild(container);
      ElementGraph.build().execute();

      const result = globalScope.getVariable('i');
      expect(result.found && result.value.value).toBe(3);
    });

    it('should declare a let variable if not found', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <statement- (="i = 3")></statement->
      `;
      document.body.appendChild(container);
      ElementGraph.build().execute();

      const result = globalScope.getVariable('i');
      expect(result.found && result.value.type).toBe('let');
      expect(result.found && result.value.value).toBe(3);
    });

    it('should reevaluate reactively', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <let- i="2"></let->
        <statement- (="i = 3")></statement->
      `;
      document.body.appendChild(container);
      ElementGraph.build().execute();

      let result = globalScope.getVariable('i');
      expect(result.found && result.value.value).toBe(3);

      const statement = document.querySelector<StatementDash>('statement-')!;
      statement.setAttribute('(', 'j = 4');
      expect(statement.getAttribute('(')).toBe('j = 4');

      result = globalScope.getVariable('j');
      expect(result.found && result.value.value).toBe(4);
    });

    it('should throw when missing ( attribute', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <statement-></statement->
      `;
      document.body.appendChild(container);
      expect(ElementGraph.build().execute).toThrow('Unrecognized line: ');
    });

    it('should throw when line is not recognized', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <statement- (="")></statement->
      `;
      document.body.appendChild(container);
      expect(ElementGraph.build().execute).toThrow('Unrecognized line: ');
    });
  });
});
