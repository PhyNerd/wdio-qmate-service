"use strict";

import { Element } from "../../../../@types/wdio";
import { VerboseLoggerFactory } from "../../helper/verboseLogger";
import { AlignmentOptions, AlignmentValues } from "../types";
import ErrorHandler from "../../helper/errorHandler";
import { GLOBAL_DEFAULT_WAIT_INTERVAL, GLOBAL_DEFAULT_WAIT_TIMEOUT } from "../constants";

/**
 * @class userInteraction
 * @memberof ui5
 */
export class UserInteraction {
  // =================================== LOGGER===================================
  private vlf = new VerboseLoggerFactory("ui5", "click");
  private ErrorHandler = new ErrorHandler();

  // =================================== CLICK ===================================
  /**
   * @function click
   * @memberOf ui5.userInteraction
   * @description Clicks on the element with the given selector.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.click(selector);
   */
  async click(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.click);
    let elem = null;
    await browser.waitUntil(
      async function () {
        elem = await ui5.element.getDisplayed(selector, index, timeout);
        if (!elem) return false;
        return elem.isClickable();
      },
      {
        timeout,
        timeoutMsg: `Element not clickable after ${+timeout / 1000}s`
      }
    );
    try {
      // @ts-ignore
      await elem.click();
    } catch (error) {
      // @ts-ignore
      this.ErrorHandler.logException(error);
    }
  }

  /**
   * @function clickAndRetry
   * @memberOf ui5.userInteraction
   * @description Clicks on the element with the given selector and retries the action in case of a failure.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @param {Number} [retries=3] - The number of retries, can be set in config for all functions under params stepsRetries.
   * @param {Number} [interval=5000] - The delay between the retries (ms). Can be set in config for all functions under params.stepRetriesIntervals.
   * @example await ui5.userInteraction.clickAndRetry(selector);
   */
  async clickAndRetry(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT, retries = 3, interval = 5000) {
    const vl = this.vlf.initLog(this.clickAndRetry);
    await util.function.retry(this.click, [selector, index, timeout], retries, interval, this);
  }

  /**
   * @function doubleClick
   * @memberOf ui5.userInteraction
   * @description Double Clicks on the passed element.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.doubleClick(selector);
   */
  async doubleClick(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.doubleClick);
    let elem = null;
    await browser.waitUntil(
      async function () {
        elem = await ui5.element.getDisplayed(selector, index, timeout);
        if (!elem) return false;
        return elem.isClickable();
      },
      {
        timeout,
        timeoutMsg: `Element not clickable after ${+timeout / 1000}s`
      }
    );
    try {
      // @ts-ignore
      await elem.doubleClick();
    } catch (error) {
      // @ts-ignore
      this.ErrorHandler.logException(error);
    }
  }

  /**
   * @function rightClick
   * @memberOf ui5.userInteraction
   * @description Right Clicks on the passed element.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example const elem = await nonUi5.element.getById("button01");
   * await ui5.userInteraction.rightClick(elem);
   */
  async rightClick(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.rightClick);
    let elem = null;
    await browser.waitUntil(
      async function () {
        elem = await ui5.element.getDisplayed(selector, index, timeout);
        if (!elem) return false;
        return elem.isClickable();
      },
      {
        timeout,
        timeoutMsg: `Element not clickable after ${+timeout / 1000}s`
      }
    );
    try {
      // @ts-ignore
      await elem.click({
        button: "right"
      });
    } catch (error) {
      // @ts-ignore
      this.ErrorHandler.logException(error);
    }
  }

  /**
   * @function clickTab
   * @memberOf ui5.userInteraction
   * @description Clicks on the tab with the given selector and checks if the tab got selected successfully.
   * The function retries the click for maximal 3 times if the selection of the tab (blue underline) was not successful.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.clickTab(selector);
   */
  async clickTab(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.clickTab);
    await util.function.retry(
      async (selector: any, index: number, timeout: number) => {
        await ui5.userInteraction.click(selector, index, timeout);
        const tabSwitchedSuccessfully: boolean = await this._verifyTabSwitch(selector);
        if (tabSwitchedSuccessfully === false) {
          this.ErrorHandler.logException(new Error("Could not verify successful tab switch."));
        }
      },
      [selector, index, timeout],
      3,
      5000,
      this
    );
  }

  /**
   * @function clickListItem
   * @memberOf ui5.userInteraction
   * @description Clicks or opens the list item with the given selector (e.g. ColumnListItem, StandardListItem).
   * In some cases the default click function is not working correctly (clicks an element within the list item).
   * Therefore we recommend to use this function to open a specific list item.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.clickListItem(selector);
   */
  async clickListItem(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.clickListItem);
    const elem = await ui5.element.getDisplayed(selector, index, timeout);
    await ui5.control.execute(function (control: any, done: Function) {
      control.attachPress(function () {
        done();
      });
      control.firePress();
    }, elem);
  }

  // =================================== CHECK ===================================
  /**
   * @function check
   * @memberOf ui5.userInteraction
   * @description Checks the checkbox with the given selector.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.check(selector);
   */
  async check(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.check);

    try {
      const isSelected: boolean = await ui5.element.getPropertyValue(selector, "selected", index, timeout);
      if (!isSelected) {
        await this.click(selector, index, timeout);
      } else {
        vl.log("Checkbox already checked.");
      }
    } catch (error) {
      this.ErrorHandler.logException(error);
    }
  }

  /**
   * @function uncheck
   * @memberOf ui5.userInteraction
   * @description Unchecks the checkbox with the given selector.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.uncheck(selector);
   */
  async uncheck(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.uncheck);

    try {
      const isSelected: boolean = await ui5.element.getPropertyValue(selector, "selected", index, timeout);
      if (isSelected) {
        await this.click(selector, index, timeout);
      } else {
        vl.log("Checkbox already unchecked.");
      }
    } catch (error) {
      this.ErrorHandler.logException(error);
    }
  }

  // =================================== FILL ===================================
  /**
   * @function fill
   * @memberOf ui5.userInteraction
   * @description Fills the input field with the given selector.
   * @param {Object} selector - The selector describing the element.
   * @param {String | Number} value - The value to enter.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.fill(selector, "My Value");
   */
  async fill(selector: any, value: string | number, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.fill);
    vl.log(`Filling with ${value}`);

    if (typeof value === "string" || typeof value === "number") {
      const id = await ui5.element.getId(selector, index, timeout);
      let elem = null;
      if (selector.elementProperties.metadata === "sap.m.TextArea") {
        elem = await nonUi5.element.getByCss("[id='" + id + "'] textarea", 0, timeout);
      } else {
        elem = await nonUi5.element.getByCss("[id='" + id + "'] input", 0, timeout);
      }
      await elem.setValue(value);
    } else {
      this.ErrorHandler.logException(new Error("Please provide an element and value(datatype - number/string) as arguments."));
    }
  }

  /**
   * @function fillAndRetry
   * @memberOf ui5.userInteraction
   * @description Fills the input field with the given selector and retries the action in case of a failure.
   * @param {Object} selector - The selector describing the element.
   * @param {String | Number} value - The value to enter.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @param {Number} [retries=3] - The number of retries, can be set in config for all functions under params stepsRetries.
   * @param {Number} [interval=5000] - The delay between the retries (ms). Can be set in config for all functions under params.stepRetriesIntervals.
   * @example await ui5.userInteraction.fillAndRetry(selector, "My Value");
   */
  async fillAndRetry(selector: any, value: string | number, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT, retries = 3, interval = 5000) {
    const vl = this.vlf.initLog(this.fillAndRetry);
    await util.function.retry(this.fill, [selector, value, index, timeout], retries, interval, this);
  }

  // =================================== CLEAR ===================================
  /**
   * @function clear
   * @memberOf ui5.userInteraction
   * @description Clears the input with the given selector.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.clear(selector);
   */

  //TODO remove clearHelper and use clear
  async clear(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.clear);
    await this._clearHelper(selector, index, timeout);
  }

  /**
   * @function clearAndRetry
   * @memberOf ui5.userInteraction
   * @description  Clears the input with the given selector and retries the action in case of a failure
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @param {Number} [retries=3] - The number of retries, can be set in config for all functions under params stepsRetries.
   * @param {Number} [interval=5000] - The delay between the retries (ms). Can be set in config for all functions under params.stepRetriesIntervals.
   * @example await ui5.userInteraction.clearAndRetry(selector);
   */
  async clearAndRetry(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT, retries = 3, interval = 5000) {
    const vl = this.vlf.initLog(this.clearAndRetry);
    await util.function.retry(this.clear, [selector, index, timeout], retries, interval, this);
  }

  /**
   * @function clearAndFill
   * @memberOf ui5.userInteraction
   * @description Clears the input field with the given selector and fills the given value.
   * @param {Object} selector - The selector describing the element.
   * @param {String | Number} value - The value to enter.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.clearAndFill(selector, "My Value");
   */
  async clearAndFill(selector: any, value: string | number, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.clearAndFill);
    if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") {
      await this.clear(selector, index, timeout);
      await common.userInteraction.fillActive(value);
    } else {
      this.ErrorHandler.logException(new Error("Please provide a value(datatype - number/string) as second parameter."));
    }
  }

  /**
   * @function clearAndFillAndRetry
   * @memberOf ui5.userInteraction
   * @description Clears the input field with the given selector and fills the given value. Retries the action in case of a failure.
   * @param {Object} selector - The selector describing the element.
   * @param {String} value - The value to enter.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @param {Number} [retries=3] - The number of retries, can be set in config for all functions under params stepsRetries.
   * @param {Number} [interval=5000] - The delay between the retries (ms). Can be set in config for all functions under params.stepRetriesIntervals.
   * @param {Boolean} [verify=true] - Specifies if the filled value should be verified.
   * @example await ui5.userInteraction.clearAndFillAndRetry(selector, "My Value");
   */
  async clearAndFillAndRetry(selector: any, value: string, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT, retries = 3, interval = 5000, verify = true) {
    const vl = this.vlf.initLog(this.clearAndFillAndRetry);
    await util.function.retry(
      async (selector: any, value: string, index: number, timeout: number) => {
        await this.clearAndFill(selector, value, index, timeout);
        if (verify) {
          const elem = await ui5.element.getDisplayed(selector, index, timeout);
          let elemValue = await ui5.element.getValue(selector, index, timeout);
          if (elemValue != value) {
            // IMPORTANT: keep non-strict comparison for format changes after input (10 -> 10.00)
            elemValue = await ui5.element.getInnerAttribute(elem, "data-" + "value");
            if (elemValue != value) {
              // IMPORTANT: keep non-strict comparison for format changes after input (10 -> 10.00)
              throw new Error(`Actual value '${elemValue}' not equal to expected value '${value}'`);
            }
          }
        }
      },
      [selector, value, index, timeout],
      retries,
      interval,
      this
    );
  }

  /**
   * @function clearSmartFieldInput
   * @memberOf ui5.userInteraction
   * @description Clears the smart filed with the given selector.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.clearSmartFieldInput(selector);
   */
  async clearSmartFieldInput(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.clearSmartFieldInput);
    await ui5.userInteraction.clear(selector, index, timeout);
  }

  /**
   * @function clearAndFillSmartFieldInput
   * @memberOf ui5.userInteraction
   * @description Clears the smart filed with the given selector and fills the given value.
   * @param {Object} selector - The selector describing the element.
   * @param {String} value - The value to enter.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.clearAndFillSmartFieldInput(selector, "My Value");
   */
  async clearAndFillSmartFieldInput(selector: any, value: string, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.clearAndFillSmartFieldInput);
    const id = await ui5.element.getId(selector, index, timeout);
    const elem = await nonUi5.element.getByCss(`input[id*='${id}']`);
    await elem.click();
    await ui5.userInteraction.selectAll(selector, index, timeout);
    await elem.setValue(value);
  }

  /**
   * @function clearAndFillSmartFieldInputAndRetry
   * @memberOf ui5.userInteraction
   * @description Clears the smart filed with the given selector and fills the given value and retries the action in case of a failure.
   * @param {Object} selector - The selector describing the element.
   * @param {String} value - The value to enter.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @param {Number} [retries=3] - The number of retries, can be set in config for all functions under params stepsRetries.
   * @param {Number} [interval=5000] - The delay between the retries (ms). Can be set in config for all functions under params.stepRetriesIntervals.
   * @example await ui5.userInteraction.clearAndFillSmartFieldInputAndRetry(selector, "My Value");
   */
  async clearAndFillSmartFieldInputAndRetry(selector: any, value: string, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT, retries = 3, interval = 5000) {
    const vl = this.vlf.initLog(this.clearAndFillSmartFieldInputAndRetry);
    await util.function.retry(this.clearAndFillSmartFieldInput, [selector, value, index, timeout], retries, interval, this);
  }

  // =================================== SELECT ===================================
  /**
   * @function selectBox
   * @memberOf ui5.userInteraction
   * @description Selects the passed value of the Select box.
   * Please note that the function will only work for the default select Box.
   * In special cases, please use the clickSelectArrow function.
   * @param {Object} selector - The selector describing the element.
   * @param {String} value - The value to select.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @example await ui5.userInteraction.selectBox(selector, "Germany");
   */
  async selectBox(selector: any, value: string, index = 0) {
    const vl = this.vlf.initLog(this.selectBox);
    await this.clickSelectArrow(selector, index);
    if (value !== undefined && value !== null) {
      const itemSelector = {
        elementProperties: {
          mProperties: {
            text: value
          },
          ancestorProperties: selector.elementProperties
        }
      };
      await this.scrollToElement(itemSelector);
      await this.click(itemSelector);
    } else {
      this.ErrorHandler.logException(new Error("Please provide a value as second argument."));
    }
  }

  /**
   * @function selectComboBox
   * @memberOf ui5.userInteraction
   * @description Selects the passed value from the ComboBox with the given selector.
   * Please note that the function will only work for the default ComboBox.
   * In special cases you need to use the 'clickSelectArrow' function.
   * @param {Object} selector - The selector describing the element.
   * @param {String} value - The value to select.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @example await ui5.userInteraction.selectComboBox(selector, "Germany");
   */
  async selectComboBox(selector: any, value: string, index = 0) {
    const vl = this.vlf.initLog(this.selectComboBox);
    await this.clickSelectArrow(selector, index);
    if (value) {
      const selector = {
        elementProperties: {
          metadata: "sap.m.StandardListItem",
          mProperties: {
            title: value
          }
        },
        parentProperties: {
          metadata: "sap.m.List"
        }
      };
      await this.scrollToElement(selector);
      await this.click(selector);
    }
  }

  /**
   * @function selectMultiComboBox
   * @memberOf ui5.userInteraction
   * @description Selects the passed values of the MultiComboBox with the given selector.
   * Please note that the function will only work for the default MultiComboBox.
   * In special cases, please use the clickSelectArrow function.
   * @param {Object} selector - The selector describing the element.
   * @param {Array} values - The values to select.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @example await ui5.userInteraction.selectMultiComboBox(selector, ["Option 1", "Option 2"]);
   */
  async selectMultiComboBox(selector: any, values: any[], index = 0) {
    const vl = this.vlf.initLog(this.selectMultiComboBox);
    await this.clickSelectArrow(selector, index);
    for (const v in values) {
      const ui5ControlProperties = {
        elementProperties: {
          metadata: "sap.m.CheckBox",
          mProperties: {}
        },
        parentProperties: {
          metadata: "sap.m.StandardListItem",
          mProperties: {
            title: values[v]
          }
        }
      };
      await this.scrollToElement(ui5ControlProperties);
      await this.click(ui5ControlProperties);
    }
    await common.userInteraction.pressEscape();
  }

  /**
   * @function clickSelectArrow
   * @memberOf ui5.userInteraction
   * @description Clicks the arrow icon at the passed selector (select box).
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @example await ui5.userInteraction.clickSelectArrow(selector);
   */
  async clickSelectArrow(selector: any, index = 0) {
    const vl = this.vlf.initLog(this.clickSelectArrow);
    const id = await ui5.element.getId(selector, index);
    const arrow = await nonUi5.element.getByCss("[id='" + id + "-arrow']", 0, 3000);
    await arrow.click();
  }

  /**
   * @function clickSelectArrowAndRetry
   * @memberOf ui5.userInteraction
   * @description Clicks the arrow icon at the passed selector (select box), and retries in case it fails.
   * @param {Object} selector - The selector describing the element
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [retries=3] - The number of retries, can be set in config for all functions under params stepsRetries.
   * @param {Number} [interval=5000] - The delay between the retries (ms). Can be set in config for all functions under params.stepRetriesIntervals.
   * @example await ui5.userInteraction.clickSelectArrowAndRetry(selector);
   */
  async clickSelectArrowAndRetry(selector: any, index = 0, retries = 3, interval = 5000) {
    const vl = this.vlf.initLog(this.clickSelectArrowAndRetry);
    await util.function.retry(this.clickSelectArrow, [selector, index], retries, interval, this);
  }

  /**
   * @function selectFromTab
   * @memberOf ui5.userInteraction
   * @description Selects the passed value on the tab with the given selector and checks if the tab got selected successfully.
   * The function retries the click for maximal 3 times if the selection of the tab (blue underline) was not successful.
   * @param {Object} selector - The selector describing the element.
   * @param {String} value - The value to select.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.selectFromTab(selector);
   */
  async selectFromTab(selector: any, value: string, index: number = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.selectFromTab);
    await util.function.retry(
      async (selector: any, index: number, timeout: number) => {
        const arrowSelector = {
          elementProperties: {
            viewName: selector.elementProperties.viewName,
            metadata: "sap.ui.core.Icon",
            src: "sap-icon://slim-arrow-down"
          },
          ancestorProperties: selector
        };
        await ui5.userInteraction.click(arrowSelector, index, timeout);

        const menuItemSelectorOldUI5 = {
          elementProperties: {
            viewName: selector.elementProperties.viewName,
            metadata: "sap.ui.unified.MenuItem",
            text: value
          }
        };
        const menuItemSelectorNewUI5 = {
          elementProperties: {
            viewName: selector.elementProperties.viewName,
            metadata: "sap.m.IconTabFilter",
            text: value
          }
        };
        await browser.waitUntil(
          async () => {
            try {
              await Promise.any([ui5.userInteraction.click(menuItemSelectorNewUI5, 0, 500), 
                ui5.userInteraction.click(menuItemSelectorOldUI5, 0, 500)]);
              return true;
            } catch (error) {
              // Ignore error and continue to next promise
              return false;
            }
          },
          {
            timeout: timeout,
            timeoutMsg: "Menu Item not clickable after " + timeout / 1000 + "s",
            interval: GLOBAL_DEFAULT_WAIT_INTERVAL
          }
        );
        
        
        const tabSwitchedSuccessfully: boolean = await this._verifyTabSwitch(selector);
        if (tabSwitchedSuccessfully === false) {
          this.ErrorHandler.logException(new Error("Could not verify successful tab switch."));
        }
      },
      [selector, index, timeout],
      3,
      5000,
      this
    );
  }

  // =================================== OTHERS ===================================
  /**
   * @function mouseOverElement
   * @memberOf ui5.userInteraction
   * @description Moves the cursor/focus to the element with the given selector.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.mouseOverElement(selector);
   */
  async mouseOverElement(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.mouseOverElement);
    let elem;
    try {
      elem = await ui5.element.getDisplayed(selector, index, timeout);
    } catch (error) {
      return this.ErrorHandler.logException(new Error(), `No element found for selector ${selector}`);
    }
    await elem.moveTo();
  }

  /**
   * @function scrollToElement
   * @memberOf ui5.userInteraction
   * @description Scrolls the element with the given selector into view.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {String | Object} [alignment="center"] - The alignment option for scrolling.
   *   Can be one of: "start", "center", "end", "nearest", or an object with properties:
   *   - block: Vertical alignment ("start", "center", "end", "nearest").
   *   - inline: Horizontal alignment ("start", "center", "end", "nearest").
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   *
   * @example
   * // Scroll to element with center alignment.
   * await nonUi5.userInteraction.scrollToElement(selector, 0, "center");
   *
   * @example
   * // Scroll to element with custom alignment.
   * const alignment = {
   *   block: "start",
   *   inline: "center"
   * };
   * await nonUi5.userInteraction.scrollToElement(selector, 0, alignment);
   */
  async scrollToElement(selector: any, index = 0, alignment: AlignmentOptions | AlignmentValues = "center", timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.scrollToElement);
    let options = {};
    const elem = await ui5.element.getDisplayed(selector, index, timeout);
    if (elem) {
      if (typeof alignment == "string") {
        options = {
          block: alignment,
          inline: alignment
        };
      } else if (typeof alignment === "object") {
        options = alignment;
      }
      await elem.scrollIntoView(options);
    }
  }

  /**
   * @function selectAll
   * @memberOf ui5.userInteraction
   * @description Performs "select all" (ctrl + a) at the element with the given selector.
   * @param {Object} [selector] - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector, in case there are more than one elements visible at the same time.
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.selectAll(selector);
   */
  async selectAll(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.selectAll);
    if (selector !== undefined) {
      await this.click(selector, index, timeout);
    } else {
      util.console.info("Selector properties are undefined. Action will be performed on current element.");
    }
    await common.userInteraction.pressKey(["\uE051", "a"]);
  }

  /**
   * @function openF4Help
   * @memberOf ui5.userInteraction
   * @description Opens the F4-help of the element with the given selector.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @param {Boolean} useF4Key - Specifies if the help is opened by pressing the F4-key or via the button.
   * The default value is true (triggered by pressing the F4-key). Set "useF4Key" to false, to trigger the search by clicking the button.
   * @example await ui5.userInteraction.openF4Help(selector, 0, 30000, false);
   */
  async openF4Help(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT, useF4Key = true) {
    const vl = this.vlf.initLog(this.openF4Help);
    await ui5.userInteraction.click(selector, index, timeout);
    if (useF4Key === true) {
      await common.userInteraction.pressF4();
    } else {
      const id = await ui5.element.getId(selector);
      const button = await nonUi5.element.getByCss("[id='" + id + "-vhi']", 0, timeout);
      await button.click();
    }
  }

  /**
   * @function searchFor
   * @memberOf ui5.userInteraction
   * @description Searches for the passed value and executes the search.
   * In case that the search is already filled, it will reset the field first.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @param {Boolean} useEnter - Specifies if the search is triggered by pressing the Enter-key or via the search button.
   * The default value is true (triggered by pressing the Enter-key). Set "useEnter" to false, to trigger the search by clicking the search button.
   * @example await ui5.userInteraction.searchFor(selector, "My Value", 0, 30000, false);
   */
  async searchFor(selector: any, value: string, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT, useEnter = true) {
    const vl = this.vlf.initLog(this.searchFor);
    vl.log(`Searching for ${value}`);
    await ui5.userInteraction.clearAndFillAndRetry(selector, value, index, timeout);
    if (useEnter === true) {
      await common.userInteraction.pressEnter();
    } else {
      const id = await ui5.element.getId(selector, index, timeout);
      const searchButton = await nonUi5.element.getByCss("[id='" + id + "-search']", 0, timeout);
      await searchButton.click();
    }
  }

  /**
   * @function resetSearch
   * @memberOf ui5.userInteraction
   * @description Resets the search field.
   * @param {Object} selector - The selector describing the element.
   * @param {Number} [index=0] - The index of the selector (in case there are more than one elements visible at the same time).
   * @param {Number} [timeout=30000] - The timeout to wait (ms).
   * @example await ui5.userInteraction.resetSearch(selector);
   */
  async resetSearch(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    const vl = this.vlf.initLog(this.resetSearch);
    const id = await ui5.element.getId(selector, index, timeout);
    const resetButton = await nonUi5.element.getByCss("[id='" + id + "-reset']", 0, timeout);
    await resetButton.click();
  }

  // =================================== HELPER ===================================
  //TODO: rework function in its whole. Why don't we use the clear function from native wdio here?
  private async _clearHelper(selector: any, index = 0, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
    let id, elem;
    if (selector) {
      await ui5.userInteraction.click(selector, index, timeout);
      id = await ui5.element.getId(selector, index, timeout);
      elem = await browser.getActiveElement();
    } else {
      elem = await browser.getActiveElement();
      await elem.click();
      // @ts-ignore
      id = await util.function.getAttribute(elem, "id");
    }

    const tokenizers = await browser.execute(function (id: string) {
      // @ts-ignore
      const t = document.getElementById(id).querySelectorAll(".sapMTokenizer");
      // @ts-ignore
      const inputs = document.getElementById(id).getElementsByTagName("input");
      // @ts-ignore
      const textareas = document.getElementById(id).getElementsByTagName("textarea");

      if (inputs.length) {
        inputs[0].value = "";
        inputs[0].focus();
      }

      if (textareas.length) {
        textareas[0].value = "";
      }
      return t;
    }, id);

    if ((await tokenizers) && (await tokenizers.length)) {
      await ui5.userInteraction.selectAll(selector, index, timeout);
      await common.userInteraction.pressBackspace();
    }
  }

  private async _verifyTabSwitch(selector: any): Promise<boolean> {
    // two classes required to handle old and new UI5 versions
    const indicatorClasses = ["sapUxAPAnchorBarButtonSelected", "sapMITBSelected"];

    // check for simple tab type
    const tabElem = await ui5.element.getDisplayed(selector);
    const tabClassList = await tabElem.getAttribute("class");
    if (indicatorClasses.some(indicatorClass => tabClassList.includes(indicatorClass))) {
      return true;
    }

    // check for multiple value tab type
    const tabElemTextValue = await ui5.control.getProperty(tabElem, "text");

    const tabParentSelector = {
      elementProperties: {
        metadata: "sap.m.MenuButton",
        text: tabElemTextValue,
        descendentProperties: selector
      }
    };
    const tabParentElem = await ui5.element.getDisplayed(tabParentSelector, 0, 5000);

    const tabParentClassList = await tabParentElem.getAttribute("class");

    if (indicatorClasses.some(indicatorClass => tabParentClassList.includes(indicatorClass))) {
      return true;
    } else {
      return false;
    }
  }

  // Disabled since it is not working correctly
  // /**
  //  * @function dragAndDrop
  //  * @memberOf ui5.userInteraction
  //  * @description Drags and drops the given element to the given target element.
  //  * @param {Object} sourceSelector - The selector describing the source element to drag.
  //  * @param {Object} targetSelector - The selector describing the target to drop the source element.
  //  * @param {Number} [sourceIndex=0] - The index of the source selector.
  //  * @param {Number} [targetIndex=0] - The index of the target selector.
  //  * @param {Number} [duration=3000] - The duration of the drag and drop (ms).
  //  * @param {Number} [timeout=30000] - The timeout to wait (ms).
  //  * @example await ui5.userInteraction.dragAndDrop(sourceSelector, targetSelector);
  //  */
  // this.dragAndDrop = async function (sourceSelector, targetSelector, sourceIndex = 0, targetIndex = 0, duration = 3000, timeout: number = parseFloat(process.env.QMATE_CUSTOM_TIMEOUT!) || GLOBAL_DEFAULT_WAIT_TIMEOUT) {
  //   const sourceElement = await ui5.element.getDisplayed(sourceSelector, sourceIndex, timeout);
  //   const targetElement = await ui5.element.getDisplayed(targetSelector, targetIndex, timeout);
  //   await nonUi5.userInteraction.dragAndDrop(sourceElement, targetElement);
  // };
}
export default new UserInteraction();
