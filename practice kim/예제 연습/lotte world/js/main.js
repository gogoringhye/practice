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
