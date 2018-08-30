var graph;
var graphStart;
var graphEnd;

$(document).ready(function(){
	console.log("5. map.js: loaded");
	
	$('body').on('click', '.map .center', function(e){
		$('.map .content').toggleClass('hideGrid');
		e.stopPropagation();
	});
	
	$('body').on('mouseenter', '.map .y', function(){
		$('.target').removeClass('target');
		$(this).addClass('target');
		var x = $(this).data('x');
		var y = $(this).data('y');
		
		graphEnd = graph.grid[y][x];
		var result = astar.search(graph, graphStart, graphEnd);
		drawMapPath(result);
	});
	
	$('body').on('click', '.map .y', function(){
		$('.target').removeClass('target');
		$(this).addClass('target');
		var x = $(this).data('x');
		var y = $(this).data('y');
		
		graphEnd = graph.grid[y][x];
		var result = astar.search(graph, graphStart, graphEnd);
		drawMapPath(result);
	});
});

function getMapContent(callback) {
	var content = '';
	server('map/map.php?session='+localStorage.session, function(data){
		console.log(data);
		
		graph = new Graph(data.map.graph);
		graphStart = graph.grid[data.map.start.y][data.map.start.x];
		
		for (row = 0; row < data.map.graph.length; row++) {
			content += '<div class="x">';
			for (col = 0; col < data.map.graph[row].length; col++) {
				content += '<div class="y" data-x="'+col+'" data-y="'+row+'">';
					if (data.map.start.x == col && data.map.start.y == row)
						content += '<div class="center shadow"></div>';
				content += '</div>';
			}
			content += '</div>';
		}
		
		$('.map .content').html(content);
		if (callback)
			drawMap(data.draw.x, data.draw.y, callback);
		else 
			drawMap(data.draw.x, data.draw.y);
	});
}

function drawMap(x, y, callback) {
	var dw = $(document).width();
	var dh = $(document).height();
	
	var c = document.createElement('canvas'),        
		ctx = c.getContext('2d'),
		cw = c.width = dw,
		ch = c.height = dh;
	
	var map = new Image();
	
	map.onload = function () {
		ctx.drawImage(map,
			x-dw/2+32, y-dh/2+32,
			dw, dh,
			0, 0,
			dw, dh);
		$('.map').css({background : 'url(' + c.toDataURL() + ')'});
		if (callback)
			callback();
	};
	map.src = 'data/img/map/map.png';
}

function drawMapPath(path) {
	$('.map .y').removeClass('path');
	for (i=0; i<path.length; i++) {
		$('.map [data-x="'+path[i].y+'"][data-y="'+path[i].x+'"]').addClass('path');
	}
}