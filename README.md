# NEIGHBOR DIFF (neighbor-diff)

## 概要
NEIGHBOR DIFFは、Visual Studio Codeの拡張機能で、現在の行と前の行の差分をハイライト表示します。

## 特徴
- 現在の行と前の行の差分を視覚的に確認できます。
- 最大20行前までの行を走査し、一致度が50%以上の最初の行を比較対象とします。

## インストール
1. [GitHubリポジトリ](https://github.com/LastaVista/neighbor-diff/releases)から最新の `.vsix` ファイルをダウンロードします。
2. Visual Studio Codeを開き、コマンドパレット（`Ctrl+Shift+P` または `Cmd+Shift+P`）を開きます。
3. 「Extensions: Install from VSIX...」を選択し、ダウンロードした `.vsix` ファイルを選択します。

## 使用方法
1. Visual Studio Codeで任意のテキストファイルを開きます。
2. テキストエディタ内でカーソルを移動すると、現在の行と前の行の差分がハイライト表示されます。

## ライセンス
この拡張機能はMITライセンスの下で提供されています。

### 使用しているライブラリ
- `diff-match-patch` ライブラリはApache License 2.0の下でライセンスされています。

## 貢献
貢献を歓迎します！バグ報告や機能リクエストは、[GitHubのIssueトラッカー](https://github.com/LastaVista/neighbor-diff/issues)を通じて行ってください。

## 開発
1. リポジトリをクローンします。
    ```sh
    git clone https://github.com/LastaVista/neighbor-diff.git
    ```
2. 依存関係をインストールします。
    ```sh
    npm install
    ```
3. 拡張機能をビルドします。
    ```sh
    npm run compile
    ```
4. Visual Studio Codeでデバッグを開始します。

## 作者
- [LastaVista](https://github.com/LastaVista)
