---
{
    "favorite_fruit": "Banana",
    "current_salary": 5000,
    "the_best_language": "Java"
}
---
# Markdown Vitepress 内置扩展语法

## 代码组
* 功能
> 类似于 HTML 中的 Tab 页
* 代码示例
````
:::code-group
```Java [Java]
public static void main(String args[]) {
    System.out.print("Hello World !");
}
```
```py [Python]
print("Hello World !");
```
```js [Javascript]
console.log("Hello World !");
```
:::

````
:::info 效果
:::code-group
```Java [Java]
public static void main(String args[]) {
    System.out.print("Hello World !");
}
```
```py [Python]
print("Hello World !");
```
```js [Javascript]
console.log("Hello World !");
```
:::

## frontmatter
* 功能
> 可以使用该功能，覆盖站点级别或主题级别的配置选项。
* 使用方式
    1. 在你需要用到这个功能的 md 文件 `顶部` 定义你的数据（`YAML 或 JSON 格式`）。
    2. 在对应的地方通过 `$frontmatter` 进行调用。
* 代码示例
:::warning 注意
当前 md 文件顶部已经定义了三组数据，由于官网是使用的 `YAML` 格式的数据，本文则使用 `JSON` 格式的数据。
```
---
{
    "favorite_fruit": "Banana",
    "current_salary": 5000,
    "the_best_language": "Java"
}
---
```
这里要注意，千万别忘记写那三个 `---` 符号！
:::

```
最爱吃的水果：{{$frontmatter.favorite_fruit}}
当前工资：{{$frontmatter.current_salary}}
最好的语言：{{$frontmatter.the_best_language}}
```

:::info 效果
最爱吃的水果：{{$frontmatter.favorite_fruit}}

当前工资：{{$frontmatter.current_salary}}

最好的语言：{{$frontmatter.the_best_language}}
:::

## 自定义容器
* 功能
> 当前 md 文件中，你所看到的 `注意`、`效果` 都是通过自定义容器实现的。

* 代码实现 & 说明
> [VitePress - 自定义容器](https://vitepress.dev/zh/guide/markdown#custom-containers)

## 代码块高亮
* 功能
> Vitepress 使用 `Shiki` 让代码带上色彩，让他们更容易被阅读 & 查看。

* 代码实现
````
``` java
public static void main(String args[]) {
    System.out.print("Hello Shiki");
}
```
``` ts
let num: number = 10
```
````

:::info 效果
``` java
public static void main(String args[]) {
    System.out.print("Hello Shiki");
}
```
``` ts
let num: number = 10
```
:::

:::tip 拓展
`Skiki` 可以支持很多种语言，详细请看：<https://shiki.tmrs.site/languages>
:::

## 代码块中行高亮
* 功能
> 可以让代码块中某一行或者某几行进行高亮展示

* 代码实现
````
```java{3,8-17}
public static void main(String[] args) {
    int[] values = { 3, 1, 6, 2, 9, 0, 7, 4, 5, 8 };
    bubbleSort(values);
    System.out.println(Arrays.toString(values));
}
public static void bubbleSort(int[] values) {
    int temp;
    for (int i = 0; i < values.length; i++) {
        for (int j = 0; j < values.length - 1 - i; j++) {
            // 减i原因：内层循环，每循环完一趟就在数组末产生一个最大数，即最大数就不用比较了。
            if (values[j] > values[j + 1]) {
                temp = values[j];
                values[j] = values[j + 1];
                values[j + 1] = temp;
            }
        }
    }
}
```
````

:::info 效果
```java{3,8-17}
public static void main(String[] args) {
    int[] values = { 3, 1, 6, 2, 9, 0, 7, 4, 5, 8 };
    bubbleSort(values);
    System.out.println(Arrays.toString(values));
}
public static void bubbleSort(int[] values) {
    int temp;
    for (int i = 0; i < values.length; i++) {
        for (int j = 0; j < values.length - 1 - i; j++) {
            // 减i原因：内层循环，每循环完一趟就在数组末产生一个最大数，即最大数就不用比较了。
            if (values[j] > values[j + 1]) {
                temp = values[j];
                values[j] = values[j + 1];
                values[j + 1] = temp;
            }
        }
    }
}
```
:::

:::tip 拓展
你也可以在某一行代码中增加 `// [!code highlight]` 进行代码高亮。

* 代码示例 & 说明
> [VitePress - 在代码块中实现行高亮](https://vitepress.dev/zh/guide/markdown#line-highlighting-in-code-blocks)
:::

## 代码块中聚焦
* 功能
> 模糊代码块中其他代码，只保留被聚焦的代码清晰度。

* 代码实现 & 说明
> [VitePress - 代码块中聚焦](https://vitepress.dev/zh/guide/markdown#focus-in-code-blocks)

## 代码块行号
* 功能
> 让代码块中增加行号，方便查找、阅读。

* 代码实现 & 说明
> [VitePress - 代码块行号](https://vitepress.dev/zh/guide/markdown#line-numbers)

## 其他
Vitepress 中还有很多 Markdown 扩展方案，大家可以直接到 Vitepress 官网进行学习 & 练习。
