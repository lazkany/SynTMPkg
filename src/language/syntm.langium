grammar Syntm

entry Model:
    (  
    (name=Module)
    (interfc=Int)*
    (agents+=Agent)*
    (Assumptions=Assumption)*
    (Guarantees=Guarantee)*
    );

Module: 'SPEC' name=ID;
Int:
    'In' '(' sins=In ')'  ','  'Out' '(' souts=Out ')';
In:
    (ins+=Param (',' ins+=Param)*)?;
Out:
    (outs+=Param (',' outs+=Param)*)?;
Agent:
    'Agent'  name=ID  '->' 'In' '(' ains=In ')'  ','  'Out' '(' aouts=Out ')';
Assumption:
    'Assume' name=ID
        (formula+=Phi)+;
Guarantee:
    'Guarantee' name=ID
        (formula+=Phi)+;

Phi: 
    fexp= Simple;
Simple:
    Exp ({infer Phi.left=current} BOP right=Exp)*;
Exp:
     '(' Phi ')' | UPhi | name=ID | name='true' | name='false';

UPhi:
      UOP (op=Exp);
BOP:
    name='&' | name='|' | name='->' | name='<->' | name='U' | name='R';
UOP:
    name='!' | name='X' | name='G' | name='F';
Param:
    name=ID;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;



