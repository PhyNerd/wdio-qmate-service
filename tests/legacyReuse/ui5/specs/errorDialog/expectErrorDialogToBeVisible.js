"use strict";
const {handleCookiesConsent} = require("../../../../helper/utils");

describe("errorDialog - expectErrorDialogToBeVisible", function () {

  it("Preparation", async function () {
    await non_ui5.common.navigation.navigateToUrl("https://sapui5.hana.ondemand.com/#/entity/sap.m.Dialog/sample/sap.m.sample.DialogMessage");
    await handleCookiesConsent();
  });

  it("Execution", async function () {
    await expect(ui5.common.errorDialog.expectErrorDialogToBeVisible())
      .rejects.toThrow(/No visible elements/);

    const selector = {
      "elementProperties": {
        "viewName": "sap.m.sample.DialogMessage.V",
        "metadata": "sap.m.Button",
        "text": "Message Dialog (Error)"
      }
    };
    await ui5.common.userInteraction.click(selector);
  });

  it("Verification", async function () {
    await ui5.common.errorDialog.expectErrorDialogToBeVisible();
  });
});