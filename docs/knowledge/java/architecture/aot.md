# AOT

## 前言

语言开发一直离不开一个话题：性能。

一直以来，如何提高程序的性能都是一个难点。

随着技术的不断发展，Java 给我们带来了一个新的解决方案：AOT。

## JIT & AOT

在 AOT 之前，Java 都是在使用另外一种编译技术：JIT（Just-in-Time：实时编译）。

在我们使用的 Java 虚拟机中（HotSpot），集成了两种 JIT 编译器：Client Compiler 和 Server Compiler。

:::tip 拓展
* Client Compiler

Client Compiler 注重启动速度和局部的优化。

工作原理：

1. 局部简单优化（eg：字节码优化）。
2. 将字节码构造成 HIR（High-level Intermediate Representation：高级中间表示）。
3. 最后将 HIR 转换成 LIR（Low-level Intermediate Representation：低级中间表示），最终生成机器码。

* Server Compiler

Server Compiler 则更加关注全局的优化，性能会更好，但由于会进行更多的全局分析，所以启动速度会变慢。

在 Hotspot 虚拟机中使用的 Server Compiler 有两种：C2 和 Graal，默认为 C2。

C2 编译器在进行编译优化时，会使用一种控制流与数据流结合的图数据结构，称为 Ideal Graph。 Ideal Graph 表示当前程序的数据流向和指令间的依赖关系，依靠这种图结构，某些优化步骤（尤其是涉及浮动代码块的那些优化步骤）变得不那么复杂。

但无论是否进行全局优化，Ideal Graph 都会被转化为一种更接近机器层面的 MachNode Graph，最后编译的机器码就是从 MachNode Graph 中得的，生成机器码前还会有一些包括寄存器分配、窥孔优化等操作。

Graal Compiler 是从 JDK 9 之后，在 Hotspot 虚拟机中集成的编译器。
相比较 C2，Graal 会在 JVM 解析执行的时候手机程序运行的各种信息，然后编译器根据这些信息进行一些基于预测的激进优化，比如分支预测，根据程序不同分支的运行概率，选择性地编译一些概率较大的分支。
Graal 编译器可以通过 Java 虚拟机参数 -XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler 启用。当启用时，它将替换掉 HotSpot 中的 C2 编译器，并响应原本由 C2 负责的编译请求。
:::

但是近年来随着 Serverless、云原生等概念和技术的火爆，Java JVM 和 JIT 的性能问题越来越多地被诟病，在 Golang、Rust、node.js 等新一代语言的包夹下，业界也不断出现“云原生时代，Java 已死”的言论。所以 Java 需要破局，而破局的手段之一就是：AOT。

## 认识 AOT

AOT（Ahead-Of-Time）是一种编译技术，它可以在程序运行之前将源代码或字节码编译成机器代码，从而提高程序的启动速度和整体性能。

在 Java 中，AOT 机制能够有效地优化 Java 应用的启动时间，尤其是在需要快速响应的场景中，如微服务、容器化应用等。

## Write once run anywhere

学 Java 的时候我们就知道了 Java 的一个承诺：Write once run anywhere。

但是，随着 AOT 的到来，破坏了这个承诺。

提前编译让我们规避了“第一次运行慢”的不好体验，但是这个提前编译缺破坏了这个承诺，因为它的存在，开发商需要为每一个不同的硬件、操作系统去编译对应的发型包，而这也会降低 Java 的动态性，必须要求加载的代码在编译期就是全部已知的，而不能在运行期才确定，否则就只能舍弃掉己经提前编译好的版本，退回到原来的即时编译执行状态。

就一句话概括：同一份产物不能跨平台运行。

## AOT 发展史

本身 Java 发展的好好的，对于企业和个人而言更是一种完美语言，程序员可以在本地开发完成后，打包部署到任何地方，但是随着 Docker 和 Serverless 的到来，慢慢风向开始发生转变。

Docker 容器化部署本身就突破了跨平台，也就是说 Java 的跨平台已经属于累赘了。

而 Serverless 的爆火，更是给了 Java 一棒子。

如果想让 Java 跟上云原生的脚步，貌似需要更多的努力，而 AOT 就是非常重要的一步了。

2016 年，OpenJDK 的 JEP 295 提案首次在 Java 中引入了 AOT 支持，在这一草案中，JDK 团队提供了 jaotc 工具，使用此工具可以将指定 class 文件中的方法逐个编译到 native 代码片段，通过 Java 虚拟机在加载某个类后替换方法的的入口到 AOT 代码来实现启动加速的效果。

