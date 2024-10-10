
const NEW_LINE = /\r\n|\n|\r/;
const COLON = ':';
// const COMMA = ",";
// const DQUOTE = "\"";
// const SEMICOLON = ";";
const SPACE = ' ';
/**
 * Take ical string data and convert to JSON
 */
function convert(source) {
    const output = {};
    const lines = source.split(NEW_LINE);
    let parentObj = {};
    let currentObj = output;
    const parents = [];
    let currentKey = '';
    for (let i = 0; i < lines.length; i++) {
        let currentValue = '';
        const line = lines[i];
        if (line.charAt(0) === SPACE) {
            currentObj[currentKey] += line.substring(1);
        }
        else {
            const splitAt = line.indexOf(COLON);
            if (splitAt < 0) {
                continue;
            }
            currentKey = line.substring(0, splitAt);
            currentValue = line.substring(splitAt + 1);
            switch (currentKey) {
                case 'BEGIN':
                    parents.push(parentObj);
                    parentObj = currentObj;
                    if (parentObj[currentValue] == null) {
                        parentObj[currentValue] = [];
                    }
                    // Create a new object, store the reference for future uses
                    currentObj = {};
                    parentObj[currentValue].push(currentObj);
                    break;
                case 'END':
                    currentObj = parentObj;
                    parentObj = parents.pop();
                    break;
                default:
                    if (currentObj[currentKey]) {
                        if (!Array.isArray(currentObj[currentKey])) {
                            currentObj[currentKey] = [currentObj[currentKey]];
                        }
                        currentObj[currentKey].push(currentValue);
                    }
                    else {
                        currentObj[currentKey] = currentValue;
                    }
            }
        }
    }
    return output;
}

function revert(object) {
  const lines = [];
  for (const key in object) {
      const value = object[key];
      if (Array.isArray(value)) {
          if (key === 'RDATE') {
              value.forEach((item) => {
                  lines.push(key + ':' + item);
              });
          }
          else {
              value.forEach((item) => {
                  lines.push('BEGIN:' + key);
                  lines.push(revert(item));
                  lines.push('END:' + key);
              });
          }
      }
      else {
          let fullLine = key + ':' + value;
          do {
              // According to ical spec, lines of text should be no longer
              // than 75 octets
              lines.push(fullLine.substring(0, 75));
              fullLine = SPACE + fullLine.substring(75);
          } while (fullLine.length > 1);
      }
  }
  return lines.join('\n');
}
const ics  = document.querySelector("#ics");
const calendar  = document.querySelector("#calendar");


