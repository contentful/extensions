'use strict';

JSONEditor.defaults.themes.contentful = (function (JSONEditor) {

  var PARENT = JSONEditor.AbstractTheme;

  var definition = {
    getFormControl: 'cf-form-field',
    getIndentedPanel: function () {
      // No need for _super's .style attributes.
      return document.createElement('div');
    },
    getFormInputField: 'cf-form-input',
    getFormInputDescription: 'cf-form-hint',
    getFormInputLabel: 'jfe-label',
    afterInputReady: function (input) {
      input.cfFormField = input.cfFormField || this.closest(input, '.cf-form-field');
    },
    getButton: el(function (el, text, icon, title) {
      el.className = text.match(/save/i) ? 'cf-btn-primary' : 'cf-btn-secondary';
    }),
    getHeader: el(function (el, text) {
      if (!(text instanceof HTMLElement)) {
        var label = document.createElement('span');
        label.appendChild(document.createTextNode(text));
        el.innerHTML = '';
        el.appendChild(label);
        text = label;
      }
      text.className = 'jfe-label jfe-header-label';
      var el2 = document.createElement('div');
      el2.innerHTML = el.innerHTML;
      return el2;
    }),
    getHeaderButtonHolder: 'jfe-button-holder',
    getSelectInput: 'cf-form-input',
    getSwitcher: function (options) {
      var el = this.getSelectInput(options);
      el.className += ' jfe-switcher';
      return el;
    },
    getErrorMessage: function (text) {
      var el = document.createElement('div');
      el.appendChild(document.createTextNode(text));
      el.className = 'cf-field-error';
      return el;
    },
    addInputError: function (input, text) {
      if (!input.cfFormField) {
        return;
      }
      if (!input.cfFieldError) {
        input.cfFieldError = document.createElement('div');
        input.cfFieldError.className = 'cf-field-error';
        input.cfFormField.appendChild(input.cfFieldError);
      }
      input.cfFieldError.textContent = text;
      input.className += ' cf-has-error'
    },
    removeInputError: function (input) {
      if (!input.cfFieldError) {
        return;
      }
      input.cfFormField.removeChild(input.cfFieldError);
      delete input.cfFieldError;
      input.cfFormField.className = input.cfFormField.className.replace(/\s?cf-field-error/g, '');
      input.className = input.className.replace(/\s?cf-has-error/g, '');
    }
  };

  // Replace strings in definition with functions which call _super() and add the
  // string as a class name.
  for (var name in definition) {
    var value = definition[name];
    if (typeof value === 'string') {
      definition[name] = elCssClass(value);
    }
  }
  // Make all getters in the definition add a class name to the returned HTMLElement.
  // E.g. class="jfe-get-error-message" for element returned by getErrorMessage().
  for (var name in PARENT.prototype) {
    if (name.substr(0, 3) === 'get') {
      var cssClass = name
        .replace(/^get/, 'jfe')
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
      var superFn = typeof definition[name] === 'function' ? definition[name] : false;
      definition[name] = elCssClass(cssClass, superFn);
    }
  }
  return PARENT.extend(definition);

  function elCssClass (value, _super) {
    return el(function (el) {
      if (el instanceof HTMLElement) {
        el.className += (el.className ? ' ' : '' ) + value;
      }
    }, _super);
  }

  function el (fn, _super) {
    return function (el) {
      var el = (_super || this._super).apply(this, arguments);
      if(!_super) {
        // Reset all class names coming from default theme.
        el.className = '';
      }
      var callbackArgs = [el].concat(Array.prototype.slice.call(arguments));
      return fn.apply(this, callbackArgs) || el;
    };
  }

}(JSONEditor));
