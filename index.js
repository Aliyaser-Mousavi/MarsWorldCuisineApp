import "react-native-gesture-handler";
import { I18nManager } from "react-native";
import "./services/i18n.js";
import { registerRootComponent } from "expo";

if (I18nManager.isRTL || I18nManager.doLeftAndRightSwapInRTL) {
  try {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    if (typeof I18nManager.swapLeftAndRightInRTL === "function") {
      I18nManager.swapLeftAndRightInRTL(false);
    }
  } catch (err) {
    console.warn("Could not configure I18nManager:", err);
  }
}

import App from "./App";

registerRootComponent(App);