const cors_api_url = 'https://cors-proxy.fringe.zone/';
function doCORSRequest(options, handler) {
  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + options.url);
  x.onload = x.onerror = function() {
    handler(
      options.method + ' ' + options.url + '\n' +
      x.status + ' ' + x.statusText + '\n\n' +
      (x.responseText || '')
    );
  };
  x.send(options.data);
}
function equalDay(a,b){
  return a.getYear() == b.getYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
}
const url = "https://edt.univ-nantes.fr/sciences/r350233.ics";
const urlsSalles = [
 
["https://edt.univ-nantes.fr/sciences/r350231.ics", "TD 01 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350232.ics", "TD 02 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350233.ics", "TD 03 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350234.ics", "TD 04 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350235.ics", "TD 05 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350236.ics", "TD 06 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350237.ics", "TD 07 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350238.ics", "TD 08 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350239.ics", "TD 09 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350240.ics", "TD 10 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350352.ics", "TD 110 (Bât 26- RdC)"],
["https://edt.univ-nantes.fr/sciences/r350357.ics", "TD 117 (Bât 26- RdC)"],
["https://edt.univ-nantes.fr/sciences/r350245.ics", "TD 12 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350244.ics", "TD 13 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350243.ics", "TD 14 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350242.ics", "TD 15 (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350294.ics", "TD 18 (Bât 13)"],
["https://edt.univ-nantes.fr/sciences/r350341.ics", "TD 20 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350342.ics", "TD 21 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350343.ics", "TD 22 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350344.ics", "TD 23 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350345.ics", "TD 24 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350346.ics", "TD 25 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350347.ics", "TD 26 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350348.ics", "TD 27 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350349.ics", "TD 28 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350350.ics", "TD 29 (Bât 18-B U)"],
["https://edt.univ-nantes.fr/sciences/r350275.ics", "TD 006 PECB (Bât 5)"],
["https://edt.univ-nantes.fr/sciences/r350276.ics", "TD 30 (Bât 5)"],
["https://edt.univ-nantes.fr/sciences/r350249.ics", "TD B (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350253.ics", "TD D (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350252.ics", "TD E (Bât 1-Admin)"],
["https://edt.univ-nantes.fr/sciences/r350306.ics", "TP 34Geol-vidéo (Bât 14)"],
["https://edt.univ-nantes.fr/sciences/r350307.ics", "TP 35Geol-vidéo (Bât 14)"],
["https://edt.univ-nantes.fr/sciences/r350309.ics", "TP 36Geol-vidéo (Bât 14)"],
["https://edt.univ-nantes.fr/sciences/r350311.ics", "TP 38Geol-vidéo (Bât 14)"],
["https://edt.univ-nantes.fr/sciences/r350296.ics", "TP 65Geol-vidéo (Bât 13)"],
["https://edt.univ-nantes.fr/sciences/r350327.ics", "TP Automatique 59 (Bât 14)"],
["https://edt.univ-nantes.fr/sciences/r350329.ics", "TP Electro 61 (Bât 14)"],
["https://edt.univ-nantes.fr/sciences/r350326.ics", "TP Info indus 57 (Bât 14)"],
];
const from = new Date("2024-08-26T08:00:00");
// const to = new Date("2024-12-29T18:00:00");
const to = new Date("2024-10-20T20:00:00");
const numberOfWeeks = 1;
const numberOfDaysInWeek = 5;
const numberOfHoursInDay = 12;
const dayStartHour = 8;
const dayEndHour = 20;
const tenMinInSec = 10*60;
const tenMin = 10;
const samedi = 6; //premier jour semaine est dimanche = 0
const today = new Date();
const realToday = new Date();
realToday.setDate(realToday.getDate() -1);
if(realToday.getHours()>=dayEndHour){
  console.log("test");
  today.setDate(today.getDate()+1);
  realToday.setDate(realToday.getDate()+1);
  console.log(realToday.getDay());
  if(realToday.getDay() == samedi){
    realToday.setDate(realToday.getDate()+2);
    today.setDate(today.getDate()+2);
  }
  today.setHours(dayStartHour);
  today.setMinutes(0);
  realToday.setHours(dayStartHour);
  realToday.setMinutes(0);
} else if(realToday.getDay() == samedi){
    realToday.setDate(realToday.getDate()+2);
    today.setDate(today.getDate()+2);
    today.setHours(dayStartHour);
    today.setMinutes(0);
    realToday.setHours(dayStartHour);
    realToday.setMinutes(0);
}
console.log(today);
const todayElement = document.querySelector("#date");
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
// todayElement.innerText = realToday.toLocaleDateString('fr-FR', options);
async function getAllData(urlsSalles) {
  let promises = [];
  let nomSalles = [];
  urlsSalles.forEach(([url, nomSalle]) => {
      const pro = fetch(cors_api_url + url).then(response => response.text());
      promises.push(pro);
      nomSalles.push(nomSalle);
  });
  let allPro = Promise.allSettled(promises);
  allPro.then((results) =>{
    const freeTimes = [];
    results.forEach((result, index) => {
      let text = result.value;
      let calJson = convert(text);
      let events = calJson.VCALENDAR[0].VEVENT;
      let freeTime = getFreeTime(events);
      freeTimes.push([freeTime, nomSalles[index]])
    })
    let getTodayFreeTime = (freeTimes) => freeTimes.map(([room, nomSalle]) => 
    [
      //day [creneau[start,end]] we check first creanea start so day[0][0] 
      room.filter((day)=> {return equalDay(day[0][0],today)}), 
      nomSalle
    ]);
    let todayFreeTime = getTodayFreeTime(freeTimes);
    createCalendar(todayFreeTime);
    // jourAvant.addEventListener('click', ()=>{
    //   today.setDate(today.getDate()-1);
    //   if(today.getDay() == 0){
    //     today.setDate(today.getDate()-2);
    //   }
    //   // todayElement.innerText = today.toLocaleDateString('fr-FR', options);
    //   todayFreeTime = getTodayFreeTime(freeTimes);
    //   createCalendar(todayFreeTime);
    //   if(isSameDay(today, realToday)){
    //     jourAvant.classList.add("not-clickable");
    //   }
    // });
    // jourAvant.classList.add("not-clickable");
    // jourApres.addEventListener('click', ()=>{
    //   today.setDate(today.getDate()+1);
    //   if(today.getDay() == samedi){
    //     today.setDate(today.getDate()+2);
    //   }
    //   // todayElement.innerText = today.toLocaleDateString('fr-FR', options);
    //   todayFreeTime = getTodayFreeTime(freeTimes);
    //   createCalendar(todayFreeTime);
    //   if(!isSameDay(today, realToday)){
    //     jourAvant.classList.remove("not-clickable");
    //   }
    // });    
  });
}

