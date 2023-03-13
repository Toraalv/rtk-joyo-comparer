let _qtyLearnt = 0; // Hämtas sedan från användaren indata

let _rtkList; // yabai
let _joyoList = new Array(); // Detta kan du gott och väl optimera för morgondagen

$(async function()	
{
	// Hämta listan av Heisigs kanji (sorterad, så index+1 == koohiis index)
	await $.get("/static/data/rtk1_index.txt", (data) => {
		_rtkList = (data.split("\n")); // Mannen tänk nu på att arrays börjar på 0 (0-2199)
	});
	resetRtkList(_rtkList);
	setLearntRtkList(_rtkList, _qtyLearnt);

	// Hämta listan av joyo kanji
	await $.get("/static/data/joyo_list_extended.json", (data) => {
		_joyoList = data;
	});
	resetJoyoList(_joyoList);

	console.log(compareRtkJoyo(_rtkList, _joyoList));
	console.log(_joyoList.grade);

	/////////// Bygga bygga
	for (let i = 1; i < _joyoList.grade.length; i++) {
		let grade_section = $("<section>").addClass("grade");
		let grade_h2 = $("<h3>").text(`Grade ${i == 7 ? "7-12" : i}`);
		let grade_kanji_container = $("<div>").addClass("kanji_container");

		grade_section.append(grade_h2);
		for (let j = 0; j < _joyoList.grade[i].length; j++) { // Det vackraste jag sett
			grade_kanji_container.append(`<span class="kanji_item ${_joyoList.grade[i][j].isActive ? 'kanji_item_active' : ''}">
											<a href='//${_joyoList.grade[i][j].jishoHref}'>
												${_joyoList.grade[i][j].kanji}
											</a>
										</span>`);
		}
		grade_section.append(grade_kanji_container);
		$("#grade_list").append(grade_section);
	}
});

function badTomfoolery(element) {
	element.form.amountInput.value = element.value;
	_qtyLearnt = element.value;
	console.log("この世界を再建する", _qtyLearnt);
	rebuildThisWorld(element.value);
}

function rebuildThisWorld() {
	resetRtkList(_rtkList);
	setLearntRtkList(_rtkList, _qtyLearnt);
	resetJoyoList(_joyoList); // Istället för att köra denna borde du göra en egen funktion som bara resettar "isActive"
	compareRtkJoyo(_rtkList, _joyoList);

	$("#grade_list").empty();
	///////////// Bygga bygga
	for (let i = 1; i < _joyoList.grade.length; i++) {
		let grade_section = $("<section>").addClass("grade");
		let grade_h2 = $("<h3>").text(`Grade ${i == 7 ? "7-12" : i}`);
		let grade_kanji_container = $("<div>").addClass("kanji_container");

		grade_section.append(grade_h2);
		for (let j = 0; j < _joyoList.grade[i].length; j++) { // Det vackraste jag sett
			grade_kanji_container.append(`<span class="kanji_item ${_joyoList.grade[i][j].isActive ? 'kanji_item_active' : ''}">
											<a href='//${_joyoList.grade[i][j].jishoHref}'>
												${_joyoList.grade[i][j].kanji}
											</a>
										</span>`);
		}
		grade_section.append(grade_kanji_container);
		$("#grade_list").append(grade_section);
	}
}

// Hjälp funktioner, かな
function resetRtkList(rtkList) {
	for (let i = 0; i < rtkList.length; i++)
		rtkList[i] = {kanji: rtkList[i], learnt: false};
}

function resetJoyoList(joyoList) {
	for (let i = 1; i < joyoList.grade.length; i++)
		for (let j = 0; j < joyoList.grade[i].length; j++)
			joyoList.grade[i][j] = {kanji: joyoList.grade[i][j].kanji, // Här känns det som att det finns optimeringar
									strokes: parseInt(joyoList.grade[i][j].strokes),
									jishoHref: joyoList.grade[i][j].jishoHref,
									koohiiHref: joyoList.grade[i][j].koohiiHref,
									isActive: false};
}

// range ex: 500 (0-500 kanji learnt)
function setLearntRtkList(rtkList, range) {
	for (let i = 0; i < range; i++)
		rtkList[i].learnt = true;
}

function compareRtkJoyo(rtkList, joyoList) {
	let qtyRtkExisted = 0;
	for (let rtk_i = 0; rtk_i < _qtyLearnt; rtk_i++) {
		for (let grade_i = 1; grade_i < joyoList.grade.length; grade_i++) {
			for (let kanji_i = 0; kanji_i < joyoList.grade[grade_i].length; kanji_i++) {
				if (rtkList[rtk_i].kanji == joyoList.grade[grade_i][kanji_i].kanji) {
					rtkList[rtk_i].learnt = false;
					joyoList.grade[grade_i][kanji_i].isActive = true;
					console.log("lmao");
					qtyRtkExisted++;
				}
			}
		}
	}
	let rtkNotInJoyo = new Array();
	for (let i = 0; i < _qtyLearnt; i++) {
		if (rtkList[i].learnt == true)
			rtkNotInJoyo.push(rtkList[i].kanji);
	}
	if (qtyRtkExisted + rtkNotInJoyo.length != _qtyLearnt) {
		console.log("qtyRtkExisted: " + qtyRtkExisted + " + rtkNotInJoyo: " + rtkNotInJoyo.length + " does not equal qtyLearnt: " + _qtyLearnt);
		return 1;
	}
	return {qtyRtkExisted, rtkNotInJoyo};
}