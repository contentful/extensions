import { init } from 'contentful-ui-extensions-sdk';
import debounce from 'lodash/debounce';
import axios from 'axios';
import Vue from 'vue/dist/vue.esm.js';
import './index.css';
import 'bulma/css/bulma.css';

init(function(extension) {
  extension.window.startAutoResizer();

  // Available SKU component
  Vue.component('sku-item', {
    props: ['sku', 'endpoint'],
    template: `<div class="column is-one-third">
            <div class="sku" @click="selectSku">
              <img :src="sku.attributes.image_url"></img>
              <p class="name">{{ sku.attributes.name }}</p>
              <p class="help">{{ sku.attributes.code }}</p>
            </div>
          </div>`,
    methods: {
      selectSku: function() {
        this.$emit('select-sku', this.sku.id);
      }
    }
  });

  // Selected SKU component
  Vue.component('sku-selected', {
    props: ['sku', 'endpoint'],
    template: `<div class="column is-one-third">
            <div class="selected-sku">
              <img :src="sku.attributes.image_url"></img>
              <p class="name">{{ sku.attributes.name }}</p>
              <p class="help">{{ sku.attributes.code }}</p>
              <p class="help">
                <a :href="skuEditURL" target="_blank">Edit</a>
                &middot;
                <a @click="unselectSku" class="has-text-danger">Remove</a>
              </p>
            </div>
          </div>`,
    methods: {
      unselectSku: function() {
        this.$emit('unselect-sku');
      }
    },
    computed: {
      skuEditURL() {
        return `${this.endpoint}/admin/skus/${this.sku.id}/edit`;
      }
    }
  });

  new Vue({
    el: '#app',
    data: {
      accessToken: null,
      endpoint: null,
      query: null,
      selectedSkuId: null,
      skus: [],
      links: {},
      meta: {}
    },
    computed: {
      selectedSku() {
        return this.skus.find(sku => {
          return sku.id === this.selectedSkuId;
        });
      }
    },
    created: function() {
      // Set endpoint
      this.endpoint = extension.parameters.instance.endpoint;

      // Assign the debounced function
      this.debouncedGetSkus = debounce(this.getSkus, 500);

      // Get an access token (valid for 2 hours)
      // Get the selected SKU or the list of all SKUs
      axios
        .post(`${this.endpoint}/oauth/token`, {
          grant_type: 'client_credentials',
          client_id: extension.parameters.instance.clientID,
          client_secret: extension.parameters.instance.clientSecret
        })
        .then(response => {
          this.accessToken = response.data.access_token;
          const fieldValue = extension.field.getValue();
          if (fieldValue) {
            const skuId = fieldValue.id;
            this.getSku(skuId);
            this.selectedSkuId = skuId;
          } else {
            this.getSkus();
          }
        })
        .catch(function() {
          document.getElementById('commerce-layer-hint').innerHTML =
            'Error connecting to Commerce Layer. Please double check your configuration.';
        });
    },
    methods: {
      getSku: function(skuId) {
        axios
          .get(`${this.endpoint}/api/skus/${skuId}`, {
            headers: {
              Accept: 'application/vnd.api+json',
              Authorization: `Bearer ${this.accessToken}`
            }
          })
          .then(response => {
            this.skus.push(response.data.data);
          });
      },
      getSkus: function(url) {
        if (url === undefined) {
          url = `${this.endpoint}/api/skus`;
        }
        axios
          .get(url, {
            params: {
              'filter[q][name_or_code_or_reference_cont]': this.query,
              'page[size]': 9
            },
            headers: {
              Accept: 'application/vnd.api+json',
              Authorization: `Bearer ${this.accessToken}`
            }
          })
          .then(response => {
            this.skus = response.data.data;
            this.links = response.data.links;
            this.meta = response.data.meta;
          });
      },
      prevPage: function() {
        this.getSkus(this.links.prev);
      },
      nextPage: function() {
        this.getSkus(this.links.next);
      },
      selectSku: function(skuId) {
        this.selectedSkuId = skuId;
        this.setFieldValue();
      },
      unselectSku: function() {
        this.selectedSkuId = null;
        extension.field.setValue(null);
        this.query = null;
        this.getSkus();
      },
      setFieldValue: function() {
        extension.field.setValue({
          id: this.selectedSku.id,
          code: this.selectedSku.attributes.code,
          link: this.selectedSku.links.self,
          mode: this.selectedSku.meta.mode
        });
      }
    },
    watch: {
      query: function() {
        this.debouncedGetSkus();
      }
    }
  });
});
