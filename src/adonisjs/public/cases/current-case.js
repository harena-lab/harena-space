(function () {
  const localCase = {
    name: 'Gustavo Case 01',
    source: `# Abertura (detailed, start)

ClinicRAC

Olá!!! Seja bem-vindo a plataforma virtual interativa para avaliação de raciocínio clínico. 

Você irá interagir com alguns casos clínicos e o objetivo é tentar resolvê-los conforme as instruções que serão apresentadas. 

A atividade tem um tempo máximo para sua finalização de 1 hora.
Vamos começar???

* Continuar -> Video

# Video (detailed)

<iframe width="560" height="315" src="https://www.youtube.com/embed/qD06Vw_S4TQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* Continuar -> Apresenta Caso

# Apresenta Caso (input)

Seguem abaixo novas informações sobre o caso, relativas ao exame físico e achados laboratoriais:

Paciente do sexo feminino, 47 anos, solteira, vendedora de roupas, natural e residente em Belo Horizonte. Refere dor epigástrica e em hipocôndrio direito de forte intensidade, com início há 3 semanas, irradiando para dorso, sem relação com a alimentação. Há 15 dias, começou a apresentar icterícia, colúria, hipocolia fecal e prurido. Refere um episódio de calafrio na noite anterior, mas diz que não verificou sua temperatura. Nega vômitos ou perda de peso, mas relata 2 a 3 episódios de náuseas após as refeições, que cederam espontaneamente, ao longo dos últimos dois meses. Etilista social, nega tabagismo e nega cirurgias prévias.

? diagnostico
  Insira 3 possíveis diagnósticos para esse caso:
  * type: table
  * schema: Diagnóstico
  * rows: 3

* Continuar -> Verifica 1

# Verifica 1 (input)

Seguem abaixo novas informações sobre o caso, relativas ao exame físico e achados laboratoriais:

Paciente do sexo feminino, 47 anos, solteira, vendedora de roupas, natural e residente em Belo Horizonte. Refere dor epigástrica e em hipocôndrio direito de forte intensidade, com início há 3 semanas, irradiando para dorso, sem relação com a alimentação. Há 15 dias, começou a apresentar icterícia, colúria, hipocolia fecal e prurido. Refere um episódio de calafrio na noite anterior, mas diz que não verificou sua temperatura. Nega vômitos ou perda de peso, mas relata 2 a 3 episódios de náuseas após as refeições, que cederam espontaneamente, ao longo dos últimos dois meses. Etilista social, nega tabagismo e nega cirurgias prévias.

Indique quais alterações você esperaria no exame clínico e em exames laboratoriais para o <b>primeiro diagnóstico</b>:

Exame físico:

? achado relacionado1
  * type: group select
  * vocabularies: evidence:findingRelated

{{symptoms/evidence:findingRelated/
{Bom estado geral}/+/, {normocorada}/+/, {ictérica +++/4+}/+/, {hidratada}/+/, {Tax: 37,5oC}/+/,  {PA: 120/70 mmHg}/+/; {FC:82 bpm; FR: 16irpm}/+/.

Coração: {RCR 2 tempos}/+/, {BNF}/+/, {sem sopros}/+/. Pulmão: {expansibilidade normal}/+/, {murmúrio vesicular fisiológico}/+/. Abdome: {Peristáltico}/+/, {flácido}/+/, {leve desconforto à palpação de hipocôndrio direito}/+/, {sem massas ou visceromegalias}/+/.
}}

Exames laboratoriais:

Resultados dos exames laboratoriais Valores de Referência   Resultados dos exames laboratoriais Valores de Referência
Hb: 14,2g/dL   12,0-18,0g/dL  Reticulócitos: 1% 0,5-1,5 %
VCM: 88fL   80-100fL AST: 88 U/L 15-40U/L
HCM: 28 pg  26-34 pg ALT:65 U/L  5-35U/L
Leucócitos: 7.400/µL 4.000-11.000/ µL  Fosfatase alcalina: 726 U/L   40-130 U/L
Segmentados 75%   45-75%   GamaGT: 1.790 U/L 10-49U/L
Linfócitos 25% 22-40%   Bilirrubina Total: 17,9 mg/dL 0,20-1,00 mg/dL
Plaquetas: 380.000/µL   150.000-450.000/µL   Bilirrubina direta: 13,4 mg/dL   0,00-0,20 mg/dL
Bilirrubina Indireta: 4,5 mg/dL  0,20 a 0,80 mg/dL

<table style="border: 1px solid darkgray">
   <tr>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Diagnóstico</th>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Alterações no Exame Clínico</th>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Alterações em Exames Diagnósticos</th>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[1]^</td>
      <td style="border: 1px solid darkgray"><dcc-expression expression="Verifica_1.achado_relacionado1" active></dcc-expression></td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[2]^</td>
      <td style="border: 1px solid darkgray"></td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[3]^</td>
      <td style="border: 1px solid darkgray"></td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
</table>

* Continuar -> Verifica 2

# Verifica 2 (input)

Seguem abaixo novas informações sobre o caso, relativas ao exame físico e achados laboratoriais:

Paciente do sexo feminino, 47 anos, solteira, vendedora de roupas, natural e residente em Belo Horizonte. Refere dor epigástrica e em hipocôndrio direito de forte intensidade, com início há 3 semanas, irradiando para dorso, sem relação com a alimentação. Há 15 dias, começou a apresentar icterícia, colúria, hipocolia fecal e prurido. Refere um episódio de calafrio na noite anterior, mas diz que não verificou sua temperatura. Nega vômitos ou perda de peso, mas relata 2 a 3 episódios de náuseas após as refeições, que cederam espontaneamente, ao longo dos últimos dois meses. Etilista social, nega tabagismo e nega cirurgias prévias.

Indique quais alterações você esperaria no exame clínico e em exames laboratoriais para o <b>segundo diagnóstico</b>:

Exame físico:

? achado relacionado2
  * type: group select
  * vocabularies: evidence:findingRelated

{{symptoms/evidence:findingRelated/
{Bom estado geral}/+/, {normocorada}/+/, {ictérica +++/4+}/+/, {hidratada}/+/, {Tax: 37,5oC}/+/,  {PA: 120/70 mmHg}/+/; {FC:82 bpm; FR: 16irpm}/+/.

Coração: {RCR 2 tempos}/+/, {BNF}/+/, {sem sopros}/+/. Pulmão: {expansibilidade normal}/+/, {murmúrio vesicular fisiológico}/+/. Abdome: {Peristáltico}/+/, {flácido}/+/, {leve desconforto à palpação de hipocôndrio direito}/+/, {sem massas ou visceromegalias}/+/.
}}

Exames laboratoriais:

Resultados dos exames laboratoriais Valores de Referência Resultados dos exames laboratoriais Valores de Referência
Hb: 14,2g/dL  12,0-18,0g/dL Reticulócitos: 1% 0,5-1,5 %
VCM: 88fL 80-100fL  AST: 88 U/L 15-40U/L
HCM: 28 pg  26-34 pg  ALT:65 U/L  5-35U/L
Leucócitos: 7.400/µL  4.000-11.000/ µL  Fosfatase alcalina: 726 U/L 40-130 U/L
Segmentados 75% 45-75%  GamaGT: 1.790 U/L 10-49U/L
Linfócitos 25%  22-40%  Bilirrubina Total: 17,9 mg/dL 0,20-1,00 mg/dL
Plaquetas: 380.000/µL 150.000-450.000/µL  Bilirrubina direta: 13,4 mg/dL  0,00-0,20 mg/dL
Bilirrubina Indireta: 4,5 mg/dL 0,20 a 0,80 mg/dL

<table style="border: 1px solid darkgray">
   <tr>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Diagnóstico</th>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Alterações no Exame Clínico</th>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Alterações em Exames Diagnósticos</th>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[1]^</td>
      <td style="border: 1px solid darkgray">^Verifica_1.achado_relacionado1^</dcc-expression></td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[2]^</td>
      <td style="border: 1px solid darkgray"><dcc-expression expression="Verifica_2.achado_relacionado2" active></td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[3]^</td>
      <td style="border: 1px solid darkgray"></td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
</table>

* Continuar -> Verifica 3

# Verifica 3 (input)

Seguem abaixo novas informações sobre o caso, relativas ao exame físico e achados laboratoriais:

Paciente do sexo feminino, 47 anos, solteira, vendedora de roupas, natural e residente em Belo Horizonte. Refere dor epigástrica e em hipocôndrio direito de forte intensidade, com início há 3 semanas, irradiando para dorso, sem relação com a alimentação. Há 15 dias, começou a apresentar icterícia, colúria, hipocolia fecal e prurido. Refere um episódio de calafrio na noite anterior, mas diz que não verificou sua temperatura. Nega vômitos ou perda de peso, mas relata 2 a 3 episódios de náuseas após as refeições, que cederam espontaneamente, ao longo dos últimos dois meses. Etilista social, nega tabagismo e nega cirurgias prévias.

Indique quais alterações você esperaria no exame clínico e em exames laboratoriais para o <b>terceiro diagnóstico</b>:

Exame físico:

? achado relacionado3
  * type: group select
  * vocabularies: evidence:findingRelated

{{symptoms/evidence:findingRelated/
{Bom estado geral}/+/, {normocorada}/+/, {ictérica +++/4+}/+/, {hidratada}/+/, {Tax: 37,5oC}/+/,  {PA: 120/70 mmHg}/+/; {FC:82 bpm; FR: 16irpm}/+/.

Coração: {RCR 2 tempos}/+/, {BNF}/+/, {sem sopros}/+/. Pulmão: {expansibilidade normal}/+/, {murmúrio vesicular fisiológico}/+/. Abdome: {Peristáltico}/+/, {flácido}/+/, {leve desconforto à palpação de hipocôndrio direito}/+/, {sem massas ou visceromegalias}/+/.
}}

Exames laboratoriais:

Resultados dos exames laboratoriais Valores de Referência Resultados dos exames laboratoriais Valores de Referência
Hb: 14,2g/dL  12,0-18,0g/dL Reticulócitos: 1% 0,5-1,5 %
VCM: 88fL 80-100fL  AST: 88 U/L 15-40U/L
HCM: 28 pg  26-34 pg  ALT:65 U/L  5-35U/L
Leucócitos: 7.400/µL  4.000-11.000/ µL  Fosfatase alcalina: 726 U/L 40-130 U/L
Segmentados 75% 45-75%  GamaGT: 1.790 U/L 10-49U/L
Linfócitos 25%  22-40%  Bilirrubina Total: 17,9 mg/dL 0,20-1,00 mg/dL
Plaquetas: 380.000/µL 150.000-450.000/µL  Bilirrubina direta: 13,4 mg/dL  0,00-0,20 mg/dL
Bilirrubina Indireta: 4,5 mg/dL 0,20 a 0,80 mg/dL

<table style="border: 1px solid darkgray">
   <tr>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Diagnóstico</th>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Alterações no Exame Clínico</th>
      <th style="border: 1px solid darkgray;background-color: lightgray;font-weight: bold">Alterações em Exames Diagnósticos</th>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[1]^</td>
      <td style="border: 1px solid darkgray">^Verifica_1.achado_relacionado1^</dcc-expression></td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[2]^</td>
      <td style="border: 1px solid darkgray">^Verifica_2.achado_relacionado2^</td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
   <tr>
      <td style="border: 1px solid darkgray;font-weight: bold">^Apresenta Caso.diagnostico[3]^</td>
      <td style="border: 1px solid darkgray"><dcc-expression expression="Verifica_3.achado_relacionado3" active></td>
      <td style="border: 1px solid darkgray"></td>
   </tr>
</table>

* Continuar -> Apresenta Resultados

# Apresenta Resultados (detailed)

Agora confira se as colunas se relacionam de forma adequada entre diagnóstico, achados do exame clínico e exames diagnósticos
Qual o diagnóstico mais provável deste caso?

CAIXA DE TEXTO COLOCAR O DIAGNÓSTICO DEFINITIVO

* Continuar -> Apresenta Resposta

# Apresenta Resposta (detailed, end)

O diagnóstico mais provável para este caso é:
CAIXA DE TEXTO COM O DIAGNÓSTICO CORRETO DO CASO

___ Data ___

* theme: simple
* namespaces:
  * evidence: http://purl.org/versum/evidence/`
  }

  MessageBus.i.publish('control/case/load/ready', localCase)
})()
