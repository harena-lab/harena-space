___ Flow ___

* Sequential:
  * _sequential_

___ Data ___

* theme: simple(lightgreen)
* namespaces:
  * evidence: http://purl.org/versum/evidence/
* templates:
  * categories:
    * detailed:
      * Lungs: simple/knot/pt_lungs
      * Cava: simple/knot/pt_cava
      * Heart: simple/knot/pt_heart
      * Lower Limbs: simple/knot/pt_llv
      * Abdomen: simple/knot/pt_abdomen
      * Aorta: simple/knot/pt_aorta
      * Urinary: simple/knot/pt_urinary
      * Vesicle: simple/knot/pt_vesicle
      * E-FAST: simple/knot/pt_efast
      * Soft Parts: simple/knot/pt_soft
      * Articulate: simple/knot/pt_articulate
      * Ocular: simple/knot/pt_ocular
      * Extra: simple/knot/pt_extra
* generators:
  * artifact-knot:
    * Lungs:
      * template: simple/knot/pt_lungs
      * description: 'Pulmão'
      * include-many: PL-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'PD-DP': 'Deslizamento Pleural D'
        * 'PE-DP': 'Deslizamento Pleural E'
        * 'PD-AS': 'Antero-superior D'
        * 'PD-AI': 'Antero-inferior D'
        * 'PD-LS': 'Latero-superior D'
        * 'PD-IP': 'Latero-inferior D (parênquima)'
        * 'PD-LI': 'Latero-inferior D'
        * 'PE-AS': 'Antero-superior E'
        * 'PE-AI': 'Antero-inferior E'
        * 'PE-LS': 'Latero-superior E'
        * 'PE-IP': 'Latero-inferior E (parênquima)'
        * 'PE-LI': 'Latero-inferior E'
        * 'PD-PS': 'Posteror-superior D'
        * 'PD-PI': 'Postero-inferior D'
        * 'PE-PS': 'Postero-superior E'
        * 'PE-PI': 'Postero-inferior E'
        * 'PL-EX': 'Extra'
    * Cava:
      * template: simple/knot/pt_cava
      * description: 'Cava'
      * include-many: CV-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'CV-VI': 'Video'
        * 'CV-II': 'Imagem Inspiração'
        * 'CV-IE': 'Imagem Expiração'
        * 'CV-EX': 'Extra'
    * Heart:
      * template: simple/knot/pt_heart
      * description: 'Coração'
      * include-many: CO-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'CO-SX': 'Sub-xifóide ou Subcostal'
        * 'CO-PL': 'Para-esternal Longa'
        * 'CO-PV': 'Paraesternal curta nível V. aortica'
        * 'CO-PM': 'Paraesternal curta nível mitral'
        * 'CO-PP': 'Paraesternal curta nível papilares'
        * 'CO-A4': 'Apical de 4 câmaras'
        * 'CO-EX': 'Extra'
    * Lower Limb Veins:
      * template: simple/knot/pt_llv
      * description: 'Veias membros inferiores'
      * include-many: VM-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'FM-D1': 'Femoral D1'
        * 'FM-D2': 'Femoral D2'
        * 'FM-D3': 'Femoral D3'
        * 'PO-D1': 'Poplitea D1'
        * 'PO-D2': 'Poplitea D2'
        * 'FM-E1': 'Femoral E1'
        * 'FM-E2': 'Femoral E2'
        * 'FM-E3': 'Femoral E3'
        * 'PO-E1': 'Poplitea E1'
        * 'PO-E2': 'Poplitea E2'
        * 'VM-EX': 'Extra'
    * Abdomen:
      * template: simple/knot/pt_abdomen
      * description: 'Abdome para detecção de liquido livre'
      * include-many: AB-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'AB-QSD': 'QSD'
        * 'AB-QSE': 'QSE'
        * 'AB-PT': 'Pelve transversal'
        * 'AB-PL': 'Pelve longitudinal'
        * 'AB-EX': 'Extra'
    * Aorta:
      * template: simple/knot/pt_aorta
      * description: 'Aorta'
      * include-many: AO-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'AO-P': 'Ao proximal'
        * 'AO-D': 'Ao distal'
        * 'AO-I': 'Ilíacas'
        * 'AO-M': 'Ao medial'
        * 'AO-L': 'Varredura Ao longitudinal'
        * 'AO-EX': 'Extra'
    * Urinary:
      * template: simple/knot/pt_urinary
      * description: 'Urinario'
      * include-many: UR-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'RD-VL': 'Rim D (varredura longitudinal)'
        * 'RD-VT': 'Rim D (varredura transversal)'
        * 'RD-ML': 'Medida longitudinal rim D'
        * 'RE-VL': 'Rim E (varredura longitudinal)'
        * 'RE-VT': 'Rim E (varredura transversal)'
        * 'RE-ML': 'Medida longitudinal rim E'
        * 'BX-VL': 'Bexiga (varredura longitudinal)'
        * 'BX-VT': 'Bexiga (varredura transversal)'
        * 'BX-ML': 'Medida da bexiga (longitudinal)'
        * 'BX-MT': 'Medida da bexiga (transveral)'
        * 'UR-EX': 'Extra'
    * Vesicle and Portal Triad:
      * template: simple/knot/pt_vesicle
      * description: 'Vesicula e Tríade portal'
      * include-many: VT-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'VS-VL': 'Vesícula (varredura longitudinal)'
        * 'VS-VT': 'Vesícula (varredura transversal)'
        * 'VS-ME': 'Medida espessura da parede da vesícula'
        * 'TRIA': 'Tríade portal'
        * 'BILI': 'Ducto biliar comum'
        * 'VT-EX': 'Extra'
    * E-FAST:
      * template: simple/knot/pt_efast
      * description: 'E-FAST'
      * include-many: EF-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'EF-DD': 'Deslizamento pleural D'
        * 'EF-DE': 'Deslizamento pleural E'
        * 'EF-SX': 'Sub-xifóide ou subcostal'
        * 'EF-QSD': 'QSD'
        * 'EF-QSE': 'QSE'
        * 'EF-PT': 'Pelve (plano transversal)'
        * 'EF-PL': 'Pelve (plano longitudinal)'
        * 'EF-EX': 'Extra'
    * Soft Parts:
      * template: simple/knot/pt_soft
      * description: 'Partes moles'
      * include-many: ML-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'ML-VL': 'Varredura longitudinal'
        * 'ML-VT': 'Varredura transversal'
        * 'ML-ML': 'Medidas no longitudinal'
        * 'ML-MT': 'Medidas no transversal'
        * 'ML-EX': 'Extra'
    * Articulate:
      * template: simple/knot/pt_articulate
      * description: 'Articular'
      * include-many: AR-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'AR-VL': 'Varredura longitudinal'
        * 'AR-VT': 'Varredura transversal'
        * 'AR-ML': 'Medidas no longitudinal'
        * 'AR-MT': 'Medidas no transversal'
        * 'AR-EX': 'Extra'
    * Ocular:
      * template: simple/knot/pt_ocular
      * description: 'Ocular'
      * include-many: OC-EX
      * include-missing: true
      * include-title: true
      * contexts:
        * 'OC-VL': 'Varredura longitudinal'
        * 'OC-VT': 'Varredura transversal'
        * 'OC-MD': 'Medida do diâmetro nervo óptico'
        * 'OC-EX': 'Extra'
    * Extra:
      * template: simple/knot/pt_extra
      * description: 'Extra'
      * include-many: *
      * include-missing: true
      * include-title: false
      * contexts:
        * 'EX-EX': 'Extra'
