%{
    var createNode = function createNode(header, child) {
      return {header:header, child:child};
    }
%}

%lex

%%
\s+                   {return 'S';}
"Ram"                 {return 'NAME';}
"Sam"                 {return 'NAME';}
"Jadu"                {return 'NAME';}
"eats"                {return 'ACTION';}
"drinks"              {return 'ACTION';}
"water"               {return 'DRINKABLE';}
"tea"                 {return 'DRINKABLE';}
"coffee"              {return 'DRINKABLE';}
"rice"                {return 'EDIBLE';}
"fish"                {return 'EDIBLE';}
"meat"                {return 'EDIBLE';}
'.'                   {return 'DOT'}
<<EOF>>               {return 'EOF';}

/lex

%%

PROGRAM
 : SENTENCES S EOF
     {return $$ = createNode('PROGRAM', [$1]);}
 ;

SENTENCES
 : SENTENCE
    {$$ = createNode('SENTENCES', [$1]);}
 | SENTENCES S SENTENCE
    {$$ = ['SENTENCES', [$1, $3]];}
 ;

SENTENCE
 : NAME_PHRASE S ACTION_PHRASE S ACTIONABLE_PHRASE END_PHRASE
    {return $$ = createNode('SENTENCE',[$1, $3, $5]);}
 ;

ACTIONABLE_PHRASE
 : EDIBLE
    {$$ = createNode('ACTIONABLE', {'EDIBLE' : yytext});}
 | DRINKABLE
    {$$ = createNode('ACTIONABLE', {'DRINKABLE' : yytext});}
 ;

ACTION_PHRASE
 : ACTION
    {$$ = createNode('ACTION', yytext);}
 ;

END_PHRASE
 : DOT
    {$$ = createNode('DOT', yytext);}
 ;

NAME_PHRASE
 : NAME
    {$$ = createNode('NAME', yytext);}
 ;

END_OF_FILE
 : EOF
    {$$ = createNode('EOF', yytext);}
 ;

SPACE
 : S
    {$$ = createNode('S', yytext);}
 ;
