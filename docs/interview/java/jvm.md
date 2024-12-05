# Java-JVM（9）

## 1. 请简单说说 JVM。2️⃣🫑
:::info 考点
JVM (全称 Java Virtual Machine)，即 Java 虚拟机。Java 虚拟机是 Java 实现跨平台的核心。

当我们点击运行程序的时候，编译器会将我们的 `.java` 源码文件编译成字节码文件（`.class`），接下来，JVM 会对字节码进行解释，将他们翻译成对应平台的机器指令，并运行。

除去 Java，Groovy、Kotlin、Scala 等语言也可以在 JVM 中运行。
:::

## 2. 请说一下 JVM 的工作原理。3️⃣
:::info 考点
1. **类加载器**：负责将Java类加载到JVM中，包括加载Java核心类库和用户自定义类‌。
2. **字节码执行引擎**：将Java字节码转换为可执行的机器码，通常有两种方式：解释执行和即时编译‌。
3. **即时编译器**：将频繁执行的字节码转换为本地机器码，以提高程序的执行效率‌。
4. **垃圾回收器**：自动回收不再使用的对象内存，以避免内存泄露和程序崩溃‌。
5. **安全管理器**：控制Java程序的访问权限，通过安全策略文件来规定程序可访问的资源和操作‌。
:::

## 3. 请阐述一下类的生命周期。🔟🥜
### **装载阶段（Loading）**

将 Java 类的字节码文件加载到机器内存中，并在内存中构建出 Java 类的原型——类模板对象。

:::tip 类模板对象
所谓类模板对象，其实就是 Java 类在 JVM 内存中的一个快照，JVM 将从字节码文件中解析出的常量池、类字段、类方法等信息存储到类模板中，这样 JVM 在运行期便能通过类模板而获取 Java 类中的任意信息，能够对 Java 类的成员变量进行遍历，也能进行 Java 方法的调用。
:::

作用：使得 Java 能够更加灵活地处理不同类型的对象，提高了代码的可重用性和可扩展性。

Class 类的构造方法是私有的，只有 JVM 能创建。

:::tip Class 实例的位置
在 Java 中，.class 文件加载到原空间(方法区)之后，会在堆内存中创建 java.lang.Class 对象，来封装类位于方法区的数据结构，而对象的引用则存储在栈（stack）内存中。栈内存用于保存局部变量和方法调用的上下文信息。对象的引用指向堆内存中实际存储对象数据的位置。
:::

### **链接阶段（Linking）**

- 验证(Verification)

当类加载到系统中，就开始链接操作，验证阶段就是为了验证加载的字节码是否符合规范。

- 准备(Preparation)

为静态变量分配并设置变量初始值。

当然，只有显式赋值或在静态代码块中赋值的变量才会生成 `clinit` 方法并执行，没有的话是不执行的。而且优先会执行父类的 `clinit`，然后才会执行子类的 `clinit`。

```java
public static int number = 1;
```
在准备阶段，number 的值为 0，而不是 1。赋值为 1 的操作需要等到初始化阶段才被执行。

- 解析(Resolution)

解析阶段是虚拟机将常量池内的符号引用替换为直接引用的过程，解析动作主要针对类或接口、字段、类方法、接口方法、方法类型、方法句柄和调用点限定符7类符号引用进行。

### **初始化阶段(Initialization)**

初始化阶段是 JVM 类加载过程中的最后一个阶段，也是类加载过程中最重要的一环。

首先，初始化阶段会执行类构造器 `clinit` 方法，该方法是编译器自动生成的，用于对类的静态变量进行初始化。这个方法会按照静态变量的声明顺序执行，并且在多线程环境下保证线程安全。

其次，初始化阶段会执行静态初始化块中的代码，静态初始化块是在类加载时执行的一段代码，它可以用于对静态变量进行复杂的初始化操作，或者执行一些其他需要在类加载时完成的任务。

需要注意的是，初始化阶段是按照初始化顺序依次执行的，并且只会执行一次。如果一个类已经被初始化过了，那么在后续的加载过程中不会再次执行初始化阶段，即使有多个类加载器加载了相同的类也是如此。

初始化阶段的目的是确保类的静态变量被正确初始化，并且执行一些必要的初始化操作，以使类可以正常使用。在程序运行过程中，如果需要访问某个类的静态变量或者静态方法，那么这个类必须经过初始化阶段，否则会抛出 `java.lang.ExceptionInInitializerError` 异常。

到了这一阶段，类加载过程才真正完成，我们可以安心地使用这个类了。

:::warning 注意
只有当对类的主动使用的时候才会导致类的初始化。

主动使用有如下几种方式
- new 对象时
- 读取静态变量或给静态变量重新赋值
- 调用静态函数
- 反射调用
- 子类初始化
- 虚拟机启动的时候，要初始化主类。

只有上述几种情况会触发初始化，也称为对一个类进行`主动引用`。

