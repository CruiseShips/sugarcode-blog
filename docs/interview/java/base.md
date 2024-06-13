# Java-基础（17）

## 1. Java 中 JDK 和 JRE 有什么区别？1️⃣
::: info 考点
- **JDK**：Java Development Kit（Java 开发工具包），是整个 Java 的核心。JDK 中包括了 Java 编译器、JRE（Java 运行环境）、JavaDoc 文档生成器和其他一些工具。
- **JRE**：Java Runtime Environment（Java 运行时环境），它用于运行已编译的Java应用程序。它里面包含了 Java 虚拟机、类加载器、运行时类库和其他支持文件。
:::

## 2. 值传递和引用传递的区别？3️⃣🍇
::: info 考点
- **值传递**：是指在调用函数的过程中，将实际参数复制一份传递到函数中。这样在函数中如果对参数进行修改，将不会影响到实际参数。
- **引用传递**：是指在调用函数的过程中，将实际参数的地址直接传递到函数中，如果在函数中对参数所进行的修改，将影响到实际参数。
:::
::: tip 拓展
！！！Java 中不存在引用传递。而之所以会出现 **引用传递** 的样子，其实是 Java 在传递参数的过程中，是通过值传递，传递的是对象的引用。
:::

## 3. Java 中深拷贝、浅拷贝是什么？4️⃣🍈
:::info 考点
- **浅拷贝**：浅拷贝是对对象的引用的复制，而不是对象本身的复制。
- **深拷贝**：深拷贝是对对象的完全复制，包括对象内部的所有成员变量。

说的明白点，浅拷贝就拷贝了一个地址，随着对象的修改，所有引用这个地址的对象都会跟这变。而深拷贝可以理解为是创建了一个新的对象，原对象不管怎么变，都不会影响到拷贝的对象。
:::
::: tip 拓展
深拷贝的方式一般使用两种
* 重写 clone 方法
``` Java
// 核心代码
class Animal implements Cloneable {
    // 属性
    // Get/Set 方法
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```
* 对象序列化
``` Java
// 核心代码
public static <T extends Serializable> T deepCopy(T object) {
    try {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ObjectOutputStream output = new ObjectOutputStream(outputStream);

        output.writeObject(object);

        ByteArrayInputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());
        ObjectInputStream input = new ObjectInputStream(inputStream);
        return input.readObject();
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}
```
:::

## 4. == 和 equals 的区别？1️⃣🍉
::: info 考点
- **==**：== 是用于比较两个变量或对象引用是否相等的操作符。
- **equals**：equals 是 Java 中 Object 对象的一个方法，用于比较两个对象是否相等。
:::
::: tip 拓展
|  | 基本数据类型 | 引用数据类型 |
|-------|-------|-------|
| == | 值比较 | 引用比较 |
| equals | 不支持 | 根据重写的equals进行判断 |

* 如果是两个基本数据类型使用 == 进行比较，则比较的是具体的值。
* 如果是两个引用数据类型使用 == 进行比较，则比较的是他们的引用地址。
> eg：好比是 **浅拷贝** 对象，它们使用 == 进行比较，则一定为 true。
* equals 无法对基本数据类型进行比较。
* 在使用 equals 方法时，需要看当前对象是否重写了该方法
```java
// 默认 Object 类中的 equals 方法
public boolean equals(Object obj) {
    return (this == obj);
}
```
:::

## 5. hashcode 相同的，equals 一定相同吗？1️⃣🍊
:::info 考点
答案：不一定。

* hashCode() 方法返回的是当前当前对象的哈希值。
* equals() 方法返回的的，当前对象和传递对象的比较。

在 Java 中，hashCode 返回值为 int 类型，也就是说最多有 2^32 个 hashCode 值，肯定会存在两个不相同的对象，得到同一个 hashCode（这个叫做 hash 碰撞）。
:::
::: tip 拓展
hash 碰撞是指两个不同的输入值，经过哈希函数的处理后，得到相同的输出值，这种情况被称之为哈希碰撞。
:::

## 6. 抽象类中必须要有抽象方法吗？2️⃣🍋
:::info 考点
答案：不是。

* Java 中，用 `abstract` 关键字修饰的类，叫做抽象类。

通过官方的定义，我们可以发现，在定义中，并没有提到抽象方法~。

也就是说，不需要抽象类中要有抽象方法。
:::

## 7. 普通类和抽象类有哪些区别？1️⃣
:::info 考点
|  | 普通类 | 抽象类 |
|-------|-------|-------|
| 定义 | 普通类中不存在抽象方法 | 可以存在抽象方法和普通方法 |
| 实例化 | 可直接实例化 | 无法直接实例化 |
| 用途 | 一般用于实现具体的功能和方法 | 用于定义模版、框架等 |
| 设计原则 | 关注于具体的实现和细节 | 关注于高层次的设计和结构，强调行为和属性的共性 |
:::

