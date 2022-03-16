import {checkRuleLabel, checkRuleList} from "../checkRule/checkRule";

/**
 * チェックルールの型です
 */
export type CheckRuleType = typeof checkRuleList[number]

/**
 * チェックルールのラベルの型です
 */
export type CheckRuleLabel = typeof checkRuleLabel[keyof typeof checkRuleLabel]
