"use strict";

import { Element } from "../../../../@types/wdio";
import { VerboseLoggerFactory } from "../../helper/verboseLogger";
import { GLOBAL_DEFAULT_WAIT_TIMEOUT } from "../constants";
import { Ui5Selector, Ui5SelectorWithOptions } from "./types/ui5.types";

/**
 * @class control
 * @memberof ui5
 */
export class Control {
  private vlf = new VerboseLoggerFactory("ui5", "control");

  private lib = require("../../../scripts/hooks/utils/lib");
  private locatorCommands = require("../../../scripts/hooks/utils/locatorCommands");

  // =================================== EXECUTE ===================================
  /**
   * @function execute
   * @memberOf ui5.control
   * @description Executes a native UI5 action as callback function in the browser on the given UI5 control.
   * @param {Function} callbackFunction - The client script function to be used with the control instance.
   * Caution: The first and last parameter is reserved for the mockserver instance and the promise resolve function - done.
   * @param {Element | Ui5Selector | Ui5SelectorWithOptions} selectorOrElement - The selector object, selector with options (selector, index, timeout) or the dom element (retrieved from ui5.element.getDisplayed).
   * @param {Object} args - An object containing the arguments to pass to the callback function.
   * @example const selector = {"elementProperties":{"metadata":"sap.m.StandardListItem", "id": "*categoryList-7"}};
   * const args = {"property": "text"};
   * const title = await ui5.control.execute(function (control, args, done) {
   *   done(control.getProperty(args.property));
   * }, selector, args);
   **/
  async execute(callbackFunction: Function, selectorOrElement: Element | Ui5Selector | Ui5SelectorWithOptions, args?: any) {
    const vl = this.vlf.initLog(this.execute);
    return this.lib.controlActionInBrowser(callbackFunction, selectorOrElement, args);
  }

  /**
   * @function focus
   * @memberOf ui5.control
   * @description Focuses on the element with the given selector to get it into view. If focus is not possible scrollToElement is used.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.control.focus(selector);
   * @example await ui5.control.focus(selector, 0, 5000);
   */
  async focus(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const elem = await ui5.element.getDisplayed(selector, index, timeout);
    const id = await elem.getAttribute("id");
    const focused = await browser.execute(function (id: string) {
        const elem = sap.ui.getCore().getElementById(id);
        if(elem && elem.focus){
            elem.focus();
            return true;
        } else{
            return false;
        }
    }, id);
    if(!focused){
        ui5.userInteraction.scrollToElement(selector, index, "center", timeout);
    }
  }

  // =================================== GET ===================================
  /**
   * @function getProperty
   * @memberOf ui5.control
   * @description Gets the UI5 control property of the given element.
   * @param {Element | Ui5Selector | Ui5SelectorWithOptions} selectorOrElement - The selector object, selector with options (selector, index, timeout) or the dom element (retrieved from ui5.element.getDisplayed)
   * @param {String} propertyName - The property name of the control to retrieve the value from.
   * @example const selector = { "elementProperties":{"metadata":"sap.m.StandardListItem","mProperties":{ "title":[{"path":"CategoryName"}] }};
   * const elem = await ui5.element.getDisplayed(selector);
   * const propertyName = "title";
   * const val = await ui5.control.getProperty(elem, propertyName);
   **/
  async getProperty(selectorOrElement: Element | Ui5Selector | Ui5SelectorWithOptions, propertyName: string) {
    const vl = this.vlf.initLog(this.getProperty);
    return this.locatorCommands.getUI5Property(propertyName, selectorOrElement);
  }

  /**
   * @function getAggregationProperty
   * @memberOf ui5.control
   * @description Gets the UI5 control aggregation property  of the given element.
   * @param {Element | Ui5Selector | Ui5SelectorWithOptions} selectorOrElement - The selector object, selector with options (selector, index, timeout) or the dom element (retrieved from ui5.element.getDisplayed)
   * @param {String} propertyName - The aggregation property name of the control to retrieve the value from.
   * @example const selector = { "elementProperties":{"metadata":"sap.m.StandardListItem","mProperties":{ "items":[{"path":"/Categories"}] }};
   * const elem = await ui5.element.getDisplayed(selector);
   * const propertyName = "tooltip";
   * const val = await ui5.control.getAggregationProperty(elem, propertyName);
   **/
  async getAggregationProperty(selectorOrElement: Element | Ui5Selector | Ui5SelectorWithOptions, propertyName: string) {
    const vl = this.vlf.initLog(this.getAggregationProperty);
    return this.locatorCommands.getUI5Aggregation(propertyName, selectorOrElement);
  }

  /**
   * @function getAssociationProperty
   * @memberOf ui5.control
   * @description Get UI control property
   * @param {Element | Ui5Selector | Ui5SelectorWithOptions} selectorOrElement - The selector object, selector with options (selector, index, timeout) or the dom element (retrieved from ui5.element.getDisplayed)
   * @param {String} propertyName - The association property name of the control to retrieve the value from.
   * @example const selector = { "elementProperties":{"metadata":"sap.m.MultiComboBox","mProperties":{}};
   * const elem = await ui5.element.getDisplayed(selector);
   * const propertyName = "selectedItems";
   * const propertyValue = await ui5.control.getAssociationProperty(elem, propertyName);
   **/
  async getAssociationProperty(selectorOrElement: Element | Ui5Selector | Ui5SelectorWithOptions, propertyName: string) {
    const vl = this.vlf.initLog(this.getAssociationProperty);
    return this.locatorCommands.getUI5Association(propertyName, selectorOrElement);
  }

  /**
   * @function getBindingContextPathProperty
   * @memberOf ui5.control
   * @description Get UI control binding context path
   * @param {Element | Ui5Selector | Ui5SelectorWithOptions} selectorOrElement - The selector object, selector with options (selector, index, timeout) or the dom element (retrieved from ui5.element.getDisplayed)
   * @example const selector = { "elementProperties":{"metadata":"sap.m.StandardListItem","mProperties":{"title":[{"path":"CategoryName"}] }};
   * const elem = await ui5.element.getDisplayed(selector);
   * const context = await ui5.control.getBindingContextPathProperty(elem);
   **/
  async getBindingContextPathProperty(selectorOrElement: Element | Ui5Selector | Ui5SelectorWithOptions) {
    const vl = this.vlf.initLog(this.getBindingContextPathProperty);
    return this.locatorCommands.getBindingContextPath(selectorOrElement);
  }

  /**
   * @function getPropertyBinding
   * @memberOf ui5.control
   * @description Get UI control property
   * @param {Element | Ui5Selector | Ui5SelectorWithOptions} selectorOrElement - The selector object, selector with options (selector, index, timeout) or the dom element (retrieved from ui5.element.getDisplayed)
   * @param {String} propertyName - The property name to retrieve from the control binding
   * @returns {Array} Array of bindings for the specific property
   * @example const selector = { "elementProperties":{"metadata":"sap.m.StandardListItem","mProperties":{ "title":[{"path":"CategoryName"}] }};
   * const elem = await ui5.element.getDisplayed(selector);
   * const propertyName = "title";
   * const binding = await ui5.control.getPropertyBinding(elem, propertyName);
   **/
  async getPropertyBinding(selectorOrElement: Element | Ui5Selector | Ui5SelectorWithOptions, propertyName: string) {
    const vl = this.vlf.initLog(this.getPropertyBinding);
    return this.locatorCommands.getBindingProperty(propertyName, selectorOrElement);
  }
}
export default new Control();