## 8. 接口和抽象类有什么区别？1️⃣
:::info 考点
|  | 接口 | 抽象类 |
|-------|-------|-------|
| 声明 | `interface` | `abstract` |
| 实现 | `implements` | `extends` |
| 实例化 | 无法直接实例化 | 无法直接实例化 |
| 子类扩展数量 | 一个类可以实现多个接口 | 一个类只可以继承一个抽象类 |
| 控制访问权限 | 只能是 public | 无限制 |
| 控制访问权限 | 只能是 public | 无限制 |
:::
:::tip 拓展
* 接口类中可以定义 static 方法和 defaule 方法，但是必须要有实现。
* 抽象类中的抽象方法不能是 private 修饰
:::

## 9. 重载和重写区别？2️⃣🍌
:::info 考点
- **重载**：重载是指在同一个类中，可以定义多个方法名相同但参数类型、个数或顺序不同的方法（可以抛出不同的异常）。
- **重写**：重写是指在子类中重新定义父类中已有的方法，但方法名、参数类型和个数必须与父类中的方法相同。
:::
:::tip 拓展
* 重载是同一个类方法中的关系，是水平关系。
* 重写是父类与子类的关系，是垂直关系。
:::

## 10. 基本数据类型有那些，分别是什么？1️⃣
:::info 考点
* 基本数据类型有 **8** 个：`byte`、`short`、`int`、`long`、`float`、`double`、`char`、`boolean`
:::

## 11. String 是基础数据类型吗？1️⃣
:::info 考点
答案：不是。

String 是一个引用数据类型。
:::

## 12. String 中常用方法有那些？1️⃣
:::info 考点
`length()`：返回当前字符串长度。

`substring(int begin)`：返回 [begin, length) 之间的字符串。

`equals()`：比较此字符串与指定的对象的 内容 是否相同。

`isEmpty()`：当且仅当长度为 0 时返回 true。

`contains(CharSequence s)`：此字符串包含指定子串时返回 true。

`matches()`：此字符串是否匹配给定的正则表达式。

`trim()`：返回字符串的副本，忽略首尾空格。

......
:::

## 13. String StringBuffer StringBuilder 区别？1️⃣🍍
:::info 考点
* String 是 final 类不能被继承且为字符串常量，而 StringBuilder 和 StringBuffer 均为字符串变量。
* StringBuilder 是一个非线程安全的类，而 StringBuffer 是线程安全的。
* StringBuilder 是没有对方法加锁同步的，所以毫无疑问，StringBuilder的性能要远大于StringBuffer。多数情况下建议使用 StringBuilder类。但是在应用程序要求线程安全的情况下，则必须使用 StringBuffer 类。
* String 一般用在少量字符串操作；StringBuffer 用于多线程环境下的大量操作；StringBuilder 用于单线程环境下的大量操作。
:::
:::tip 拓展
* String 之所以创建好之后就不能修改的原因是：String 底层是由 char 数组构成，并且由 final 修饰，也就是说，一但 String 被创建，就没有办法去修改它的属性了。
:::

## 14. String str="i" 和 String str = new String("1") 两种声明方式有什么区别？2️⃣🍎
:::info 考点
* String str = "i";
> 该方式初始化字符串的时候，Java 虚拟机会将值分配至`常量池`中。
* String str = new String("1");
> 使用该方式初始化字符串的时候，Java 虚拟机会将值分配至`堆内存`中。
:::

:::tip 拓展
- **栈**、**堆**、**常量池**
:::code-group

```txt [栈]
存放基本类型的数据和对象的引用，但对象本身不存放在栈中，而是存放在堆中。
```

```txt [堆]
存放用new产生的数据。
```

```txt [常量池]
存放常量。
```
:::

## 15. String str = new String("1"); 在这段代码中，一共创建了多少个对象？3️⃣🍏
:::info 考点
答案：1或者2个。

解释：new String() 会先去常量池中判断有没有此字符串，如果有则只在堆上创建一个字符串并且指向常量池中的字符串；如果常量池中没有此字符串，则会创建 2 个对象，先在常量池中新建此字符串，然后把此引用返回给堆上的对象。
:::

## 16. final、finally 和 finalize 是什么？1️⃣
:::info 考点
* final
> final 表示终态。一般用于变量、参数、方法、类的修饰。

> 被 final 修饰的变量、参数都表示`不可变`。基本数据类型被 final 修饰后，变为常量，切不可变。引用数据类型被 final 修饰后，引用地址不可变，但是地址所指向的内容是可变的。

> 被 final 修饰的方法是不可被重写的。

> 被 final 修饰的类是终态的，无法被继承。

* finally
> 一般和 try catch 中串联使用。(我们可以使用 try-finally 或者 try-catch-finally 来进行类似关闭 JDBC 连接、保证 unlock 锁等动作)

* finalize
> 它为 java.lang.Object 类中的一个方法，它的设计目的是保证对象在被垃圾收集前完成特定资源的回收。
:::

## 17. IO 流分为几种？1️⃣
:::info 考点
* 按照流方向分为：输入流、输出流；
* 按照流操作的数据单位分为：字节流、字符流；
:::