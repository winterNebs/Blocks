declare namespace B {
    function fromNumber(num: number): string;
    function toNumber(s: string): number;
    function binaryTo64(n: string): string;
    function binaryFrom64(n: string): string;
    function hexTo64(n: string): string;
    function hexFrom64(n: string): string;
    function pad(toPad: string, padChar: string, padnum: number): string;
}
