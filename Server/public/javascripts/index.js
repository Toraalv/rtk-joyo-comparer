let qtyLearnt = 2200; // Hämtas sedan från användaren indata

$(async function()	
{
	// Hämta listan av Heisigs kanji (sorterad, så index+1 == koohiis index)
	let rtkList;
	await $.get("/static/data/rtk1_index.txt", (data) => {
		rtkList = (data.split("\n")); // Mannen tänk nu på att arrays börjar på 0 (0-2199)
	});
	resetRtkList(rtkList);
	setLearntRtkList(rtkList, qtyLearnt);

	// Hämta listan av joyo kanji
	let joyoList = new Array();
	await $.get("/static/data/joyo_list.json", (data) => {
		joyoList = data;
	});
	resetJoyoList(joyoList);

	console.log(compareRtkJoyo(rtkList, joyoList));
	console.log(joyoList.grade);

	///////////// Bygga bygga
	for (let i = 1; i < joyoList.grade.length; i++) {
		let grade_section = $("<section>").addClass("grade");
		let grade_h2 = $("<h2>").text(`Grade ${i == 7 ? "7-12" : i}`);
		let grade_kanji_container = $("<div>").addClass("kanji_container");

		grade_section.append(grade_h2);
		for (let j = 0; j < joyoList.grade[i].length; j++) {
			grade_kanji_container.append(`<span class="kanji_item ${joyoList.grade[i][j].isActive ? 'kanji_item_active' : ''}">${joyoList.grade[i][j].kanji}</span>`);
		}
		grade_section.append(grade_kanji_container);
		$("main").append(grade_section);
	}
});

// Hjälp funktioner, かな
function resetRtkList(rtkList) {
	for (let i = 0; i < rtkList.length; i++)
		rtkList[i] = {kanji: rtkList[i], learnt: false};
}

function resetJoyoList(joyoList) {
	for (let i = 1; i < joyoList.grade.length; i++)
		for (let j = 0; j < joyoList.grade[i].length; j++)
			joyoList.grade[i][j] = {kanji: joyoList.grade[i][j], isActive: false};
}

// range ex: 500 (0-500 kanji learnt)
function setLearntRtkList(rtkList, range) {
	for (let i = 0; i < range; i++)
		rtkList[i].learnt = true;
}

function compareRtkJoyo(rtkList, joyoList)
{
	let qtyRtkExisted = 0;
	for (let rtk_i = 0; rtk_i < qtyLearnt; rtk_i++) {
		for (let grade_i = 1; grade_i < joyoList.grade.length; grade_i++) {
			for (let kanji_i = 0; kanji_i < joyoList.grade[grade_i].length; kanji_i++) {
				if (rtkList[rtk_i].kanji == joyoList.grade[grade_i][kanji_i].kanji) {
					rtkList[rtk_i].learnt = false;
					joyoList.grade[grade_i][kanji_i].isActive = true;
					qtyRtkExisted++;
				}
			}
		}
	}
	let rtkNotInJoyo = new Array();
	for (let i = 0; i < qtyLearnt; i++) {
		if (rtkList[i].learnt == true)
			rtkNotInJoyo.push(rtkList[i].kanji);
	}
	if (qtyRtkExisted + rtkNotInJoyo.length != qtyLearnt) {
		console.log("qtyRtkExisted: " + qtyRtkExisted + " + rtkNotInJoyo: " + rtkNotInJoyo.length + " does not equal qtyLearnt: " + qtyLearnt);
		return 1;
	}
	return {qtyRtkExisted, rtkNotInJoyo};
}