
const questions=[
['현재 몇 살이신가요?','지금 나이를 알려주세요.','age','세',25],
['몇 살에 은퇴하고 싶으신가요?','일을 그만두고 싶은 나이를 입력해 주세요.','retire','세',60],
['은퇴 후 매달 얼마를 쓰고 싶으신가요?','지금 돈의 가치로 생각해 주세요.','spend','만원',250],
['현재 모아둔 저축·투자금은 얼마인가요?','집값과 퇴직연금(DB·DC), 개인연금, IRP에 있는 돈은 제외해 주세요.','assets','만원',3000],
['매달 얼마를 저축할 수 있나요?','일반 저축과 개인적으로 납입하는 IRP·연금저축을 포함해 주세요. 회사가 납입하는 DB·DC 부담금은 제외해 주세요.','save','만원',80],
['국민연금을 매달 얼마나 받을 예정인가요?','모르시면 0을 입력하세요. 통계 평균 월 64.8만원으로 임시 계산해요.','pension','만원',0],
['몇 살까지 생활비를 준비할까요?','노후 자금을 준비할 목표 나이예요.','end','세',95],
['현재 직장 퇴직연금은 어떤 방식인가요?','DB·DC를 모르면 건너뛰어도 괜찮아요. 퇴직급여는 추정해서 임의로 더하지 않을게요.','workType','선택','unknown']];
const AVG_PENSION=64.7543;let step=0;let data={};const $=id=>document.getElementById(id);const money=n=>Math.round(n).toLocaleString('ko-KR')+'만원';
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
function advance(){if(!saveStep())return;if(step<questions.length-1){step++;render()}else{if(!(data.age<data.retire&&data.retire<data.end)){alert('현재 나이 < 은퇴 나이 < 목표 나이 순서로 입력해 주세요.');return}show('results');$('save2').value=data.save;$('retire2').value=data.retire;$('spend2').value=data.spend;$('pension2').value=data.pension===0&&!data.noPension?AVG_PENSION.toFixed(1):data.pension;recalc()}}
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
 let balance=d.assets,irpBalance=0,workBalance=d.workType==='dc'?(d.workDCBalance||0):0,atRetire=0,irpAtRetire=0,workAtRetire=0,firstShortfall=null,firstDepletion=null,months=[];
 const workR=Math.pow(1+(d.dcRate??3)/100,1/12)-1;
 const irpR=Math.pow(1+(d.irpRate??3)/100,1/12)-1,irpPay=d.irpMonthly??0;
 // 개인 납입금만 있는 신규 IRP 가정: 55세 및 가입 후 5년을 모두 충족해야 연금 수령 가능.
 const irpEligibilityAge=Math.max(55,d.age+5),irpStartAge=Math.max(irpEligibilityAge,d.irpStartAge??60);
 let irpAnnualBucket=null,irpAnnualLimit=0,irpAnnualUsed=0;
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
   balance=Math.max(0,balance*(1+after));irpBalance=Math.max(0,irpBalance*(1+irpR));
   const national=age>=d.pensionStart?d.pension*factor:0;
   const privateNow=age>=d.privateStart&&age<d.privateEnd?d.privatePension*factor:0;
   const housing= d.houseOn && age>=d.houseAge ? d.houseMonthly : 0;
   const income=national+privateNow+housing;
   // 정기 연금소득이 생활비를 초과하면 잉여 현금흐름을 일반 금융자산에 적립.
   // 해당 월 운용수익 계산 후 적립하므로 잉여금은 다음 달부터 수익 발생.
   const surplus=Math.max(0,income-wanted);
   balance+=surplus;
   const gap=Math.max(0,wanted-income);
   const liquidBeforeWithdrawal=balance;
   const irpBeforeWithdrawal=irpBalance;
   // 연금수령연차는 연금개시 신청 연도가 아니라 연금수령 요건을 최초 충족한 연도부터 계산.
   // 출생월·달력연도 정보가 없어 연령 구간을 과세연도 대용으로 쓰는 단순 추정.
   const irpEligible=age>=irpStartAge;
   if(irpEligible){
     const bucket=Math.floor(age+1e-8);
     if(bucket!==irpAnnualBucket){
       irpAnnualBucket=bucket;irpAnnualUsed=0;
       const pensionYear=Math.max(1,Math.floor(bucket-irpEligibilityAge)+1);
       irpAnnualLimit=(d.irpWithdrawalMode==='unrestricted'||pensionYear>=10)?Infinity:Math.max(0,irpBalance*1.2/(11-pensionYear));
     }
   }
   const irpAvailable=irpEligible?Math.min(irpBalance,Math.max(0,irpAnnualLimit-irpAnnualUsed)):0;
   const paid=Math.min(wanted,income+balance+irpAvailable);
   const withdrawal=Math.min(balance,gap);
   balance=Math.max(0,balance-withdrawal);
   const irpWithdrawal=irpEligible?Math.min(irpAvailable,Math.max(0,gap-withdrawal)):0;
   irpAnnualUsed+=irpWithdrawal;
   irpBalance=Math.max(0,irpBalance-irpWithdrawal);
   if(firstDepletion===null&&gap>0&&balance+irpAvailable-withdrawal-irpWithdrawal<=1e-7)firstDepletion=age;
   if(firstShortfall===null&&paid+1e-7<wanted)firstShortfall=age;
   months.push({age:ageEnd,paid:paid/factor,wanted:wantedReal,balance:balance+irpBalance, liquid:balance,irp:irpBalance,liquidBeforeWithdrawal,irpBeforeWithdrawal,irpEligible,irpAvailable,irpWithdrawal,regularIncome:income/factor,shortfall:Math.max(0,wanted-paid)/factor,withdrawal, pensionStarted:age>=d.pensionStart});
 }
 return {months,points:[{age:d.retire,paid:months[0]?.paid??0,wanted:months[0]?.wanted??d.spend},...months],atRetire,irpAtRetire,workAtRetire,ending:balance+irpBalance,firstShortfall,firstDepletion};
}
function gapEvents(result, d){
 const ms=result.months||[];
 const events=[];
 let active=false;
 for(let i=0;i<ms.length;i++){
  const row=ms[i], prev=ms[i-1];
  const shortage=row.shortfall>0.01;
  const start=!active&&shortage, end=active&&!shortage;
  const zeroNow=shortage&&row.paid<0.005;
  const zeroBefore=!!prev&&prev.shortfall>0.01&&prev.paid<0.005;
  const irpBegins=i>0&&!prev.irpEligible&&row.irpEligible&&row.irpBeforeWithdrawal>0.01;
  const pensionBegins=i>0&&!prev.pensionStarted&&row.pensionStarted;
  const age=Math.floor(row.age-1/12+1e-7);
  const month=Math.floor(((row.age-1/12)-age)*12+1e-6)+1;
  const when=`${age}세 ${month}개월째`;
  if(start){
   let reason='희망 생활비를 충당할 수 있는 현금흐름이 부족해졌어요.';
   if(row.liquidBeforeWithdrawal<=0.01&&row.irpBeforeWithdrawal>0.01&&!row.irpEligible) reason='일반 금융자산이 부족하지만 IRP는 아직 설정한 수령 개시 나이 전이라 사용할 수 없어요.';
   else if(row.irpEligible&&row.irpBeforeWithdrawal>0.01&&row.irpAvailable<=0.01) reason='IRP 잔액이 남아 있지만 설정된 연금수령한도 때문에 이번 달 인출 가능액이 부족해요.';
   else if(row.liquidBeforeWithdrawal<=0.01&&row.irpBeforeWithdrawal<=0.01) reason='일반 금융자산과 IRP 잔액이 부족해 생활비를 전액 충당하기 어려워요.';
   else if(row.liquidBeforeWithdrawal<=0.01&&row.irpEligible) reason='일반 금융자산이 부족하고 IRP 인출 가능액만으로도 생활비를 모두 충당하기 어려워요.';
   events.push({type:zeroNow?'gap':'partial',when,title:zeroNow?'생활비 충당 불가':'생활비 부족 발생',reason:zeroNow?'이번 달 충당 가능한 생활비가 0원이에요.':reason});
  }
  if(!start&&zeroNow&&!zeroBefore)events.push({type:'gap',when,title:'생활비 충당 불가',reason:'이번 달 충당 가능한 생활비가 0원이에요.'});
  if(irpBegins)events.push({type:shortage?(row.paid>=0.005?'partial':'gap'):'resume',when,title:'IRP 수령 개시',reason:shortage?'IRP 인출이 가능해졌지만 생활비 부족이 계속돼요.':'IRP 인출이 가능해져 생활비 충당에 활용할 수 있어요.'});
  if(pensionBegins)events.push({type:shortage?(row.paid>=0.005?'partial':'gap'):'resume',when,title:'국민연금 수령 개시',reason:shortage?'국민연금 수령이 시작됐지만 생활비 부족은 계속돼요.':'국민연금 수령이 시작되어 생활비 충당에 도움이 돼요.'});
  if(end)events.push({type:'resume',when,title:'생활비 부족 해소',reason:'연금 등 인출 가능한 현금흐름이 증가해 이번 달부터 희망 생활비를 충당할 수 있어요.'});
  active=shortage;
 }
 return events;
}
function renderGapAnalysis(a,b,baseline,modified,changed){
 const root=$('gapAnalysis');if(!root)return;
 const scenarios=[{label:'현재 계획',r:a,d:baseline,cls:'base'},...(changed?[{label:'변경 계획',r:b,d:modified,cls:'modified'}]:[])];
 root.replaceChildren();
 const h=document.createElement('h2');h.textContent='은퇴소득 공백 분석';root.appendChild(h);
 const intro=document.createElement('p');intro.className='gap-intro';intro.textContent='금융자산이 남아 있어도 IRP 인출 시점·한도에 따라 생활비 공백이 생길 수 있어요. 아래 시점은 월별 시뮬레이션 결과예요.';root.appendChild(intro);
 for(const s of scenarios){
  const section=document.createElement('section');section.className='gap-scenario '+s.cls;
  const title=document.createElement('h3');title.textContent=s.label;section.appendChild(title);
  const ev=gapEvents(s.r,s.d);
  if(!s.r.months.some(row=>row.shortfall>0.01)){
   const p=document.createElement('p');p.className='gap-empty';p.textContent=`${s.d.end}세까지 희망 생활비를 모두 충당할 수 있는 것으로 추정돼요.`;section.appendChild(p);
  }else{
   for(const e of ev.slice(0,12)){
    const item=document.createElement('div');item.className='gap-event '+e.type;
    const label=document.createElement('strong');label.textContent=e.when+' · '+e.title;
    const desc=document.createElement('p');desc.textContent=e.reason;
    item.append(label,desc);section.appendChild(item);
   }
   if(ev.length>12){const p=document.createElement('p');p.className='gap-more';p.textContent=`이후 ${ev.length-12}개 변화는 생략했어요.`;section.appendChild(p)}
  }
  root.appendChild(section);
 }
 const caveat=document.createElement('p');caveat.className='gap-disclaimer';caveat.textContent='IRP는 설정한 수령 조건을 충족한 경우에만 인출하는 것으로 가정하며, 중도해지·연금 외 수령 및 세금은 계산에 포함하지 않았어요.';root.appendChild(caveat);
}
function ageLabel(age){if(age===null)return null;return `${Math.floor(age+1e-8)}세`}

