
const questions=[
['현재 몇 살이신가요?','지금 나이를 알려주세요.','age','세',25],
['몇 살에 은퇴하고 싶으신가요?','일을 그만두고 싶은 나이를 입력해 주세요.','retire','세',60],
['은퇴 후 매달 얼마를 쓰고 싶으신가요?','지금 돈의 가치로 생각해 주세요.','spend','만원',250],
['현재 모아둔 저축·투자금은 얼마인가요?','집값과 퇴직연금(DB·DC), 개인연금, IRP에 있는 돈은 제외해 주세요.','assets','만원',3000],
['매달 얼마를 저축할 수 있나요?','일반 저축과 개인적으로 납입하는 IRP·연금저축을 포함해 주세요. 회사가 납입하는 DB·DC 부담금은 제외해 주세요.','save','만원',80],
['국민연금을 매달 얼마나 받을 예정인가요?','모르시면 0을 입력하세요. 통계 평균 월 64.8만원으로 임시 계산해요.','pension','만원',0],
['몇 살까지 생활비를 준비할까요?','노후 자금을 준비할 목표 나이예요.','end','세',95],
['현재 직장 퇴직연금은 어떤 방식인가요?','DB·DC를 모르면 건너뛰어도 괜찮아요. 퇴직급여는 추정해서 임의로 더하지 않을게요.','workType','선택','unknown']];
const AVG_PENSION=64.7543;let step=0;let data={};const $=id=>document.getElementById(id);const money=n=>{
  if(!Number.isFinite(Number(n))) return '—';
  const won=Math.round(Number(n)*10000);
  if(won===0) return '0원';
  const negative=won<0?'-':'';
  const amount=Math.abs(won);
  const eok=Math.floor(amount/100000000);
  const man=Math.floor((amount%100000000)/10000);
  const rest=amount%10000;
  const chunks=[];
  if(eok) chunks.push(eok.toLocaleString('ko-KR')+'억');
  if(man) chunks.push(man.toLocaleString('ko-KR')+'만');
  if(rest) chunks.push(rest.toLocaleString('ko-KR')+'원');
  if(!rest && chunks.length) chunks[chunks.length-1]+='원';
  return negative+chunks.join(' ');
};
function show(id){['home','quiz','results'].forEach(k=>$(k).classList.toggle('hidden',k!==id))}
function start(){step=0;show('quiz');render()}
function syncDCAnnual(){const v=$('workDCMonthlySalary').value; if(v.trim()!==''){const annual=Number(v)/12; $('workDCAnnual').value=Number(annual.toFixed(4)); $('dcAnnualPreview').textContent='연간 회사 부담금 추정: '+annual.toLocaleString('ko-KR',{maximumFractionDigits:2})+'만원 (세전 연봉 ÷ 12)';}else{$('workDCAnnual').value=0;$('dcAnnualPreview').textContent='연봉을 입력하면 연간 회사 부담금(연봉 ÷ 12)을 추정해요.'}}
function syncDCSalary(){ $('workDCMonthlySalary').value='';$('dcAnnualPreview').textContent='직접 입력한 연간 회사 부담금을 사용해요.';}
function updateWorkFields(){
 const type=document.querySelector('input[name="workType"]:checked')?.value||'unknown';
 $('workDBFields').classList.toggle('hidden',type!=='db');
 $('workDCFields').classList.toggle('hidden',type!=='dc');
}

