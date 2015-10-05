$(function (){
    // 5 同 04.js 測試當2個模組綁定在同一個元素，是否有問題
    $(".content").vmodel("--content_5", false, function (){
        var vs = this;
        this.autoload = ['say', 'hello'];
        this.say = function (){
            vs.root.html(null);
            vs.struct('say', true);
        }

        this.hello = function (){
            vs.struct('hello', true);
        }
    });

    var result = $.vmodel.get("content_5", true, function (storage){
        console.log("5-2 callback: OK");
    });
    if (result === true) {
        console.log('5-1: OK');
    }
})