/* Explicit application: typing does not update results or graph. */
function toggleHouseInputs(){ $('houseInputs').classList.toggle('hidden',!$('houseOn').checked); }
function markPending(el){
 const id=el?.id||'';
 const house=el?.closest?.('#housingCard');
 const irp=el?.closest?.('#irpCard');
 const target=house?'pendingHouse':irp?'pendingIrp':'pendingMain';
 const hint=$(target);if(hint)hint.textContent='변경사항이 있어요. 버튼을 누르면 결과에 반영돼요.';
}
function applyResults(){
 recalc();
 // Validation messages are preserved, but a failed calculation must not clear pending state.
 if($('irpValidation').textContent)return;
 ['pendingMain','pendingIrp','pendingHouse'].forEach(id=>$(id).textContent='');
}


function togglePreviewSetup(kind){
 const panel=$(kind+'Setup'),btn=$(kind+'OpenBtn'),opening=panel.classList.contains('hidden');
 panel.classList.toggle('hidden',!opening);btn.setAttribute('aria-expanded',String(opening));
 btn.textContent=kind==='future'?(opening?'미래 계획 상세 설정 접기 ↑':'나의 미래 계획 자세히 설정하기 →'):(opening?'주택연금 상세 설정 접기 ↑':'나에게 맞는 주택연금 설정하기 →');
}
function teaserDurationChange(before,after){
 const count=r=>r.months.filter(m=>m.shortfall<=0.01).length;
 const diff=count(after)-count(before),abs=Math.abs(diff);
 return {diff,text:diff===0?'변화 없음':(diff>0?'+':'−')+Math.floor(abs/12)+'년 '+abs%12+'개월'};
}
function updateOtherTeasers(base){
 const original=simulate(base);
 const boosted={...base,save:base.save*1.2};const future=simulate(boosted);
 const fd=teaserDurationChange(original,future),fa=future.atRetire-original.atRetire;
 $('futureTeaserAsset').textContent=(fa>0?'+':fa<0?'−':'')+money(Math.abs(fa));
 $('futureTeaserYears').textContent=fd.text;
 $('futureTeaserAsset').classList.toggle('irp-teaser-negative',fa<0);
 $('futureTeaserYears').classList.toggle('irp-teaser-negative',fd.diff<0);
 $('futureTeaserBasis').textContent=`월 ${money(base.save)} → ${money(boosted.save)} · 일반저축 연 ${base.preRate}% 가정 · 목표 연령까지 전액 충당 월수 합계 기준`;
 const exampleAge=70,examplePrice=50000,monthly=houseEstimate(exampleAge,examplePrice);
 const housing=simulate({...base,houseOn:true,houseAge:exampleAge,houseMonthly:monthly});
 const hd=teaserDurationChange(original,housing);
 $('houseTeaserMonthly').textContent=monthly.toFixed(1)+'만원/월';
 $('houseTeaserYears').textContent=hd.text;
 $('houseTeaserYears').classList.toggle('irp-teaser-negative',hd.diff<0);
 $('houseTeaserBasis').textContent='70세부터 월 지급 가정 · 기존 계획 대비 목표 연령까지 희망 생활비 전액 충당 월수 합계 기준';
}

