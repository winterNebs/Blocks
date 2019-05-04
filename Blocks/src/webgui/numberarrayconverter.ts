
    //Convert numbers chunks at a time
    const _Rixits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    export function fromNumber(num: number): string {
        let rixit;
        let residual = num;
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
        n = n.padStart(Math.ceil(n.length / 6) * 6, "0");

        let s = "";
        let bin: string[] = n.match(/.{1,6}/g);
        
        for (let b of bin) {
            s += fromNumber(parseInt(b,2));
        }
        return s;
    }
    export function binaryFrom64(n: string): string {
        let s = "";
        for (let b of n.split('')) {
            s += toNumber(b).toString(2).padStart(6,'0');
        }
        return s;
    }
    export function hexTo64(n: string): string {
        let bin = parseInt(n, 16);
        return fromNumber(bin);
    }
    export function hexFrom64(n: string): string {
        let b = toNumber(n);
        return b.toString(16);
    }
    export function pad(toPad: string, padChar: string, padnum: number): string {
        let p = "";
        for (let i = 0; i < padnum; ++i) {
            p += padChar;
        }
        p += toPad;
        return p.slice(-padnum);
    }
