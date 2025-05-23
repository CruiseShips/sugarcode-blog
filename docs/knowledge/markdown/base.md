# Markdown 基础

## 标题
* 功能
> 标题可以让文档中内容更好的归类；并且类似 `vitepress` 会根据标题层级当做索引。
* 代码示例
```
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
```
:::info 效果
![标题](/images/service/knowledge/markdown/Biaoti.png)

之所以放了一张图，是因为怕 `vitepress` 根据他们创建对应的标题层级。
:::

## 文本
* 功能&示例

|  | 使用方式 | 正常文本 | 对比文本 | 代码示例 |
|------|------|------|------|------|
| 加粗 | 两个*或者两个_ | 我是无敌cool男孩 | **我是无敌cool男孩** | `**我是无敌cool男孩**` |
| 斜体 | 单个*或者单个_ | 我是无敌cool男孩 | *我是无敌cool男孩* | `*我是无敌cool男孩*` |
| 删除 | 两个~ | 我是无敌cool男孩 | ~~我是无敌cool男孩~~ | `~~我是无敌cool男孩~~` |

:::tip 拓展
* 标记文本
使用 html 标签中的 `<mark>` 实现。
```
<mark>标记文本</mark>
```
效果：<mark>标记文本</mark>

* 下划线
使用 html 标签中的 `<u>` 实现。
```
<u>下划线</u>
```
效果：<u>下划线</u>

:::

## 列表
### 有序列表
* 功能
> 可以让列表数据按照 1 2 3 顺序进行并列排序。

* 代码示例
```
1. 张三
2. 李四
3. 王五
4. 赵六
```

:::info 效果
1. 张三
2. 李四
3. 王五
4. 赵六
:::

### 无序列表
* 功能
> 对比有序列表，这里只是将 1 2 3 这些数字更换成 `·`。

* 代码示例
```
* 张三
- 李四
+ 王五
```
:::info 效果
* 张三
- 李四
+ 王五

这里可以使用 `*` `-` `+` 三种方式去表示无序列表。
:::

:::warning 注意
不管哪种列表，符号（`.`、`*`、`-`、`+`等）后面都需要跟一个空格，如果不写，会被当做普通文本处理。
:::

:::tip 拓展
可以使用首行的缩进（一个 tab），让列表层次更加分明

* 代码示例
```
* 吃饭
    * 吃烧烤
        * 羊肉串
        * 牛板筋
        * 啤酒
    * 吃火锅
        * 毛肚
        * 鸭血
```

:::info 效果
* 吃饭
    * 吃烧烤
        * 羊肉串
        * 牛板筋
        * 啤酒
    * 吃火锅
        * 毛肚
        * 鸭血
:::

## 引用
* 功能
> 相对于普通文本，使用引用功能，会提高文本的曝光度。

* 代码示例
```
> 李白：这个博客写的真好！
>> 孟浩然：是的呢，我看完就想再写一首诗！
>>> 王昌龄：都出来喝酒！！！
```

:::info 效果
> 李白：这个博客写的真好！
>> 孟浩然：是的呢，我看完就想再写一首诗！
>>> 王昌龄：都出来喝酒！！！
:::

## 行内代码
* 功能
> 需要在文本中凸显出一些代码、或者单词。

* 代码展示
```
大家好，我是 `SugarCode`！
```

:::info 效果
* 正常文本
大家好，我是 SugarCode！
* 使用行内代码块
大家好，我是 `SugarCode`！
:::

## 代码块
* 功能
> 可以更好的展示代码；而且在鼠标移动到代码块的右上角，还会有复制按钮。

* 代码展示
````
``` java
public static void main(String args[]) {
    System.out.println("你好，代码块！");
}
```
````

:::info 效果
``` java
    public static void main(String args[]) {
        System.out.println("你好，代码块！");
    }
```

"代码展示"中后面的 java 可以替换为其他语言的简写或者全称。比如说 ts、js、py 等等。
:::

:::warning 注意
这里的代码展示本应该放置可复制的代码，但是由于符号原因，现在需要复制后，去掉所有的 `前置空格（4个）` 才可正常使用。
:::

## 自动链接
* 功能
> 自动将 https 链接、邮箱等标记出来。

* 代码展示
```
<https://sugarcode.cn>
<2011363119@qq.com>
直接使用尖括号将内容括起来即可。
```

:::info 效果
<https://sugarcode.cn>

<2011363119@qq.com>
:::

## 超链接
* 功能
> 可以针对任何文本添加超链接，当点击时会跳转到圆括号内提供的网址。

* 代码展示
```
[Sugar Code](https://sugarcode.cn)
```

:::info 效果
[Sugar Code](https://sugarcode.cn)
:::

我们如果想让链接在新窗口打开，可以使用 `{target="_blank"}`

* 代码展示
```
[Sugar Code](https://sugarcode.cn){target="_blank"}
```

:::info 效果
[Sugar Code](https://sugarcode.cn){target="_blank"}
:::

## 图片
* 功能
> 展示项目中（本地）的图片。

* 代码展示
```
![Sugar Code](/images/system/logo.jpg)
```

:::info 效果
![Sugar Code](/images/system/logo.jpg)
:::

:::warning 注意
和上面的超链接不一样，在代码最前面还有一个 `!`。
:::