除此以外，有其他方式都不会触发初始化，称为`被动引用`。

eg：
- 子类引用父类的静态变量，不会导致子类初始化。
- 通过数组定义引用类，不会触发此类的初始化。
- 引用常量时，不会触发该类的初始化。

用 final 修饰某个类变量时，它的值在编译时就已经确定好放入常量池了，所以在访问该类变量时，等于直接从常量池中获取，并没有初始化该类。
:::

### **使用(Using)**

程序代码执行时使用，new出对象程序中使用。

### **类的卸载(Unloading)**

程序代码退出、异常、结束等，执行垃圾回收。

## 4. JVM 有那些核心组成？8️⃣🧅
:::info 考点
- **类加载器**

负责从文件系统、网络或其他来源加载 Class 文件，将 Class 文件中的二进制数据读入到内存当中。

- **运行时数据区**

JVM 在执行 Java 程序时，需要在内存中分配空间来处理各种数据，这些内存区域主要包括方法区、堆、栈、程序计数器和本地方法栈。

- **执行引擎**

执行引擎是 JVM 的心脏，负责执行字节码。它包括一个虚拟处理器，还包括即时编译器（JIT Compiler）和垃圾回收器（Garbage Collector）。
:::

## 5. 类加载器有那些？执行顺序是什么？9️⃣🧄
:::info 考点

Java 中有四种类加载器，他们的执行顺序是：启动类加载器 -> 扩展类加载器 -> 系统类加载器 -> 自定义类加载器，详情如下：
* 启动类加载器（Bootstrap ClassLoader）

主要负责加载存放在 `JAVA_HOME/jre/lib` 下，或被 -Xbootclasspath 参数指定的路径下的，并且能被虚拟机识别的类库（如 rt.jar，所有的 java.* 开头的类均被 Bootstrap ClassLoader 加载），启动类加载器是无法被 Java 程序直接引用的。
* 扩展类加载器（Extension ClassLoader）

主要负责加载器由 sun.misc.Launcher$ExtClassLoader 实现，它负责加载 `JAVA_HOME/jre/lib/ext` 目录中，或者由 java.ext.dirs 系统变量指定的路径中的所有类库（如 javax.* 开头的类），开发者可以直接使用扩展类加载器。
* 系统类加载器（System ClassLoader）

主要负责加载器由 sun.misc.Launcher$AppClassLoader 来实现，它负责加载用户类路径（ClassPath）所指定的类，开发者可以直接使用该类加载器，如果应用程序中没有自定义过自己的类加载器，一般情况下这个就是程序中默认的类加载器。
* 自定义类加载器（Custom ClassLoader）

用户自定义的加载器。
:::

## 6. 什么是双亲委派模型？🔟🥦
:::info 考点
双亲委派机制指的是：当一个类加载器接收到加载类的任务时，会自底向上查找是否加载过，如果没有加载过，再由顶向下进行加载。

每个 Java 实现的类加载器中保存了一个成员变量叫 `Parent` 类加载器。但是 `Parent` 加载器是和当前加载器是上下级关系，并不是继承关系。

在类加载的过程中，每个类加载器都会先检查是否已经加载了该类，如果已经加载则直接返回，否则会将加载请求委派给父类加载器。

之所以叫 `双亲委派模型` 其实就是翻译上的问题，Parent = 双亲。
:::

:::tip 拓展
扩展类加载器（Extension Class Loader）负责加载位于 `JAVA_HOME/jre/lib/ext` 目录下的 jar 文件，这些文件通常是 Java 平台的扩展库。由于这些扩展库通常包含的是 Java 平台的基础功能，为了保证这些基础功能的稳定性和安全性，扩展类加载器被设计为没有父类。

启动类加载器（Bootstrap ClassLoader）是由 C++ 实现的，它是 jvm 中第一个被加载的类加载器。由于它是用 C++ 编写的，而不是 Java 语言，因此它没有父类。

此外，启动类加载器的设计使得它能够独立于 Java 类的继承结构，从而确保了JVM的核心功能的安全性和稳定性。由于它是最底层的类加载器，其他类加载器（如扩展类加载器和系统类加载器）都是通过委托机制来请求启动类加载器加载特定的类‌。
:::

## 7. 如果一个类重复出现在三个类加载器的加载位置，应该由谁来加载？3️⃣
:::info 考点
启动类加载器加载，根据双亲委派机制，它的优先级是最高的。
:::

:::tip 拓展
如果三个类加载器都都无法成功加载类会怎么样？

直接报异常：`ClassNotFountException`。
:::

## 8. 如何判断一个对象是否可被回收？8️⃣🥬
:::info 考点
### **引用计数算法**：
给对象添加一个引用计数器，当对象增加一个引用时计数器加 1，引用失效时计数器减 1。

引用计数为 0 的对象可被回收。

两个对象出现循环引用的情况下，此时引用计数器永远不为 0，导致无法对它们进行回收。正因为循环引用的存在，因此 Java 虚拟机不使用引用计数算法。

