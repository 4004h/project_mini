let draw = false;
let goalPoint = 8;
let cardDeck = Array(52).fill().map((v,i)=>i+1);
let horseCount = [0,0,0,0];
let trackCard = [1,2,3,4,5,6,7];
let trackCount = 1;
let allocation = [0,0,0,0];
let scaletable = [1,2,3,5,10,77,777];
// 배율표
// 무늬의 개수
// 배당
// 0개
// ×1
// 1개
// ×2
// 2개
// ×3
// 3개
// ×5
// 4개
// ×10
// 5개 이상
// 게임 무효
let start = false;
let player = [];
let betting = [];
//[0,100]

let urlParams = new URL(location.href).searchParams;
let play = urlParams.get('player')

$(document).ready(function(){
    if(play != null) 
        playerAppend(play) 

})

function gameStart() {
    let pass = betting.filter((val) => val[0] < 0).length;
    if(pass) return;

    setting()
    $('.startbut').hide()
    start = true;
}

function gameEnd() {
    $('.startbut').show()
    start = false;
}


function setting() {
    horseCount = [0,0,0,0];
    raceHorse()

    cardDeck =  Array(52).fill().map((v,i)=>i+1);
    cardDeck = cardDeck.filter((val)=>{
        return 1 != val && 14 != val && 27 != val && 40 != val;
    });
    $('#deck .card').removeClass('up')
    $('#deck .draw').attr("src", `./img/카드뒷면.png`)

    allocation = [0,0,0,0]
    trackCount = 0;
    trackCard.map(function (val, index) {
        let cardNum = cardDeck.splice(Math.floor(Math.random() * cardDeck.length),1)
        let pattern = Math.floor(cardNum[0] / 13.5);
        allocation[pattern]++
        trackCard[index] = cardNum[0]

        let trackNum = $('.track')[index].className.split(" ")[1]
        $(`.${trackNum} .card img:last-child`).attr("src", `./img/카드${cardNum[0]}.png`);

        $('.track .card').removeClass('turn')
        // $(`.${trackNum} .card`).addClass('turn')

    })
    console.log(allocation)

    draw = false;
}


function cardUp() {
    if(draw || !start) return;
    if(cardDeck.length <= 0) return console.log('무승부', cardDeck.length);

    let cardNum = cardDeck.splice(Math.floor(Math.random() * cardDeck.length-1),1)
    draw = !draw;

    // console.log(cardNum ,cardDeck)

    $('#deck .card').removeClass('up')
    setTimeout(() => {        
        $('#deck .card img:last-child').attr("src", `./img/카드${cardNum}.png`);
        $('#deck .card').addClass('up')
    }, 0);

    setTimeout(() => {
        $('#deck .draw').attr("src", `./img/카드${cardNum}.png`);
        raceHorse(cardNum)

        //  is goal?

        track()
        // draw = !draw;
    }, 300);
    
}

function raceHorse(drawCard) {
    let pattern = Math.floor(drawCard / 13.5);
    
    horseCount[pattern] < goalPoint ? horseCount[pattern]++ : null;

    // $(`.${$('.racehorse')[pattern].className.split(" ")[1]}`)
    // .css({'transform':`translateY(-${horseCount[pattern]}00%)`})
    // horseCount[pattern] >= goalPoint ? console.log(`goal ${pattern+1}번마`) : null

    horseCount.map(function (val, index) {
        $(`.${$('.racehorse')[index].className.split(" ")[1]}`)
        .css({'transform':`translateX(${val}00%)`})

        // val >= goalPoint ? console.log(`goal ${index+1}번마`) : null
    })
    horseCount[pattern] >= goalPoint ? goalIn(pattern) : null

    // console.log(horseCount)
}

function track() {
    let pass = 
    trackCount < horseCount[0] &&
    trackCount < horseCount[1] &&
    trackCount < horseCount[2] &&
    trackCount < horseCount[3]
    // console.log(pass)

    if(pass)
    {
        let trackNum = $('.track')[trackCount].className.split(" ")[1]
        let pattern;

        // console.log(trackNum)

        setTimeout(() => {
            $(`.${trackNum} .card`).addClass('turn')   
            // .3s 이후 실행
            setTimeout(() => {
                pattern = Math.floor(trackCard[trackCount] / 13.5);
                horseCount[pattern]--;
                $(`.${$('.racehorse')[pattern].className.split(" ")[1]}`)
                .css({'transform':`translateX(${horseCount[pattern]}00%)`})
                trackCount++;
                draw = !draw;
            }, 300);

        }, 200);
    }
    else
    {
        draw = !draw;
    }
}

function goalIn(pr) {
    draw = !draw;

    console.log(`goal ${pr+1}번마 배당 ${scaletable[allocation[pr]]}배`)

    setTimeout(() => {
        $('.track .card').addClass('turn')
        playerUpdate(pr, scaletable[allocation[pr]])

        setTimeout(() => {
            gameEnd()
        }, 2000);

    }, 300);
}

// $('.player_3 .scorecount').text(300)
function playerAppend(num) {
    if(num > 4) num = 4;
    for (let index = 0; index < num; index++) {
        player.push(1000)
        betting.push([-1,100])

        $('.scoreboard').append(`
            <div class="score player_${index}">
                    <div class="scorecount"> ${player[index]} </div>
                    <div class="profile"> ${index+1} </div>
                    <div class="select">
                        <div class="ace select_0" onclick="select(this)"></div>
                        <div class="ace select_1" onclick="select(this)"></div>
                        <div class="ace select_2" onclick="select(this)"></div>
                        <div class="ace select_3" onclick="select(this)"></div>
                    </div>
                    <div class="scorebetting" >
                        <div class="bettingup" onclick="playerBetting(this, 1)">
                            ▲
                        </div>
                        <div class="betting">
                            <h3>100</h3>
                        </div>
                        <div class="bettingdown" onclick="playerBetting(this, -1)">
                            ▼
                        </div>
                    </div>
            </div>
        `)
    }
}

function playerUpdate(horse, alloca) {
    for (let index = 0; index < player.length; index++) {
        if(betting[index][0] == horse) 
          player[index] = player[index] - betting[index][1] + ( betting[index][1] * alloca )
        else 
          player[index] = player[index] - betting[index][1]
        $(`.player_${index} .scorecount`).text(player[index])

        if(player[index] < 100)
        {
            console.log(`player_${index} die`)
        }

        betting[index][1] = 100
        $(`.player_${index} .betting h3`).text(betting[index][1])


    }
}

function select(params) {
    if(start) return;
    let PNum = parseInt(params.parentElement.parentElement.className.split(" ")[1].split("_")[1])
    let SNum = parseInt(params.className.split(" ")[1].split("_")[1])
    let SBut = params.className.split(" ")[1]
    // console.log(PNum)
    // console.log(SNum)
    // console.log($(`.player_${PNum} .${SBut}`))

    betting[PNum][0] = SNum
    $(`.player_${PNum} .ace`).removeClass('selectladio')
    $(`.player_${PNum} .${SBut}`).addClass('selectladio')

    console.log(betting[PNum])
}

function playerBetting(params, updown) {
    if(start) return;
    let PNum = parseInt(params.parentElement.parentElement.className.split(" ")[1].split("_")[1])
    if(updown > 0)
    {
        betting[PNum][1] < player[PNum] ? betting[PNum][1] += 100 : null
    }
    else
    {
        betting[PNum][1] > 100 ? betting[PNum][1] -= 100 : null

    }
    $(`.player_${PNum} .betting h3`).text(betting[PNum][1])
}