function decorateMoneyInputs(){
 const ids=['workSalary','workDCBalance','workDCMonthlySalary','workDCAnnual','save2','spend2','pension2','privatePension','irpMonthly','housePrice'];
 ids.forEach(id=>{const el=$(id);if(!el||el.parentElement.classList.contains('money-input'))return;const wrap=document.createElement('div');wrap.className='money-input';el.parentNode.insertBefore(wrap,el);wrap.appendChild(el);const unit=document.createElement('span');unit.className='money-unit';unit.textContent='만원';wrap.appendChild(unit);});
 const ans=$('answer');if(ans&&!ans.parentElement.classList.contains('money-input')){const wrap=document.createElement('div');wrap.className='money-input';ans.parentNode.insertBefore(wrap,ans);wrap.appendChild(ans);const unit=document.createElement('span');unit.className='money-unit';unit.textContent='만원';wrap.appendChild(unit);}
 const unit=$('answer')?.parentElement.querySelector('.money-unit');if(unit)unit.textContent=['assets','save','spend','pension'].includes(questions[step][2])?'만원':'세';
}
function render(){let q=questions[step];$('stepLabel').textContent=`${step+1} / ${questions.length}`;$('bar').style.width=((step+1)/questions.length*100)+'%';$('question').textContent=q[0];$('hint').textContent=q[1];$('hint').style.display=q[2]==='workType'?'block':'none';$('field').innerHTML=q[2]==='workType'?'':`<p class="quiz-input-hint">${q[1]}</p><input id="answer" type="number" min="0" step="1" value="${data[q[2]]??q[4]}" inputmode="numeric">`;$('pensionOptions').classList.toggle('hidden',q[2]!=='pension');$('workPensionOptions').classList.toggle('hidden',q[2]!=='workType');if(q[2]==='workType'){if(data.workType==='none')data.workType='unknown';document.querySelector(`input[name="workType"][value="${data.workType||'unknown'}"]`).checked=true;['workSalary','workTenure','workDCBalance','workDCAnnual','workDCMonthlySalary'].forEach(k=>{if(data[k]!==undefined)$(k).value=data[k]});updateWorkFields();if(data.workDCMonthlySalary!==undefined)syncDCAnnual()}decorateMoneyInputs();if(q[2]==='pension')$('noPension').checked=!!data.noPension;$('back').disabled=step===0;$('next').textContent=step===questions.length-1?'결과 보기':'다음'}
function saveStep(){let q=questions[step];if(q[2]==='workType'){data.workType=document.querySelector('input[name="workType"]:checked')?.value||'unknown';for(let k of ['workSalary','workTenure','workDCBalance','workDCAnnual']){let el=$(k),v=Number(el.value);if(!Number.isFinite(v)||v<0||el.value.trim()===''){alert('퇴직연금 입력값을 확인해 주세요.');return false}data[k]=v}data.workDCMonthlySalary=$('workDCMonthlySalary').value.trim()===''?undefined:Number($('workDCMonthlySalary').value);if(data.workType==='db'&&data.workTenure>60){alert('예상 근속기간을 확인해 주세요.');return false}return true}let v=Number($('answer').value);if(!Number.isFinite(v)||v<0||$('answer').value.trim()===''){alert('0 이상의 숫자를 입력해 주세요.');return false}data[q[2]]=v;if(q[2]==='pension')data.noPension=$('noPension').checked;return true}
function previous(){if(step>0){saveStep();step--;render()}}
function advance(){if(!saveStep())return;if(step<questions.length-1){step++;render()}else{if(!(data.age<data.retire&&data.retire<data.end)){alert('현재 나이 < 은퇴 나이 < 목표 나이 순서로 입력해 주세요.');return}resultsApplied=false;show('results');$('save2').value=data.save;$('retire2').value=data.retire;$('spend2').value=data.spend;$('pension2').value=data.pension===0&&!data.noPension?AVG_PENSION.toFixed(1):data.pension;recalc()}}
// 매월 말 납입·인출, 월복리, 현재 가치 생활비 기준. 단순 가정 모형.
const defaults={pensionStart:65,privatePension:0,privateStart:60,privateEnd:85,ageSpending:false,spend70:100,spend80:100,spend90:100,preRate:3,postRate:3,irpRateDetail:2.99,dcRate:3,inflationRate:2};
const fields=['pensionStart','privatePension','privateStart','privateEnd','spend70','spend80','spend90','preRate','postRate','irpRateDetail','dcRate','inflationRate'];
function settings(){let d={};fields.forEach(k=>d[k]=Number($(k).value));d.ageSpending=$('ageSpending').checked;return d}
function markCustom(){$('investStyle').value='custom'}
function markIrpCustom(){ $('irpStrategy').value='custom';updateIrpStrategy() }
function updateIrpStrategy(){
 const mode=$('irpStrategy').value,weight=Number($('irpSafeWeight').value)/100;
 $('irpMixPanel').classList.toggle('hidden',mode!=='mixed');
 $('irpSafePct').textContent=Math.round(weight*100)+'%';$('irpRiskPct').textContent=Math.round((1-weight)*100)+'%';
 const rate=mode==='deposit'?2.11:mode==='fund'?4.48:mode==='mixed'?(2.11*weight+4.48*(1-weight)):mode==='unknown'?2.99:Number($('irpRateDetail').value);
 if(mode!=='custom')$('irpRateDetail').value=Number(rate.toFixed(2));
 $('irpRate').value=Number(rate.toFixed(2));
 const label=mode==='mixed'?`예금 ${Math.round(weight*100)}% + 투자 ${Math.round((1-weight)*100)}%`:
 mode==='deposit'?'예금·원리금보장형 중심':mode==='fund'?'ETF·펀드 중심':mode==='custom'?'직접 입력':'잘 모르겠어요';
 $('irpStrategyInfo').textContent=`${label} · 연 ${Number(rate.toFixed(2))}% 가정 (최근 10년 실측 기반·미래 보장 아님)`;
}
function applyInvestStyle(){
 const mode=$('investStyle').value;if(mode==='custom')return;
 const rate=mode==='safe'?2:mode==='growth'?5:3;
 ['preRate','postRate','dcRate'].forEach(id=>$(id).value=rate);
 if($('irpStrategy').value==='unknown'){$('irpRateDetail').value=2.99;updateIrpStrategy()}markPending();
}
function toggleDetails(){let panel=$('detailsPanel'),open=panel.classList.toggle('hidden')===false;$('detailsToggle').setAttribute('aria-expanded',String(open));$('detailsArrow').textContent=open?'접기 −':'펼치기 ＋'}
function toggleSpending(){$('spendingPanel').classList.toggle('hidden',!$('ageSpending').checked);markPending()}
function resetDetails(){fields.forEach(k=>$(k).value=defaults[k]);$('irpRate').value=2.99;$('irpStrategy').value='unknown';$('irpSafeWeight').value=70;updateIrpStrategy();$('investStyle').value='balanced';$('ageSpending').checked=false;toggleSpending()}
function spendingAt(d,age){
 if(!d.ageSpending)return d.spend;
 if(age>=90)return d.spend*d.spend90/100;
 if(age>=80)return d.spend*d.spend80/100;
 if(age>=70)return d.spend*d.spend70/100;
 return d.spend;
}
// 한국주택금융공사 2026-03-01 일반주택 종신지급 정액형, 단위 만원/월.
const HOUSE_AGES=[55,60,65,70,75,80];
const HOUSE_TABLE=[[15.6,31.2,46.8,62.4,78,93.6,109.2,124.8,140.4,156,171.6,187.2],[21,42.1,63.2,84.2,105.3,126.4,147.5,168.5,189.6,210.7,231.8,252.8],[25.2,50.5,75.8,101.1,126.4,151.7,177,202.3,227.6,252.9,278.2,303.5],[30.7,61.5,92.3,123.1,153.9,184.7,215.5,246.2,277,307.8,338.6,341.4],[38.1,76.2,114.3,152.5,190.6,228.7,266.9,305,343.1,366.6,366.6,366.6],[48.3,96.6,144.9,193.2,241.6,289.9,338.2,386.5,406,406,406,406]];
function houseEstimate(age,price){
 const a=Math.max(55,Math.min(80,age)),p=Math.max(10000,Math.min(120000,price));
 const idx=HOUSE_AGES.findIndex(v=>v>=a),hi=idx<0?5:idx,lo=Math.max(0,hi-1);
 function byPrice(row){const x=p/10000-1,i=Math.min(11,Math.floor(x)),j=Math.min(11,i+1);return HOUSE_TABLE[row][i]+(HOUSE_TABLE[row][j]-HOUSE_TABLE[row][i])*(x-i)}
 const t=hi===lo?0:(a-HOUSE_AGES[lo])/(HOUSE_AGES[hi]-HOUSE_AGES[lo]);return byPrice(lo)*(1-t)+byPrice(hi)*t;
}
function simulate(d){
 const before=Math.pow(1+d.preRate/100,1/12)-1,after=Math.pow(1+d.postRate/100,1/12)-1;
 const inf=1+d.inflationRate/100;
 let balance=d.assets,irpBalance=0,workBalance=d.workType==='dc'?(d.workDCBalance||0):0,atRetire=0,irpAtRetire=0,workAtRetire=0,firstShortfall=null,firstDepletion=null,months=[],shortfallIntervals=[],openShortfall=null;
 const workR=Math.pow(1+(d.dcRate??3)/100,1/12)-1;
 const irpR=Math.pow(1+(d.irpRate??3)/100,1/12)-1,postIrpR=Math.pow(1+(d.postIrpRate??d.irpRate??3)/100,1/12)-1,irpPay=d.irpMonthly??0;
 const retireM=Math.round((d.retire-d.age)*12),endM=Math.round((d.end-d.age)*12);
 for(let m=1;m<=endM;m++){
   if(m<=retireM){balance=balance*(1+before)+d.save;irpBalance=irpBalance*(1+irpR)+irpPay;
 if(d.workType==='dc')workBalance=workBalance*(1+workR)+(d.workDCAnnual||0)/12;
 if(m===retireM){
  if(d.workType==='db')workBalance=Math.max(0,(d.workSalary||0)/12*(d.workTenure||0));
  workAtRetire=workBalance;
  // 퇴직 시점에 퇴직급여를 일반 은퇴자산으로 합산하는 단순 세전 가정.
  balance+=workBalance;
  atRetire=balance+irpBalance;irpAtRetire=irpBalance
 }continue}
   const age=d.age+(m-1)/12,ageEnd=d.age+m/12;
   const factor=Math.pow(inf,m/12),wantedReal=spendingAt(d,age),wanted=wantedReal*factor;
   balance=Math.max(0,balance*(1+after));irpBalance=Math.max(0,irpBalance*(1+postIrpR));
   const national=age>=d.pensionStart?d.pension*factor:0;
   const privateNow=age>=d.privateStart&&age<d.privateEnd?d.privatePension*factor:0;
   const housing= d.houseOn && age>=d.houseAge ? d.houseMonthly : 0;
   const income=national+privateNow+housing;
   // 정기 연금소득이 생활비를 초과하면 잉여 현금흐름을 일반 금융자산에 적립.
   // 해당 월 운용수익 계산 후 적립하므로 잉여금은 다음 달부터 수익 발생.
   const surplus=Math.max(0,income-wanted);
   balance+=surplus;
   const gap=Math.max(0,wanted-income);
   // 은퇴 후 수익률이 낮은 자산부터 사용. IRP는 55세 이후에만 인출 가능.
   const canIRP=age>=55;
   const lowFirst=(d.postRate<=(d.postIrpRate??d.irpRate));
   let remaining=gap;
   const drawDeposit=()=>{const used=Math.min(Math.max(0,balance),remaining);balance-=used;remaining-=used;};
   const drawIRP=()=>{if(!canIRP)return;const used=Math.min(Math.max(0,irpBalance),remaining);irpBalance-=used;remaining-=used;};
   if(lowFirst){drawDeposit();drawIRP();}else{drawIRP();drawDeposit();}
   const paid=Math.max(0,wanted-remaining);
   if(firstDepletion===null&&gap>0&&balance+irpBalance<=1e-7)firstDepletion=age;
   if(firstShortfall===null&&remaining>1e-7)firstShortfall=age;
   if(remaining>1e-7&&openShortfall===null)openShortfall=age;
   if(remaining<=1e-7&&openShortfall!==null){shortfallIntervals.push({start:openShortfall,end:age});openShortfall=null;}
   months.push({age:ageEnd,paid:paid/factor,wanted:wantedReal,balance:balance+irpBalance});
 }
 if(openShortfall!==null)shortfallIntervals.push({start:openShortfall,end:d.end});
 return {shortfallIntervals,points:[{age:d.retire,paid:months[0]?.paid??0,wanted:months[0]?.wanted??d.spend,balance:atRetire},...months],atRetire,irpAtRetire,workAtRetire,ending:balance+irpBalance,firstShortfall,firstDepletion};
}
// Present-value presentation: all future amounts are expressed in the user's current-age purchasing power.
function pvAt(amount, age, assumptions){
 const years=Math.max(0,age-assumptions.age);
 return amount/Math.pow(1+assumptions.inflationRate/100,years);
}
function pvRetire(amount, assumptions){return pvAt(amount,assumptions.retire,assumptions)}
function pvEnd(amount, assumptions){return pvAt(amount,assumptions.end,assumptions)}
let resultsApplied=false;
function ageLabel(age){if(age===null)return null;const total=Math.round(age*12),y=Math.floor(total/12),m=total%12;return `${y}세${m?' '+m+'개월':''}`}

