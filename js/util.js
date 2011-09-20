function randomRange(min, max, round) {
	var num = ((Math.random()*(max-min)) + min); 
	return (round)? Math.round(num): num;
}

function distanceBetween(x1, y1, x2, y2) {
	var dx = x1-x2;
	var dy = y1-y2;
	return Math.sqrt(dx*dx + dy*dy);
}