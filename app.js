(() => {
  'use strict';
  const STORAGE_KEY = 'centerwell-connected-care-demo-v2';
  const pageEl = document.getElementById('page');
  const notice = document.getElementById('notice');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const sections = ['huddle', 'patient', 'review', 'quality', 'feedback', 'flow'];
  const titles = {huddle:'Pre-visit huddle', patient:'Patient dashboard', review:'Physician review', quality:'Provider scorecard', feedback:'Provider feedback', flow:'How it connects'};
  const sourceNames = ['Health Gorilla', 'Compass', 'CQ3', 'athena', 'Other sources'];
  const e = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${e(name)}"></use></svg>`;
  const patients = {
    A:{name:'John Doe', initials:'JD', age:'72 years', visit:'Oct 28, 2026', provider:'Avery Morgan, NP', context:'Office visit', vitals:'BP 134/78 mmHg · HR 72',
      condition:'Prior record lists chronic kidney disease, stage 3a. eGFR 54 mL/min/1.73 m²; confirm current status and assess.',
      result:'Outside echocardiogram: LVEF 50–55%; grade I diastolic dysfunction. Review report and determine follow-up.',
      gap:'Colorectal cancer screening is listed as due and eligible based on available data. Confirm appropriateness and discuss screening options.',
      follow:'Discuss the outside echocardiogram findings with the patient by October 28, per the care plan.',
      evidence:{'Health Gorilla':[{id:'A-01', title:'Prior primary care note and laboratory result', date:'Oct 3, 2026', detail:'Prior note lists CKD stage 3a. Laboratory result: eGFR 54 mL/min/1.73 m². Current status and relevance require clinical assessment.'}, {id:'A-05', title:'Prior kidney laboratory record', date:'Jun 3, 2026', detail:'eGFR 58 mL/min/1.73 m². The date shown is the source record date.'},{id:'A-13',title:'Prior cardiology note',date:'Oct 20, 2026',detail:'Cardiology note lists possible heart failure; assessment and current status remain to be confirmed.'}],
        'athena':[{id:'A-08',title:'Current medication list',date:'Oct 25, 2026',detail:'Medication list includes metformin 500 mg twice daily and furosemide 20 mg daily. Indications are not established by the medication list alone.'},{id:'A-09',title:'Laboratory result',date:'Oct 15, 2026',detail:'Hemoglobin A1c 7.2%. The clinician reviews the result and confirms whether a diagnosis is supported.'}],
        'Compass':[{id:'A-03', title:'Colorectal cancer screening', date:'Oct 8, 2026', detail:'Available data identifies an eligible screening opportunity. Confirm appropriateness and review a screening plan.'},{id:'A-12',title:'Eye exam status',date:'Oct 8, 2026',detail:'A diabetes eye exam result was not found in available records. Diabetes and measure eligibility require clinical confirmation; unavailable does not mean not performed.'}],
        'CQ3':[{id:'A-04', title:'Condition review opportunity', date:'Oct 8, 2026', detail:'Prior record lists CKD stage 3a. Review current status and document an appropriate assessment; a prompt alone is not a diagnosis.'},{id:'A-10',title:'Diabetes review opportunity',date:'Oct 18, 2026',detail:'CQ3 identifies a possible diabetes review opportunity. Clinical confirmation is needed.'},{id:'A-14',title:'Heart failure review opportunity',date:'Oct 21, 2026',detail:'Prior cardiology documentation notes possible heart failure. Review clinical status and supporting records.'}],
        'Other sources':[{id:'A-02', title:'Outside echocardiogram', date:'Oct 8, 2026', detail:'LVEF 50–55%; grade I diastolic dysfunction. Review the complete report in clinical context.'}, {id:'A-06',title:'Visit intake',date:'Oct 28, 2026',detail:'PHQ-2: one question unanswered. TAPS-1: positive screen; clinical follow-up needed.'}, {id:'A-07',title:'Visit measurements',date:'Oct 28, 2026',detail:'Blood pressure 134/78 mmHg; height 175 cm. Weight not available.'}]}},
    B:{name:'Jane Doe', initials:'JD', age:'76 years', visit:'Oct 28, 2026', provider:'Avery Morgan, NP', context:'Office visit', vitals:'128/74 mmHg · HR 68 · BMI 26.4',
      condition:'Prior record lists heart failure. Review current status, treatment and the supported plan.',
      result:'Outside laboratory result: hemoglobin A1c 7.4%. Review in the context of the patient’s care plan.',
      gap:'Breast cancer screening is listed as due and eligible based on available data. Appropriateness and the action were reviewed.',
      follow:'The assigned follow-up has been completed.',
      evidence:{'Health Gorilla':[{id:'B-01',title:'Prior cardiology note',date:'Oct 6, 2026',detail:'Prior cardiology record lists heart failure. The clinician determines current status and clinical relevance.'}],
        'Compass':[{id:'B-03',title:'Breast cancer screening',date:'Oct 9, 2026',detail:'Available data identifies an eligible screening opportunity. Confirm appropriateness and document the action or reason.'},{id:'B-05',title:'Colorectal screening result',date:'Oct 5, 2026',detail:'Prior Cologuard result reported abnormal. Completion of a follow-up colonoscopy is unknown.'}],
        'CQ3':[{id:'B-04',title:'Condition review opportunity',date:'Oct 9, 2026',detail:'Prior record lists heart failure. Review current status and document an appropriate assessment; a prompt alone is not a diagnosis.'}],
        'Other sources':[{id:'B-02',title:'Outside laboratory report',date:'Oct 9, 2026',detail:'Hemoglobin A1c: 7.4%. Review in the context of the patient’s care plan.'}]}},
    C:{name:'Maria Sample', initials:'MS', age:'69 years', visit:'Oct 28, 2026', provider:'Avery Morgan, NP', context:'Office visit', vitals:'122/76 mmHg · HR 70 · BMI 25.8',
      condition:'A prior record mentions a resolved episode of acute kidney injury. No current reportable diagnosis was established.',
      result:'No outside laboratory or imaging report is available.',
      gap:'No eligible open care gap is available.',
      follow:'No provider-owned follow-up is due.',
      evidence:{'Health Gorilla':[{id:'C-01',title:'Prior hospital note',date:'Oct 4, 2026',detail:'Prior hospital note mentions a resolved episode of acute kidney injury. No current reportable diagnosis was established.'}],
        'Compass':[], 'CQ3':[{id:'C-04',title:'Review disposition',date:'Oct 10, 2026',detail:'The clinician determined that no current reportable diagnosis was supported.'}],
        'Other sources':[]}}
  };
  const cases = [
    {id:'case-condition',patient:'A',date:'Oct 12, 2026',topic:'Prior condition assessment',metric:'condition', source:'Health Gorilla',record:'A-01',
      evidence:'Outside history dated Oct 3, 2026 notes chronic kidney disease.',
      encounter:'Signed note: chronic kidney disease is not assessed in the available excerpt. Review the complete chart for context.',
      question:'Is there a missed opportunity to assess or document this relevant condition?',
      action:'Review current status and document the clinically appropriate assessment and plan.'},
    {id:'case-result',patient:'A',date:'Oct 12, 2026',topic:'Outside result review',metric:'result',source:'Other sources',record:'A-02',
      evidence:'Outside echocardiogram dated Oct 8, 2026: LVEF 50–55%.',
      encounter:'Signed note: no review or follow-up of the echocardiogram is shown in the available excerpt.',
      question:'Is there an unresolved opportunity to review or follow up on this available result?',
      action:'Review the report in context and document the appropriate next step.'},
    {id:'case-gap',patient:'A',date:'Oct 12, 2026',topic:'Preventive care opportunity',metric:'gap',source:'Compass',record:'A-03',
      evidence:'Colorectal cancer screening gap was available on Oct 8, 2026.',
      encounter:'Signed note: no screening action or valid reason is documented in the available excerpt. Review the complete chart for context.',
      question:'Was an eligible care gap left without appropriate action or a valid reason?',
      action:'Discuss the opportunity and document an appropriate action or valid reason.'},
    {id:'case-capture',patient:'B',date:'Oct 16, 2026',topic:'Supported diagnosis capture',metric:'capture',source:'Health Gorilla',record:'B-01',
      evidence:'Prior record dated Oct 6, 2026 notes heart failure. Confirm current clinical relevance.',
      encounter:'The signed note includes an assessment. The structured encounter diagnosis does not show the condition; determine whether it is reportable.',
      question:'Is a supported, reportable encounter diagnosis missing after clinical and coding review?',
      action:'Review the clinical documentation and follow the approved coding-correction process if appropriate.'},
    {id:'case-follow',patient:'B',date:'Oct 16, 2026',topic:'Provider-owned follow-up',metric:'follow',source:'Other sources',record:'B-02',
      evidence:'Outside laboratory report dated Oct 9, 2026: A1c 7.4%.',
      encounter:'The Oct 16 encounter established a provider-owned next step. Follow-up is due, with no completion or accepted handoff shown.',
      question:'Is a provider-owned due action incomplete without an accepted handoff?',
      action:'Confirm the responsible owner and complete or hand off the outstanding action.'}
  ];
  const defaultState = () => ({version:2, patient:'A', selectedCase:'case-condition', actions:{
    A:{condition:'pending',gap:'pending',result:'pending',follow:'not_applicable'},
    B:{condition:'documented',gap:'acted',result:'reviewed',follow:'completed'},
    C:{condition:'no_reportable',gap:'not_applicable',result:'unavailable',follow:'not_applicable'}},
    reviews:{'case-condition':'pending','case-result':'pending','case-gap':'confirmed','case-capture':'pending','case-follow':'pending'},
    discussed:{}, sentDemo:{A:false,B:false,C:false}, drafts:{A:{},B:{},C:{}}, enteredWeight:null, phqAnswer:null});
  const demoIntents = {
    A:{condition:{ckd:'Add diagnosis to athena'},lab:{egfr:'Confirm result'},result:{report:'Confirm result'},gap:{cologuard:'Order Cologuard',colonoscopy:'Order colonoscopy',fit:'Order FIT testing'},screen:{phq:'Complete question'},substance:{plan:'Assessment planned',needs:'Needs information'},bp:{reading:'Confirm reading'},kidney:{uacr:'Order uACR'},ckd_follow:{plan:'Plan kidney follow-up'},diabetes:{code:'Add diagnosis to athena'},dm_education:{refer:'Refer for diabetes education'},dm_follow:{plan:'Plan diabetes follow-up'},heart:{code:'Add diagnosis to athena'},hf_follow:{plan:'Plan heart follow-up'},hf_referral:{refer:'Refer to cardiology'},eye_gap:{eligibility:'Review eligibility'},eye_order:{exam:'Arrange eye exam'},kit:{eligibility:'Check kit eligibility'}},
    B:{condition:{heart_failure:'Confirm diagnosis'},result:{report:'Confirm result'},gap:{mammogram:'Order mammogram'},referral:{colon:'Arrange colonoscopy'}},
    C:{}
  };
  // These are illustrative mappings for a fictional visit, not claims about
  // any existing EHR integration or a completed clinical action.
  const intentDetails = {
    A:{condition:{ckd:{field:'Encounter diagnosis',value:'Chronic kidney disease, stage 3a',source:'Health Gorilla · prior record dated Oct 3, 2026'}},
      lab:{egfr:{field:'Outside laboratory result · eGFR',value:'54 mL/min/1.73 m²',source:'Health Gorilla · source record dated Oct 3, 2026'}},
      result:{report:{field:'Outside echocardiogram findings',value:'LVEF 50–55% · Grade I diastolic dysfunction',source:'Outside report · Oct 8, 2026'}},
      gap:{cologuard:{field:'Screening order',value:'Cologuard',source:'Compass · Oct 8, 2026'},colonoscopy:{field:'Screening order',value:'Colonoscopy',source:'Compass · Oct 8, 2026'},fit:{field:'Screening order',value:'FIT testing',source:'Compass · Oct 8, 2026'}}},
    B:{condition:{heart_failure:{field:'Encounter diagnosis',value:'Heart failure',source:'Health Gorilla · prior record dated Oct 6, 2026'}},
      result:{report:{field:'Outside laboratory result · Hemoglobin A1c',value:'7.4%',source:'Outside report · Oct 9, 2026'}},
      gap:{mammogram:{field:'Screening order',value:'Mammogram',source:'Compass · Oct 9, 2026'}}}
  };
  const allowedActions = {condition:['pending','documented','assessed_capture_pending','no_reportable','needs_info'],gap:['pending','acted','valid_reason','not_applicable','needs_info'],result:['pending','reviewed','no_action','unavailable','needs_info'],follow:['pending','completed','handoff','unavailable','not_applicable','needs_info']};
  function loadState(){
    const base=defaultState();
    try {
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || saved.version!==2) return base;
      if (patients[saved.patient]) base.patient=saved.patient;
      if (Number.isFinite(saved.enteredWeight) && saved.enteredWeight>=25 && saved.enteredWeight<=350) base.enteredWeight=saved.enteredWeight;
      if (['Not at all','Several days','More than half the days','Nearly every day','Patient declined'].includes(saved.phqAnswer)) base.phqAnswer=saved.phqAnswer;
      if (cases.some(c=>c.id===saved.selectedCase)) base.selectedCase=saved.selectedCase;
      for (const p of Object.keys(patients)) for (const kind of Object.keys(allowedActions)) {
        const value=saved.actions?.[p]?.[kind]; if (allowedActions[kind].includes(value)) base.actions[p][kind]=value;
      }
      // The separate follow-up for John duplicated the echocardiogram finding.
      // Retire that old demo item even when a visitor has a saved v2 state.
      base.actions.A.follow='not_applicable';
      // Jane's example is a completed historical action, not a current task.
      base.actions.B.follow='completed';
      for (const c of cases) {
        const value=saved.reviews?.[c.id]; if (['pending','confirmed','dismissed','needs_info'].includes(value)) base.reviews[c.id]=value;
        if (saved.discussed?.[c.id]===true) base.discussed[c.id]=true;
      }
      for (const p of Object.keys(patients)) base.sentDemo[p]=saved.sentDemo?.[p]===true;
      for (const p of Object.keys(patients)) for (const [kind,choices] of Object.entries(demoIntents[p])) {
        const value=saved.drafts?.[p]?.[kind]; if (Object.hasOwn(choices,value)) base.drafts[p][kind]=value;
      }
    } catch (_) { /* A private browser may not allow storage. */ }
    return base;
  }
  let state=loadState();
  function save(){try {localStorage.setItem(STORAGE_KEY,JSON.stringify(state));} catch (_) { /* State remains in memory for this visit. */ }}
  function patient(){return patients[state.patient];}
  function caseById(id){return cases.find(c=>c.id===id);}
  function caseState(c){return state.reviews[c.id] || 'pending';}
  function resolvedCount(status){return cases.filter(c=>caseState(c)===status).length;}
  function pendingCount(){return cases.filter(c=>['pending','needs_info'].includes(caseState(c))).length;}
  function statusChip(value,context='action'){
    const actionLabels={pending:['Awaiting review','amber'],documented:['Assessed & captured','green'],assessed_capture_pending:['Assessed · capture incomplete','amber'],no_reportable:['Reviewed · no diagnosis','green'],needs_info:['Needs information','amber'],acted:['Action documented','green'],valid_reason:['Valid reason documented','green'],not_applicable:['Not applicable','neutral'],reviewed:['Reviewed','green'],no_action:['Reviewed · no action needed','green'],unavailable:['Unavailable','neutral'],completed:['Completed','green'],handoff:['Accepted handoff','green']};
    const reviewLabels={pending:['Pending','amber'],confirmed:['Confirmed','green'],dismissed:['Dismissed','neutral'],needs_info:['Needs information','amber']};
    const labels=context==='review'?reviewLabels:actionLabels;
    const item=labels[value]||['Pending','amber'];return `<span class="chip ${item[1]}">${e(item[0])}</span>`;
  }
  function heading(eyebrow,title,subtitle,side=''){
    return `<div class="page-heading"><div><div class="eyebrow">${e(eyebrow)}</div><h1>${e(title)}</h1><p class="page-intro">${e(subtitle)}</p></div>${side?`<div class="heading-side">${icon('info')}${e(side)}</div>`:''}</div>`;
  }
  function patientSelector(){return `<div class="patient-select" role="group" aria-label="Select patient"><span class="patient-label">PATIENT</span>${Object.keys(patients).map(id=>`<button type="button" class="patient-pill ${state.patient===id?'selected':''}" data-patient="${id}" aria-pressed="${state.patient===id}">${e(patients[id].name)}</button>`).join('')}</div>`;}
  const clinicalCards={
    A:{condition:['Possible chronic kidney disease, stage 3a',''],result:['Echocardiogram available','LVEF 50–55% · Grade I diastolic dysfunction'],gap:['Colorectal cancer screening due',''],follow:['Discuss echocardiogram with patient','Due October 28 · Per care plan']},
    B:{condition:['Heart failure in prior record',''],result:['Hemoglobin A1c: 7.4%',''],gap:['Breast cancer screening',''],follow:['Follow-up completed','Provider-owned follow-up']},
    C:{condition:['Prior acute kidney injury','Resolved'],result:['No outside results available',''],gap:['No eligible care gap identified',''],follow:['No follow-up due','']}
  };
  function item(kind,sourceLabel,sourceName,evidenceId){
    const value=state.actions[state.patient][kind], unavailable=value==='unavailable'||value==='not_applicable';
    let [title,description]=clinicalCards[state.patient][kind];
    if(kind==='condition'&&state.patient!=='C'){
      const diagnosis=state.patient==='A'?'Chronic kidney disease, stage 3a':'Heart failure';
      if(value==='documented')title=diagnosis+' · assessed';
      if(value==='assessed_capture_pending')title=diagnosis+' · capture incomplete';
      if(value==='no_reportable')title=diagnosis+' history · no current reportable diagnosis';
    }
    if(kind==='gap'&&['acted','valid_reason'].includes(value))title=state.patient==='A'?'Colorectal cancer screening':'Breast cancer screening';
    if(kind==='follow'&&state.patient==='B')title=value==='completed'?'Follow-up completed':value==='handoff'?'Follow-up handed off':value==='needs_info'?'Follow-up needs information':'Follow-up';
    const proposedCode=kind==='condition'&&state.patient==='A'&&value==='pending'?'<span class="proposed-code">Proposed ICD-10 · N18.31</span>':'';
    const record=sourceName?(patient().evidence[sourceName]||[]).find(r=>r.id===evidenceId):null;
    const displaySource=sourceName==='Other sources'?'Outside report':sourceName;
    const cq3=kind==='condition'?(patient().evidence.CQ3||[])[0]:null;
    const resolved=(kind==='condition'&&['documented','no_reportable'].includes(value))||(kind==='gap'&&['acted','valid_reason'].includes(value))||(kind==='result'&&['reviewed','no_action'].includes(value))||(kind==='follow'&&['completed','handoff'].includes(value));
    const choices=resolved?{}:(demoIntents[state.patient]?.[kind]||{});
    const staged=state.drafts[state.patient]?.[kind], stagedLabel=choices[staged];
    const choiceButtons=!unavailable?Object.entries(choices).map(([id,label],i)=>`<button type="button" class="clinical-action ${kind==='condition'&&i===0?'primary-action':''} ${staged===id?'is-selected':''}" data-action="stage-intent" data-kind="${e(kind)}" data-intent="${e(id)}" aria-pressed="${staged===id}">${e(label)}${staged===id?' ✓':''}</button>`).join(''):'';
    // The outside lab is a separate, structured data item from the proposed
    // diagnosis. Choosing one must never imply that the other was sent.
    const labChoice=kind==='condition'&&state.patient==='A'?demoIntents.A.lab.egfr:'';
    const labStaged=kind==='condition'&&state.patient==='A'&&state.drafts.A.lab==='egfr';
    const egfrEvidence=labChoice&&record?`<section class="support-evidence" aria-label="Supporting eGFR result"><div class="support-evidence-main"><h4>eGFR</h4><span class="support-evidence-value">54 mL/min/1.73 m²</span></div><div class="support-evidence-footer"><button type="button" class="text-button" data-action="source" data-source="${e(sourceName)}" data-focus="${e(evidenceId)}">${icon('link')} ${e(displaySource)} · record ${e(record.date)}</button><button type="button" class="evidence-action ${labStaged?'is-selected':''}" data-action="stage-intent" data-kind="lab" data-intent="egfr" aria-label="Confirm eGFR result" aria-pressed="${labStaged}">Confirm result ${labStaged?icon('check'):icon('arrow')}</button></div><div class="support-previous"><strong>Prior eGFR</strong> 58 mL/min/1.73 m² <button type="button" class="text-button" data-action="source" data-source="Health Gorilla" data-focus="A-05">${icon('link')} Record Jun 3, 2026</button></div><div class="support-previous"><strong>uACR</strong> Not available</div></section>`:'';
    const gapPath=kind==='gap'&&state.patient==='A'?`<div class="care-path"><span>${stagedLabel?'Order selected':'Order status unknown'}</span><span>Result unavailable</span><span>Reporting unknown</span></div><div class="kit-line">Kit eligibility unknown ${quickButton('kit','eligibility','Check kit eligibility')}</div>`:'';
    const next=kind==='condition'&&state.patient==='A'&&!resolved?`<div class="care-actions-label">Suggested actions</div><div class="clinical-actions">${quickButton('kidney','uacr','Order uACR')}${quickButton('ckd_follow','plan','Plan kidney follow-up')}</div>`:'';
    return `<div class="opportunity"><span class="opportunity-icon">${icon(kind==='condition'?'file':kind==='gap'?'check':kind==='result'?'link':'clock')}</span><div><h3>${e(title)}</h3>${proposedCode}${description?`<p>${e(description)}</p>`:''}<div class="opportunity-meta">${sourceName&&record&&!egfrEvidence?`<button type="button" class="text-button" data-action="source" data-source="${e(sourceName)}" data-focus="${e(evidenceId)}">${icon('link')} ${e(displaySource)} · ${e(record.date)}</button>`:!egfrEvidence?`<span class="muted">${e(sourceLabel)}</span>`:''}${cq3?`<button type="button" class="text-button" data-action="source" data-source="CQ3" data-focus="${e(cq3.id)}">${icon('link')} CQ3 · ${e(cq3.date)}</button>`:''}</div>${egfrEvidence}${gapPath}${choiceButtons?`<div class="clinical-actions">${choiceButtons}</div>`:''}${next}</div><div class="opportunity-action">${stagedLabel?'<span class="chip blue">Selected</span>':statusChip(value)}</div></div>`;
  }
  function quickButton(kind,intent,label,primary=false,accessibleLabel=''){
    const selected=state.drafts[state.patient]?.[kind]===intent;
    return `<button type="button" class="clinical-action ${primary?'primary-action':''} ${selected?'is-selected':''}" data-action="stage-intent" data-kind="${e(kind)}" data-intent="${e(intent)}" ${accessibleLabel?`aria-label="${e(accessibleLabel)}"`:''} aria-pressed="${selected}">${e(label)}${selected?' ✓':''}</button>`;
  }
  function evidenceLink(source,id,label){
    return `<button type="button" class="text-button" data-action="source" data-source="${e(source)}" data-focus="${e(id)}">${icon('link')} ${e(label)}</button>`;
  }
  function additionalSuspects(){
    if(state.patient!=='A')return '';
    const diabetesSelected=state.drafts.A.diabetes==='code', heartSelected=state.drafts.A.heart==='code';
    return `<div class="opportunity"><span class="opportunity-icon">${icon('file')}</span><div><h3>Possible diabetes</h3><section class="support-evidence" aria-label="Supporting diabetes evidence"><div class="support-previous"><strong>A1c</strong> 7.2% ${evidenceLink('athena','A-09','athena · Oct 15, 2026')}</div><div class="support-previous"><strong>Medication</strong> Metformin · indication unconfirmed ${evidenceLink('athena','A-08','athena · Oct 25, 2026')}</div><div class="support-previous"><strong>Review opportunity</strong> ${evidenceLink('CQ3','A-10','CQ3 · Oct 18, 2026')}</div></section><div class="clinical-actions">${quickButton('diabetes','code','Add diagnosis to athena',true,'Add possible diabetes diagnosis to athena')}</div><div class="care-actions-label">Suggested actions</div><div class="clinical-actions">${quickButton('dm_education','refer','Refer for diabetes education')}${quickButton('dm_follow','plan','Plan diabetes follow-up')}</div></div><div class="opportunity-action"><span class="chip ${diabetesSelected?'blue':'amber'}">${diabetesSelected?'Selected':'Awaiting review'}</span></div></div>
      <div class="opportunity"><span class="opportunity-icon">${icon('file')}</span><div><h3>Possible heart failure</h3><section class="support-evidence" aria-label="Supporting heart failure evidence"><div class="support-previous"><strong>Prior note</strong> Possible heart failure ${evidenceLink('Health Gorilla','A-13','Health Gorilla · Oct 20, 2026')}</div><div class="support-previous"><strong>Echo</strong> LVEF 50–55% · Grade I diastolic dysfunction ${evidenceLink('Other sources','A-02','Outside report · Oct 8, 2026')}</div><div class="support-previous"><strong>Medication</strong> Furosemide · indication unconfirmed ${evidenceLink('athena','A-08','athena · Oct 25, 2026')}</div><div class="support-previous"><strong>Review opportunity</strong> ${evidenceLink('CQ3','A-14','CQ3 · Oct 21, 2026')}</div></section><div class="clinical-actions">${quickButton('heart','code','Add diagnosis to athena',true,'Add possible heart failure diagnosis to athena')}</div><div class="care-actions-label">Suggested actions</div><div class="clinical-actions">${quickButton('result','report','Confirm echo result')}${quickButton('hf_referral','refer','Refer to cardiology')}${quickButton('hf_follow','plan','Plan heart follow-up')}</div></div><div class="opportunity-action"><span class="chip ${heartSelected?'blue':'amber'}">${heartSelected?'Selected':'Awaiting review'}</span></div></div>`;
  }
  function additionalGap(){
    if(state.patient!=='A')return '';
    const selected=state.drafts.A.eye_gap||state.drafts.A.eye_order;
    return `<div class="opportunity"><span class="opportunity-icon">${icon('check')}</span><div><h3>Possible diabetes eye exam gap</h3><p>Exam not found · eligibility unconfirmed</p><div class="opportunity-meta">${evidenceLink('Compass','A-12','Compass · Oct 8, 2026')}</div><div class="clinical-actions">${quickButton('eye_gap','eligibility','Review eligibility')}${quickButton('eye_order','exam','Arrange eye exam')}</div></div><div class="opportunity-action"><span class="chip ${selected?'blue':'amber'}">${selected?'Selected':'Review eligibility'}</span></div></div>`;
  }
  let visitDetailsOpen=false;
  function bloodPressurePriority(){
    if(state.patient!=='A')return '';
    return `<div class="opportunity"><span class="opportunity-icon">${icon('chart')}</span><div><h3>Blood pressure · 134/78 mmHg</h3><div class="opportunity-meta"><button type="button" class="text-button" data-action="source" data-source="Other sources" data-focus="A-07">${icon('link')} Visit reading · Oct 28, 2026</button></div><p>Control not evaluated · payer status unknown</p><div class="clinical-actions">${quickButton('bp','reading','Confirm reading')}</div></div><div class="opportunity-action">${state.drafts.A.bp?'<span class="chip blue">Selected</span>':'<span class="chip neutral">Reading available</span>'}</div></div>`;
  }
  function visitDetails(){
    if(state.patient!=='A')return '';
    const weight=state.enteredWeight, bmi=weight==null?'':(weight/(1.75*1.75)).toFixed(1);
    return `<details class="compact-visit-section" id="visit-details" ${visitDetailsOpen?'open':''}><summary>Screeners &amp; measurements <span>View details</span></summary><div class="opportunity"><span class="opportunity-icon">${icon('review')}</span><div><h3>${state.phqAnswer==='Patient declined'?'PHQ-2 · patient declined':state.phqAnswer?'PHQ-2 · answer selected':'PHQ-2 · one answer missing'}</h3>${state.phqAnswer?`<p>${e(state.phqAnswer)} · pending documentation</p>`:''}<div class="opportunity-meta"><button type="button" class="text-button" data-action="source" data-source="Other sources" data-focus="A-06">${icon('link')} Visit intake · Oct 28, 2026</button></div><div class="clinical-actions"><button type="button" class="clinical-action ${state.phqAnswer?'is-selected':''}" data-action="phq-entry">${state.phqAnswer?'Edit answer':'Complete question'}</button></div></div><div class="opportunity-action">${state.phqAnswer==='Patient declined'?'<span class="chip neutral">Declined</span>':state.phqAnswer?'<span class="chip blue">Selected</span>':'<span class="chip amber">Incomplete</span>'}</div></div>
      <div class="opportunity"><span class="opportunity-icon">${icon('review')}</span><div><h3>TAPS-1 · positive screen</h3><div class="opportunity-meta"><button type="button" class="text-button" data-action="source" data-source="Other sources" data-focus="A-06">${icon('link')} Visit intake · Oct 28, 2026</button></div><div class="clinical-actions"><button type="button" class="clinical-action ${state.drafts.A.substance?'is-selected':''}" data-action="taps-entry">${state.drafts.A.substance?'Review assessment':'Open assessment'}</button></div></div><div class="opportunity-action">${state.drafts.A.substance?'<span class="chip blue">Selected</span>':'<span class="chip amber">Assessment due</span>'}</div></div><div class="opportunity"><span class="opportunity-icon">${icon('chart')}</span><div><h3>Height &amp; weight</h3><p>Height 175 cm · Oct 28, 2026</p><button type="button" class="text-button" data-action="source" data-source="Other sources" data-focus="A-07">${icon('link')} Visit measurements</button><p>${weight==null?'Weight unavailable':`Weight ${e(weight.toFixed(1))} kg · entered · BMI ${e(bmi)}`}</p><div class="clinical-actions"><button type="button" class="clinical-action ${weight!=null?'is-selected':''}" data-action="weight-entry">${weight==null?'Enter weight':'Edit weight'}</button></div></div><div class="opportunity-action">${weight==null?'<span class="chip neutral">Weight unavailable</span>':'<span class="chip blue">Entered</span>'}</div></div></details>`;
  }
  function referralPriority(){
    if(state.patient!=='B')return '';
    const selected=state.drafts.B.referral==='colon';
    return `<div class="opportunity"><span class="opportunity-icon">${icon('clock')}</span><div><h3>Abnormal colorectal screening result</h3><p>Colonoscopy completion unknown · Owner: Avery Morgan, NP</p><div class="opportunity-meta"><button type="button" class="text-button" data-action="source" data-source="Compass" data-focus="B-05">${icon('link')} Compass · Oct 5, 2026</button></div><div class="care-path"><span>Result received</span><span>${selected?'Referral selected':'Referral status unknown'}</span><span>Completion unknown</span><span>Reporting unknown</span></div><div class="clinical-actions">${quickButton('referral','colon','Arrange colonoscopy')}</div></div><div class="opportunity-action"><span class="chip ${selected?'blue':'amber'}">${selected?'Selected':'Follow-up needed'}</span></div></div>`;
  }
  function patientPage(){
    const p=patient(), a=state.actions[state.patient];
    const pending=['condition','result','gap'].filter(kind=>['pending','needs_info','assessed_capture_pending'].includes(a[kind])).length+(state.patient==='A'?6:state.patient==='B'?1:0);
    const availableResults=a.result==='unavailable'?'No report available':'Outside report';
    const gapContext=a.gap==='not_applicable'?'No eligible open gap':['acted','valid_reason'].includes(a.gap)?'Disposition recorded':a.gap==='needs_info'?'Additional information needed':'Eligibility review';
    return `${heading('POINT OF CARE','Patient dashboard','',`${p.visit} · ${p.context}`)}
      <div class="page-heading" style="margin-bottom:15px">${patientSelector()}<div class="heading-side">${icon('clock')} ${e(p.visit)}</div></div>
      <div class="grid-main"><div class="card"><div class="patient-card-head"><div class="patient-avatar">${e(p.initials)}</div><div><h2>${e(p.name)}</h2><p>${e(p.age)} · ${e(p.provider)} · ${e(p.context)} · ${e(p.visit)}</p></div><span class="chip blue">Today’s visit</span></div>
      <div class="opportunity-list"><div class="worklist-heading"><h2>${state.patient==='A'?'Suspected diagnoses':'Conditions & clinical evidence'}</h2></div>${item('condition','Prior record','Health Gorilla',`${state.patient}-01`)}${additionalSuspects()}${state.patient==='A'?'':item('result',availableResults,a.result==='unavailable'?'':'Other sources',`${state.patient}-02`)}
      <div class="worklist-heading"><h2>Care gaps &amp; follow-up</h2></div>${item('gap',gapContext,a.gap==='not_applicable'?'':'Compass',`${state.patient}-03`)}${additionalGap()}${referralPriority()}${bloodPressurePriority()}${visitDetails()}</div></div>
      <div class="stack"><div class="card next-steps"><div class="section-head"><div><h2>Visit overview</h2><p>${e(p.visit)} · ${e(p.provider)}</p></div><span class="section-icon">${icon('people')}</span></div>
      ${state.patient==='A'?'':`<div class="next-step-item">${icon('clock')}<div><strong>Vitals</strong><p>${e(p.vitals)}</p></div></div>`}
      <div class="next-step-item">${icon('check')}<div><strong>Pending documentation</strong><p>${pending} ${pending===1?'item':'items'}</p></div></div>
      <button type="button" class="secondary" data-page="huddle">View today’s schedule ${icon('arrow')}</button></div></div></div>`;
  }
  function huddleIndicators(id){
    const a=state.actions[id];
    const conditionName={A:'Possible CKD 3a',B:'Possible heart failure',C:'Prior AKI'}[id];
    const gapName={A:'Colorectal screening',B:'Breast screening',C:'Care gaps'}[id];
    const resultName={A:'Echocardiogram',B:'A1c 7.4%',C:'Outside results'}[id];
    let condition=[`${conditionName} · review`,'blue'];
    if (a.condition==='documented') condition=[`${id==='B'?'Heart failure':conditionName} · assessed`,'green'];
    if (a.condition==='no_reportable') condition=[`${conditionName} · no current diagnosis`,'neutral'];
    if (a.condition==='assessed_capture_pending') condition=[`${conditionName} · capture incomplete`,'amber'];
    if (a.condition==='needs_info') condition=[`${conditionName} · needs information`,'amber'];
    let gap=[`${gapName} · due`,'blue'];
    if (a.gap==='acted') gap=[`${gapName} · action documented`,'green'];
    if (a.gap==='valid_reason') gap=[`${gapName} · valid reason documented`,'green'];
    if (a.gap==='not_applicable') gap=['No eligible care gap','neutral'];
    if (a.gap==='needs_info') gap=[`${gapName} · needs information`,'amber'];
    let result=[`${resultName} · review`,'blue'];
    if (['reviewed','no_action'].includes(a.result)) result=[`${resultName} · reviewed`,'green'];
    if (a.result==='unavailable') result=['No outside result available','neutral'];
    if (a.result==='needs_info') result=[`${resultName} · needs information`,'amber'];
    const additional=id==='A'?[['Possible diabetes · review','blue'],['Possible heart failure · review','blue'],['Eye exam · eligibility unknown','amber']]:id==='B'?[['Abnormal result · follow-up','amber']]:[];
    return [condition,gap,result,...additional].map(([label,color])=>`<span class="chip ${color}">${e(label)}</span>`).join('');
  }
  function huddlePage(){
    const slots={A:'9:00 AM',B:'10:00 AM',C:'11:00 AM'};
    const rows=Object.keys(patients).map(id=>{
      const p=patients[id];
      return `<article class="huddle-row"><div class="huddle-person"><div class="patient-avatar">${e(p.initials)}</div><div><h3>${e(p.name)}</h3><p>${e(slots[id])} · ${e(p.age)} · Office visit</p></div></div><div class="huddle-context"><div class="mini-heading">VISIT PRIORITIES</div><div class="huddle-badges">${huddleIndicators(id)}</div></div><button type="button" class="secondary huddle-open" data-huddle-patient="${e(id)}" aria-label="Open ${e(p.name)} dashboard">Open patient ${icon('arrow')}</button></article>`;
    }).join('');
    return `${heading('BEFORE THE VISIT','Pre-visit huddle','Today’s appointments and visit priorities.','October 28, 2026')}
      <div class="card huddle-card"><div class="section-head"><div><div class="section-title"><span class="section-icon">${icon('people')}</span><h2>Today’s schedule</h2></div><p>Avery Morgan, NP · October 28, 2026</p></div><span class="chip blue">3 appointments</span></div><div class="huddle-list">${rows}</div></div>`;
  }
  function qualityMetrics(){
    // Current-visit progress only. Selected historical chart reviews never
    // enter these counts. Unknown or unavailable opportunities are excluded.
    const rows=Object.fromEntries(['condition','capture','gap','result','follow'].map(id=>[id,{numerator:0,denominator:0,pending:0,excluded:0}]));
    for (const id of Object.keys(patients)) {
      const a=state.actions[id],p=patients[id];
      if (!p.evidence['Health Gorilla'].length || a.condition==='needs_info') rows.condition.excluded++;
      else {rows.condition.denominator++;if (['documented','assessed_capture_pending','no_reportable'].includes(a.condition)) rows.condition.numerator++;else rows.condition.pending++;}
      // Only explicitly clinician-confirmed reportable opportunities count.
      // A captured opportunity represents both signed documentation and the
      // structured encounter diagnosis in this fictional example.
      if (['documented','assessed_capture_pending'].includes(a.condition)) {rows.capture.denominator++;if (a.condition==='documented') rows.capture.numerator++;else rows.capture.pending++;}
      else if (['pending','needs_info'].includes(a.condition)) rows.capture.excluded++;
      if (a.gap==='needs_info') rows.gap.excluded++;
      else if (a.gap!=='not_applicable' && p.evidence.Compass.length) {rows.gap.denominator++;if (['acted','valid_reason'].includes(a.gap)) rows.gap.numerator++;else rows.gap.pending++;}
      if (a.result==='unavailable'||a.result==='needs_info'||!p.evidence['Other sources'].length) rows.result.excluded++;
      else {rows.result.denominator++;if (['reviewed','no_action'].includes(a.result)) rows.result.numerator++;else rows.result.pending++;}
      if (a.follow==='unavailable'||a.follow==='needs_info') rows.follow.excluded++;
      else if (a.follow!=='not_applicable') {rows.follow.denominator++;if (['completed','handoff'].includes(a.follow)) rows.follow.numerator++;else rows.follow.pending++;}
    }
    // Two additional, clinically unconfirmed opportunities are visible for
    // John. Selecting a proposed diagnosis does not complete either review.
    rows.condition.denominator+=2;
    rows.condition.pending+=2;
    // The additional eye-exam opportunity has unconfirmed eligibility.
    rows.gap.excluded+=1;
    rows.phq={numerator:0,denominator:1,pending:1,excluded:2};
    rows.taps={numerator:1,denominator:1,pending:0,excluded:2};
    rows.measurements={numerator:0,denominator:1,pending:1,excluded:2};
    rows.bp={numerator:3,denominator:3,pending:0,excluded:0};
    rows.colonfollow={numerator:0,denominator:1,pending:1,excluded:2};
    return rows;
  }
  const metricDetails=[
    {id:'condition',name:'Relevant conditions addressed',detail:'Documented assessment or disposition / relevant conditions available for the visit.'},
    {id:'capture',name:'Supported diagnosis capture',detail:'Signed note and structured encounter diagnosis / clinician-confirmed reportable opportunities. HCCs where applicable.'},
    {id:'gap',name:'Care gaps addressed',detail:'Appropriate action or valid reason / source-identified eligible gaps.'},
    {id:'result',name:'Selected outside results reviewed',detail:'Reviewed with a disposition / selected index results; supporting labs excluded.'},
    {id:'colonfollow',name:'Abnormal colorectal result follow-up',detail:'Completed follow-up / known results requiring follow-up.'},
    {id:'bp',name:'Visit BP reading available',detail:'Dated visit reading / visits shown; control and payer status assessed separately.'},
    {id:'follow',name:'Provider-owned follow-up completed',detail:'Completed or accepted handoff / known provider-owned actions due.'},
    {id:'measurements',name:'Height and weight documented',detail:'Both current encounter measurements / eligible visits with known measurement status.'},
    {id:'phq',name:'PHQ-2 completed',detail:'Complete documented screener / eligible visits with known screener status.'},
    {id:'taps',name:'TAPS-1 completed',detail:'Complete documented screener / eligible visits with known screener status.'}
  ];
  function metricTable(){const metrics=qualityMetrics();return `<table class="metric-table"><thead><tr><th scope="col">Measure</th><th scope="col">Completed / eligible</th></tr></thead><tbody>${metricDetails.map(m=>{const v=metrics[m.id];const note=[v.pending?`${v.pending} pending`:'',v.excluded?`${v.excluded} unavailable or unknown excluded`:''].filter(Boolean).join(' · ');return `<tr><td><div class="metric-name">${e(m.name)}</div><div class="metric-detail">${e(m.detail)}</div></td><td><div class="metric-fraction">${v.denominator?`${v.numerator} / ${v.denominator}`:'N/A'}</div><div class="unscored">${e(note||(!v.denominator?'No evaluable opportunities':''))}</div></td></tr>`;}).join('')}</tbody></table>`;}
  function qualityPage(){
    const confirmed=resolvedCount('confirmed'), dismissed=resolvedCount('dismissed'), pending=pendingCount();
    return `${heading('QUALITY & PERFORMANCE','Provider scorecard','October 2026 · Avery Morgan, NP','Reporting period: October 1–31')}
      <div class="quality-layout"><div class="card card-pad"><div class="section-head"><div><div class="section-title"><span class="section-icon">${icon('chart')}</span><h2>Care delivery measures</h2></div><p>Current visit activity · October 2026</p></div><span class="chip blue">Monthly</span></div>${metricTable()}
      <div class="method-note">${icon('info')}<span>${Object.values(state.drafts).reduce((n,d)=>n+Object.keys(d).length,0)+(state.enteredWeight!=null?1:0)} selected items pending documentation. Known opportunities only; care-gap eligibility is source-identified and requires clinical review. Pending actions are not confirmed deficiencies. Missing or unknown information is excluded. Condition capture requires clinical support and a structured encounter diagnosis; care-gap action does not establish payer closure.</span></div></div>
      <div class="stack"><div class="card card-pad side-section"><div><h2>Physician review</h2><p>APP encounters · separate from visit measures</p></div><ul class="definition-list"><li><strong>${confirmed} confirmed</strong>Reviewed opportunities for feedback</li><li><strong>${dismissed} dismissed</strong>No improvement finding</li><li><strong>${pending} pending</strong>Awaiting review or additional information</li></ul><button class="secondary" type="button" data-page="review">Review APP encounters ${icon('arrow')}</button></div><div class="card next-steps"><h2>Provider feedback</h2><p>Review confirmed examples and follow-up discussions.</p><button class="secondary" type="button" data-page="feedback">View feedback ${icon('arrow')}</button></div></div></div>`;
  }
  function caseTitle(c){return {'case-condition':'CKD 3a assessment','case-result':'Echocardiogram review','case-gap':'Colorectal cancer screening','case-capture':'Heart failure diagnosis capture','case-follow':'A1c follow-up'}[c.id] || c.topic;}
  function queueItem(c){const s=caseState(c);return `<button type="button" class="queue-item ${state.selectedCase===c.id?'selected':''}" data-case="${e(c.id)}" aria-pressed="${state.selectedCase===c.id}"><span class="queue-item-top"><strong>${e(caseTitle(c))}</strong>${statusChip(s,'review')}</span><p>${e(patients[c.patient].name)} · ${e(c.date)}<br>Avery Morgan, NP</p></button>`;}
  function caseDetail(c){const status=caseState(c);let outcome='Awaiting physician review.';
    if(status==='confirmed') outcome='Confirmed for provider feedback.';
    if(status==='dismissed') outcome='Dismissed; no improvement finding recorded.';
    if(status==='needs_info') outcome='Awaiting additional information.';
    return `<div class="card case-detail"><div class="case-kicker"><span class="chip blue">${e(patients[c.patient].name)}</span><span class="chip">Encounter · ${e(c.date)}</span>${statusChip(status,'review')}</div><h2>${e(caseTitle(c))}</h2><p class="case-intro">APP: Avery Morgan, NP · Reviewer: Supervising physician</p>
      <div class="evidence-grid"><div class="evidence-box"><div class="mini-heading">SOURCE RECORD · ${e(c.source)}</div><strong>Available before encounter</strong><p>${e(c.evidence)}</p><button type="button" class="text-button" data-action="source" data-source="${e(c.source)}" data-patient-id="${e(c.patient)}" data-focus="${e(c.record)}">View source ${icon('arrow')}</button></div><div class="evidence-box"><div class="mini-heading">${c.metric==='follow'?'ENCOUNTER & FOLLOW-UP':'ENCOUNTER NOTE'} · ${e(c.date.toUpperCase())}</div><strong>Chart documentation</strong><p>${e(c.encounter)}</p></div></div>
      <div class="decision-block"><h3>${e(c.question)}</h3><div class="decision-buttons"><button type="button" class="decision-button confirmed ${status==='confirmed'?'selected':''}" data-action="decision" data-value="confirmed" aria-pressed="${status==='confirmed'}">Confirm opportunity</button><button type="button" class="decision-button dismissed ${status==='dismissed'?'selected':''}" data-action="decision" data-value="dismissed" aria-pressed="${status==='dismissed'}">Dismiss</button><button type="button" class="decision-button ${status==='needs_info'?'selected':''}" data-action="decision" data-value="needs_info" aria-pressed="${status==='needs_info'}">Needs information</button></div><div class="case-outcome"><strong>Review status:</strong> ${e(outcome)}${status==='confirmed'?`<br><strong>Recommended next step:</strong> ${e(c.action)}`:''}</div></div>
      <div class="right-link"><button type="button" class="text-button" data-page="feedback">Provider feedback ${icon('arrow')}</button></div></div>`;
  }
  function reviewPage(){const c=caseById(state.selectedCase)||cases[0];return `${heading('PHYSICIAN OVERSIGHT','Physician review','APP encounters · October 2026','Supervising physician')}
    <div class="review-layout"><div class="card queue-card"><div class="section-head"><div><h2>APP review queue</h2><p>Selected encounters</p></div><span class="chip amber">${pendingCount()} pending</span></div><div class="queue-list">${cases.map(queueItem).join('')}</div></div>${caseDetail(c)}</div>`;}
  function feedbackPage(){const confirmed=cases.filter(c=>caseState(c)==='confirmed'), dismissed=cases.filter(c=>caseState(c)==='dismissed'), awaiting=pendingCount();
    const feedback=confirmed.length?confirmed.map(c=>`<article class="feedback-item"><div class="feedback-item-top"><div><h3>${e(caseTitle(c))}</h3><p>${e(patients[c.patient].name)} · ${e(c.date)} encounter · ${e(c.source)}</p></div>${statusChip('confirmed','review')}</div><p>${e(c.action)}</p><div class="feedback-meta"><button type="button" class="small-button ${state.discussed[c.id]?'green':''}" data-action="discuss" data-case-id="${e(c.id)}">${state.discussed[c.id]?'Discussed with provider':'Mark discussed'}</button><button type="button" class="text-button" data-case="${e(c.id)}" data-page="review">View APP review ${icon('arrow')}</button></div></article>`).join(''):`<div class="empty-state"><strong>No confirmed opportunities</strong></div>`;
    return `${heading('PROVIDER DEVELOPMENT','Provider feedback','Avery Morgan, NP · Weekly review','October 2026')}
      <div class="feedback-grid"><div class="card card-pad"><div class="section-head"><div><div class="section-title"><span class="section-icon">${icon('message')}</span><h2>Reviewed opportunities</h2></div><p>Physician-confirmed findings</p></div><span class="chip green">${confirmed.length} confirmed</span></div>${feedback}</div>
      <div class="stack"><div class="card card-pad side-section"><div><h2>Review summary</h2><p>Selected encounters</p></div><ul class="definition-list"><li><strong>${confirmed.length} confirmed</strong>Included in feedback</li><li><strong>${dismissed.length} dismissed</strong>No improvement finding</li><li><strong>${awaiting} pending</strong>Awaiting review or information</li></ul></div><div class="card next-steps"><h2>Monthly scorecard</h2><p>Review current visit measures and chart review activity.</p><button type="button" class="secondary" data-page="quality">Open scorecard ${icon('arrow')}</button></div></div></div>`;
  }
  function flowPage(){const steps=[['Pre-visit huddle','Identify relevant records, care gaps and follow-up before the visit.'],['Patient dashboard','Review information and record the appropriate care action.'],['Clinical review','Review selected encounters and confirm or dismiss opportunities.'],['Provider scorecard','Track visit measures alongside selected chart reviews.'],['Provider feedback','Discuss confirmed opportunities and follow up.']];return `${heading('CARE OPERATIONS','Care overview','Information, clinical action and quality review in one workflow.')}
      <div class="card card-pad"><div class="section-head"><div><h2>Care workflow</h2><p>At a glance</p></div></div><div class="flow-grid">${steps.map((s,i)=>`<div class="flow-step"><span class="flow-index">${i+1}</span><div><strong>${e(s[0])}</strong><p>${e(s[1])}</p></div></div>`).join('')}</div></div><div style="margin-top:18px"><button class="primary" type="button" data-page="huddle">Open pre-visit huddle ${icon('arrow')}</button></div>`;}
  const renderers={huddle:huddlePage,patient:patientPage,review:reviewPage,quality:qualityPage,feedback:feedbackPage,flow:flowPage};
  let currentPage=sections.includes(location.hash.slice(1))?location.hash.slice(1):'patient';
  function render(message){
    document.getElementById('breadcrumb-current').textContent=titles[currentPage];
    for(const button of document.querySelectorAll('.nav-item')){const active=button.dataset.page===currentPage;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');}
    document.getElementById('queue-count').textContent=String(pendingCount());
    pageEl.innerHTML=renderers[currentPage]();
    if(message){notice.textContent=message;notice.hidden=false;}else{notice.hidden=true;notice.textContent='';}
  }
  function navigate(page){if(!sections.includes(page))return;currentPage=page;history.replaceState(null,'',`#${page}`);render();window.scrollTo({top:0,behavior:'auto'});document.getElementById('main-content').focus({preventScroll:true});}
  function modalShell(title,body){modalBody.innerHTML=`<div class="modal-card"><div class="modal-header"><div><div class="eyebrow">PATIENT RECORD</div><h2 id="modal-title">${e(title)}</h2></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close">${icon('close')}</button></div>${body}</div>`;if(!modal.open)modal.showModal();}
  function showSource(source,id,focus){
    if(!sourceNames.includes(source))return;const p=patients[id]||patient(),records=p.evidence[source]||[];
    const display=focus?records.filter(r=>r.id===focus):records;
    const list=display.length?display.map(r=>`<div class="modal-source"><strong>${e(r.title)}</strong><p>${e(r.detail)}</p><small>${e(source)} · ${e(r.date)} · ${e(p.name)}</small></div>`).join(''):'<div class="empty-state"><strong>No record available</strong></div>';
    modalShell('Source record',`${list}<div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Close</button></div>`);
  }
  const options={
    condition:{title:'Condition review',intro:'Select the clinical disposition.',items:[['documented','Supported diagnosis documented','Assessment and structured encounter diagnosis documented.'],['assessed_capture_pending','Assessment documented; capture incomplete','Assessment documented; the structured encounter diagnosis is missing.'],['no_reportable','No reportable diagnosis','Reviewed; a current reportable diagnosis is not supported.'],['needs_info','More information needed','Review is pending additional information.']]},
    gap:{title:'Care gap review',intro:'Select the appropriate disposition.',items:[['acted','Appropriate action documented','A next step is documented; payer closure may require separate confirmation.'],['valid_reason','Valid reason documented','An appropriate reason for no action is documented.'],['needs_info','More information needed','Review is pending additional information.']]},
    result:{title:'Outside result review',intro:'Select the appropriate disposition.',items:[['reviewed','Reviewed; follow-up planned','Documented review and next step.'],['no_action','Reviewed; no action needed','Documented review; no additional action indicated.'],['needs_info','More information needed','Review is pending additional information.']]},
    follow:{title:'Follow-up',intro:'Select the outcome.',items:[['completed','Action completed','The provider-owned action is complete.'],['handoff','Accepted handoff','The appropriate owner accepted the handoff.'],['needs_info','More information needed','Outcome remains pending.']]}
  };
  function showOutcome(kind){const o=options[kind];if(!o)return;modalShell(o.title,`<p class="modal-body-copy">${e(o.intro)}</p><div class="modal-options">${o.items.map(x=>`<button type="button" class="modal-option" data-action="set-outcome" data-kind="${e(kind)}" data-value="${e(x[0])}"><strong>${e(x[1])}</strong><span>${e(x[2])}</span></button>`).join('')}</div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancel</button></div>`);}
  function showQuickOutcome(kind,value){
    if(!['result','follow'].includes(kind))return;const option=options[kind]?.items.find(x=>x[0]===value);if(!option)return;
    modalShell(option[1],`<p class="modal-body-copy">${e(patient().name)} · ${e(option[2])}</p><div class="modal-source"><strong>Simulation only</strong><p>This updates the fictional demo. No information is sent to an EHR.</p></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancel</button><button type="button" class="primary" data-action="set-outcome" data-kind="${e(kind)}" data-value="${e(value)}">Confirm</button></div>`);
  }
  function showIntent(kind,intent){
    const label=demoIntents[state.patient]?.[kind]?.[intent];if(!label)return;
    const detail=intentDetails[state.patient]?.[kind]?.[intent];if(!detail)return;
    const guidance=kind==='condition'?'Confirm that the diagnosis is clinically appropriate.':kind==='lab'||kind==='result'?'Review the outside result before adding it to the chart.':'Confirm the screening choice is clinically appropriate.';
    modalShell(label,`<p class="modal-body-copy">${e(patient().name)} · ${e(patient().visit)} encounter</p><div class="modal-source"><small>PROPOSED STRUCTURED FIELD</small><strong>${e(detail.field)}</strong><p>${e(detail.value)}</p><small>Source: ${e(detail.source)}</small></div><p class="modal-body-copy">${e(guidance)}</p><div class="modal-source"><strong>Simulation only</strong><p>Nothing is sent or ordered. The field mapping and EHR connection would need validation; this selection does not complete a quality measure.</p></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancel</button><button type="button" class="primary" data-action="confirm-intent" data-kind="${e(kind)}" data-intent="${e(intent)}">Confirm simulation</button></div>`);
  }
  function showWriteback(){const a=state.actions[state.patient];const entries=[];if(['documented','assessed_capture_pending','no_reportable'].includes(a.condition))entries.push('Condition review');if(['acted','valid_reason'].includes(a.gap))entries.push('Care-gap disposition');if(['reviewed','no_action'].includes(a.result))entries.push('Outside-result review');if(['completed','handoff'].includes(a.follow))entries.push('Follow-up outcome');
    modalShell('Simulate a future write-back',`<p class="modal-body-copy">Information comes into the independent dashboard first. In a future design, selected information could potentially be sent back to athena or another EHR.</p><div class="modal-source"><strong>Illustrative selection · ${e(patient().name)}</strong><p>${entries.length?e(entries.join(' · ')):'No demo actions have been selected yet. You can still see the simulation.'}</p><small>No EHR is connected. Nothing will be transmitted or written to a chart.</small></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancel</button><button type="button" class="primary" data-action="simulate-writeback">Simulate write-back</button></div>`);
  }
  document.addEventListener('toggle',event=>{if(event.target?.id==='visit-details')visitDetailsOpen=event.target.open;},true);
  document.addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.id==='reset-demo'||target.id==='reset-demo-mobile'){state=defaultState();save();if(modal.open)modal.close();currentPage='patient';history.replaceState(null,'','#patient');render('Workspace reset.');window.scrollTo({top:0,behavior:'auto'});return;}
    if(target.dataset.huddlePatient && patients[target.dataset.huddlePatient]){state.patient=target.dataset.huddlePatient;save();navigate('patient');return;}
    if(target.dataset.case && caseById(target.dataset.case))state.selectedCase=target.dataset.case;
    if(target.dataset.page){save();navigate(target.dataset.page);return;}
    if(target.dataset.patient && patients[target.dataset.patient]){state.patient=target.dataset.patient;save();render();return;}
    if(target.dataset.case && caseById(target.dataset.case)){save();render();return;}
    const action=target.dataset.action;
    if(action==='close-modal'){modal.close();return;}
    if(action==='source'){showSource(target.dataset.source,target.dataset.patientId||state.patient,target.dataset.focus||'');return;}
    if(action==='taps-entry'){modalShell('TAPS-1 · positive screen',`<div class="modal-options"><button type="button" class="modal-option" data-action="taps-select" data-value="plan"><strong>Assessment planned</strong></button><button type="button" class="modal-option" data-action="taps-select" data-value="needs"><strong>More information needed</strong></button></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancel</button></div>`);return;}
    if(action==='taps-select'){if(!demoIntents.A.substance[target.dataset.value])return;state.drafts.A.substance=target.dataset.value;save();modal.close();render('Assessment selected.');return;}
    if(action==='phq-entry'){modalShell('PHQ-2',`<p class="modal-body-copy">Over the last two weeks, how often have you been bothered by feeling down, depressed, or hopeless?</p><div class="modal-options">${['Not at all','Several days','More than half the days','Nearly every day','Patient declined'].map(answer=>`<button type="button" class="modal-option" data-action="phq-answer" data-value="${e(answer)}"><strong>${e(answer)}</strong></button>`).join('')}</div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancel</button></div>`);return;}
    if(action==='phq-answer'){if(!['Not at all','Several days','More than half the days','Nearly every day','Patient declined'].includes(target.dataset.value))return;state.phqAnswer=target.dataset.value;state.drafts.A.screen='phq';save();modal.close();render('Answer selected.');return;}
    if(action==='weight-entry'){modalShell('Enter weight',`<div class="weight-form"><label for="weight-value">Weight (kg)</label><input id="weight-value" type="number" min="25" max="350" step="0.1" inputmode="decimal" value="${state.enteredWeight==null?'':e(state.enteredWeight)}"><p id="weight-error" role="alert"></p></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Cancel</button><button type="button" class="primary" data-action="save-weight">Save</button></div>`);return;}
    if(action==='save-weight'){const field=document.getElementById('weight-value'), value=Number(field.value);if(!field.value||!Number.isFinite(value)||value<25||value>350){document.getElementById('weight-error').textContent='Enter a weight from 25 to 350 kg.';return;}state.enteredWeight=value;save();modal.close();render('Weight entered.');return;}
    if(action==='stage-intent'){
      const kind=target.dataset.kind,intent=target.dataset.intent;
      if(!demoIntents[state.patient]?.[kind]?.[intent])return;
      if(state.drafts[state.patient][kind]===intent)delete state.drafts[state.patient][kind];else state.drafts[state.patient][kind]=intent;
      save();render();return;
    }
    if(action==='quick-outcome'){showQuickOutcome(target.dataset.kind,target.dataset.value);return;}
    if(action==='confirm-intent'){
      const kind=target.dataset.kind,intent=target.dataset.intent,label=demoIntents[state.patient]?.[kind]?.[intent];if(!label)return;
      state.drafts[state.patient][kind]=intent;save();modal.close();render('Selection updated.');return;
    }
    if(action==='open-outcome'){showOutcome(target.dataset.kind);return;}
    if(action==='set-outcome'){
      const kind=target.dataset.kind,value=target.dataset.value;if(!allowedActions[kind]?.includes(value))return;
      state.actions[state.patient][kind]=value;if(kind==='condition'||kind==='gap')delete state.drafts[state.patient][kind];save();modal.close();render(`Review saved for ${patient().name}.`);return;
    }
    if(action==='writeback'){showWriteback();return;}
    if(action==='simulate-writeback'){state.sentDemo[state.patient]=true;save();modal.close();render('Write-back simulated. No connection was made and no information was sent.');return;}
    if(action==='decision'){
      const value=target.dataset.value,c=caseById(state.selectedCase);if(!c||!['confirmed','dismissed','needs_info'].includes(value))return;
      state.reviews[c.id]=value;if(value!=='confirmed')delete state.discussed[c.id];save();render(`Review decision saved for ${patients[c.patient].name}.`);return;
    }
    if(action==='discuss'){
      const c=caseById(target.dataset.caseId);if(!c||caseState(c)!=='confirmed')return;
      state.discussed[c.id]=true;save();render('Discussion recorded.');return;
    }
  });
  window.addEventListener('hashchange',()=>{const p=location.hash.slice(1);if(sections.includes(p)&&p!==currentPage){currentPage=p;render();}});
  render();
})();
