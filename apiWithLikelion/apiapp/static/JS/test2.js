/* 
이슈 수정본 입니다

1. "*등 영화이름"이 담기는 button 태그를 div로 변경
    (clickedSearchBtn, showMeTheCode 수정)

2. 상세정보 onclick 비활성화 문제 해결
    (clickedMovieBtn 3번째 then)
*/
document.querySelector(".todayDateInput").value = new Date((new Date()) - 1000*60*60*24).toISOString().substring(0,10);
let contentsBox = document.querySelector('.contents');
const key = "?key=c9b76986468427bb85c2e8928316a530";
let movieCodeObject = {};
let movieNameArray = [];
let movieCodeArray = []; 
const clickedSearchBtn = async () => {
    try{
        await giveRankObject()
            .then((data) => {
                let DtYear = data.boxOfficeResult.showRange.substring(0,4);
                let DtMonth = data.boxOfficeResult.showRange.substring(4,6);
                let DtDate = data.boxOfficeResult.showRange.substring(6,8);
                let dateTitle = document.createTextNode(`${DtYear}년 ${DtMonth}월 ${DtDate}일 박스 오피스`);
                let titleBox = document.createElement('h1');
                let createDiv = document.createElement('div');
                createDiv.classList.add("moviePackage");
                contentsBox.appendChild(createDiv).appendChild(titleBox).appendChild(dateTitle);
                for (let i = 0; i < 10; i++) {
                    let movieRankJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieNm; 
                    let movieCodeJson = data.boxOfficeResult.dailyBoxOfficeList[i].movieCd; 
                    let text = document.createTextNode(`${i+1}위 `+movieRankJson);
                    let textBox = document.createElement('div');
                    // button에서 div로 수정
                    contentsBox.appendChild(createDiv).appendChild(textBox).appendChild(text);
                    //textBox.setAttribute("value",`${movieRankJson}`); 삭제
                    textBox.setAttribute("onclick", "clickedMovieBtn(this);");
                    textBox.setAttribute("class", `movieContents`);
                    movieNameArray[i] = `${movieRankJson}`;  
                    movieCodeArray[i] = `${movieCodeJson}`; 
                    movieCodeObject[movieNameArray[i]] = `${movieCodeArray[i]}`;
                };
            });
    }catch(error){
        console.log(`clickedSearchBtn 에러 발생 ${error.name}:${error.message}`);
    };
};
const giveRankObject = async() => {
    try{
        let date = document.todayDateForm.todayDateInput.value; 
        let targetDate = date.replaceAll("-",""); 
        let targetTodayDate = `&targetDt=${targetDate}`; 
        const url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
            + key
            + targetTodayDate;
        const response = await fetch(url);
        return await response.json();
    }catch(error){
        console.log(`giveRankObject 에러 발생 ${error.name}:${error.message}`);
    };
};
const clickedMovieBtn = async(clickedValue) =>{
    try{
        await showMeTheCode(clickedValue)
            .then((info) => { 
                let directors = []; 
                let actors = []; 
                let searchDirectors = info.movieInfoResult.movieInfo.directors;
                let searchActors = info.movieInfoResult.movieInfo.actors;
                let searchDirectorsNum = Object.keys(searchDirectors).length;
                let searchActorsNum = Object.keys(searchActors).length;
                if (searchDirectorsNum==0){
                    directors[0]="미입력 혹은 사람이 아님"; 
                } else if (searchDirectorsNum > 2){
                    for(let i = 0; i < 2; i++){  
                        directors[i] = searchDirectors[i].peopleNm;       
                    }; 
                    actors[2] = ' 이하 생략'; 
                } else if (searchDirectorsNum <= 2){
                    for(let i = 0; i < searchDirectorsNum; i++){ 
                        directors[i] = searchDirectors[i].peopleNm;       
                    };
                };
                if (searchActorsNum==0){
                    actors[0] = "미입력 혹은 사람이 아님"; 
                } else if(searchActorsNum > 4){
                    for(let i = 0; i < 4; i++){ 
                        actors[i] = " "+searchActors[i].peopleNm;       
                    }; 
                    actors[4] = ' 이하 생략'; 
                }else if(searchActorsNum <= 4){
                    for(let i = 0; i < searchActorsNum; i++){ 
                        actors[i] = " "+searchActors[i].peopleNm;       
                    };
                }else{
                    console.log("누구냐 넌"); 
                };
                return [directors, actors]; 
            })
            .then((MoviePeople) => {
                let directors = MoviePeople[0];
                let actors = MoviePeople[1];
                let addAnotherP = document.createElement('p');
                let TextDirectors = document.createTextNode(`감독 : ${directors}`);
                let TextActors = document.createTextNode(`출연진 : ${actors}`);
                let br = document.createElement('br');
                addAnotherP.appendChild(TextDirectors);
                addAnotherP.appendChild(br);
                addAnotherP.appendChild(TextActors);
                addAnotherP.classList.add("info");
                clickedValue.appendChild(addAnotherP);
            })
            .then(()=>{
                let NoMoreThanOne = contentsBox.querySelectorAll(".movieContents");
                for(let i = 0; i < NoMoreThanOne.length; i++){
                    if(NoMoreThanOne[i].childElementCount != 0 ){
                        NoMoreThanOne[i].toggleAttribute("onclick", "");
                    };
                };
            })
    }catch(error){
        console.log(`clickedMovieBtn 에러 발생 ${error.name}:${error.message}`);
    };
};
const showMeTheCode = async(clickedValue) => { 
    try{
        let innerHtml = clickedValue.innerHTML;
        // innerHtml 예시 _ 1등 테넷 
        let iWantedValue = innerHtml.slice(3, innerHtml.length+1); 
        // "1등 테넷" 에서 "1등 "을 제외한 테넷만 slice 후 전송
        let Code = await CodeInMovieObj(iWantedValue);
        let moreInfo = await searchMoreInfo(Code);
        return await moreInfo;
    } catch(error){
        console.log(`showMeTheCode 에러 발생 ${error.name}:${error.message}`);
    };
}
const CodeInMovieObj = async(iWantedValue) => {
    try{
        let iWantedCode = movieCodeObject[iWantedValue];
        return await iWantedCode;
    }catch(error){
        console.log(`CodeInMovieObj 에러 발생 ${error.name}:${error.message}`);
    };
};
const searchMoreInfo = async(Code) => {
    try{
        let usingCode = `&movieCd=${Code}`; 
        const infoUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
        + key 
        + usingCode;
        const responseInfo = await fetch(infoUrl); 
        return await responseInfo.json();
    }catch(error){
        console.log(`searchMoreInfo 에러 발생 ${error.name}:${error.message}`);
    };
}
function reload(){
    setTimeout(location.reload(), 3000);
    alert("페이지가 새로고침 됩니다.");
 };