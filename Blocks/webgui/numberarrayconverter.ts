namespace B {
    export function B64SafeEncode(s: string): string {
        //Replace '+' and '/' with '-' and '_' and remove '='

        //Should also remove any not websafe chars like chinese or whatever
        return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    }
    export function B64SafeDecode(s: string): string {
        s = (s + '===').slice(0, s.length + (s.length % 4));
        return atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    }

    const _Rixits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
    export function fromNumber(num: number): string {
        let rixit;
        let residual = Math.floor(num);
        let result = '';
        while (true) {
            rixit = residual % 64;
            result = _Rixits.charAt(rixit) + result;
            residual = Math.floor(residual / 64);
            if (residual == 0) {
                break;
            }
        }
        return result;
    }
    export function toNumber(s: string): number {
        let result: number = 0;
        let rix = s.split('');
        for (let e = 0; e < rix.length; ++e) {
            result = (result * 64) + _Rixits.indexOf(rix[e]);
        }
        return result
    }

    export function binaryTo64(n: string): string {
        let bin = parseInt(n, 2);
        return fromNumber(bin);
    }
    export function binaryFrom64(n: string): string {
        let b = toNumber(n);
        return b.toString(2);
    }
    export function hexTo64(n: string): string {
        let bin = parseInt(n, 16);
        return fromNumber(bin);
    }
    export function hexFrom64(n: string): string {
        let b = toNumber(n);
        return b.toString(16);
    }
    export function pad(toPad:string, padChar: string, padnum: number): string {
        let p = "";
        for (let i = 0; i < padnum; ++i) {
            p += padChar;
        }
        p += toPad;
        return p.slice(-padnum);
    }
}