/*
学号：17343147
姓名：张涵健
日期：2018/11/5
*/

/*
* 说明：全局变量src_picture为拼图源文件的路径
* */

var canvas = document.getElementById('imageC');
var isRun = false;
var can_judge = false;
var src_picture = "./1.png";
var level = 500;
function aload(){
    console.log("load success");
    //var c = document.getElementById("imageC");
    var puzzle = document.getElementById('puzzle_block');
    while(puzzle.hasChildNodes()) //当elem下还存在子节点时 循环继续
    {
        puzzle.removeChild(puzzle.firstChild);
    }

    var img = new Image();
    img.src = src_picture;
    //img.sizes = 500/img.width;
    //img.width = 500;
    //img.height = 500;
    //img.crossOrigin = "Anonymous";
    img.onload = function(){
        //一定要写在onload回调中，否则看不到图片
        for (var i = 0; i < 4; i++){
            for (var j = 0; j< 4; j++){
                var di = document.createElement("div");
                di.className = "container"
                di.id = (i*4 + j + 1);
                di.addEventListener("click", clk_change, false );
                //di.attr("disabled", true);
                var c = document.createElement("canvas");
                c.className = "imageC";
                c.id = "P"+ (i*4 + j);
                //di.onclick = clk_change();
                var ctx = c.getContext("2d");
                //console.log(img.width,img.height);
                if (i*j !=9)
                    ctx.drawImage(img,j*img.width/4,i*img.height/4,img.width/4,img.height/4,0,0,c.width,c.height);
                else{
                    ctx.fillStyle = 'white';
                    //ctx.fill();
                }


                di.appendChild(c);
                var puzzle_block = document.getElementById('puzzle_block');
                puzzle_block.appendChild(di);
            }
        }

    }
    //var puzzle_block = document.getElementById('puzzle_block');
}


function clk_change(){
    if(isRun) {
        //console.log(Number(this.id));
        var left = Number(this.id) - 1;
        //console.log(left);
        //console.log(Number(this.id));
        //console.log(parseInt(left/5));
        //console.log(parseInt(Number(this.id) / 5));
        left = (parseInt((left - 1) / 4) < parseInt((Number(this.id) - 1) / 4)) ? 0 : left;
        //console.log("left:",left);
        var right = Number(this.id) + 1;
        right = (parseInt((Number(this.id) - 1) / 4) < parseInt((right - 1) / 4)) ? 0 : right;
        if (right > 17) {
            right = 0;
        }
        var up = Number(this.id) - 4;
        up = (up > 0) ? up : 0;
        var down = Number(this.id) + 4;
        down = (down <= 16) ? down : 0;
        //console.log(right);
        //console.log(String(left));
        if (left) {
            var l = document.getElementById(left.toString());
            //console.log("left:",l.childNodes[0].id);
            if (l.childNodes[0].id == "P15") {
                exchange(l.childNodes[0], this.childNodes[0]);
                judge_win();
                return;
            }
        }
        if (right) {
            var l = document.getElementById(right.toString());
            //console.log("hhhh",l.childNodes[0].id);
            //console.log("right:",l.childNodes[0].id);

            if (l.childNodes[0].id == "P15") {
                exchange(l.childNodes[0], this.childNodes[0]);
                judge_win();
                return;
            }
        }
        if (up) {
            var l = document.getElementById(up.toString());
            //console.log("hhhh",l.childNodes[0].id);
            //console.log("up:",l.childNodes[0].id);
            if (l.childNodes[0].id == "P15") {
                exchange(l.childNodes[0], this.childNodes[0]);
                judge_win();
                return;
            }
        }
        if (down) {
            var l = document.getElementById(down.toString());
            //console.log("hhhh",l.childNodes[0].id);
            //console.log("down:",l.childNodes[0].id);
            //console.log(l.childNodes[0].id == "P15")
            if (l.childNodes[0].id == "P15") {
                /*
                var hold = this.childNodes[0];

                this.childNodes[0] = l.childNodes[0];
                console.log(l.childNodes[0]);
                l.childNodes[0] = hold;
                console.log(l.childNodes[0]);
                console.log(hold);
                */
                exchange(l.childNodes[0], this.childNodes[0]);
                judge_win();
                return;
            }
        }
    }

}

function exchange(el1, el2){
    var ep1 = el1.parentNode,
        ep2 = el2.parentNode,
        index1 = Array.prototype.indexOf.call(ep1.children, el1),
        index2 = Array.prototype.indexOf.call(ep2.children, el2);
    ep2.insertBefore(el1,ep2.children[index2]);
    ep1.insertBefore(el2,ep1.children[index1]);
}

function start(e){
    //console.log(e.childNodes[0]);
    //aload();
    can_judge = false;
    for(var i = 1; i < 16; i++){
        var ch = document.getElementById(i.toString()).childNodes[0];
        var tru = document.getElementById("P"+(i-1).toString());
        exchange(ch, tru);
    }
    e.childNodes[0].nodeValue="Restart";
    console.log("do");
    isRun = true;
    for (var i = 0; i < level; i++){
        var dir = Math.floor(Math.random()*4);
        var blank = document.getElementById("P15").parentNode;
        //console.log(blank);
        if (dir == 0){

            var target = Number(blank.id) - 1;

            var tar_block = document.getElementById(target.toString());
            if(tar_block) tar_block.click();
            continue;
        }
        if (dir == 1){
            var target = Number(blank.id) + 1;
            var tar_block = document.getElementById(target.toString());
            if(tar_block) tar_block.click();
            continue;
        }
        if (dir == 2){
            //onsole.log('a',target);
            var target = Number(blank.id) - 4;
            var tar_block = document.getElementById(target.toString());
            //console.log(tar_block);
            if(tar_block) tar_block.click();
            continue;
        }
        if (dir == 3){
            var target = Number(blank.id) +4 ;
            var tar_block = document.getElementById(target.toString());
            if(tar_block) tar_block.click();
            continue;
        }
    }
    can_judge = true;
}

function judge_win() {
    var count = 0;
    for(var i = 1; i < 16; i++){
        const ch = document.getElementById(i.toString()).childNodes[0];
        if (Number(ch.id.substr(1)) == count){
            count ++;
        }
    }
    //console.log(count);
    if (count == 15 && can_judge){
        isRun = false;
        can_judge = false;
        alert("You have complete the puzzle!");
    }
}


function c_reload() {
    //console.log($("#upload"));
    //src_picture = "2.jpg";
    aload();

}


function read() {
    console.log("DO");
    var fileObj = $("#upload")[0];
    var windowURL = window.URL || window.webkitURL;
    src_picture = windowURL.createObjectURL(fileObj.files[0]);
}

function d_change(e){
    switch (e.value) {
        case "1":
            level = 10;
            //console.log(level);
            break;
        case "2":
            level = 500;
            break;
        case "3":
            level = 1000;
            break;
    }
}