jaotc 类似于给 JVM 打了一个“补丁”，让用户有权利将部分代码编译成机器码的时期提前，并预装载到 JVM 中，供运行时代码调用。不过这个补丁存在很多问题：

首先是在设计上没有考虑到 Java 的多 Classloader 场景，当多个 Classloader 加载的同名类都使用了 AOT 后，他们的 static field 是共享的，而根据 java 语言的设计，这部分数据应该是隔开的。由于这个问题无法快速修复，jaotc 最终给出的方案只是暴力地禁止用户自定义 classloader 使用 AOT。
此外，由于社区人手不足，缺乏调优和维护，jaotc 的实际运行效果不尽人意，有时甚至会对应用的启动和运行速度带来反向优化，实装没多久之后就退化为实验特性，最终在 JDK 16 中被删除，结束了短暂的一生。

后来阿里 AJDK 团队自研的 AppCDS（Class-Data-Share）技术继承了 jatoc 的思路，进行了大幅的优化和完善，目前也不失为一种 Java AoT 的选择，其本质思路和 jaotc 基本一致，这里就不再赘述了。

而目前业界除了这种在 JVM 中进行 AOT 的方案，还有另外一种实现 Java AOT 的思路，那就是直接摒弃 JVM，和 C/C++ 一样通过编译器直接将代码编译成机器代码，然后运行。这无疑是一种直接颠覆 Java 语言设计的思路，不过还是被各路大佬们实现了，那就是 GraalVM Native Image。

它通过 C 语言实现了一个超微缩的运行时组件 —— Substrate VM，基本实现了 JVM 的各种特性，但足够轻量、可以被轻松内嵌，这就让 Java 语言和工程摆脱 JVM 的限制，能够真正意义上实现和 C/C++ 一样的 AOT 编译。这一方案在经过长时间的优化和积累后，已经拥有非常不错的效果，基本上成为 Oracle 官方首推的 Java AOT 解决方案。

## GraalVM

GraalVM 是一种高性能的 JDK（完整的 JDK 发行版本），它可以运行 Java 和其他 JVM 语言，以及 JavaScript、Python 等非 JVM 语言。 GraalVM 不仅能提供 AOT 编译，还能提供 JIT 编译。
:::tip 拓展
[GraalVM 官网](https://www.graalvm.org/){_target="blank"}

以 2024-11-29 日这天为准，我们可以在官网下载两种版本的 GraalVM，Java 21 和 Java 23，如果有需要其他版本的，可以到 Oracle 官网进行下载。

[Oracle 官网下载 GraalVM](https://www.oracle.com/java/technologies/downloads/#graalvmjava17){_target="blank"}
:::
GraalVM 本身是一个非常庞大的项目，并且从它可以支持的语言不难发现，这货想要统一编程，有兴趣的朋友可以好好研究一下 GraalVM。

我们接下来要学习的就是他里面的一个核心组件：Native Image。

### Native Image

生成一个 Native Image 是需要应用代码、各种依赖库、JDK、以及 Substrate VM。

有了这些东西，就可以对整个应用代码进行静态分析了，这个分析过程类似 GC 的“可达性分析”，分析过程中会将可达的代码、变量、对象等生成快照，最终打包变成一个可执行的 Native Image。

一个完整的 Native Image 包含两个部分，一部分称为 Text Section，即用户代码编译成的机器代码；另一部分称为 Data Section，存储了应用启动后堆区内存中各种对象的快照。

在整个静态分析的过程中，会以 Pionts-to Analysis -> Run Initializations -> Heap Snapshotting 的方式迭代进行，一直到不可达程度。

通过这种方式，最后可以得到两个树对象，一个 Call Tree（包含所有可达的方法），另一个 Object Tree（包含所有可达的对象）。Call Tree 中所包含的方法会被AOT编译为机器码，成为 Native Image 的Text Section，而 Object Tree 中所包含的对象及变量则会被保存下来，写入 Native Image 的 Data Setion。

:::tip 拓展
Native Image 中是如何处理 JVM 的动态特性？

针对于 JVM 的动态特性，例如反射、代理、JNI 等，Native Image 设置了一个名为 Closed World Assumption 去作为静态分析的基本前提。

* Pionts-to Analysis 需要查看所有字节码
如果查看不到所有字节码，无法进行 AOT 优化，不能删除未使用的类、方法、字段，并且需要在运行时有类加载器。

* Java 的动态部分需要在构建时进行配置
例如反射、JNI、代理等这些需要在配置文件中声明。

* 在整个程序运行过程中不会动态加载任何新的 class。
:::

## 实践
这里实践到时候放在项目中吧，本次博客就不多说了，因为需要弄 GraalVM 的环境。