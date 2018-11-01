import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | paper toast', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{paper-toast}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#paper-toast}}
        Toast was shown successfully!
      {{/paper-toast}}
    `);

    assert.dom('md-toast').hasText('Toast was shown successfully!')
  });

  test('duration triggers onClose', async function(assert) {
    let done = assert.async();

    this.set('closeAction', () => {
      assert.ok(true);
      done();
    });

    await render(hbs`
      {{#paper-toast duration=100 onClose=closeAction}}
        Toast was shown successfully!
      {{/paper-toast}}
    `);
  });

  test('duration set to `false` does not trigger onClose', async function(assert) {
    assert.expect(0);

    this.set('closeAction', () => {
      assert.ok(false);
    });

    await render(hbs`
      {{#paper-toast duration=false onClose=closeAction}}
        Toast was shown successfully!
      {{/paper-toast}}
    `);
  });

  test('should render in ember-testing if no parent is defined', async function(assert) {
    await render(hbs`
      {{paper-toast}}
    `);
    assert.dom('#ember-testing md-toast').exists({count: 1}, 'rendered in default');
  });

  test('should render in specific wormhole if parent is defined', async function(assert) {
    await render(hbs`
      <div id="sagittarius-a"></div>
      {{#paper-toast parent="#sagittarius-a"}}
        So this is singularity, eh?
      {{/paper-toast}}
    `);
    assert.dom('#ember-testing > md-toast').doesNotExist('did not render in default');
    assert.dom('#sagittarius-a md-toast').exists({count: 1}, 'rendered in parent');
    
  });

  test('capsule sets the correct class', async function(assert) {
    await render(hbs`
      {{paper-toast capsule=true}}
    `);

    assert.dom('md-toast').hasClass('md-capsule', 'rendered in default');
  });

  ['bottom left', 'bottom right', 'top left', 'top right'].forEach((position) => {
    let [y, x] = position.split(' ');

    test(`position '${position}' sets the correct classes`, async function(assert) {
      this.position = position;

      await render(hbs`
        {{paper-toast position=position}}
      `);

      assert.dom('#ember-testing > md-toast').hasClass(`md-${x}`);
      assert.dom('#ember-testing > md-toast').hasClass(`md-${y}`);
      //weird, it doesnt work with plain string selector?
      assert.dom(find('#ember-testing')).hasClass(`md-toast-open-${y}`);
      
    });
  });
});