function toDate(date){
  return new Date(`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,11)}:${date.slice(11,13)}:${date.slice(13,15)}`);
}

function coupleDateSort(a,b){
  return a[0]-b[0];
}

function isSameDay(a,b){
  return a.getYear()==b.getYear() &&  a.getMonth()==b.getMonth() &&  a.getDate()==b.getDate()
}

function getFreeTime(events){ //->[date[debut,fin]*]*
  const occupied = [];
  const free = [];
  events.forEach(ev => {
   let start = toDate(ev.DTSTART);
   let end = toDate(ev.DTEND);
   occupied.push([start,end]);
  });
  occupied.sort(coupleDateSort)
  let currentDate = new Date(from.getTime());
  let today = [];
  for (let i = 0; i < occupied.length; i++) {
    let occStart = occupied[i][0];
    let occEnd = occupied[i][1];
    if(occStart.getDay()==6 ||occStart.getDay()==0){
      continue;
    }
    while(!isSameDay(currentDate, occStart)){
      let freeStart = new Date(currentDate.getTime());
      let freeEnd = new Date(currentDate.getTime());
      freeEnd.setHours(dayEndHour);
      freeEnd.setMinutes(0);
      today.push([freeStart, freeEnd]);
      free.push(today);
      today = [];
      currentDate.setDate(currentDate.getDate() +1);
      if(currentDate.getDay() == samedi){
        currentDate.setDate(currentDate.getDate() +2);
      }
      currentDate.setHours(dayStartHour);
      currentDate.setMinutes(0);
    }
    if((occStart-currentDate)/1000 > tenMinInSec){ //diff in secondes 
      let startFree = new Date(currentDate.getTime());
      let endFree = new Date(occStart.getTime());
      if(today.length>0){
        if(today[today.length - 1][0]-startFree != 0){
          today.push([startFree, endFree]);
        }
      } else {
        today.push([startFree, endFree]);
      }
    }
    currentDate = new Date(occEnd.getTime());
  } 
  return free;
}
function millisecondsToMinutes(mil){
  return mil/1000/60;
}

