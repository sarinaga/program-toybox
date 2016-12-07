
$(document).ready(function(){
	//alert("OK");

	$("#create").click(function(event){
		createMaze();
	});



});

function mazeData(){
	this.xSize = 3;
	this.ySize = 3;
	this.xLen = this.xSize * 2 + 1;
	this.yLen = this.ySize * 2 + 1;
	this.curveRate = 0.1;
	this.map = null;
}



function createMaze(){
	var md = getParameter();
	md.map = createWall(md);
	md.map = createInnerWall(md);
	displayMaze(md);
	//alert("created");
}


// フォームから値取得
function getParameter(){
	var md = new mazeData();
	md.xSize = (Number($('input[name=x_size]').val()) || 3);
	md.ySize = (Number($('input[name=y_size]').val()) || 3);
	md.curveRate =  (Number($('input[name=curve_rate]').val()) || 0.1);
	md.xLen = md.xSize * 2 + 1;
	md.yLen = md.ySize * 2 + 1;
	return md;
}


function createWall(md){
	var map = new Array();
	for(var i = 0 ; i < md.xLen ; ++i){
		map[i] = new Array();
	}
	for(var y = 0 ; y < md.yLen ; ++y){
		for(var x = 0 ; x < md.xLen ; ++x){
			if (x == 0 || y == 0 || x == md.xLen - 1 || y == md.yLen - 1){
				map[x][y] = 1;
			}else{
				map[x][y] = 0;
			}
		}
	}
	return map;

}

function createInnerWall(md){

	var pos = function(){
		this.x = 0;
		this.y = 0;
	};
	var poses = new Array();

	// 起点一覧を作成
	for (var x = 0 ; x < md.xLen ; x += 2){
		for (var y = 0 ; y < md.yLen ; y += 2){
			var p = new pos();
			p.x = x;
			p.y = y;
			poses.push(p);
		}
	}
	// 一覧のシャッフル Fisher–Yates shuffle
	var n = poses.length;
	while (n) {
		i = random(n--);
		var p = poses[n];
		poses[n] = poses[i];
		poses[i] = p;
	}

	// 起点から壁を伸ばす
	for(var i = 0 ; i < poses.length ; ++i){
		var p = poses[i];
		//alert(p.x + " " + p.y);
		md.map = extendWall(md, p.x, p.y);
	}

	return md.map;
}


// 壁を作ることができる方向を返す (配列)
// 0 上
// 1 右
// 2 下
// 3 左
function getOpenSpace(md, x, y){
	var m = md.map;
	var xLen = md.xLen;
	var yLen = md.yLen;
	var n = new Array();
	if (m[x][y] == 0) return n;
	if (y - 2 > 0    && m[x    ][y - 2] == 0) n.push(0);
	if (x + 2 < xLen && m[x + 2][y    ] == 0) n.push(1);
	if (y + 2 < yLen && m[x    ][y + 2] == 0) n.push(2);
	if (x - 2 > 0    && m[x - 2][y    ] == 0) n.push(3);
	return n;
}

// 指定された場所から壁を伸ばす
function extendWall(md, x, y){

	var n = getOpenSpace(md, x, y);
	if (n.length == 0) return md.map;

	var dir = n[random(n.length)];
	do{
		
		switch(dir){
			case 0:
				//alert("上");
				md.map[x][--y] = 1;
				md.map[x][--y] = 1;
				break;
			case 1:
				//alert("右");
				md.map[++x][y] = 1;
				md.map[++x][y] = 1;
				break;
			case 2:
				//alert("下");
				md.map[x][++y] = 1;
				md.map[x][++y] = 1;
				break;
			case 3:
				
				//alert("左");
				md.map[--x][y] = 1;
				md.map[--x][y] = 1;
				break;
			default:
				alert("バグ");
				exit;
		}

		//displayMaze(md);

		n = getOpenSpace(md, x, y);
		//alert("+," + n.join(","));

		if (n.length == 0){
			//alert("行き先がない");
			break;
		}

		if (n.length == 1){
			dir = n[0];

		}else{
			var idx = n.indexOf(dir);
			if (idx >= 0 && Math.random() > md.curveRate){
				/**/
			}else{
				dir = n[random(n.length)];
			}
		}

	}while(true);

	return md.map;


}


function random(n){
	return Math.floor(Math.random() * n);
}



function displayMaze(md){
	var maze = "";
	for(var y = 0 ; y < md.yLen ; ++y){
		for(var x = 0 ; x < md.xLen ; ++x){
			if (md.map[x][y] == 1){
				maze += "■";
			}else{
				maze += "□";
			}
		}
		maze += "<br>\n"
	}

	$('#map').html(maze);
	$('#map').css("width", md.xLen + "em");
}

