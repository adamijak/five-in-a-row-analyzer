export class Log{
    #log: number[];

    constructor(logString: string | null = null){
        this.#log = new Array();

        if (logString == null){
            return;
        }

        const logArray = logString.split(/\s+/);
        if (logArray.length % 2 != 0){
            throw new Error("Could not parse log string");
        }

        for (let i = 0; i < logArray.length; i+=2) {
            const row = parseInt(logArray[i]);
            const col = parseInt(logArray[i+1]);
            this.#log.push(row,col);
        }
    }

    get log(){
        return this.#log;
    }

    push(row: number, col: number){
        this.#log.push(row, col);
    }

    toString(){
        let str = "";
        for (let i = 0; i < this.#log.length; i+=2) {
            const row = this.#log[i];
            const col = this.#log[i+1];
            
            str += `${row} ${col}\n`;
        }
        return str;
    }

    toBlob(){
        return new Blob([this.toString()], {type: "text/plain"});
    }
}