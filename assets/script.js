function getBlockAccess(bytes, block) {
	var mask1 = 0x01 << block;
	var mask2 = 0x10 << block;
	var access = 0;

	var c1 = (bytes[7] & mask2) ? 0x04 : 0;
	var c2 = (bytes[8] & mask1) ? 0x02 : 0;
	var c3 = (bytes[8] & mask2) ? 0x01 : 0;

	// console.log("block=" + block + ", c1=" + c1 + ", c2=" + c2 + ", c3=" + c3);
	return (c1 | c2 | c3);
}

function setBlockAccess(bytes, block, access) {
	var mask1 = 0x01 << block;
	var mask2 = 0x10 << block;

	if (access & 0x04) bytes[7] |= mask2;
	else bytes[6] |= mask1;
	
	if (access & 0x02) bytes[8] |= mask1;
	else bytes[6] |= mask2;

	if (access & 0x01) bytes[8] |= mask2;
	bytes[7] |= mask1;
}

function getBytes() {
	var bytes = [
		0, 0, 0, 0, 0, 0, // keyA
		parseInt($("input[name=byte0]").val(), 16), // byte6
		parseInt($("input[name=byte1]").val(), 16), // byte7
		parseInt($("input[name=byte2]").val(), 16), // byte8
		0, //GPB
		0, 0, 0, 0, 0, 0, // keyB
	];
	// console.log(bytes);
	return bytes;
}

function showBytes(bytes) {
	$("input[name=byte0]").val(hex(bytes[6]));
	$("input[name=byte1]").val(hex(bytes[7]));
	$("input[name=byte2]").val(hex(bytes[8]));
}

function getSelectedAccess() {
	var access0 = $("input[name=access0]:checked").val();
	var access1 = $("input[name=access1]:checked").val();
	var access2 = $("input[name=access2]:checked").val();
	var access3 = $("input[name=access3]:checked").val();

	return [access0, access1, access2, access3];
}

function showHighLight(access) {
	$("table tr").removeClass("selected");
	for (block = 0; block < 4; block++) showAccess(block, access[block]);
}

function showAccess(block, value) {
	$("input[name=access" + block + "][value=" + value + "]").prop('checked', true).parent().parent().addClass("selected");
}

function hex(val) {
	return ("0" + val.toString(16).toUpperCase()).substr(-2);
}

$(document).ready(function () {

	$("input[type=radio]").change(function () {
		var access = getSelectedAccess();
		var bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (var i = 0; i < 4; i++) setBlockAccess(bytes, i, access[i]);

		showBytes(bytes);
		showHighLight(access);
	});

	$(".button-calculate").click(function () {
		var bytes = getBytes();
		var access = [getBlockAccess(bytes, 0), getBlockAccess(bytes, 1),
					  getBlockAccess(bytes, 2), getBlockAccess(bytes, 3)];

		showHighLight(access);
	}).trigger("click");
});