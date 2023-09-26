# Tarefa 1 #

<h1>Compondo em Escalas</h1>
<h1>Componentes e REST</h1>
<h2>Tarefa 1</h2>

{{explica
* Escolha uma API do TheMealDB que não sejam as duas abordadas no vídeo (`search.php` e `categories.php`) e monte uma chamada no Postman.
}}

{{figura1
<h2>Coloque a figura com a captura do aplicativo funcionando.</h2>
}}

<br>

<code>
{{codigo1
Escreva o resultado retornado em JSON (máximo 15 linhas).
}}
</code>

<br>

# Tarefa 2 #

<h2>Tarefa 2</h2>

{{explica
* Adapte o App desenvolvido no vídeo "Compondo em Escalas / Componentes e REST" para explorar o serviço que você usou na Tarefa 1.
}}

{{figura1
<h2>Coloque a figura com a captura do aplicativo funcionando.</h2>
}}

<br>

{{figura2
<h2>Coloque a figura com a captura da hierarquia de componentes visuais (composite).</h2>
}}

<br>

{{figura3
<h2>Coloque a figura com a captura dos scripts em box programming.</h2>
}}

# Apres 1 #

<h2>Apresentação do Resultado da Tarefa 1</h2>

Você deve capturar:
* a tela do Postman apresentando a chamada, os parâmetros preenchidos e o resultado retornado;
* o JSON que retornou da chamada - se o JSON tiver mais do que 15 linhas, recorte linhas significativas.

![Postman Screen](template_fix/labs/lab5/postman-screen.png)

<code>
{
  "meals": [
    {
      "idMeal": "52771",
      "strMeal": "Spicy Arrabiata Penne",
      "strInstructions": "Bring a large pot...",
      "strMealThumb": "https://www.themealdb.com/...",
      "strTags": "Pasta,Curry",
      "strCreativeCommonsConfirmed": null,
      "dateModified": null
    }
  ]
}
</code>

# Apres 2 #

<h2>Apresentação do Resultado da Tarefa 2</h2>

Você deve capturar:
* a tela do aplicativo apresentando o resultado final - pode ser do emulador ou do celular;
* a hierarquia de componentes visuais (padrão composite);
* todos os scripts do app (na forma de caixinhas).

As figuras são colocadas de forma separada (como no exemplo abaixo). Coloque figuras em que as coisas fiquem legíveis, mesmo que a figura fique grande. Exemplo:

![Result Screen](template_fix/labs/lab5/ai-screen.png)
![Composite Tree](template_fix/labs/lab5/ai-tree.png)
![Script](template_fix/labs/lab5/ai-script.png)

___ Template ___

* template: labs/lab_5