function toggleIrpSetup(){
 const panel=$('irpSetup'),opening=panel.classList.contains('hidden');
 panel.classList.toggle('hidden',!opening);
 $('irpOpenBtn').setAttribute('aria-expanded',String(opening));
 $('irpOpenBtn').textContent=opening?'IRP 상세 설정 접기 ↑':'나에게 맞는 IRP 계획 설정하기 →';
 if(opening){$('irpStrategy').value='fund';updateIrpStrategy();markPending($('irpStrategy'));}
}
function updateIrpTeaser(base){
 const proposed=Math.min(150,Math.max(0,Math.round((data.save/2)*10)/10));
 const scenario={...base,save:base.save-proposed,irpMonthly:proposed,irpRate:4.48,irpStartAge:60,irpWithdrawalMode:'limit'};
 const before=simulate(base),after=simulate(scenario),difference=after.atRetire-before.atRetire;
 const prefix=difference>0?'+':difference<0?'−':'';
 $('irpTeaserAsset').textContent=prefix+money(Math.abs(difference));
 const fundedMonths=result=>result.months.filter(row=>row.shortfall<=0.01).length;
 const delta=fundedMonths(after)-fundedMonths(before);
 $('irpTeaserYears').textContent=delta===0?'변화 없음':(delta>0?'+':'−')+Math.floor(Math.abs(delta)/12)+'년 '+Math.abs(delta)%12+'개월';
 $('irpTeaserYears').classList.toggle('irp-teaser-negative',delta<0);
 $('irpTeaserAsset').classList.toggle('irp-teaser-negative',difference<0);
 $('irpTeaserBasis').textContent=proposed>0?`월 저축 ${money(data.save)} 중 ${money(proposed)}을 IRP로 이전 · 일반저축 연 ${base.preRate}% / IRP ETF·펀드 중심 연 4.48% · 은퇴 후 희망 생활비 전액 충당 가능 월수 기준`:'월 저축액이 0원이므로 이전할 금액이 없습니다.';
}
function recalc(){
 let custom=settings();updateIrpStrategy();let irpMonthly=Number($('irpMonthly').value),irpMode=document.querySelector('input[name="irpMode"]:checked')?.value||'transfer',irpRate=Number($('irpRate').value),irpOtherDeduction=Number($('irpOtherDeduction').value);let d={...data,...custom,irpMonthly,irpRate,irpStartAge:Number($('irpStartAge').value),irpWithdrawalMode:document.querySelector('input[name="irpWithdrawalMode"]:checked')?.value||'limit',save:Number($('save2').value)-(irpMode==='transfer'?irpMonthly:0),retire:Number($('retire2').value),spend:Number($('spend2').value),pension:Number($('pension2').value)};
 const houseOn=$('houseOn').checked,houseAge=Number($('houseAge').value),housePrice=Number($('housePrice').value),houseSpouse=Number($('houseSpouse').value);
 const houseReferenceAge=houseSpouse>0?Math.min(houseAge,houseSpouse):houseAge;
 const houseMonthly=houseEstimate(houseReferenceAge,housePrice);
 Object.assign(d,{houseOn,houseAge,houseMonthly});
 $('houseInputs').classList.toggle('hidden',!houseOn);
 $('houseMonthly').textContent=houseMonthly.toFixed(1)+'만원/월';
 $('houseBasis').textContent=`공식 조견표 보간 · 기준 ${houseReferenceAge}세 / 시세 ${(housePrice/10000).toFixed(1)}억원`;
 $('houseWarning').textContent=houseOn?(houseReferenceAge>80?'80세 초과: 80세 조견표 상한값 적용 · 공식 조회 권장':housePrice>120000?'시세 12억원 초과: 12억원까지만 월지급액 산정 · 공시가격 가입요건 별도 확인':houseAge<55?'가입 나이는 55세 이상이어야 합니다.':'실제 지급액과 가입 가능 여부는 공식 조회로 확인하세요.') : '';
 const displayedSaving=Number($('save2').value);
 const nums=[d.irpStartAge,houseAge,housePrice,houseSpouse,d.save,displayedSaving,d.retire,d.spend,d.pension,irpMonthly,irpRate,irpOtherDeduction,...fields.map(k=>d[k])];
 const valid=nums.every(Number.isFinite)&&(!houseOn||(houseAge>=55&&houseAge<=95&&housePrice>=10000&&housePrice<=300000&&houseSpouse>=0&&houseSpouse<=95&&houseSpouse<=houseAge))&&d.save>=0&&displayedSaving>=0&&d.irpStartAge>=55&&d.irpStartAge<=95&&d.irpStartAge>=d.age+5&&irpMonthly>=0&&irpMonthly<=150&&irpRate>=-50&&irpRate<=30&&d.dcRate>=-50&&d.dcRate<=30&&irpOtherDeduction>=0&&irpOtherDeduction<=900&&d.spend>=0&&d.pension>=0&&d.retire>d.age&&d.retire<d.end&&d.pensionStart>=50&&d.pensionStart<=85&&d.privatePension>=0&&d.privateStart>=40&&d.privateEnd>d.privateStart&&d.privateEnd<=110&&[d.spend70,d.spend80,d.spend90].every(x=>x>=0&&x<=300)&&d.preRate>=-50&&d.preRate<=30&&d.postRate>=-50&&d.postRate<=30&&d.inflationRate>=-10&&d.inflationRate<=30;
 if(!valid){$('irpValidation').textContent=irpMonthly>150?'IRP는 월 150만원까지 입력할 수 있어요. 200만원을 저축한다면 일반 저축 50만원 + IRP 150만원으로 설정해 주세요.':irpMode==='transfer'&&irpMonthly>displayedSaving?'IRP 납입액이 월 저축액보다 많아요.':d.irpStartAge<Math.max(55,d.age+5)?`IRP 신규 가입 기준 연금 개시 나이는 ${Math.max(55,d.age+5)}세 이상이어야 해요.`:'입력값을 확인해 주세요.';$('irpAllocation').textContent='현재 입력값으로는 계산할 수 없어요.';$('irpBalance').textContent='계산 불가';$('irpTax').textContent='계산 불가';$('irpSummary').textContent='입력값 수정 후 다시 계산해요.';$('irpComparisonNote').style.display='none';$('editHint').textContent=irpMode==='transfer'&&irpMonthly>displayedSaving?'IRP로 옮기는 금액은 현재 월 저축액을 넘을 수 없어요.':'입력값을 확인해 주세요. 연금 종료 나이는 시작 나이보다 커야 해요.';$('editHint').classList.remove('hidden');return}
 $('irpValidation').textContent='';
 let baseline={...data,...defaults,irpStartAge:60,irpWithdrawalMode:'limit',houseOn:false,houseMonthly:0,irpMonthly:0,irpRate:3,pension:data.noPension?0:(data.pension===0?AVG_PENSION:data.pension)};
 let a=simulate(baseline),b=simulate(d);
 updateIrpTeaser(baseline);updateOtherTeasers(baseline);
 const changed=houseOn||irpMonthly>0||Math.abs(displayedSaving-data.save)>1e-8||Math.abs(d.retire-data.retire)>1e-8||Math.abs(d.spend-data.spend)>1e-8||Math.abs(d.pension-baseline.pension)>0.051||fields.some(k=>(k!=='irpRateDetail'||irpMonthly>0)&&Math.abs(d[k]-defaults[k])>1e-8)||d.ageSpending!==defaults.ageSpending;
 ['changedStatusCard','changedLegend','changedDetails'].forEach(k=>$(k).classList.toggle('hidden',!changed));
 $('editHint').classList.toggle('hidden',changed);$('editHint').textContent='조건을 수정한 뒤 ‘결과 변경’ 버튼을 눌러주세요.';
 $('pensionNote').textContent='최초 입력: '+(data.noPension?'연금 미수령(0원)':data.pension===0?'국민연금 통계 평균 약 64.8만원 자동 적용':'직접 입력 '+data.pension+'만원')+' · 변경 시 주황색 계획에 반영돼요.';
 $('atRetire').textContent=money(a.atRetire);
 $('workPensionSummary').textContent=data.workType==='db'?`DB형 예상 퇴직급여 ${money(a.workAtRetire)} 포함 · 세전 단순 추정`:
 data.workType==='dc'?`DC형 예상 퇴직급여 ${money(a.workAtRetire)} 포함 · 연 3% 기본 수익률 가정`:
 '퇴직급여 계산 제외';
 $('irpBalance').textContent=money(b.irpAtRetire);
 $('irpCurrentSaving').textContent=money(displayedSaving);
 $('irpAllocation').textContent=irpMode==='transfer'?`일반 저축 ${money(d.save)} + IRP ${money(irpMonthly)} = 월 총 ${money(displayedSaving)} (기존 저축 유지)`:`일반 저축 ${money(displayedSaving)} + IRP ${money(irpMonthly)} = 월 총 ${money(displayedSaving+irpMonthly)} (추가 저축)`;
 const deduction=Math.max(0,Math.min(irpMonthly*12,900-irpOtherDeduction));
 const tax=deduction*Number($('irpTaxBand').value)/100;
 $('irpTax').textContent=tax.toFixed(1)+'만원/년';
 $('irpSummary').textContent=irpMonthly===0?'IRP 납입액을 입력하면 비교 그래프에 반영돼요.':`월 ${money(irpMonthly)} · ${irpMode==='transfer'?'기존 저축 재배분':'추가 저축'} · 연 납입 ${money(irpMonthly*12)} · 공제 대상 ${money(deduction)}`;
 const note=$('irpComparisonNote');
 note.style.display=irpMonthly>0?'block':'none';
 if(irpMonthly>0){
  const pre=d.preRate,irp=d.irpRate;
  const comparison=irpMode==='transfer'
   ? `월 총저축 동일 · 일반 연 ${pre}% / IRP 연 ${irp}%`
   : `월 총저축 ${money(irpMonthly)} 증가 · 추가 납입 효과 포함`;
  note.innerHTML=`<strong>IRP 비교 기준</strong><br>${comparison}<br><strong>IRP 인출:</strong> ${d.irpStartAge}세부터 · ${d.irpWithdrawalMode==='limit'?'연간 연금수령한도 적용':'한도 미적용(연금 외 수령 가능)'}<br><strong>주의:</strong> 세액공제액·수령세금·수수료 미반영`;
 }

 $('status').textContent=a.firstShortfall===null?`${data.end}세까지 충당 가능`:`${ageLabel(a.firstShortfall)}부터`; 
 $('statusChanged').textContent=b.firstShortfall===null?`${data.end}세까지 충당 가능`:`${ageLabel(b.firstShortfall)}부터`; 
 $('newAsset').textContent=money(b.atRetire);
 let diff=b.ending-a.ending;$('delta').textContent=(diff>=0?'+':'')+money(diff);
 $('summary').textContent='';
 $('graphNote').textContent=`IRP 수령 ${d.irpStartAge}세 시작 · ${d.irpWithdrawalMode==='limit'?'세법상 연금수령한도 적용':'한도 미적용(연금 외 수령 과세 가능)'} · 월별 계산 · 현재 가치 표시 · 국민연금 65세 개시 · 기본 수익률 연 3% · 물가 연 2%. DB·DC 퇴직급여는 은퇴 시 세전 일시금 합산. 입력 연금은 물가 연동 가정. 초과 연금소득은 일반 금융자산에 재적립.`;
 const fmt=r=>r.firstShortfall===null?`${data.end}세까지 부족 없음`:`${ageLabel(r.firstShortfall)}부터 부족`;
 if(!changed)$('comparisonNote').textContent='현재 계획만 표시하고 있어요. 아래 숫자를 바꾸면 변경 계획을 비교할 수 있어요.';
 else if(Math.abs((a.firstShortfall??-1)-(b.firstShortfall??-1))<1/24){
   const age=a.firstShortfall;
   const thresholds=[70,80,90].filter(t=>d.ageSpending&&t>=d.retire&&t<d.end&&spendingAt(d,t)!==spendingAt(baseline,t));
   const later=age!==null&&thresholds.length>0&&thresholds.every(t=>t>age);
   $('comparisonNote').textContent=`두 계획의 최초 부족 시점이 같아요 (${fmt(a)}). ${later?'변경한 연령별 생활비는 최초 부족 시점 이후에 적용되어 시작 시점에 영향을 주지 않아요.':'변경 조건이 최초 부족 시점을 바꾸지 않았어요. 그래프에서 이후 월별 차이를 확인하세요.'}`;
 }else $('comparisonNote').textContent=`현재 계획: ${fmt(a)} · 변경 계획: ${fmt(b)}`;
 $('graphExplanation').textContent='실선은 월별 충당 가능한 생활비입니다. 급격한 변화 구간은 선을 분리해 표시하며, 원형 표시는 첫 생활비 부족 시점입니다. 국민연금 개시 후 충당액이 다시 늘어날 수 있습니다.';
 draw(a,b,baseline,d,changed);
 renderGapAnalysis(a,b,baseline,d,changed);
 renderActions(d,b);


}


