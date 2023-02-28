import json

rtk_list = []
rtk_file = open("rtk_index.json", "w", encoding="utf8")
for i in range(2200):  # magic number baby
    currFile = open(f"venv/rtk1-v6/{i+1}.md", "r", encoding="utf8")
    kanji = currFile.readlines()[4][7:8]
    currFile.seek(0)
    kuk = currFile.readlines()[7]
    strokes = kuk[9:kuk.find("\n")]
    rtk_list.append({"kanji": kanji, "strokes": strokes, "jishoHref": f"jisho.org/search/{kanji} %23kanji", "koohiiHref": f"kanji.koohii.com/study/kanji/{i+1}"})
    currFile.close()
print(rtk_list)
rtk_file.write(json.dumps(rtk_list, ensure_ascii=False, indent=4))
rtk_file.close()