/* Explicit application: typing does not update results or graph. */
function toggleExperiment(which){
 const panel=$(which==='irp'?'irpSettingsPanel':'houseSettingsPanel');
 const button=$(which==='irp'?'irpSettingsToggle':'houseSettingsToggle');
 const opened=panel.classList.toggle('hidden')===false;
 button.setAttribute('aria-expanded',String(opened));
 button.textContent=(which==='irp'?'IRP':'주택연금')+' 설정값 '+(opened?'접기 −':'펼치기 ＋');
}
function updateExperimentPreviews(base){
 // 미리보기는 실제 선택한 납입 방식·금액·운용 방식·수익률을 즉시 반영한다.
 updateIrpStrategy();
 const total=Number($('save2').value),entered=Number($('irpMonthly').value);
 // 설정을 입력하기 전에는 0원이 아니라 월 80만원 ETF·펀드 전환 예시를 표시한다.
 // 선택한 납입액/운용 방식을 건드린 이후에는 입력값 그대로 미리보기에 반영한다.
 const exampleMode=entered===0 && $('irpStrategy').value==='unknown' && !window.irpPreviewTouched;
 const selected=exampleMode?Math.min(80,Math.max(0,total)):entered;
 const mode=document.querySelector('input[name="irpMode"]:checked')?.value||'transfer';
 const irpRate=exampleMode?4.48:Number($('irpRate').value);
 const pre=Number($('preRate').value),post=Number($('postRate').value);
 const infl=Number($('inflationRate').value);
 const scenario={...base,...settings(),save:total-(mode==='transfer'?selected:0),irpMonthly:selected,irpRate,houseOn:false,houseMonthly:0};
 const reference={...scenario,save:total,irpMonthly:0};
 const valid=[total,selected,irpRate,pre,post,infl].every(Number.isFinite)&&total>=0&&selected>=0&&selected<=150&&(mode!=='transfer'||selected<=total);
 if(!valid){$('irpPreviewGain').textContent='입력값 확인 필요';$('irpPreviewPV').textContent='IRP 납입액·저축액을 확인하세요.';$('irpPreviewDesc').textContent='이전 방식에서는 IRP 납입액이 월 저축액을 초과할 수 없습니다.';return;}
 const original=simulate(reference),converted=simulate(scenario);
 const gain=converted.atRetire-original.atRetire;
 const pv=gain/Math.pow(1+infl/100,base.retire-base.age);
 const first=x=>x.firstShortfall===null?`${scenario.end}세까지 부족 없음`:ageLabel(x.firstShortfall);
 const last=x=>x.shortfallIntervals.length?ageLabel(x.shortfallIntervals[x.shortfallIntervals.length-1].start):`${scenario.end}세까지 부족 없음`;
 const sign=gain>=0?'+':'';
 $('irpPreviewGain').textContent=(pv>=0?'+':'')+money(pv);
 $('irpPreviewPV').textContent=`현재 나이 ${base.age}세 구매력 기준 · 은퇴 시점 추가 자산을 환산`;
 const label=exampleMode?'ETF·펀드 중심 (기본 예시)':($('irpStrategy').selectedOptions[0]?.textContent.trim()||'선택한 운용 방식');
 $('irpPreviewDesc').textContent=`${exampleMode?'예시':'미리보기'} · 월 ${money(selected)} ${mode==='transfer'?'기존 저축에서 IRP로 이전':'IRP에 추가 납입'} · ${label} (연 ${irpRate}%) · 아직 그래프에 미적용`;
 const neutral=simulate({...scenario,irpRate:pre,postIrpRate:post});
 const neutralDifference=neutral.atRetire-original.atRetire;
 // 상세 대조군 수치는 마지막 참고 섹션에서 확인할 수 있습니다.
 const housePrice=50000,age=70;
 $('housePreviewMonthly').textContent=money(pvAt(houseEstimate(age,housePrice),age,scenario))+'/월';
 $('housePreviewDesc').textContent=`현재 ${scenario.age}세 구매력 · 시세 5억원·70세 가입 시 월 정액 지급액을 물가로 할인한 예시 · 아직 미적용`;
}
function updateIrpPreviewLive(){
 if(!data||!Number.isFinite(data.age)||!$('save2'))return;
 const base={...data,...defaults,houseOn:false,houseMonthly:0,irpMonthly:0,irpRate:3,pension:data.noPension?0:(data.pension===0?AVG_PENSION:data.pension)};
 updateExperimentPreviews(base);
}
function toggleHouseInputs(){ /* 상세 설정은 펼치기 버튼으로만 제어합니다. */ }
function validateHousingAge(showAlert){
 const age=Number($('houseAge').value), valid=$('houseAge').value.trim()!==''&&Number.isInteger(age)&&age>=55&&age<=95;
 const msg=valid?'':'이 시뮬레이터에서는 연소자 나이를 55~95세로 입력해 주세요. 실제 가입 자격은 부부 중 한 명이 만 55세 이상이면 충족할 수 있으므로, 연소자가 55세 미만이라면 공식 예상연금조회에서 확인해 주세요.';
 $('houseAgeError').textContent=msg;
 $('houseAge').setAttribute('aria-invalid',String(!valid));
 if(!valid&&showAlert)window.alert(msg);
 return valid;
}
function validateHousingPrice(showAlert){
 const raw=$('housePrice').value.trim(),price=Number(raw);
 const tooHigh=raw!==''&&Number.isFinite(price)&&price>120000;
 const msg=tooHigh?'입력한 주택 시세가 12억 원을 초과했어요. 실제 가입 자격은 공시가격 등 별도 기준으로 판단하므로 공식 조회에서 확인해 주세요.':'';
 $('housePriceError').textContent=msg;
 $('housePrice').setAttribute('aria-invalid',String(tooHigh));
 if(tooHigh&&showAlert)window.alert(msg);
 return true; // 시세만으로 가입 불가를 판정하지 않음.
}
function applyHousingResults(){
 if(!validateHousingAge(true))return;
 validateHousingPrice(true);
 $('houseOn').checked=true; applyResults();
}
function markPending(el){
 const id=el?.id||'';
 const house=el?.closest?.('#housingCard');
 const irp=el?.closest?.('#irpCard');
 const target=house?'pendingHouse':irp?'pendingIrp':'pendingMain';
 const hint=$(target);if(hint)hint.textContent='변경사항이 있어요. 버튼을 누르면 결과에 반영돼요.';
}
function applyResults(){
 resultsApplied=true;recalc();
 // Validation messages are preserved, but a failed calculation must not clear pending state.
 if($('irpValidation').textContent)return;
 ['pendingMain','pendingIrp','pendingHouse'].forEach(id=>$(id).textContent='');
}

