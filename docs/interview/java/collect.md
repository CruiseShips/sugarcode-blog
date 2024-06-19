# Java-集合（6）

## 1. List、Set、Map 之间的区别？3️⃣🍎
::: info 考点
* List
    1. 数据有序存储
    2. 可添加重复元素
    3. 常用实现类：ArrayList、LinkedList、Vector 等

* Set
    1. 数据无序存储
    2. 不可添加重复元素（可存储一个 null 元素）
    3. 常用实现类：HashSet、LinkedHashSet、TreeSet 等

* Map
    1. 键值对集合，数据以 Key-Value 的格式进行存储
    2. Key 为无序，且唯一；Value 可重复
    3. 常用实现类：HashMap、TreeMap、Hashtable、ConcurrentHashMap 等
:::

## 2. ArrayList、LinkedList 和 Vector 的区别？3️⃣🍐
:::info 考点
| | ArrayList | LinkedList | Vector |
|-|-|-|-|
| 数据结构 | 动态数组 | 双向链表 | 动态数组 |
| 集合特点 | 查询快，增删慢 | 增删快，查询慢 | 查询快，增删慢 |
| 线程安全 | 线程不安全 | 线程不安全 | 线程安全 |
| 扩容策略 | 1.5 | 不扩容 | 2 |
:::

:::tip 拓展
**使用场景**

* ArrayList

适用于频繁访问元素，但插入和删除操作较少的场景。例如，在需要快速查找元素的数据结构中，如哈希表，可以使用 ArrayList 作为值的存储结构。

* Vector

虽然在现代Java开发中，Vector 的使用较少，但在某些需要线程安全的场景下，如多线程环境下的数据结构，Vector 仍然是一个可选的选择。

* LinkedList

适用于频繁进行插入和删除操作的场景。例如，在实现栈、队列等数据结构时，LinkedList 是一个很好的选择。此外，对于需要动态调整数据结构大小的情况，LinkedList 也是一个不错的选择。
:::

## 3. Collection 和 Collections 区别？2️⃣🍏
:::info 考点
- **Collection**：集合类的一个顶级接口，它提供了对集合对象进行基本操作的通用接口方法（add、remove 等）。
- **Collections**: 集合类的一个工具类 / 帮助类，其中提供了一系列静态方法，用于对集合中元素进行排序、搜索、线程安全等各种操作。
:::

## 4. HashMap 的实现原理？4️⃣🍑
:::info 考点
- **JDK1.7及以前**：数组 + 链表。无冲突时，存放数组；冲突时，存放链表；采用头插法。

- **JDK1.8及以后**：数组 + 链表 + 红黑树。无冲突时，存放数组；有冲突存放链表或者红黑树。当链表长度大于阈值（默认为8）并且数组长度大于64时，将链表转化为红黑树；树元素小于等于6时，树结构还原成链表形式。
:::
:::tip 扩展 - HashMap 的实现原理

* 数组特点
> 寻址容易，插入和删除困难。
* 链表特点
> 寻址困难，插入和删除容易。

根据这两种数据结构的特性，去设计出一种寻址容易、插入、删除也容易的数据结构哈希表。

数组存储的元素是一个 Entry 类，这个类有三个数据域，key、value（键值对），next(指向下一个 Entry)。当两个 key 经过计算得到的 index（索引）相同时，即产生哈希冲突时，用链地址法来解决哈希冲突，即通过 next 属性将索引值相同的链接在一起。随着 map 的容量或者链表长度越来越大，在进行进一步的优化，比如使用红黑树。
:::
:::tip 扩展 - HashMap 的数据存储&获取
* put()：
  1. 首先将 k, v 封装成 Node 节点。
  2. 调用 hashCode() 方法得出 hash 值并将 hash 值转换成数组的下标，下标位置上如果没有任何元素（没有碰撞），就把 Node 节点添加到这个位置上。如果说下标对应的位置上有值（ hash 碰撞）。碰撞的元素与要插入的元素 key 值相等，直接进行 value 的更新；如果 key 值不相同，于是增长链表或者树节点的增加。插入之后判断是否进行扩容。

