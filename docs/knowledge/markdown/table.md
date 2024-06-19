# Markdown 表格

## 基础表格
* 实现方式
> 表格中是使用 `|` 来分隔单元格的，使用 `-` 来分隔表头和其他行。
* 代码示例
```
|表头1|表头2|表头3|表头4|
|-|-|-|-|
| 千山鸟飞绝 | 万径人踪灭 | 孤舟蓑笠翁 | 独钓寒江雪 |
```
:::info 效果
|表头1|表头2|表头3|表头4|
|-|-|-|-|
| 千山鸟飞绝 | 万径人踪灭 | 孤舟蓑笠翁 | 独钓寒江雪 |
:::

:::warning 注意
* 单元格中的宽度是自适应，无需自己调整；
* 单元格分割所使用的 `|` 无需对齐，只需要保证数量和表头一致即可；
* 每个表格中必须有 `表头`和`分隔行`；
:::

## 单元格对齐方式
* 实现方式
> 在 `分隔行`中的 `-` 左右两侧，使用 `:` 进行实现对齐方式；`:` 在左，则表示居左对齐（默认单元格数据居左）；在右，表示局右对齐；左右两侧都有，则表示居中。

* 代码示例
```
| 默认 | 居左 | 居中 | 居右 |
| :-: | :- | :-: | -: |
| 千山鸟飞绝 | 万径人踪灭 | 孤舟蓑笠翁 | 独钓寒江雪 |
| 雷神 | 九条 | 班尼特 | 万叶 |
```

:::info 效果
| 默认 | 居左 | 居中 | 居右 |
| :-: | :- | :-: | -: |
| 千山鸟飞绝 | 万径人踪灭 | 孤舟蓑笠翁 | 独钓寒江雪 |
| 雷神 | 九条 | 班尼特 | 万叶 |
:::

:::warning 注意
如果要使用单元格对齐，需要所有的 `分隔行` 上的 `-` 都增加 `:`。
:::

## 复杂格式
* 实现方式
> 巧了，`Markdown` 的表格只能支持固定格式，复杂的格式还得靠 `Html`。

* 代码示例
```html
<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-syad{background-color:#000000;border-color:inherit;color:#ffffff;text-align:left;vertical-align:top}
.tg .tg-vfmm{background-color:#3bd37f;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-ffbu{background-color:#3a5cd1;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-jynt{background-color:#9a0000;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-6i1h{background-color:#9fcf2f;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-d6vy{background-color:#d5a915;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-ncd7{background-color:#ffffc7;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-tw5s{background-color:#fe0000;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-706m{background-color:#009901;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-mpvc{background-color:#d83ee6;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-jywj{background-color:#6434fc;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-rleq{background-color:#68cbd0;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-c6of{background-color:#ffffff;border-color:inherit;text-align:left;vertical-align:top}
</style>
<table class="tg"><thead>
  <tr>
    <th class="tg-ncd7" colspan="2">1</th>
    <th class="tg-tw5s">2</th>
    <th class="tg-706m">3</th>
    <th class="tg-mpvc">4</th>
  </tr></thead>
<tbody>
  <tr>
    <td class="tg-jywj">5</td>
    <td class="tg-jynt">6</td>
    <td class="tg-rleq" colspan="2">7</td>
    <td class="tg-6i1h">8</td>
  </tr>
  <tr>
    <td class="tg-vfmm">9</td>
    <td class="tg-tw5s" colspan="3">10</td>
    <td class="tg-ffbu">11</td>
  </tr>
  <tr>
    <td class="tg-d6vy" colspan="2">12</td>
    <td class="tg-c6of">13</td>
    <td class="tg-syad" colspan="2">14</td>
  </tr>
</tbody>
</table>
```

:::info 效果
<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-syad{background-color:#000000;border-color:inherit;color:#ffffff;text-align:left;vertical-align:top}
.tg .tg-vfmm{background-color:#3bd37f;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-ffbu{background-color:#3a5cd1;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-jynt{background-color:#9a0000;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-6i1h{background-color:#9fcf2f;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-d6vy{background-color:#d5a915;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-ncd7{background-color:#ffffc7;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-tw5s{background-color:#fe0000;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-706m{background-color:#009901;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-mpvc{background-color:#d83ee6;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-jywj{background-color:#6434fc;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-rleq{background-color:#68cbd0;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-c6of{background-color:#ffffff;border-color:inherit;text-align:left;vertical-align:top}
</style>
<table class="tg"><thead>
  <tr>
    <th class="tg-ncd7" colspan="2">1</th>
    <th class="tg-tw5s">2</th>
    <th class="tg-706m">3</th>
    <th class="tg-mpvc">4</th>
  </tr></thead>
<tbody>
  <tr>
    <td class="tg-jywj">5</td>
    <td class="tg-jynt">6</td>
    <td class="tg-rleq" colspan="2">7</td>
    <td class="tg-6i1h">8</td>
  </tr>
  <tr>
    <td class="tg-vfmm">9</td>
    <td class="tg-tw5s" colspan="3">10</td>
    <td class="tg-ffbu">11</td>
  </tr>
  <tr>
    <td class="tg-d6vy" colspan="2">12</td>
    <td class="tg-c6of">13</td>
    <td class="tg-syad" colspan="2">14</td>
  </tr>
</tbody>
</table>
:::