function recalc(){
 let custom=settings();updateIrpStrategy();let irpMonthly=Number($('irpMonthly').value),irpMode=document.querySelector('input[name="irpMode"]:checked')?.value||'transfer',irpRate=Number($('irpRate').value),irpOtherDeduction=Number($('irpOtherDeduction').value);let d={...data,...custom,irpMonthly,irpRate,save:Number($('save2').value)-(irpMode==='transfer'?irpMonthly:0),retire:Number($('retire2').value),spend:Number($('spend2').value),pension:Number($('pension2').value)};
 const houseOn=$('houseOn').checked,houseAge=Number($('houseAge').value),housePrice=Number($('housePrice').value),houseSpouse=0;
 const houseReferenceAge=houseAge;
 const houseMonthly=houseEstimate(houseReferenceAge,housePrice);
 Object.assign(d,{houseOn,houseAge,houseMonthly});
 /* 주택연금 설정 입력란은 체크박스 없이 항상 표시합니다. */
 $('houseMonthly').textContent=money(pvAt(houseMonthly,houseReferenceAge,d))+'/월';
 $('houseBasis').textContent=`현재 ${d.age}세 구매력 · ${houseReferenceAge}세 가입 시 명목 정액 월지급액을 환산 · 조견표 보간 · 가입 시 예상 주택가격 ${(housePrice/10000).toFixed(1)}억원`;
 $('houseWarning').textContent=houseOn?(houseReferenceAge>80?'80세 초과: 80세 조견표 상한값 적용 · 공식 조회 권장':housePrice>120000?'시세 12억원 초과: 12억원까지만 월지급액 산정 · 공시가격 가입요건 별도 확인':houseAge<55?'연소자 나이는 55세 이상으로 입력해 주세요.':'실제 지급액과 가입 가능 여부는 공식 조회로 확인하세요.') : '';
 const displayedSaving=Number($('save2').value);
 const nums=[houseAge,housePrice,d.save,displayedSaving,d.retire,d.spend,d.pension,irpMonthly,irpRate,irpOtherDeduction,...fields.map(k=>d[k])];
 const valid=nums.every(Number.isFinite)&&(!houseOn||(houseAge>=55&&houseAge<=95&&housePrice>=10000&&housePrice<=300000))&&d.save>=0&&displayedSaving>=0&&irpMonthly>=0&&irpMonthly<=150&&irpRate>=-50&&irpRate<=30&&d.dcRate>=-50&&d.dcRate<=30&&irpOtherDeduction>=0&&irpOtherDeduction<=900&&d.spend>=0&&d.pension>=0&&d.retire>d.age&&d.retire<d.end&&d.pensionStart>=50&&d.pensionStart<=85&&d.privatePension>=0&&d.privateStart>=40&&d.privateEnd>d.privateStart&&d.privateEnd<=110&&[d.spend70,d.spend80,d.spend90].every(x=>x>=0&&x<=300)&&d.preRate>=-50&&d.preRate<=30&&d.postRate>=-50&&d.postRate<=30&&d.inflationRate>=-10&&d.inflationRate<=30;
 if(!valid){$('irpValidation').textContent=irpMonthly>150?'IRP는 월 150만원까지 입력할 수 있어요. 200만원을 저축한다면 일반 저축 50만원 + IRP 150만원으로 설정해 주세요.':irpMode==='transfer'&&irpMonthly>displayedSaving?'IRP 납입액이 월 저축액보다 많아요.':'입력값을 확인해 주세요.';$('irpAllocation').textContent='현재 입력값으로는 계산할 수 없어요.';$('irpBalance').textContent='계산 불가';$('irpTax').textContent='계산 불가';$('irpSummary').textContent='입력값 수정 후 다시 계산해요.';$('irpComparisonNote').style.display='none';$('editHint').textContent=irpMode==='transfer'&&irpMonthly>displayedSaving?'IRP로 옮기는 금액은 현재 월 저축액을 넘을 수 없어요.':'입력값을 확인해 주세요. 연금 종료 나이는 시작 나이보다 커야 해요.';$('editHint').classList.remove('hidden');return}
 $('irpValidation').textContent='';
 let baseline={...data,...defaults,houseOn:false,houseMonthly:0,irpMonthly:0,irpRate:3,pension:data.noPension?0:(data.pension===0?AVG_PENSION:data.pension)};
 let a=simulate(baseline),b=simulate(d);
 updateExperimentPreviews(baseline);
 updateFuturePreview();
 const changed=resultsApplied&&(houseOn||irpMonthly>0||Math.abs(displayedSaving-data.save)>1e-8||Math.abs(d.retire-data.retire)>1e-8||Math.abs(d.spend-data.spend)>1e-8||Math.abs(d.pension-baseline.pension)>0.051||fields.some(k=>(k!=='irpRateDetail'||irpMonthly>0)&&Math.abs(d[k]-defaults[k])>1e-8)||d.ageSpending!==defaults.ageSpending);
 ['changedStatusCard','changedLegend','changedDetails'].forEach(k=>$(k).classList.toggle('hidden',!changed));
 $('editHint').classList.toggle('hidden',changed);$('editHint').textContent='조건을 수정한 뒤 ‘결과 변경’ 버튼을 눌러주세요.';
 $('pensionNote').textContent='최초 입력: '+(data.noPension?'연금 미수령(0원)':data.pension===0?'국민연금 통계 평균 약 64.8만원 자동 적용':'직접 입력 '+data.pension+'만원')+' · 변경 시 초록색 계획에 반영돼요.';
 $('atRetire').textContent=money(pvRetire(a.atRetire,baseline));
 $('workPensionSummary').textContent=data.workType==='db'?`DB형 예상 퇴직급여 ${money(pvRetire(a.workAtRetire,baseline))} 포함 · 세전 단순 추정`:
 data.workType==='dc'?`DC형 예상 퇴직급여 ${money(pvRetire(a.workAtRetire,baseline))} 포함 · 연 3% 기본 수익률 가정`:
 '퇴직급여 계산 제외';
 $('irpBalance').textContent=money(pvRetire(b.irpAtRetire,d));
 $('irpCurrentSaving').textContent=money(displayedSaving);
 $('irpAllocation').textContent=irpMode==='transfer'?`일반 저축 ${money(d.save)} + IRP ${money(irpMonthly)} = 월 총 ${money(displayedSaving)} (기존 저축 유지)`:`일반 저축 ${money(displayedSaving)} + IRP ${money(irpMonthly)} = 월 총 ${money(displayedSaving+irpMonthly)} (추가 저축)`;
 const deduction=Math.max(0,Math.min(irpMonthly*12,900-irpOtherDeduction));
 const salaryForTax=Number(data.workSalary)||0;
 const assumedTaxRate=salaryForTax>0&&salaryForTax<=5500?16.5:13.2;
 $('irpTaxBand').value=assumedTaxRate;
 const tax=deduction*assumedTaxRate/100;
 $('irpTax').textContent=money(tax)+'/년';
 $('irpSummary').textContent=irpMonthly===0?'IRP 납입액을 입력하면 비교 그래프에 반영돼요.':`월 ${money(irpMonthly)} · ${irpMode==='transfer'?'기존 저축 재배분':'추가 저축'} · 연 납입 ${money(irpMonthly*12)} · 공제 대상 ${money(deduction)}`;
 const note=$('irpComparisonNote');
 note.style.display=irpMonthly>0?'block':'none';
 if(irpMonthly>0){
  const pre=d.preRate,irp=d.irpRate;
  const comparison=irpMode==='transfer'
   ? `월 총저축 동일 · 일반 연 ${pre}% / IRP 연 ${irp}%`
   : `월 총저축 ${money(irpMonthly)} 증가 · 추가 납입 효과 포함`;
  note.innerHTML=`<strong>IRP 비교 기준</strong><br>${comparison}<br><strong>주의:</strong> 세액공제액·수령세금·수수료 미반영`;
 }

 const auditId='cashflowAuditV20261030';
 let audit=document.getElementById(auditId);
 if(!audit){audit=document.createElement('p');audit.id=auditId;audit.className='notice';$('referenceAudit').appendChild(audit);}
 const startIRP=irpMonthly>0?`일반 예금 월 ${money(d.save)} + IRP 월 ${money(irpMonthly)} (총 ${money(d.save+irpMonthly)})`:`일반 예금 월 ${money(d.save)}`;
 audit.textContent=`검증 기준: ${d.age}~${d.retire}세 납입, ${d.retire}세부터 추가 납입 0원 · 현재 금융자산 ${money(d.assets)}은 일반 예금으로 유지 · ${startIRP} · IRP는 55세 이전 생활비에 사용 불가(55세 이후 연금 수령요건 충족 가정) · 은퇴 시점 현재가치 기존 ${money(pvRetire(a.atRetire,baseline))}, 변경 ${money(pvRetire(b.atRetire,d))} (차이 ${money(pvRetire(b.atRetire,d)-pvRetire(a.atRetire,baseline))}) · 은퇴 후 예금 연 ${d.postRate}%, IRP 연 ${d.irpRate}% 복리(선택 운용 방식) · 인출 순서: ${d.postRate<=d.irpRate?'예금 우선 → 55세 이후 IRP':'55세 이후 IRP 우선 → 예금'} · 생활비 부족은 매월 실제 사용 가능액으로 판정. IRP 수익률은 보장되지 않으며 세금·수수료는 제외.`;
  $('status').textContent=a.firstShortfall===null?`${data.end}세까지 충당 가능`:`${ageLabel(a.firstShortfall)}부터`; 
 $('statusChanged').textContent=b.firstShortfall===null?`${data.end}세까지 충당 가능`:`${ageLabel(b.firstShortfall)}부터`;
 const intervalText=r=>r.shortfallIntervals.length?r.shortfallIntervals.map(x=>`${ageLabel(x.start)}~${x.end>=d.end?d.end+'세(목표 종료)':ageLabel(x.end)} 부족`).join(' / '):'목표 기간 부족 없음';
 audit.textContent+=` · 기존 부족 구간: ${intervalText(a)} · 변경 부족 구간: ${intervalText(b)}`;
 if(irpMonthly>0 && !houseOn){
  // Fair control: BOTH saving-period and retirement-period IRP yields equal deposit yields.
  // This is a liquidity comparison, NOT a positive investment-return effect.
  const neutral=simulate({...d,irpRate:d.preRate,postIrpRate:d.postRate});
  const fairBaseline=simulate({...d,save:d.save+irpMonthly,irpMonthly:0,irpRate:d.preRate});
  const last=r=>r.shortfallIntervals.length?r.shortfallIntervals[r.shortfallIntervals.length-1].start:null;
  const fmtAge=x=>x===null?`${d.end}세까지 충당 가능`:ageLabel(x);
  const zeroYieldDiff=neutral.atRetire-fairBaseline.atRetire;
  audit.textContent+=` · 동일수익률 대조군: 일반 저축과 IRP를 은퇴 전 연 ${d.preRate}%, 은퇴 후 연 ${d.postRate}%로 동일 운용 시 은퇴 시점 현재가치 총자산 차이 ${money(pvRetire(zeroYieldDiff,d))}(이론상 0원). IRP 55세 전 인출 제한으로 생활비 최초 부족 시점은 다를 수 있음. 실제 IRP 연 ${d.irpRate}% 적용 시 은퇴 시점 현재가치 추가 자산 ${money(pvRetire(b.atRetire,d)-pvRetire(a.atRetire,baseline))}, 최종 부족 ${fmtAge(last(b))}. 40세 이후 IRP 수익률만 3%로 낮추는 비교는 동일수익률 대조군이 아니므로 사용하지 않음.`;
 }
 
 $('newAsset').textContent=money(pvRetire(b.atRetire,d));
 let diff=pvEnd(b.ending,d)-pvEnd(a.ending,baseline);$('delta').textContent=(diff>=0?'+':'')+money(diff);
 $('summary').textContent='';
 $('graphNote').textContent=`월별 계산 · 현재가치 생활비 표시 · 국민연금 ${d.pensionStart}세 개시 · 예금 수익률 연 ${d.postRate}% · IRP 수익률 연 ${d.irpRate}% · 물가 연 ${d.inflationRate}%. DB·DC 퇴직급여는 은퇴 시 세전 일시금 합산. 입력 연금은 물가 연동 가정. 초과 연금소득은 일반 금융자산에 재적립.`;
 const fmt=r=>r.firstShortfall===null?`${data.end}세까지 부족 없음`:`${ageLabel(r.firstShortfall)} 최초 부족`;
 const intervalsLabel=r=>(r.shortfallIntervals||[]).map(x=>`${ageLabel(x.start)} 부족${x.end<d.end-1e-8?' → '+ageLabel(x.end)+' 회복':''}`).join(' / ')||'부족 없음';
 if(!changed)$('comparisonNote').textContent='현재 계획만 표시하고 있어요. 아래 숫자를 바꾸면 변경 계획을 비교할 수 있어요.';
 else if(Math.abs((a.firstShortfall??-1)-(b.firstShortfall??-1))<1/24){
   const age=a.firstShortfall;
   const thresholds=[70,80,90].filter(t=>d.ageSpending&&t>=d.retire&&t<d.end&&spendingAt(d,t)!==spendingAt(baseline,t));
   const later=age!==null&&thresholds.length>0&&thresholds.every(t=>t>age);
   $('comparisonNote').textContent=`두 계획의 최초 부족 시점이 같아요 (${fmt(a)}). ${later?'변경한 연령별 생활비는 최초 부족 시점 이후에 적용되어 시작 시점에 영향을 주지 않아요.':'변경 조건이 최초 부족 시점을 바꾸지 않았어요. 그래프에서 이후 월별 차이를 확인하세요.'}`;
 }else $('comparisonNote').textContent=`현재 계획: ${intervalsLabel(a)} · 변경 계획: ${intervalsLabel(b)}`;
 draw(a,b,baseline,d,changed);
 renderActions(d,b);


}


