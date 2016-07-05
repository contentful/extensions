'use strict';

/*
* Custom translation widget using the widget API
* Translates text from the default locale to every other locales present in a space
* Uses the Yandex Translator Service - https://tech.yandex.com/translate/
*/

+function() {
  var widget = {};

  // Hardcoding secrets for now
  widget.apiKey = 'trnsl.1.1.20151015T080754Z.fac48f0d13a96c3a.c0c58058288c42ba40de8aec2b36d9d86c3adb1d';


  widget.events = {
    initialize: function(resp) {
      // Define API
      widget.cfApi = resp;
      // Create HTML elements
      widget.elements = {
        input: createElement('input', {type: 'text', className: 'cf-form-input'}, createElement('p')),
        populateAll: createElement('input', {type: 'submit', className: 'cf-btn-primary', value: 'Populate all other locales'})
      };

      // Attach event listeners
      widget.elements.input.addEventListener('input', widget.events.textUpdated);
      widget.elements.populateAll.addEventListener('click', widget.events.doTranslations);

      // Watch for changes on the default language field
      if (widget.cfApi.locales.default !== widget.cfApi.field.locale) {
        var apiName = widget.cfApi.field.id;
        widget.cfApi.entry.fields[apiName].onValueChanged(widget.cfApi.field.locale, widget.events.fieldsUpdated);
      }

      // Populate current values
      widget.events.fieldsUpdated();

      var isDefaultLocale = widget.cfApi.locales.default === widget.cfApi.field.locale;

      // Hide Populate button on non-default locales
      if (!isDefaultLocale) {
        widget.uiUpdate.hideElement(widget.elements.populateAll);
      }

      // Set iframe size
      widget.cfApi.window.updateHeight((isDefaultLocale ? 110 : 60));
    },

    fieldsUpdated: function() {
      var currentValue = widget.cfApi.field.getValue();

      // Show translate button when there is a value in the default locale
      widget.uiUpdate.updateInput(currentValue);

      // Show or hide translate button
      if (widget.cfApi.locales.default === widget.cfApi.field.locale) {
        widget.uiUpdate.enableElement(widget.elements.populateAll, !!currentValue);
      } else {
        // Save value
        widget.cfApi.field.setValue(currentValue);
      }
    },

    textUpdated: function() {
      var val = widget.elements.input.value.toString();
      widget.cfApi.field.setValue(val);
      widget.events.fieldsUpdated();
    },

    doTranslations: function(ev) {
      ev.preventDefault();
      var currentLocale = widget.cfApi.field.locale;
      var idx = widget.cfApi.locales.available.indexOf(currentLocale);
      var arr = widget.cfApi.locales.available.slice();
      arr.splice(idx, 1);
      var languagePair;
      var text = widget.cfApi.field.getValue();
      arr.forEach(function(language) {
        languagePair = getYandexCode(currentLocale, language);
        getTranslation(text, languagePair, language);
      });
    }
  };

  widget.uiUpdate = {
    updateInput: function(text) {
      // because sometimes getValue() returns an empty object instead of null...
      text = (typeof text === 'object') ? undefined : text;
      widget.elements.input.value = text ? text : '';
    },
    enableElement: function(element, enabled) {
      element.disabled = !enabled;
    },
    hideElement: function(element) {
      element.style.display = 'none';
    }
  };

  function callTranslateApi(text, lang) {
    return new Promise(function(resolve, reject) {
      var endpoint = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='
        + widget.apiKey + '&lang=' + lang + '&text=' + encodeURIComponent(text);

      var xhr = new XMLHttpRequest();

      xhr.open('GET', endpoint, true);
      xhr.send();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          setTimeout(function() {
            reject();
          }, 200);
        }
      };
    });
  }

  function createElement(elem, opts, parent) {
    var e = document.createElement(elem);
    var prop;
    for (prop in opts) {
      e[prop] = opts[prop];
    }
    parent = parent || document.body;
    parent.appendChild(e);
    return e;      
  }

  // Call the translate API and insert the text into the correct locale
  function getTranslation(text, lang, targetLocale) {
    callTranslateApi(text, lang)
    .then(function(resp) {
      var translation = resp.text.join(' ');
      var apiName = widget.cfApi.field.id;
      widget.cfApi.entry.fields[apiName].setValue(translation, targetLocale);
    });
  }

  // Map Contentful locales to Yandex locale code
  function getYandexCode(fromLocale, toLocale) {
    function getCode(cfLocale) {
      var translationMap = {
        'en-US': 'en',
        'de-DE': 'de',
        'fr-FR': 'fr'
      };
      return translationMap[cfLocale] ? translationMap[cfLocale] : cfLocale.substring(0,2);
    }
    return getCode(fromLocale) + '-' + getCode (toLocale);
  }

  window.contentfulWidget.init(widget.events.initialize);

}();
