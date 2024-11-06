declare module 'diff-match-patch' {
    export class diff_match_patch {
        diff_main(text1: string, text2: string): Array<[number, string]>;
        diff_cleanupSemantic(diffs: Array<[number, string]>): void;
    }

    export const DIFF_INSERT: number;
    export const DIFF_DELETE: number;
    export const DIFF_EQUAL: number;
}