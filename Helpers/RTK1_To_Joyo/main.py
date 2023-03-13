import json

rtkFile = open("rtk1_index_extended.json", "r", encoding="utf8")
joyoFile = open("joyo_list.json", "r", encoding="utf8")

rtkList = json.loads(rtkFile.read())
joyoList = json.loads(joyoFile.read())

for rtkObj_i, rtkObj in enumerate(rtkList):
	for joyoGrade_i, joyoGrade in enumerate(joyoList["grade"]):
		for joyoKanji_i, joyoKanji in enumerate(joyoGrade):
			if rtkObj["kanji"] == joyoKanji:
				# joyoKanji = rtkObj	funka inte?
				joyoList["grade"][joyoGrade_i][joyoKanji_i] = rtkObj
				joyoList["grade"][joyoGrade_i][joyoKanji_i]["heisigIndex"] = rtkObj_i + 1

joyoExtendedFile = open("joyo_list_extended.json", "w", encoding="utf8")
joyoExtendedFile.write(json.dumps(joyoList, ensure_ascii=False, indent=4))
joyoExtendedFile.close()

rtkFile.close()
joyoFile.close()