function renderReport(base,original,modified,updated,changed){
 const d=changed?modified:base,r=changed?updated:original;
 const age=r.firstShortfall;
 $('reportRetire').textContent=d.retire+'세';
 const yearsToRetire=d.retire-d.age;
 const inflationMultiple=Math.pow(1+d.inflationRate/100,yearsToRetire);
 const assetPV=r.atRetire/inflationMultiple;
 $('reportAssets').textContent=money(assetPV);
 $('reportAssetsNominal').textContent=`현재 ${d.age}세 구매력 · 물가상승률 연 ${d.inflationRate}%로 할인`;
 $('reportSpend').textContent=money(d.spend)+'/월';
 $('reportSpendFuture').textContent=`현재 ${d.age}세 구매력 기준 · 연 물가 ${d.inflationRate}% 반영`;
 const principalFuture=d.assets*Math.pow(1+d.preRate/100,yearsToRetire);
 const generalFuture=Math.max(0,r.atRetire-r.irpAtRetire-r.workAtRetire);
 const savedFuture=generalFuture-principalFuture;
 const irpFuture=r.irpAtRetire;
 const retirementPay=r.workAtRetire;
 const parts=[['기존 금융자산 운용 후',money(principalFuture/inflationMultiple)],['월 일반저축 적립 후',money(savedFuture/inflationMultiple)],['개인형 IRP 적립 후',money(irpFuture/inflationMultiple)],['DB·DC 퇴직급여',money(retirementPay/inflationMultiple)]];
 const breakdown=$('reportAssetBreakdown');breakdown.replaceChildren();
 for(const [label,value] of parts){const row=document.createElement('div');row.className='diagnostic-row';const name=document.createElement('span'),num=document.createElement('b');name.textContent=label;num.textContent=value;row.append(name,num);breakdown.append(row)}
 $('reportShortfall').textContent=age===null?`${d.end}세까지 부족 없음`:`${ageLabel(age)}부터`;
 const verdict=$('reportVerdict');verdict.replaceChildren();
 const heading=document.createElement('strong'),sub=document.createElement('p');
 const years=age===null?d.end-d.retire:Math.max(0,age-d.retire);
 heading.textContent=age===null?'목표 기간 충당 가능':years<10?'은퇴 초기 자금 부족 위험':'노후 후반 자금 부족 위험';
 sub.textContent=age===null?`${d.end}세까지 목표 생활비 충당 가능 (설정 가정 기준)`:`은퇴 ${d.retire}세 → 생활비 부족 ${ageLabel(age)} · 약 ${years}년 유지`;
 verdict.append(heading,sub);
 const add=(id,rows,note='')=>{const el=$(id);el.replaceChildren();for(const [label,value] of rows){const row=document.createElement('div');row.className='diagnostic-row';const l=document.createElement('span'),v=document.createElement('b');l.textContent=label;v.textContent=value;row.append(l,v);el.append(row)}if(note){const n=document.createElement('div');n.className='diagnostic-note';n.textContent=note;el.append(n)}};
 const incomeAt=(a)=>{const factor=1;return (a>=d.pensionStart?d.pension:0)+(a>=d.privateStart&&a<d.privateEnd?d.privatePension:0)};
 const startIncome=incomeAt(d.retire),startNeed=spendingAt(d,d.retire),startGap=Math.max(0,startNeed-startIncome);
 const at65=incomeAt(Math.max(d.retire,d.pensionStart));
 const cause=[];
 if(d.retire<d.pensionStart&&d.pension>0)cause.push(['국민연금 개시 전 공백',`${Math.max(0,d.pensionStart-d.retire)}년`]);
 cause.push(['은퇴 직후 희망 생활비',money(startNeed)+'/월']);
 cause.push(['은퇴 직후 정기 연금소득',money(startIncome)+'/월']);
 cause.push(['은퇴 직후 자산 충당 필요액',money(startGap)+'/월']);
 if(d.ageSpending)cause.push(['고령기 지출 조정','연령별 설정 반영']);
 add('reportCauses',cause,'정기 연금소득과 생활비 차액을 금융자산·퇴직급여·IRP에서 충당하는 구조입니다.');
 const shortPoint=age===null?null:r.points.find(p=>p.age>=r.firstShortfall-1e-7);
 const shortAge=r.firstShortfall;
 const incomeShort=shortAge===null?0:incomeAt(shortAge);
 const wantShort=shortAge===null?0:spendingAt(d,shortAge);
 const deficit=shortPoint?Math.max(0,shortPoint.wanted-shortPoint.paid):0;
 const gapRows=[['국민연금 예상 수령액',money(d.pension)+'/월 ('+d.pensionStart+'세부터)'],['추가 개인연금',money(d.privatePension)+'/월']];
 if(age!==null){gapRows.push(['첫 부족 시점 희망 생활비',money(wantShort)+'/월']);gapRows.push(['첫 부족 월의 미충당액',money(deficit)+'/월']);gapRows.push(['부족 시점 정기 연금소득',money(incomeShort)+'/월'])}
 else gapRows.push(['목표 연령까지','희망 생활비 충당']);
 add('reportGap',gapRows,'월 금액은 현재가치 기준. 첫 부족 월의 미충당액은 그 달에 한정되며, 이후 부족액과 다를 수 있습니다.');
 const labelResult=(v)=>v.firstShortfall===null?`${d.end}세까지 충당`:`${ageLabel(v.firstShortfall)}부터 부족`;
 const variants=[['월 저축 +10만원',{...d,save:d.save+10}],['은퇴 1년 연기',{...d,retire:Math.min(d.end-1,d.retire+1)}],['생활비 10% 절감',{...d,spend:d.spend*.9}]];
 const leverRows=variants.map(([label,variant])=>[label,labelResult(simulate(variant))]);
 add('reportLevers',leverRows,'한 번에 한 조건만 변경한 비교입니다. 우열은 수익률·은퇴 연령·지출 수준에 따라 달라집니다.');
 const risks=[['운용수익률 1%p 하락', {...d,preRate:Math.max(-50,d.preRate-1),postRate:Math.max(-50,d.postRate-1),irpRate:Math.max(-50,d.irpRate-1),dcRate:Math.max(-50,(d.dcRate??3)-1)}],['물가상승률 1%p 상승',{...d,inflationRate:d.inflationRate+1}]];
 add('reportRisks',risks.map(([label,v])=>[label,labelResult(simulate(v))]),'동일 수익률·물가가 매년 유지된다는 단순 가정입니다. 확률이나 손실 가능성을 추정한 결과는 아닙니다.');
 let advice='현재 계획을 유지하되 수익률·연금액 가정을 정기적으로 재확인하세요.';
 if(age!==null){if(d.retire<d.pensionStart&&d.pension>0&&age<=d.pensionStart)advice='우선순위: 국민연금 수령 전 소득 공백 대비';else if(startGap>0)advice='우선순위: 희망 생활비와 정기 연금소득의 차액 축소';else advice='우선순위: 자산 소진 구간과 연금 종료 시점 점검';}
 $('reportAdvice').textContent=advice;
 $('reportCard').querySelector('p').textContent=changed?'변경한 계획 기준 · 자동 분석':'최초 입력한 계획 기준 · 자동 분석';
}
// 현재 입력값을 기준으로 목표 연령까지 매달 희망 생활비를 충당하는지 검사.
// 자산이 한 번이라도 부족해지면 실패로 판정하며, 단순 잔여자산만 보지 않음.
function isFunded(d){return simulate(d).firstShortfall===null}
function actionButton(title,description,key,value,enabled){
 const card=document.createElement('div');card.className='stat';
 const heading=document.createElement('div');heading.style.fontWeight='800';heading.style.fontSize='16px';heading.textContent=title;
 const explanation=document.createElement('p');explanation.style.margin='9px 0 13px';explanation.textContent=description;
 card.append(heading,explanation);
 // 결과 안내 전용: 이 카드에서는 시뮬레이터 입력값을 변경하지 않음.
 return card;
}
function renderActions(d,result){
 const list=$('actionList');list.replaceChildren();
 if(result.firstShortfall===null){$('actionIntro').textContent=`현재 가정에서는 ${d.end}세까지 희망 생활비를 충당할 수 있어요. 아래 항목은 생활비가 부족할 때 참고용으로 표시돼요.`;return}
 $('actionIntro').textContent=`현재 조건으로는 ${ageLabel(result.firstShortfall)}부터 생활비가 부족해요. 목표인 ${d.end}세까지 유지하기 위한 참고 계산 결과예요. 이 숫자는 입력값에 자동 반영되지 않아요.`;
 // 1. 월 저축액: 1만원 단위로 탐색. 최대 1억원/월까지 탐색하되 비현실적이면 안내.
 const maxSave=10000;
 let savings=null;
 if(d.save<=maxSave&&isFunded({...d,save:maxSave})){
  let low=Math.ceil(d.save),high=maxSave;
  while(low<high){const mid=Math.floor((low+high)/2);if(isFunded({...d,save:mid}))high=mid;else low=mid+1}
  savings=low;
 }
 list.append(actionButton('① 매달 저축액 늘리기',savings===null?'현재 계산 범위에서는 저축액만 늘려 목표를 충족하는 방법을 찾지 못했어요.':`매달 약 ${money(savings-d.save)}을 추가 저축하면 목표에 도달할 수 있어요. (일반 저축 ${money(savings)}/월, IRP 별도)`, 'save2',savings,savings!==null));
 // 2. 은퇴 연기: 1년 단위. 현재 은퇴 시점보다 늦고 목표 연령보다 빠른 연령만 확인.
 let later=null;
 for(let r=Math.floor(d.retire)+1;r<d.end&&r<=85;r++){
  if(r>d.age&&isFunded({...d,retire:r})){later=r;break}
 }
 list.append(actionButton('② 은퇴 시점 늦추기',later===null?'설정 가능한 은퇴 연령 안에서는 목표를 충족하는 시점을 찾지 못했어요.':`${later}세에 은퇴하면 목표 연령까지 생활비를 충당할 수 있어요. (현재보다 ${Number((later-d.retire).toFixed(1))}년 늦게)`, 'retire2',later,later!==null));
 // 3. 희망 생활비: 0.1만원 단위 탐색. 수입이 생활비보다 많을 수 있으므로 모든 월의 부족 여부를 검증.
 let affordable=null;
 if(isFunded({...d,spend:0})){
  let low=0,high=Math.max(0,Math.floor(d.spend*10));
  while(low<high){const mid=Math.ceil((low+high)/2);if(isFunded({...d,spend:mid/10}))low=mid;else high=mid-1}
  affordable=low/10;
 }
 list.append(actionButton('③ 은퇴 후 생활비 조정',affordable===null?'생활비를 0원으로 설정해도 충당할 수 없는 달이 있어요.':`월 희망 생활비를 약 ${money(affordable)} 이하로 설정하면 목표에 도달할 수 있어요. (현재보다 약 ${money(d.spend-affordable)} 감소)`, 'spend2',affordable,affordable!==null));
}
function draw(a,b,original,changed,showChanged){
 const svg=$('graph'),W=460,H=260,L=89,R=12,T=31,B=36;
 const start=Math.min(original.retire,showChanged?changed.retire:original.retire),end=original.end;
 const visibleA=a.points.filter(p=>p.age>=start),visibleB=b.points.filter(p=>p.age>=start);
 const all=[...visibleA,...(showChanged?visibleB:[])];
 const maxVal=Math.max(1,...all.map(p=>Math.max(p.paid,p.wanted)))*1.15;
 const x=age=>L+(age-start)/(end-start)*(W-L-R),y=v=>T+(1-v/maxVal)*(H-T-B);
 const text=(x0,y0,t,anchor='middle')=>`<text x="${x0}" y="${y0}" font-size="11" fill="#7b8799" text-anchor="${anchor}">${t}</text>`;
 const paidPath=points=>points.map((p,i)=>`${i?'L':'M'}${x(p.age).toFixed(2)},${y(p.paid).toFixed(2)}`).join(' ');
 // 월별 생활비 목표는 단계형으로 표현하여 변화가 발생한 연령을 정확히 표시.
 function targetPath(d){
   const cut=[d.retire,70,80,90,end].filter((v,i,arr)=>v>=start&&v<=end).sort((a,b)=>a-b);
   if(!cut.includes(start))cut.unshift(start);
   if(!cut.includes(end))cut.push(end);
   let path=`M${x(start).toFixed(2)},${y(spendingAt(d,start)).toFixed(2)}`;
   for(let i=1;i<cut.length;i++){
     let age=cut[i],prev=cut[i-1],beforeVal=spendingAt(d,prev),afterVal=spendingAt(d,age);
     path+=`L${x(age).toFixed(2)},${y(beforeVal).toFixed(2)}`;
     if(i<cut.length-1&&Math.abs(afterVal-beforeVal)>1e-9)path+=`L${x(age).toFixed(2)},${y(afterVal).toFixed(2)}`;
   }
   return path;
 }
 let parts=[];
 for(let i=0;i<=4;i++){let v=maxVal*i/4;parts.push(`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#e8edf6"/>`,text(L-8,y(v)+4,money(v),'end'))}
 for(let age=Math.ceil(start/5)*5;age<=end;age+=5)parts.push(text(x(age),H-12,age+'세'));
 parts.push(`<path d="${targetPath(original)}" fill="none" stroke="#7f8ba2" stroke-width="2" stroke-dasharray="6 5"/>`);
 const targetChanged=showChanged&&(changed.spend!==original.spend||changed.ageSpending!==original.ageSpending||[70,80,90].some(t=>spendingAt(changed,t)!==spendingAt(original,t)));
 $('changedTargetLegend').classList.toggle('hidden',!targetChanged);
 if(targetChanged)parts.push(`<path d="${targetPath(changed)}" fill="none" stroke="#9aa6b8" stroke-width="2" stroke-dasharray="2 4"/>`);
 // Render both lines at true coordinates. On exactly overlapping intervals,
 // show two slim parallel strokes (±2 SVG px) only for those intervals.
 // This is a display-only separation; simulation and event coordinates stay exact.
 parts.push(`<path d="${paidPath(visibleA)}" fill="none" stroke="#d4ad2c" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);
 if(showChanged){
   parts.push(`<path d="${paidPath(visibleB)}" fill="none" stroke="#2868ef" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);
   const shared=[];
   const len=Math.min(visibleA.length,visibleB.length);
   for(let i=1;i<len;i++){
     const a0=visibleA[i-1],a1=visibleA[i],b0=visibleB[i-1],b1=visibleB[i];
     if(Math.abs(a0.age-b0.age)>1e-7||Math.abs(a1.age-b1.age)>1e-7)continue;
     if(Math.abs(y(a0.paid)-y(b0.paid))<0.35&&Math.abs(y(a1.paid)-y(b1.paid))<0.35){
       shared.push(`M${x(a0.age).toFixed(2)},${y(a0.paid).toFixed(2)}L${x(a1.age).toFixed(2)},${y(a1.paid).toFixed(2)}`);
     }
   }
   if(shared.length){
     const d=shared.join(' ');
     // Erase the single overlapped center stroke, then draw both colors side-by-side.
     parts.push(`<path d="${d}" fill="none" stroke="#fafcff" stroke-width="6.4" stroke-linecap="butt"/>`);
     parts.push(`<path d="${d}" transform="translate(0,-2.2)" fill="none" stroke="#d4ad2c" stroke-width="2" stroke-linecap="butt"/>`);
     parts.push(`<path d="${d}" transform="translate(0,2.2)" fill="none" stroke="#2868ef" stroke-width="2" stroke-linecap="butt"/>`);
   }
 }
 const markers=[{result:a,color:'#d4ad2c',label:'현재'},...(showChanged?[{result:b,color:'#2868ef',label:'변경'}]:[])];
 markers.forEach((marker,i)=>{
   (marker.result.shortfallIntervals||[]).forEach((interval,k)=>{
     [{age:interval.start,type:'부족'},...(interval.end<end-1e-8?[{age:interval.end,type:'회복'}]:[])].forEach(event=>{
       if(event.age<start||event.age>end)return;
       const xpos=x(event.age),pt=marker.result.points.find(p=>p.age>=event.age+1/12-1e-6);
       parts.push(`<line x1="${xpos}" x2="${xpos}" y1="${T}" y2="${H-B}" stroke="${marker.color}" stroke-width="1.2" stroke-dasharray="${event.type==='회복'?'2 4':'4 5'}" opacity=".75"/>`);
       if(pt)parts.push(`<circle cx="${xpos}" cy="${y(pt.paid)}" r="4" fill="${marker.color}" stroke="white" stroke-width="1.5"/>`);

     });
   });
 });
 svg.innerHTML=parts.join('');
 const eventContainer=$('graphEvents');eventContainer.replaceChildren();
 const explanation=$('recoveryExplain');
 // Restore the compact retirement-income-gap event cards. Derive every event
 // from the SAME monthly paid/wanted values used by the graph.
 const monthStatus=p=>p.paid<=0.005?'zero':p.paid<p.wanted-0.005?'partial':'full';
 const stateColor={zero:'#ef4760',partial:'#ed8b16',full:'#16865a'};
 const eventTitle=(state,previous)=>state==='full'?'생활비 부족 해소':previous==='full'?'생활비 부족 발생':state==='zero'?'생활비 충당액 0원':'생활비 일부 충당';
 const formatWhen=age=>{const total=Math.round(age*12);return `${Math.floor(total/12)}세 ${total%12+1}개월째`;};
 let hasEvents=false;
 markers.forEach(marker=>{
   const rows=marker.result.points.slice(1).filter(p=>p.age>=(marker.result.points[0]?.age??start));
   const events=[];let previous='full';
   rows.forEach((row,i)=>{
     const state=monthStatus(row),age=row.age-1/12;
     if(state!==previous){
       const title=eventTitle(state,previous);
       const reason=state==='zero'?'해당 월에 희망 생활비로 충당할 수 있는 금액이 0원이에요.':state==='partial'?'일부 생활비는 충당하지만 희망 생활비에는 미치지 못해요.':'연금 등으로 희망 생활비 전액을 충당할 수 있게 되었어요.';
       events.push({age,state,title,reason});
     }
     previous=state;
   });
   // Pension-start event is shown even when shortfall continues.
   const pensionStart=marker.label==='현재'?original.pensionStart:changed.pensionStart;
   if(Number.isFinite(pensionStart)&&pensionStart>=start&&pensionStart<end){
     const row=rows.find(p=>Math.abs((p.age-1/12)-pensionStart)<1/24);
     if(row){const state=monthStatus(row);events.push({age:pensionStart,state,title:'국민연금 수령 개시',reason:state==='zero'?'국민연금 수령이 시작되었지만 현재가치 기준 생활비 충당액은 0원으로 표시돼요.':state==='partial'?'국민연금 수령이 시작됐지만 생활비 부족은 계속돼요.':'국민연금 수령이 시작되어 희망 생활비를 충당하는 데 도움이 돼요.'});}
   }
   events.sort((a,b)=>a.age-b.age||(a.title==='국민연금 수령 개시'?1:-1));
   if(!events.length){const msg=document.createElement('p');msg.className='gap-no-events';msg.textContent=`${marker.label} 계획 · ${end}세까지 희망 생활비를 모두 충당할 수 있는 것으로 추정돼요.`;eventContainer.appendChild(msg);return;}
   hasEvents=true;
   const group=document.createElement('section');group.className='gap-event-group';
   const heading=document.createElement('h3');heading.textContent=marker.label+' 계획';heading.style.color=marker.color;group.appendChild(heading);
   events.forEach(ev=>{
     const item=document.createElement('div');item.className='gap-event-item';item.style.borderLeftColor=stateColor[ev.state];
     const title=document.createElement('strong');title.textContent=`${formatWhen(ev.age)} · ${ev.title}`;title.style.color=stateColor[ev.state];
     const reason=document.createElement('p');reason.textContent=ev.reason;
     item.append(title,reason);group.appendChild(item);
   });
   eventContainer.appendChild(group);
 });
 explanation.textContent='IRP는 설정한 수령 조건을 충족한 경우에만 인출하는 것으로 가정하며, 중도해지·연금 외 수령 및 세금은 계산에 포함하지 않았어요.';

}
function reset(){resultsApplied=false;window.irpPreviewTouched=false;data={};$('houseOn').checked=false;$('housePrice').value=50000;$('houseAge').value=70;$('houseInputs').classList.remove('hidden');document.querySelector('input[name="irpMode"][value="transfer"]').checked=true;$('irpMonthly').value=0;$('irpRate').value=2.99;$('irpOtherDeduction').value=0;$('irpTaxBand').value='14.85';resetDetails();['pendingMain','pendingIrp','pendingHouse'].forEach(id=>$(id).textContent='');show('home')}

