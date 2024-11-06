// This file uses the diff-match-patch library, which is licensed under
// the Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0).

import * as vscode from 'vscode';
import { diff_match_patch, DIFF_INSERT, DIFF_DELETE, DIFF_EQUAL } from 'diff-match-patch';

// 前の行と現在の行が一致する割合のしきい値（0.5 = 50%）
const SIMILARITY_THRESHOLD = 0.5;

let previousDecorations: vscode.TextEditorDecorationType[] = [];

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.window.onDidChangeTextEditorSelection((event) => {
        const editor = event.textEditor;
        if (!editor) {
            return; // エディタが開いていない場合は何もしない
        }

        const currentLine = editor.selection.active.line;

        // 先頭行に移動した場合、すべてのハイライトをクリア
        if (currentLine === 0) {
            clearPreviousDecorations();
            return;
        }

        const document = editor.document;
        const previousLineText = document.lineAt(currentLine - 1).text;
        const currentLineText = document.lineAt(currentLine).text;

        // 前のデコレーションをクリア
        clearPreviousDecorations();

        // 前の行と現在の行がしきい値以上に同じかどうかをチェック
        if (linesAreSimilar(previousLineText, currentLineText)) {
            // 前後の行を比較して差分をハイライト
            compareLines(previousLineText, currentLineText, editor);
        }
    });

    context.subscriptions.push(disposable);
}

function clearPreviousDecorations() {
    previousDecorations.forEach(decoration => decoration.dispose());
    previousDecorations = [];
}

function linesAreSimilar(previousLine: string, currentLine: string): boolean {
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(previousLine, currentLine);
    dmp.diff_cleanupSemantic(diffs);

    let equalLength = 0;
    let totalLength = Math.max(previousLine.length, currentLine.length);

    diffs.forEach(diff => {
        const [operation, text] = diff;
        if (operation === DIFF_EQUAL) {
            equalLength += text.length;
        }
    });

    return (equalLength / totalLength) >= SIMILARITY_THRESHOLD;
}

function compareLines(previousLine: string, currentLine: string, editor: vscode.TextEditor): void {
    const dmp = new diff_match_patch();

    // diff_mainで差分を計算
    const diffs = dmp.diff_main(previousLine, currentLine);
    dmp.diff_cleanupSemantic(diffs);

    let currentInsertRanges: vscode.Range[] = [];
    let previousDeleteRanges: vscode.Range[] = [];

    let currentIndex = 0;
    let previousIndex = 0;

    diffs.forEach(diff => {
        const [operation, text] = diff;
        const length = text.length;

        if (operation === DIFF_EQUAL) {
            // テキストが一致している場合、インデックスを進める
            currentIndex += length;
            previousIndex += length;
        } else if (operation === DIFF_INSERT) {
            // 挿入されたテキスト（現在の行に追加された部分）をマゼンタでハイライト
            currentInsertRanges.push(new vscode.Range(editor.selection.active.line, currentIndex, editor.selection.active.line, currentIndex + length));
            currentIndex += length;
        } else if (operation === DIFF_DELETE) {
            // 削除されたテキスト（前の行に存在した部分）の背景色を緑でハイライト
            previousDeleteRanges.push(new vscode.Range(editor.selection.active.line - 1, previousIndex, editor.selection.active.line - 1, previousIndex + length));
            previousIndex += length;
        }
    });

    // マゼンタでハイライト
    const magentaDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 0, 255, 0.3)' // マゼンタ
    });

    // 緑の背景色を設定
    const greenBackgroundDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(0, 255, 0, 0.3)' // 緑
    });

    // デコレーションを適用
    editor.setDecorations(magentaDecorationType, currentInsertRanges);
    editor.setDecorations(greenBackgroundDecorationType, previousDeleteRanges);

    // 現在のデコレーションを保存して、次回クリアする
    previousDecorations.push(magentaDecorationType, greenBackgroundDecorationType);
}

export function deactivate() {
    clearPreviousDecorations();
}