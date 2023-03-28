//let _qtyLearnt = 0; // Hämtas sedan från användaren indata

$(async function()	
{
	let _qtyLearnt = 0;

	// Hämta listan av Heisigs kanji (sorterad, så index+1 == koohiis index)
	let rtkList;
	await $.get("/static/data/rtk1_index.txt", (data) => {
		rtkList = (data.split("\n")); // Mannen tänk nu på att arrays börjar på 0 (0-2199)
	});
	resetRtkList(rtkList);
	// setLearntRtkList(rtkList, _qtyLearnt); // Ska inte köras här i slutändan

	// Hämta listan av joyo kanji
	let joyoList = new Array();
	await $.get("/static/data/joyo_list_extended_V2.json", (data) => {
		joyoList = data;
	});
	resetJoyoList(joyoList);

	// compareRtkJoyo(rtkList, joyoList, _qtyLearnt); // Detta ska heller inte köras i slutändan
	// console.log(joyoList.grade);

	///////////// Bygga bygga				// Kanske inte heller ska vara här i slutändan? 				// Fast jo vänta lite, den måste ju visa någonting på sidan, bara att inga är lärda än
	for (let i = 1; i < joyoList.grade.length; i++) {
		let grade_section = $("<section>").addClass("grade");
		let grade_h2 = $("<h3>").text(`Grade ${i == 7 ? "7-12" : i}`);
		let grade_kanji_container = $("<div>").addClass("kanji_container");

		grade_section.append(grade_h2);
		for (let j = 0; j < joyoList.grade[i].length; j++) { // Det vackraste jag sett
			grade_kanji_container.append(`<span class="kanji_item ${joyoList.grade[i][j].isActive ? 'kanji_item_active' : ''}" id="${joyoList.grade[i][j].kanji}">
											<a href='//${joyoList.grade[i][j].jishoHref}'>
												${joyoList.grade[i][j].kanji}
											</a>
										</span>`);
		}
		grade_section.append(grade_kanji_container);
		$("#grade_list").append(grade_section);
	}

	// Får denna ligga här? Hmmmm
	$('[name^="qtyLearnt"]').on("input", (e) => { // Så denna skiten uppdaterar vilka kanjin som ska vara "aktiva" LÖPANDE (optimering i väggen)
		_qtyLearnt = e.currentTarget.value;
		
		// resetRtkList(rtkList); // WTF, VARFÖR SKA INTE DENNA VAR HÄR????????????????????????????????????????????????
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

		// Detta funkar åt ett håll
		// for (let rtk_i = 0; rtk_i <= _qtyLearnt; rtk_i++) {
		// 	for (let grade_i = 1; grade_i < joyoList.grade.length; grade_i++) {
		// 		for (let kanji_i = 0; kanji_i < joyoList.grade[grade_i].length; kanji_i++) {
		// 			if (rtk_i == joyoList.grade[grade_i][kanji_i].heisigIndex) {
		// 				$(`#${joyoList.grade[grade_i][kanji_i].kanji}`).addClass("kanji_item_active");
		// 			}
		// 		}
		// 	}
		// }
	});

	$('[name="perday"]').on("input", (e) => {
		let perday = (2200 - _qtyLearnt) / e.currentTarget.value;
		$("#kanjiperday").text(perday);
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
				// if (rtkList[rtk_i].kanji == joyoList.grade[grade_i][kanji_i].kanji) {
				// 	rtkList[rtk_i].learnt = false; // Tänkte säga att jag kanske inte ens behöver rtkList om jag ändå har heisigIndex i joyoList, men då kommer inte detta funka, kuken
				// 	joyoList.grade[grade_i][kanji_i].isActive = true;
				// 	qtyRtkExisted++;
				// }
				if (rtk_i + 1 == joyoList.grade[grade_i][kanji_i].heisigIndex) {
					rtkList[rtk_i].learnt = false; // Tänkte säga att jag kanske inte ens behöver rtkList om jag ändå har heisigIndex i joyoList, men då kommer inte detta funka, kuken
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