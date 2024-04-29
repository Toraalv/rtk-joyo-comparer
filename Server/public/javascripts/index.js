//let _qtyLearnt = 0; // Hämtas sedan från användaren indata

$(async function()
{
	let _qtyLearnt = 0;

	// Hämta listan av Heisigs kanji (sorterad, så index+1 == koohiis index)
	let rtkList;
	await $.get("/static/data/rtk1_index.txt", (data) => {
		rtkList = (data.split("\n"));
	});
	resetRtkList(rtkList);

	// Hämta listan av joyo kanji
	let joyoList = new Array();
	await $.get("/static/data/joyo_list_extended_V2.json", (data) => {
		joyoList = data;
	});
	resetJoyoList(joyoList);

	for (let i = 1; i < joyoList.grade.length; i++) {
		let grade_item = $("<section>").addClass("grade_item");
		let grade_name = $("<h1>").text(`grade ${i == 7 ? "7-12" : i}`);
		let grade_kanji_container = $("<div>").addClass("kanji_container");

		grade_item.append(grade_name);
		for (let j = 0; j < joyoList.grade[i].length; j++) {
			grade_kanji_container.append(	`<a class="${joyoList.grade[i][j].isActive ? 'kanji_item_active' : ''}" id="${joyoList.grade[i][j].kanji}" href='//${joyoList.grade[i][j].jishoHref}'>
												${joyoList.grade[i][j].kanji}
											</a>`);
		}
		grade_item.append(grade_kanji_container);
		$("#grade_container").append(grade_item);
		if (i != 7)
			$("#grade_container").append($("<div>").addClass("grade_divider"));
	}

	// Får denna ligga här? Hmmmm
	$('[name^="qtyLearnt"]').on("input", (e) => { // Så denna skiten uppdaterar vilka kanjin som ska vara "aktiva" LÖPANDE (optimering i väggen)
		if (e.currentTarget.value > 0 && e.currentTarget.value <= 2200)
			_qtyLearnt = e.currentTarget.value;
		else
			_qtyLearnt = 0;

		let perday = (2200 - _qtyLearnt) / $('[name="perday"]')[0].valueAsNumber;
		$("#kanjiperday").text(Math.round(perday));
		
		setLearntRtkList(rtkList, _qtyLearnt);
		resetJoyoList(joyoList);
		compareRtkJoyo(rtkList, joyoList, _qtyLearnt);
		

		for (let grade_i = 1; grade_i < joyoList.grade.length; grade_i++) {
			for (let kanji_i = 0; kanji_i < joyoList.grade[grade_i].length; kanji_i++) {
				if (joyoList.grade[grade_i][kanji_i].isActive) {
					$(`#${joyoList.grade[grade_i][kanji_i].kanji}`).addClass("kanji_item_active");
				}
				else
					$(`#${joyoList.grade[grade_i][kanji_i].kanji}`).removeClass("kanji_item_active");
			}
		}
	});

	$('[name^="perday"]').on("input", (e) => {
		if (e.currentTarget.value > 0 && e.currentTarget.value <= 2200) {
			let perday = (2200 - _qtyLearnt) / e.currentTarget.value;
			$("#kanjiperday").text(Math.round(perday));
		}
	});
});



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
									isActive: false,
									heisigIndex: joyoList.grade[i][j].heisigIndex};
}

// range ex: 500 (0-500 kanji learnt)
function setLearntRtkList(rtkList, range) {
	for (let i = 0; i < range; i++)
		rtkList[i].learnt = true;
}

function compareRtkJoyo(rtkList, joyoList, range) {
	let qtyRtkExisted = 0;
	for (let rtk_i = 0; rtk_i < range; rtk_i++) {
		for (let grade_i = 1; grade_i < joyoList.grade.length; grade_i++) {
			for (let kanji_i = 0; kanji_i < joyoList.grade[grade_i].length; kanji_i++) {
				if (rtk_i + 1 == joyoList.grade[grade_i][kanji_i].heisigIndex) {
					rtkList[rtk_i].learnt = false;
					joyoList.grade[grade_i][kanji_i].isActive = true;
					qtyRtkExisted++;
				}
			}
		}
	}
	let rtkNotInJoyo = new Array();
	for (let i = 0; i < range; i++) {
		if (rtkList[i].learnt == true)
			rtkNotInJoyo.push(rtkList[i].kanji);
	}
	if (qtyRtkExisted + rtkNotInJoyo.length != range) {
		console.log("qtyRtkExisted: " + qtyRtkExisted + " + rtkNotInJoyo: " + rtkNotInJoyo.length + " does not equal _qtyLearnt: " + range);
		return 1;
	}
	return {qtyRtkExisted, rtkNotInJoyo};
}