decorateMoneyInputs();
function toggleFutureSettings(){
 const panel=document.getElementById('futureSettings'),btn=document.getElementById('futureToggle');
 const willOpen=panel.classList.contains('hidden');
 panel.classList.toggle('hidden',!willOpen);
 btn.setAttribute('aria-expanded',String(willOpen));
 btn.textContent=willOpen?'미래 계획 설정값 접기 −':'미래 계획 설정값 펼치기 ＋';
}
function updateFuturePreview(){
 const main=document.getElementById('futurePreviewGain');if(!main||!data||!Number.isFinite(data.save))return;
 const base={...data,...defaults,houseOn:false,houseMonthly:0,irpMonthly:0,irpRate:3,
 pension:data.noPension?0:(data.pension===0?AVG_PENSION:data.pension)};
 if(!(base.age<base.retire&&base.retire<base.end))return;
 const normal=simulate(base),boosted=simulate({...base,save:base.save*1.2});
 const first=normal.firstShortfall,second=boosted.firstShortfall;
 const show=r=>r.firstShortfall===null?`${base.end}세까지 충당 가능`:`${ageLabel(r.firstShortfall)}부터 부족`;
 document.getElementById('futurePreviewBase').textContent=show(normal);
 document.getElementById('futurePreviewBoost').textContent=show(boosted);
 if(first===null){main.textContent='현재 계획도 목표 기간 충당 가능';}
 else if(second===null){main.textContent=`${base.end}세까지 생활비 충당 가능`;}
 else {const months=Math.round((second-first)*12),sign=months>=0?'+':'−',n=Math.abs(months);
   main.textContent=months===0?'부족 시점 변화 없음':`${sign}${Math.floor(n/12)}년 ${n%12}개월 연장`;
 }
 document.getElementById('futurePreviewDesc').textContent=`예시: 월 ${money(base.save)} → ${money(base.save*1.2)} (+20%) · IRP/주택연금 미적용 · 나머지 최초 입력 조건 동일 · 버튼을 눌러야 최종 그래프에 반영됩니다.`;
}

// v10: 입력만으로 최종 그래프를 바꾸지 않되, 예상 효과 카드는 즉시 갱신.
document.addEventListener('DOMContentLoaded',()=>{
 ['irpMonthly','irpStrategy','irpSafeWeight','irpRateDetail','save2','preRate','postRate','inflationRate','retire2'].forEach(id=>{
   const el=document.getElementById(id);if(!el)return;
   el.addEventListener('input',()=>{if(['irpMonthly','irpStrategy','irpSafeWeight','irpRateDetail'].includes(id))window.irpPreviewTouched=true;queueMicrotask(updateIrpPreviewLive);});
   el.addEventListener('change',()=>{if(['irpMonthly','irpStrategy','irpSafeWeight','irpRateDetail'].includes(id))window.irpPreviewTouched=true;queueMicrotask(updateIrpPreviewLive);});
 });
 document.querySelectorAll('input[name="irpMode"]').forEach(el=>el.addEventListener('change',()=>{window.irpPreviewTouched=true;queueMicrotask(updateIrpPreviewLive)}));
});
