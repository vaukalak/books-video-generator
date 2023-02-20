# Налады

Неабходна ўсталяваць:
- `node.js` (> 16)
- `ffmpeg` (> 5.1.2)

# Каманды

Для ўсіх камандаў патрэбна параметр `BOOK` - гэта id кнігі з якой працуем

### Стварыць кнігу

`BOOK=vostrau ./add-book.js`

Створыць каталог `resource/vostrau` з базавым наборам для генерацыі кнігі

### Згенерыць главы

`BOOK=vostrau ./generate-chapters.js`

Згенеруе главы ў каталог `out/vostrau/chapters`

### Склеіць главы

`BOOK=vostrau ./concat-chapters.js`

Ствоорыць ў `out/vostrau/` фінальнае відэа

### Стварыць таймкоды

`BOOK=vostrau ./create-timecodes.js`

вывядзе таймкоды ў кансоль

# Налады

Кастамізацыя адбываецца праз `resource/НАЗВА/config.yml` файл:

```
text_options:
  fontsize: 78
  fontcolor: black
# video / image
# калі ўказаць video, будзе шукаць файл `resource/НАЗВА/background.mp4`
background_mode: image
```