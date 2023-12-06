let pTag1=document.querySelector('.first-parallel');
let pTag2=document.querySelector('.second-parallel');

let imageArr1=[
    'http://makorang.com/img/main/main_12_btn_20.jpg', 
    'http://makorang.com/img/main/main_12_btn_19.jpg', 
    'http://makorang.com/img/main/main_12_btn_17.jpg', 
    'http://makorang.com/img/main/main_12_btn_16.jpg',
    'http://makorang.com/img/main/main_12_btn_15.jpg',
    'http://makorang.com/img/main/main_12_btn_14.jpg',
]

let imageArr2=[
    'http://makorang.com/img/main/main_12_btn_20.jpg', 
    'http://makorang.com/img/main/main_12_btn_19.jpg', 
    'http://makorang.com/img/main/main_12_btn_17.jpg', 
    'http://makorang.com/img/main/main_12_btn_16.jpg',
    'http://makorang.com/img/main/main_12_btn_15.jpg',
    'http://makorang.com/img/main/main_12_btn_14.jpg',
];

//변수 선언 후 항상 세미콜론 적어주기(마침표의 의미)
let count1=0;
let count2=0;

initImages(pTag1,imageArr1);
initImages(pTag2,imageArr2);

//함수를 두번 실행하는데 두번 다 다른 값이 들어옴 
//1.(element-->pTag1,imageArr-->imageArr1)
//2.(element-->pTag2,imageArr-->imageArr2)
function initImages(element,imageArr){
    imageArr.push(...imageArr)
    imageArr.push(...imageArr)
    //console.log(imageArr)
    //<img src="" alt=""/>
    for(let i=0; i< imageArr.length; i++){//항상 배열에는 길이가 출력됨
        //이미지 태그 만들기
        const img=document.createElement('img');
        img.src=imageArr[i];
        img.alt=`Image ${i + 1}`;
        element.appendChild(img);

    }
}

//appendChild--> 요소의 자식으로 첨부해라

function animate(){
    count1++;
    count2++;
    console.log(count1)

   count1= marqueeImage(count1,pTag1,-1)
   count2= marqueeImage(count2,pTag2,1)

    window.requestAnimationFrame(animate)
}

function marqueeImage(count,element,direction){
    //.scrollHeigh--> 숨어있는 원래 높이 값을 찾아줌
    //.scrollWidth--> 숨어있는 원래 넓이 값을 찾아줌
    if(count>element.scrollWidth / 2){
        count=0;
        element.style.transform=`translate(0,0)`;
    }
    element.style.transform=`translate(${count * direction}px,0)`;
    return count;
}
//짝수로 넣어줘야 튕기는 게 티가 안남

function scrollHandler(){
    count1 += 25;
    count2 += 25;
}

animate()//실행하기 위해서 호출
window.addEventListener('scroll',function(){
    scrollHandler()
})

window.addEventListener('scroll',scrollHandler)
/* 🚨 scrollHandler 뒤에 괄호를 넣지 않아야 대기 상태의 펑션문이 여기로 들어오니 괄호 적지 않도록 주의하기

//window.addEventListener('scroll',scrollHandler())-->X

함수를 호출하는 것이 아니라 함수의 참조(reference)를 전달하기 때문에 scrollHandler 함수 뒤에 괄호를 넣지 않음






//호출과 결과값 받는 것까지 모두 다 함
//이미 있는 것을 써야함? 렛 안돼?