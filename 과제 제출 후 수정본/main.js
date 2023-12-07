let stageEle=document.querySelector('.stage'),
houseEle=document.querySelector('.house'),
maxScrollValue;//실제 스크롤이 움직이는 높이값
mousePos={x:0,y:0};

function resizeHandler(){
    maxScrollValue=document.body.offsetHeight - window.innerHeight;
}
window.addEventListener('scroll',function(){
let scrollper=pageYOffset / maxScrollValue;
//console.log(scrollper)
let zMove=scrollper * 2910 - 1470;//.world .stage .house에서 준 -500 값이 중복 적용되어서 500 빼주고 마지막 너무 빠져있어서 30만큼 덜줌?, 빈틈때문에 490으로 수정 
houseEle.style.transform=`translateZ(${zMove}vw)`;
})

window.addEventListener('mousemove',function(e){
    mousePos.x=(e.clientX / window.innerWidth) * 5;
    mousePos.y=-(e.clientY / window.innerHeight) * 5;
    stageEle.style.transform=`rotateY(${mousePos.x}0deg) rotateX(${mousePos.y}deg)`;
})

window.addEventListener("resize",resizeHandler)//콜백함수 괄호닫으면 안됨
resizeHandler()