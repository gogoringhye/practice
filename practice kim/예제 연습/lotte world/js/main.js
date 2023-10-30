console.log("어서오세요! 모험과 신비의 나라 롯데월드 어드벤처")

//menu
$('#nav>ul>li').mouseover(function () {
    console.log($(this));
    $(this).find('#submenu').stop().slideDown();
});

$('#nav>ul>li').mouseout(function () {
    $(this).find('#submenu').stop().slideUp();

});


let currentIndex = 0;

setInterval(function () {
    if (currentIndex < 3) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    let slidePosition = currentIndex * (-376) + "px";
    console.log(currentIndex);
    $('.slidelist').animate({ top: slidePosition }, 400);
}, 3000);


/* 주어진 코드는 이미지 슬라이드를 자동으로 전환하는 JavaScript 코드입니다. 이 코드는 슬라이드 쇼를 만들기 위해 setInterval 함수와 jQuery의 animate 함수를 사용합니다.

여기서 주요 부분을 설명하겠습니다:

currentIndex 변수는 현재 표시 중인 슬라이드의 인덱스를 나타냅니다. 초기값은 0으로 설정됩니다.

setInterval 함수는 주기적으로 슬라이드를 전환하는 작업을 수행합니다. 3초(3000 밀리초)마다 한 번씩 함수가 실행됩니다.

함수 내부에서 currentIndex 값이 3보다 작으면 1을 증가시키고, 그렇지 않으면 0으로 다시 설정하여 다음 슬라이드의 인덱스를 업데이트합니다. 이렇게 하면 슬라이드가 루프되며 첫 번째 슬라이드에서 마지막 슬라이드로 넘어갈 때 currentIndex가 다시 0으로 설정됩니다.

slidePosition 변수는 현재 슬라이드 위치를 픽셀 단위로 계산합니다. 현재 슬라이드의 인덱스에 따라 슬라이드 위치를 변경합니다.

animate 함수를 사용하여 .slidelist 요소의 top 속성을 slidePosition으로 변경하여 슬라이드를 부드럽게 이동시킵니다. 이 작업은 400밀리초 동안 실행됩니다.

마지막으로 현재 슬라이드 위치(slidePosition)를 콘솔에 출력합니다.

이 코드는 주기적으로 이미지 슬라이드를 전환하고, jQuery의 animate 함수를 사용하여 부드럽게 슬라이드를 이동시킵니다. */