* get()：
  1. 先调用 k 的 hashCode() 方法得出哈希值，并转换成数组的下标。
  2. 通过数组下标快速定位到某个位置上。如果该位置上什么都没有，则返回 null。如果这个位置上有数据，那么它就会拿着参数 k 和单向链表上(红黑树)的每一个节点的 k 进行 equals，如果所有 equals 方法都返回 false，则 get 方法返回 null。如果其中一个节点的 k 和参数 k 进行 equals 返回 true，那么返回该节点的 value。
:::

## 5. HashMap 和 Hashtable 有什么区别？3️⃣🍒
:::info 考点
1. 线程安全 ： HashMap 是非线程安全的， HashTable 是线程安全的； HashTable 内部的方法基本
都经过 synchronized 修饰。（如果你要保证线程安全的话就使用 ConcurrentHashMap ）；
2. 效率 ： 因为线程安全的问题， HashMap 要比 HashTable 效率高一点。另外， HashTable 基本被
淘汰，不要在代码中使用它；（如果你要保证线程安全的话就使用 ConcurrentHashMap ）；
3. 对 Null key 和 Null value 的支持 ： HashMap 中， null 可以作为键，这样的键只有一个，可以有
一个或多个键所对应的值为 null 。但是在 HashTable 中 put 进的键值只要有一个 null ，直接抛
NullPointerException 。
4. 初始容量大小和每次扩充容量大小的不同 ：
5. 创建时如果不指定容量初始值， Hashtable 默认的初始大小为 11 ，之后每次扩充，容量变为原来
的 2n+1 。 HashMap 默认的初始化大小为 16 。之后每次扩充，容量变为原来的 2 倍。
6. 创建时如果给定了容量初始值，那么 Hashtable 会直接使用你给定的大小，而 HashMap 会将其
扩充为 2 的幂次方大小。也就是说 HashMap 总是使用 2 的幂作为哈希表的大小，后面会介绍到为
什么是 2 的幂次方。
7. 底层数据结构 ： JDK1.8 以后的 HashMap 在解决哈希冲突时有了较大的变化，当链表长度大于阈 值（默认为8 ）时，将链表转化为红黑树，以减少搜索时间。 Hashtable 没有这样的机制。
8. 推荐使用：在 Hashtable 的类注释可以看到， Hashtable 是保留类不建议使用，推荐在单线程环
境下使用 HashMap 替代，如果需要多线程使用则用 ConcurrentHashMap 替代。
:::


## 6. ConcurrentHashMap 和 HashMap 有什么区别？4️⃣🍓
:::info 考点
HashMap 是 Java Collection Framework 的重要成员，也是Map族(如下图所示)中我们最为常用的一种。

不过遗憾的是，HashMap 不是线程安全的。

也就是说，在多线程环境下，操作 HashMap 会导致各种各样的线程安全问题，比如在 HashMap 扩容重哈希时出现的死循环问题，脏读问题等。HashMap 的这一缺点往往会造成诸多不便，虽然在并发场景下HashTable 和由同步包装器包装的 HashMap(Collections.synchronizedMap(Map<K,V> m) )可以代替 HashMap，但是它们都是通过使用一个全局的锁来同步不同线程间的并发访问，因此会带来不可忽视的性能问题。

庆幸的是，Java 为我们解决了这个问题，它为 HashMap 提供了一个线程安全的高效版本 ConcurrentHashMap。在 ConcurrentHashMap 中，无论是读操作还是写操作都能保证很高的性能：在进行读操作时(几乎)不需要加锁，而在写操作时通过锁分段技术只对所操作的段加锁而不影响客户端对其它段的访问。特别地，在理想状态下，ConcurrentHashMap 可以支持 16 个线程执行并发写操作（如果并发级别设为16），及任意数量线程的读操作。
:::
