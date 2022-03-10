/**
 * メッセージテンプレートの${N}部分を指定の値で埋めて返します
 *
 * @param template ${N}形式のプレースホルダーを含むメッセージ
 * @param vals ${N}部分に埋める値の配列。最初の要素は${1}に対応します
 * @returns 変換後のメッセージ
 */
export const fillString = (template: string, ...vals: (string | number)[]) => {
  let result = template;
  vals.forEach((val, index) => {
    const placeHolder = '${' + (index + 1) + '}';
    if (!result.includes(placeHolder)) {
      // ${N}がない
      console.warn(
        `Placeholder ${placeHolder} is not found in template: ${template}.`
      );
    }
    result = result.replace(placeHolder, String(val));
  });
  if (result.match(/\$\{[0-9]+\}/)) {
    // 結果に${N}がまだ残っている
    console.warn(`Not enough params to fill template. result: ${result}`);
  }
  return result;
};
