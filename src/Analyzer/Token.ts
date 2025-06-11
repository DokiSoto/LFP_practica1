enum Type {
    DESCONOCIDO,
    LLAVE_IZQUIERDA,     
    LLAVE_DERECHA,       
    CORCHETE_IZQUIERDO,  
    CORCHETE_DERECHO,    
    PAR_IZQUIERDO,       
    PAR_DERECHO,         
    DOS_PUNTOS,          
    ASIGNACION,          
    PUNTO_Y_COMA,        
    IGUAL,               
    PALABRA_RESERVADA,
    NUMERO,
    CADENA
}

class Token {
    public row: number;
    public column: number;
    public lexeme: string;
    public typeToken: Type;
    public typeTokenString: string;

    constructor(typeToken: Type, lexeme: string, row: number, column: number){
        this.typeTokenString =Type[typeToken];
        this.typeToken = typeToken;
        this.lexeme = lexeme;
        this.row = row;
        this.column = column;
    }

    
}

export { Token, Type };