function minToPercentOfDay(min){
  return (countTd - nomSalleTdSize) * ((min/60)/12);
}
const nomSalleTdSize = 10;
let delta = 1;
function buildSlotCell(parent, classe, startTime, endTime){
  console.log("inbuild", classe, startTime, endTime);
  let timeSlot = document.createElement('td')
  timeSlot.classList.add(classe, "slot");
  console.log("min",millisecondsToMinutes(endTime-startTime));
  let sizeFloat = minToPercentOfDay(millisecondsToMinutes(endTime-startTime));
  let size = Math.round(sizeFloat);
  // if(size != sizeFloat){
  //   delta += sizeFloat - size;
  //   if(delta>1){
  //     size+=1;
  //     console.log("delta1", delta);
  //     delta-=1;
  //     console.log("delta2", delta);
  //   }
  // }
  console.log("delta",delta);
  console.log("size",size);
  timeSlot.colSpan = size;
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  let p = document.createElement('span');
  p.innerText = startTime.getHours()+":"+startTime.getMinutes() + " " + endTime.getHours()+":"+endTime.getMinutes();
  let p2 = document.createElement('span');
  let diff = new Date(endTime-startTime);
  if(diff.getHours()-1>0){
    p2.innerText = diff.getHours()-1 + "h" + diff.getMinutes();
    timeSlot.appendChild(p);
  } else {
    p2.innerText = diff.getMinutes() + " min";
  }
  timeSlot.appendChild(p2);
  let popUp =  document.createElement('div');
  popUp.classList.add("popUp");
  let blur = document.createElement("div");
  blur.classList.add("blur");
  let dedans = document.createElement("div");
  dedans.classList.add("dedans");
  let dedansSpan = document.createElement("span");
  dedansSpan.innerText = "Vous utilisez cette salle ? Prévenez les autres !";
  dedans.appendChild(dedansSpan);
  blur.appendChild(dedans);
  blur.appendChild(popUp);
  timeSlot.appendChild(blur);
  parent.appendChild(timeSlot);
  console.log(timeSlot);
}
const countTd = (72*2 + nomSalleTdSize)
function createCalendar(rooms){
  // let t = calendar.firstElementChild;
  // console.log(t);
  // calendar.replaceChildren(t);
  if(calendar.querySelector("tbody")){
    calendar.removeChild(calendar.querySelector("tbody"));
  }
  let calendarBody = document.createElement("tbody");
  let inv = document.createElement("tr");
  for (let i = 0; i < countTd; i++) {
    let temp = document.createElement("td");
    temp.innerText = i;
    inv.appendChild(temp);    
  }
  // console.log(calendarBody);
  calendarBody.appendChild(inv);
  inv.style.visibility = "hidden";
  inv.style.height = 0;
  inv.style.overflow = "hidden";
  calendar.appendChild(calendarBody);
  rooms.forEach(([free, nomSalle])=>{
    delta = 0;
    let room = document.createElement('tr');
    room.classList.add("room");
    // room.colSpan = 100;
    calendarBody.appendChild(room); 
    let nomSalleElement = document.createElement('td');
    nomSalleElement.classList.add("nom-salle");
    nomSalleElement.colSpan = nomSalleTdSize;
    let link = document.createElement('a');
    let goodLien;
    urlsSalles.forEach(([url, nomSalleTemp]) => {
      if(nomSalleTemp == nomSalle){
        goodLien = url;
      }
    });
    goodLien = goodLien.slice(0, goodLien.length-3) + "html";
    let newNomSalle = nomSalle.substring(0, nomSalle.search("\\("));
    link.innerText = newNomSalle;
    // console.log(urlsSalles.fiter(([url, nomSalle2])=>nomSalle == nomSalle2)[0][0]); //not working ??
    link.href = goodLien;
    nomSalleElement.appendChild(link);
    room.appendChild(nomSalleElement);
    let creneaux = document.createElement("div");
    creneaux.classList.add("creneaux")
    // room.appendChild(creneaux);
    let nom = room.querySelector(".nom-salle");
    room.addEventListener("mouseover", ()=>{
      console.log("test");
      nom.style.backgroundColor = "pink";
    });
    room.addEventListener("mouseleave", ()=>{
      console.log("test");
      nom.style.backgroundColor = "lightblue";
    });
    free.forEach(salle => { //creneau
      const dayStartDate = new Date(salle[0][0].getTime());
      dayStartDate.setHours(dayStartHour);
      dayStartDate.setMinutes(0);
      const dayEndDate = new Date(salle[0][0].getTime());
      dayEndDate.setHours(dayEndHour);
      dayEndDate.setMinutes(0);
      if(realToday-today != 0 || true){
        console.log(salle[0][0]);
        let diffFirst = salle[0][0]-dayStartDate;
        console.log(diffFirst);
        if(diffFirst != 0){
          console.log("build", dayStartDate, salle[0][0]);
          buildSlotCell(room, "occupied-time", dayStartDate, salle[0][0]);
        }
      } else {
        if(salle[0][0]-realToday > 0){
          let diffFirst = salle[0][0]-realToday;
          if(diffFirst != 0){
            buildSlotCell(creneaux, "occupied-time", realToday, salle[0][0]);
          }
        }
      }
        let lastFree = salle[0][1];
        for (let i = 0; i < salle.length; i++) {
          freeStart = salle[i][0];
          freeEnd = salle[i][1];
          if(freeEnd-realToday < 0){
            if(i!=salle.length-1){
              if(salle[i+1][0]-realToday>0){
                buildSlotCell(room, "occupied-time", realToday, salle[i+1][0]);
              }
            }
            continue;
          }
          if(freeStart-realToday<0){
            buildSlotCell(room, "free-time", realToday, freeEnd);
          }else {
            buildSlotCell(room, "free-time", freeStart, freeEnd);
          }

          if(dayEndDate-freeEnd != 0){
            if(i!=salle.length-1){
              buildSlotCell(room, "occupied-time", freeEnd, salle[i+1][0]);
            } else {
              buildSlotCell(room, "occupied-time", freeEnd, dayEndDate);
            }
          }
          if(freeEnd-lastFree != 0){
          }
    }
  });
});
}

const jourAvant = document.querySelector("#jourAvant");
const jourApres = document.querySelector("#jourApres");
let oldHour = null;
document.body.addEventListener("mousemove", function(e){
  if(oldHour){
    oldHour.classList.remove("selected");
  }
  let x = e.layerX;
  let w = calendar.clientWidth;
  let nomSalleWidth = w*0.10;
  let n = 12;
  if(x>nomSalleWidth){
    let pos = Math.floor(((x-nomSalleWidth) / (w-nomSalleWidth)) *n)+1;
    console.log(pos);
    console.log(x-nomSalleWidth);
    console.log(w-nomSalleWidth);
    console.log((x-nomSalleWidth) / (w-nomSalleWidth));
    let hours = document.querySelector("#hours").querySelectorAll("td");
    let newHour = hours[pos];
    let h = newHour.classList.add("selected");
    oldHour = newHour;
  }
});
getAllData(urlsSalles);