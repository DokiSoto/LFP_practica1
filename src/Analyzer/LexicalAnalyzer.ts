import { Token, Type } from "./Token";

class LexicalAnalyzer {
    private row: number;
    private column: number;
    private auxChar: string;
    private state: number;
    private tokenList: Token[];
    private errorList: Token[];

    constructor() {
        this.row = 1;
        this.column = 1;
        this.auxChar = '';
        this.state = 0;
        this.tokenList = [];
        this.errorList = [];
    }

    scanner(input: string) {
        input += '#';
        let char: string;

        for (let i = 0; i < input.length; i++) {
            char = input[i];

            switch (this.state) {
                case 0:
                    switch (char) {
                        case '{':
                            this.addToken(Type.LLAVE_IZQUIERDA, char, this.row, this.column);
                            this.column++;
                            break;
                        case '}':
                            this.addToken(Type.LLAVE_DERECHA, char, this.row, this.column);
                            this.column++;
                            break;
                        case '[':
                            this.addToken(Type.CORCHETE_IZQUIERDO, char, this.row, this.column);
                            this.column++;
                            break;
                        case ']':
                            this.addToken(Type.CORCHETE_DERECHO, char, this.row, this.column);
                            this.column++;
                            break;
                        case '(':
                            this.addToken(Type.PAR_IZQUIERDO, char, this.row, this.column);
                            this.column++;
                            break;
                        case ')':
                            this.addToken(Type.PAR_DERECHO, char, this.row, this.column);
                            this.column++;
                            break;
                        case ':':
                            if (input[i + 1] === '=') {
                                this.addToken(Type.ASIGNACION, ':=', this.row, this.column);
                                this.column += 2;
                                i++; 
                            } else {
                                this.addToken(Type.DOS_PUNTOS, char, this.row, this.column);
                                this.column++;
                            }
                            break;
                        case '=':
                            this.addToken(Type.IGUAL, char, this.row, this.column);
                            this.column++;
                            break;
                        case ';':
                            this.addToken(Type.PUNTO_Y_COMA, char, this.row, this.column);
                            this.column++;
                            break;
                        case '"':
                            this.auxChar = char;
                            this.state = 1;
                            this.column++;
                            break;
                        case '\n':
                        case '\r':
                            this.row++;
                            this.column = 1;
                            break;
                        case '\t':
                            this.column += 4;
                            break;
                        case ' ':
                            this.column++;
                            break;
                        default:
                            if (this.esLetra(char)) {
                                this.auxChar = char;
                                this.state = 2;
                                this.column++;
                            } else if (this.esDigito(char)) {
                                this.auxChar = char;
                                this.state = 3;
                                this.column++;
                            } else if (char === '#' && i === input.length - 1) {
                            } else {
                                this.addError(Type.DESCONOCIDO, char, this.row, this.column);
                                this.column++;
                            }
                            break;
                    }
                    break;

                case 1: 
                    if (char === '"') {
                        this.auxChar += char;
                        this.addToken(Type.CADENA, this.auxChar, this.row, this.column - this.auxChar.length + 1);
                        this.clean();
                    } else if (char === '\n') {
                        this.addError(Type.DESCONOCIDO, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--; 
                    } else {
                        this.auxChar += char;
                        this.column++;
                    }
                    break;

                case 2: 
    if (this.esLetra(char)) {
        this.auxChar += char;
        this.column++;
    } else {
        const palabras = [
            "Jugador", "salud", "ataque", "defensa", "tipo",
            "agua", "fuego", "planta", "dragon", "psiquico", "normal"
        ];
        
        if (palabras.some(palabra => palabra === this.auxChar)) {
            this.addToken(Type.PALABRA_RESERVADA, this.auxChar, this.row, this.column - this.auxChar.length);
        } else {
            this.addError(Type.DESCONOCIDO, this.auxChar, this.row, this.column - this.auxChar.length);
        }
        this.clean();
        i--; 
    }
    break;
                case 3: 
                    if (this.esDigito(char)) {
                        this.auxChar += char;
                        this.column++;
                    } else {
                        this.addToken(Type.NUMERO, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--; 
                    }
                    break;
            }
        }

        return this.tokenList;
    }

    private esLetra(char: string): boolean {
        return /^[a-zA-Z]$/.test(char);
    }

    private esDigito(char: string): boolean {
        return /^[0-9]$/.test(char);
    }

    private addCharacter(char: string) {
        this.auxChar += char;
        this.column++;
    }

    private clean() {
        this.auxChar = '';
        this.state = 0;
    }

    private addToken(type: Type, lexeme: string, row: number, column: number) {
        this.tokenList.push(new Token(type, lexeme, row, column));
    }

    private addError(type: Type, lexeme: string, row: number, column: number) {
        this.errorList.push(new Token(type, lexeme, row, column));
    }

    public getTokenList(): Token[] {
        return this.tokenList;
    }

    public getErrorList(): Token[] {
        return this.errorList;
    }
}

export { LexicalAnalyzer };
