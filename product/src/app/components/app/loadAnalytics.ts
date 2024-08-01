/**
 * Google Analyticsの初期化
 * GAを読み込むためのwebview（electronが提供するカスタムエレメント）を生成し、body直下に追加します
 */
export const loadAnalytics = (analysisUrl: string) => {
  const webview = document.querySelector('.tracking-ga');
  if (!webview) {
    const webview = document.createElement('webview');
    webview.className = 'tracking-ga';
    webview.setAttribute('src', analysisUrl);
    webview.setAttribute('width', '1');
    webview.setAttribute('height', '1');
    document.body.appendChild(webview);
  }
};

/**
 * オプトアウト設定が有効な場合、GAを削除します
 */
export const removeAnalytics = () => {
  const webview = document.querySelector('.tracking-ga');
  if (webview) {
    webview.remove();
  }
};