function renderReport(base,original,modified,updated,changed){
 const d=changed?modified:base,r=changed?updated:original;
 const age=r.firstShortfall===null?null:Math.floor(r.firstShortfall+1e-8);
 $('reportRetire').textContent=d.retire+'세';
 const yearsToRetire=d.retire-d.age;
 const inflationMultiple=Math.pow(1+d.inflationRate/100,yearsToRetire);
 const assetPV=r.atRetire/inflationMultiple;
 $('reportAssets').textContent=money(assetPV);
 $('reportAssetsNominal').textContent=`${d.retire}세 명목 ${money(r.atRetire)} · 물가 ${d.inflationRate}% 반영`;
 $('reportSpend').textContent=money(d.spend)+'/월';
 $('reportSpendFuture').textContent=`${d.retire}세 필요 ${money(d.spend*inflationMultiple)}/월 (명목)`;
 const principalFuture=d.assets*Math.pow(1+d.preRate/100,yearsToRetire);
 const generalFuture=Math.max(0,r.atRetire-r.irpAtRetire-r.workAtRetire);
 const savedFuture=generalFuture-principalFuture;
 const irpFuture=r.irpAtRetire;
 const retirementPay=r.workAtRetire;
 const parts=[['기존 금융자산 운용 후',money(principalFuture)],['월 일반저축 적립 후',money(savedFuture)],['개인형 IRP 적립 후',money(irpFuture)],['DB·DC 퇴직급여',money(retirementPay)]];
 const breakdown=$('reportAssetBreakdown');breakdown.replaceChildren();
 for(const [label,value] of parts){const row=document.createElement('div');row.className='diagnostic-row';const name=document.createElement('span'),num=document.createElement('b');name.textContent=label;num.textContent=value;row.append(name,num);breakdown.append(row)}
 $('reportShortfall').textContent=age===null?`${d.end}세까지 부족 없음`:`${age}세부터`;
 const verdict=$('reportVerdict');verdict.replaceChildren();
 const heading=document.createElement('strong'),sub=document.createElement('p');
 const years=age===null?d.end-d.retire:Math.max(0,age-d.retire);
 heading.textContent=age===null?'목표 기간 충당 가능':years<10?'은퇴 초기 자금 부족 위험':'노후 후반 자금 부족 위험';
 sub.textContent=age===null?`${d.end}세까지 목표 생활비 충당 가능 (설정 가정 기준)`:`은퇴 ${d.retire}세 → 생활비 부족 ${age}세 · 약 ${years}년 유지`;
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
 const svg=$('graph'),W=460,H=265,L=48,R=18,T=22,B=37;
 const start=Math.min(original.retire,showChanged?changed.retire:original.retire);
 const end=original.end;
 const aa=a.points.filter(p=>p.age>=start-1e-7&&p.age<=end+1e-7);
 const bb=showChanged?b.points.filter(p=>p.age>=start-1e-7&&p.age<=end+1e-7):[];
 const all=[...aa,...bb];
 const maxVal=Math.max(1,...all.map(p=>Math.max(p.paid,p.wanted)))*1.12;
 const X=age=>L+(age-start)/Math.max(1,end-start)*(W-L-R);
 const Y=v=>T+(1-Math.max(0,v)/maxVal)*(H-T-B);
 const n=v=>Number(v).toFixed(2);
 const text=(x,y,s,anchor='middle',color='#8190a8',size=11)=>`<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-size="${size}" fill="${color}">${s}</text>`;
 const line=(x1,y1,x2,y2,color,width=1,dash='')=>`<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
 // Plot every monthly point in one continuous SVG path. Never insert path breaks,
 // artificial zero points, or disconnected shortfall markers.
 const path=points=>points.map((p,i)=>`${i?'L':'M'}${n(X(p.age))} ${n(Y(p.paid))}`).join(' ');
 const targetPath=d=>{
  const breaks=[start,...[70,80,90].filter(v=>v>start&&v<end),end];
  let s=`M${n(X(start))} ${n(Y(spendingAt(d,start)))}`;
  for(let i=1;i<breaks.length;i++){
   const age=breaks[i],prev=breaks[i-1];
   s+=` L${n(X(age))} ${n(Y(spendingAt(d,prev)))}`;
   if(i<breaks.length-1)s+=` L${n(X(age))} ${n(Y(spendingAt(d,age)))}`;
  }
  return s;
 };
 const parts=[];
 for(let i=0;i<=4;i++){
  const v=maxVal*i/4;
  parts.push(line(L,Y(v),W-R,Y(v),'#e9edf5'));
  parts.push(text(L-7,Y(v)+4,`${Math.round(v)}만`,'end'));
 }
 for(let age=Math.ceil(start/5)*5;age<=end;age+=5)parts.push(text(X(age),H-11,`${age}세`));
 // Light guide for the pension start, not a misleading shortfall marker.
 if(original.pensionStart>start&&original.pensionStart<end){
  const px=X(original.pensionStart);
  parts.push(line(px,T,px,H-B,'#c9d5e8',1,'3 5'));
  parts.push(text(px+3,T+11,'연금 개시','start','#8291a7',9));
 }
 parts.push(`<path d="${targetPath(original)}" fill="none" stroke="#7f8ba2" stroke-width="1.8" stroke-dasharray="5 5"/>`);
 const targetChanged=showChanged&&[start,70,80,90].some(t=>spendingAt(changed,t)!==spendingAt(original,t));
 $('changedTargetLegend').classList.toggle('hidden',!targetChanged);
 if(targetChanged)parts.push(`<path d="${targetPath(changed)}" fill="none" stroke="#a5aebd" stroke-width="1.8" stroke-dasharray="2 5"/>`);
 if(aa.length)parts.push(`<path d="${path(aa)}" fill="none" stroke="#2868ef" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`);
 if(bb.length)parts.push(`<path d="${path(bb)}" fill="none" stroke="#f18c2b" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`);
 // Labels belong in the status cards outside the plotting area, not floating on lines.
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 svg.innerHTML=parts.join('');
}
function reset(){['future','house'].forEach(k=>{const panel=$(k+'Setup'),btn=$(k+'OpenBtn');if(panel)panel.classList.add('hidden');if(btn){btn.setAttribute('aria-expanded','false');btn.textContent=k==='future'?'나의 미래 계획 자세히 설정하기 →':'나에게 맞는 주택연금 설정하기 →';}});data={};$('houseOn').checked=false;$('housePrice').value=30000;$('houseAge').value=70;$('houseSpouse').value=0;$('houseInputs').classList.add('hidden');document.querySelector('input[name="irpMode"][value="transfer"]').checked=true;$('irpMonthly').value=0;$('irpRate').value=2.99;$('irpOtherDeduction').value=0;$('irpTaxBand').value='14.85';resetDetails();['pendingMain','pendingIrp','pendingHouse'].forEach(id=>$(id).textContent='');show('home')}

decorateMoneyInputs();
// Survey URL: insert the user's survey link here when provided.
// Example: const LIFEPLAN_SURVEY_URL = 'https://...';
const LIFEPLAN_SURVEY_URL = 'https://naver.me/FRoTKRwP';
(function configureSurveyLink(){
  const link = document.getElementById('surveyLink');
  const status = document.getElementById('surveyStatus');
  if(!link) return;
  if(/^https:\/\//i.test(LIFEPLAN_SURVEY_URL)){
    link.href = LIFEPLAN_SURVEY_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '설문조사 참여하기 →';
    link.classList.remove('is-disabled');
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
    if(status) status.textContent = '버튼을 누르면 설문조사가 새 창에서 열립니다.';
  }
})();