### **可达性分析算法**：
通过 GC Roots 作为起始点进行搜索，能够到达到的对象都是存活的，不可达的对象可被回收。

Java 中 GC Roots 一般包含以下内容:

1. 虚拟机栈中引用的对象
2. 本地方法栈中引用的对象
3. 方法区中类静态属性引用的对象
4. 方法区中的常量引用的对象

### **方法区的回收**：
因为方法区主要存放永久代对象，而永久代对象的回收率比新生代低很多，因此在方法区上进行回收性价比不高。

主要是对常量池的回收和对类的卸载。
### **finalize**：
`finalize()` 类似 C++ 的析构函数，用来做关闭外部资源等工作，但是该方法运行代价高昂，不确定性大，无法保证各个对象的调用顺序，因此最好不要使用。

我们可以使用 `try-finally` 等方式进行关闭外部资源，例如 IO 等。

当一个对象可被回收时，如果需要执行该对象的 `finalize()` 方法，那么就有可能通过在该方法中让对象重新被引用，从而实现自救。自救只能进行一次，如果回收的对象之前调用了 `finalize()` 方法自救，后面回收时不会调用 `finalize()` 方法。

:::

## 9. Java 中常见的垃圾回收算法有哪些？8️⃣🥒
:::info 考点
- **标记 清除**：

未回收内存分布图（红色：存活对象；绿色：可回收对象；白色：未使用）
<table>
    <tr>
        <td style="background: RED;"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
        <td style="background: GREEN"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
    </tr>
</table>

标记清除法会把存活对象进行标记，然后将可回收对象进行回收，回收之后内存分布图如下。

<table>
    <tr>
        <td style="background: RED;"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: WHITE"></td>
    </tr>
</table>

缺点：

1. 标记和清除过程效率都不高；
2. 会产生大量不连续的内存碎片，导致无法给大对象分配内存。

- **标记 整理**：

未回收内存分布图（红色：存活对象；绿色：可回收对象；白色：未使用）
<table>
    <tr>
        <td style="background: RED;"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
        <td style="background: GREEN"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
    </tr>
</table>

标记整理法会将存活对象向一边移动，并且回收可回收对象，回收之后内存分布图如下。

<table>
    <tr>
        <td style="background: RED;"></td>
        <td style="background: RED"></td>
        <td style="background: RED"></td>
        <td style="background: RED"></td>
        <td style="background: RED"></td>
        <td style="background: RED"></td>
    </tr>
    <tr>
        <td style="background: RED"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
</table>

- **复制**：

未回收内存分布图（红色：存活对象；绿色：可回收对象；白色：未使用；蓝色：保留区）
<table>
    <tr>
        <td style="background: RED;"></td>
        <td style="background: GREEN"></td>
        <td style="background: GREEN"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
    </tr>
    <tr>
        <td style="background: GREEN"></td>
        <td style="background: RED"></td>
        <td style="background: GREEN"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
    </tr>
</table>

首先，使用复制这种垃圾回收算法前，会将内存分为两部分（具体什么比例，可以自己定，也可以按照虚拟机默认来），每次使用只使用一部分。

好比说 A 部分内存用完了，就会将 A 的存活对象复制到 B，然后再把 A 的所有对象都清除，清楚后的内存分布图如下：

<table>
    <tr>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: RED;"></td>
        <td style="background: RED"></td>
        <td style="background: RED"></td>
    </tr>
    <tr>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: RED"></td>
        <td style="background: RED"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
    <tr>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: BLUE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
        <td style="background: WHITE"></td>
    </tr>
</table>

缺点：

1. 我们总会存在有一块内存没有办法直接使用。
2. 会产生大量不连续的内存碎片，导致无法给大对象分配内存。

- **分代收集**：
现在的商业虚拟机采用分代收集算法，它根据对象存活周期将内存划分为几块，不同块采用适当的收集算法。

一般将堆分为新生代和老年代。

新生代使用: 复制算法。

老年代使用: “标记 清除” 或者 “标记 整理” 算法
:::

:::tip 拓展
现在的商业虚拟机都采用 `复制` 这种收集算法来回收新生代，但是并不是将新生代划分为大小相等的两块，而是分为一块较大的 `Eden` 空间和两块较小的 `Survivor` 空间，每次使用 `Eden` 空间和其中一块 `Survivor`。在回收时，将 `Eden` 和 `Survivor` 中还存活着的对象一次性复制到另一块 `Survivor` 空间上，最后清理 `Eden` 和使用过的那一块 `Survivor`。

HotSpot 虚拟机的 `Eden` 和 `Survivor` 的大小比例默认为 8:1，保证了内存的利用率达到 90%。如果每次回收有多于 10% 的对象存活，那么一块 `Survivor` 空间就不够用了，此时需要依赖于老年代进行分配担保，也就是借用老年代的空间存储放不下的对象。
:::