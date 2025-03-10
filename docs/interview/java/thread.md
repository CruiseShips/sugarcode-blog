# Java-设计模式（16）

## 1. 什么是进程？什么是线程？他们之间有什么关系吗？2️⃣🍑
::: info 考点
- **进程**：计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础。
- **线程**：程序执行流的最小单元，是处理器调度和分派的基本单位。
:::

::: tip 拓展
打开你的电脑 - 任务管理器，第一项就是进程。

一个进程下可以有多个线程，一个线程只能属于一个进程。
:::

## 2. Java 如何创建线程，常用的方式有那些？3️⃣🍒
:::info 考点
常用创建线程一般有三种种方式，具体如下：
* 继承 Thread 类
``` Java
// 关键代码
class MyThread extends Thread {
	@Override
    public void run(){
        System.out.println("继承 Thread 类创建线程。");
    }
}

public class Test {
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.start();
    }
}
```

* 实现 Runnable 接口
``` Java
// 关键代码
class MyThread implements Runnable {
	@Override
    public void run(){
        System.out.println("实现 Runnable 接口创建线程。");
    }
}

public class Test_01 {
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.start();
    }
}

public class Test_02 {
    public static void main(String[] args) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("匿名内部类实现 Runnable 接口");
            }
        }).start();
    }
}

public class Test_03 {
    public static void main(String[] args) {
        new Thread(() -> {
            System.out.println("Lambda表达式");
        }).start();
    }
}
```

* 实现 Callable 接口
``` Java
// 关键代码
class MyCallable implements Callable<String> {
	@Override
    public String call(){
        return "实现 Callable 接口";
    }
}

public class Test {
    public static void main(String[] args) {
        MyCallable myCallable = new MyCallable();
        FutureTask<String> futureTask = new FutureTask<>(myCallable);

        Thread thread = new Thread(futureTask);

        // 启动新线程
        thread.start();

        try {
            // 阻塞性地获得并发线程的执行结果
            String result = futureTask.get();
            System.out.println("线程返回内容：" + result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
:::

## 3. Java 中线程有几种状态，分别是什么？请详述。7️⃣🍓
::: info 考点
![Java线程状态](/images/service/interview/java/Thread_Status.jpeg)

- **New**：在这个状态下，线程对象已经被创建，但是还没有调用 `start()` 方法启动线程。此时，线程对象只是一个普通的Java对象，还没有被分配操作系统资源。
- **Runnable**：当调用了线程对象的 `start()` 方法后，线程就进入了就绪状态。在这个状态下，线程已经被加入到线程调度器的就绪队列中，等待被分配 CPU 时间片来执行任务。
- **Running**：当线程获得了 CPU 时间片，开始执行任务时，它处于运行状态。在这个状态下，线程正在执行自己的任务代码。
- **Blocked**：线程进入阻塞状态通常是因为某些原因导致了线程无法继续执行。常见的阻塞原因包括等待I/O操作完成、等待获取锁、等待条件满足等。当阻塞的原因消失后，线程会重新进入就绪状态等待执行。
- **Waiting**：线程进入等待状态是因为它在某个对象上等待。例如，线程调用了 `Object.wait()` 方法或者 `Thread.join()` 方法时会进入等待状态。在等待状态下，线程会释放掉它所持有的锁，直到其他线程唤醒它。
- **Timed Waiting**：和等待状态类似，但是在这个状态下，线程在等待一段时间或者等待某个条件满足之前会超时返回。例如，调用 `Thread.sleep()` 方法或者 `Object.wait(timeout)` 方法时会使线程进入定时等待状态。
- **Terminated**：线程处于终止状态表示它已经执行完任务或者被提前中断。当线程的 `run()` 方法执行完毕或者调用了 `Thread.interrupt()` 方法中断线程时，线程会进入终止状态。
:::

## 4. Java 中线程 `wait()` 和 `sleep()` 有什么区别？8️⃣🫐
:::info 考点
- **方法所属不同**：`sleep()` 方法属于 Thread 类中的 static 方法。`wait()` 属于 Object 类的方法。
- **唤醒方式不同**：`sleep()` 可以在时间到了之后自动唤醒。`wait()` 需要手动唤醒。
- **资源占用不同**：调用 `sleep()` 后，现成不会释放资源，而 `wait()` 会直接释放。
:::

## 5. Java 中线程 `run()` 和 `start()` 有什么区别？8️⃣🥝
:::info 考点
- **run()**：`run()` 方法是线程的主体，包含了线程需要执行的代码。但直接调用 run() 方法并不会启动新线程，而是像调用普通方法一样在当前线程中同步执行 run() 方法体内的代码。
- **start()**：`start()` 方法用于启动线程，使线程从新建状态（NEW）进入就绪状态（RUNNABLE），等待 JVM 的调度执行。一旦线程被启动，它将执行其 run() 方法中的代码。
:::
::: tip 拓展
启动线程需要调用 `start()`，如果直接调用 `run()` 方法，就和调用普通方法无差。
:::

## 6. 如何停止一个线程？为什么 `stop()` 和 `suspend()` 不推荐使用？那应该用什么？8️⃣🍅
:::info 考点
Java 线程中，提供了几个方法用来停止线程：`stop()`、`suspend()`、`interrupt()`。

- **stop()**：调用 `stop()` 方法会立即停止线程，无论线程中的任务是否执行完毕，这会导致线程不安全，可能会在任务执行过程中释放锁资源，导致数据不一致的问题‌。
- **suspend()**：暂停当前线程，一般情况下会和 `resume()` 一同使用，不然很容易发生死锁。
- **interrupt()**：`interrupt()` 方法用于请求终止线程，不会立即停止线程，而是设置一个中断标志。线程内部通过检查中断标志来决定是否安全地停止执行，这样可以保证资源正确释放，避免数据不一致和死锁问题‌。
:::

## 7. 如何保证线程按照顺序执行？8️⃣🫒
:::info 考点
- **join()**：该方法为 Theard 的方法，作用是调用线程需等待该 join() 线程执行完成后，才能继续用下运行。
我们来看一段代码
```java
Thread thread1 = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("先炒好鸡蛋，盛出来。");
    }
});
Thread thread2 = new Thread(new Runnable() {
    @Override
    public void run() {
        try {
            thread1.join();
            System.out.println("炒西红柿，然后放刚刚的鸡蛋。");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});
Thread thread3 = new Thread(new Runnable() {
    @Override
    public void run() {
        try {
            thread2.join();
            System.out.println("好了，做好了。");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});
System.out.println("做炒鸡蛋。");
thread3.start();
thread2.start();
thread1.start();
```
测试结果：
> 做炒鸡蛋。
> 先炒好鸡蛋，盛出来。
> 炒西红柿，然后放刚刚的鸡蛋。
> 好了，做好了。

- **线程池 newSingleThreadExecutor**：可串行执行所有任务。
还是上面的代码，我们改造一下。
```java
ExecutorService executorService = Executors.newSingleThreadExecutor(); // [!code focus]
Thread thread1 = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("先炒好鸡蛋，盛出来。");
    }
});
Thread thread2 = new Thread(new Runnable() {
    @Override
    public void run() {
        try {
            thread1.join();
            System.out.println("炒西红柿，然后放刚刚的鸡蛋。");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});
Thread thread3 = new Thread(new Runnable() {
    @Override
    public void run() {
        try {
            thread2.join();
            System.out.println("好了，做好了。");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});
System.out.println("做炒鸡蛋。");
executorService.submit(thread1); // [!code focus]
executorService.submit(thread2); // [!code focus]
executorService.submit(thread3); // [!code focus]
executorService.shutdown(); // [!code focus]
```
:::

## 8. 请说一下创建线程池核心的几个参数？6️⃣🥥
:::info
```java
public ThreadPoolExecutor(
    int corePoolSize,
    int maximumPoolSize,
    long keepAliveTime,
    TimeUnit unit,
    BlockingQueue<Runnable> workQueue,
    ThreadFactory threadFactory,
    RejectedExecutionHandler handler
)
```
- **corePoolSize**：线程池中的核心线程数，当提交一个任务时，线程池创建一个新线程执行任务，直到当前线程数等于 corePoolSize, 即使有其他空闲线程能够执行新来的任务, 也会继续创建线程；如果当前线程数为 corePoolSize，继续提交的任务被保存到阻塞队列中，等待被执行；如果执行了线程池的 `prestartAllCoreThreads()` 方法，线程池会提前创建并启动所有核心线程。
- **maximumPoolSize**：线程池中允许的最大线程数。如果当前阻塞队列满了，且继续提交任务，则创建新的线程执行任务，前提是当前线程数小于 maximumPoolSize；当阻塞队列是无界队列, 则maximumPoolSize 则不起作用, 因为无法提交至核心线程池的线程会一直持续地放入 workQueue。
- **keepAliveTime**：线程空闲时的存活时间，即当线程没有任务执行时，该线程继续存活的时间；默认情况下，该参数只在线程数大于 corePoolSize 时才有用, 超过这个时间的空闲线程将被终止。
- **unit**：keepAliveTime的单位。
- **workQueue**：用来保存等待被执行的任务的阻塞队列。
- **threadFactory**：创建线程的工厂，通过自定义的线程工厂可以给每个新建的线程设置一个具有识别度的线程名。
- **handler**：线程池的饱和策略，当阻塞队列满了，且没有空闲的工作线程，如果继续提交任务，必须采取一种策略处理该任务，默认使用 AbortPolicy（直接抛出异常）。
:::
:::tip 拓展
**workQueue**：
* ArrayBlockingQueue: 基于数组结构的有界阻塞队列，按FIFO排序任务。
* LinkedBlockingQueue: 基于链表结构的阻塞队列，按FIFO排序任务，吞吐量通常要高于 ArrayBlockingQueue。
* SynchronousQueue: 一个不存储元素的阻塞队列，每个插入操作必须等到另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量通常要高于 LinkedBlockingQueue。
* PriorityBlockingQueue: 具有优先级的无界阻塞队列。

**handler**：
* AbortPolicy: 直接抛出异常。
* CallerRunsPolicy: 用调用者所在的线程来执行任务。
* DiscardOldestPolicy: 丢弃阻塞队列中靠最前的任务，并执行当前任务。
* DiscardPolicy: 直接丢弃任务；
:::

## 9. 什么是 Executor？2️⃣
:::info 考点
Executor 是 Java 并发编程中的一个接口，用于执行异步任务。它定义了一组方法来提交任务并执行它们，以及管理任务的执行状态和结果。

Executor 接口允许将任务提交给执行器，它将负责在后台线程中运行任务并返回结果（如果有）。执行器封装了线程池，可自动管理线程的创建、调度和销毁，从而提供了一种方便的方式来管理并发任务。

在 Executor 框架中，任务可以是实现了 Runnable 接口或 Callable 接口的对象。Executor 框架通过线程池（ThreadPool）来管理这些任务的执行，从而提高了资源利用率和系统性能。

Executor 框架主要由以下几个部分组成：

任务：包括 Runnable 接口和 Callable 接口的实现类。Runnable 接口表示无返回值的任务，而 Callable 接口表示有返回值的任务。

任务的执行：

1. Executor接口：是 Executor 框架的基础，它将任务的提交与任务的执行分离开来。

2. ExecutorService接口：继承自 Executor 接口，提供了更丰富的任务提交和执行方法，以及管理线程池的能力。ThreadPoolExecutor 和 ScheduledThreadPoolExecutor 是 ExecutorService 接口的两个关键实现类。

3. 异步计算的结果：Future 接口和实现了 Future 接口的 FutureTask 类，代表异步计算的结果。
:::

## 10. 请说一下线程池中 `submit()` 和 `execute()`？3️⃣
:::info 考点
- **execute()**：`execute()` 方法是 Executor 接口中定义的一个方法，用于提交一个任务用于执行。它是最基本的任务提交方式，适用于需要执行 Runnable 类型的任务。
- **submit()**：`submit()` 方法是 ExecutorService 接口中定义的一个方法，它是 `execute()` 的增强版本。`submit()` 不仅可以提交 Runnable 任务，还可以提交 Callable 任务，并且它会返回一个 Future对象，代表任务的执行结果或状态。
:::

## 11. Executors 可以创建那些线程池？3️⃣🥑
:::info 考点
- **newCachedThreadPool**：用于创建一个没有核心线程（corePoolSize 为 0）且最大线程数可以接近无限的线程池。这种线程池可以根据任务量的增加动态地创建新线程，并且可以在任务执行完毕后回收空闲的线程。
- **newFixedThreadPool()**：用于创建一个固定大小的线程池。当有新的任务提交时，如果线程池中的所有线程都在执行任务，则新的任务会被放入等待队列中，直到有线程可用为止。
- **newScheduledThreadPool**：用于创建支持定时和周期性任务执行的线程池。可执行定时任务、周期性任务、延迟执行任务。
- **newSingleThreadExecutor**：用于创建一个单线程的线程池。顾名思义，这个线程池中只有一个线程，所有提交到线程池的任务将按照提交的顺序依次执行。即使线程池中的唯一线程因某些原因意外终止，线程池也会创建一个新的线程来继续执行后续的任务，从而保证任务的顺序性和稳定性。
- **newSingleThreadScheduledExecutor**：调度线程池，它保证所有调度任务在单个线程中按顺序执行。
- **newWorkStealingPool**：Java 8 引入的一个新型线程池，该线程池使用 `工作窃取` 的算法，可用于可并行化且计算密集型的任务。
:::
:::tip 拓展
详细使用与用法见：[Executors](/docs/knowledge/java/class/executors.md){target="_blank"}
:::

## 12. Executors 生命周期？2️⃣
:::info 考点
Executors 是 Java 中处理并发任务的工具类，它提供了一系列工厂方法来创建不同类型的线程池。然而，正如所有资源一样，创建的线程池需要在不需要时进行适当的清理和释放，以避免资源泄露。

线程池的生命周期主要包括以下几个部分：

1. 创建（Create）：使用 Executors 中的工厂方法或 ThreadPoolExecutor 的构造函数来创建线程池。

2. 使用（Use）：在线程池中执行任务，使用 submit 方法或 execute 方法。

3. 关闭（Shutdown）：当不再需要线程池时，调用 shutdown 或 shutdownNow 方法来关闭线程池。
:::

## 13. synchronized 和 volatile 区别？5️⃣🍆
:::info 考点
synchronized 和 volatile 都是 Java 中用来实现多线程同步的机制，但它们在使用场景、内存开销和功能上有所不同。
* 变量特性 & 内存开销

> **synchronized**：利用锁来保证同步，使用时有较大的内存开销，因为它需要进行锁的申请、释放、等待等操作。它适用于需要在代码块或方法上进行同步控制的场景。

> **volatile**：利用内存屏障来保证可见性和禁止指令重排，没有锁的开销。它适用于只需要保证变量的可见性，而不需要保证多线程之间的原子性操作的场景。

* ‌线程安全 & 使用场景

> **synchronized**：可以保证多线程下数据的准确性，适用于需要在代码块或者方法上进行同步控制的场景。它可以保证变量的修改可见性和原子性。

> **volatile**：只能保证变量的修改可见性，不能保证原子性。它适用于多个线程对实例变量更改的场合，可以刷新主内存共享变量的值，从而使得各个线程可以获得最新的值‌。

* 编译器优化 & 指令重排

> **synchronized**‌：标记的变量可以被编译器优化。

> **volatile**：标记的变量不会被编译器优化，可以禁止进行指令重排。

synchronized 和 volatile 都是用来实现多线程同步的机制，synchronized 具有更强大的功能，但同时也有较大的性能开销，适用于在多个线程之间需要同步共享变量的情况；而 volatile 则适用于只需要保证变量的可见性，而不需要保证多线程之间的原子性操作的场景‌。
:::

## 14. Java 中常见并发容器有那些，分别是什么？4️⃣🥔
:::info 考点
- **ConcurrentHashMap**：一个线程安全的HashMap实现，允许多个线程并发访问。
- **CopyOnWriteArrayList**：一个线程安全的ArrayList实现，适用于读多写少的场景。
- **ConcurrentLinkedQueue**：一个高效的线程安全队列，内部使用链表实现，适合FIFO场景。
- **BlockingQueue**：一个线程安全的队列，提供了put和take方法以支持阻塞操作。
- **ConcurrentSkipListMap**：一个线程安全的有序Map，基于跳表实现，适合需要排序的并发场景。
:::

## 15. 请说一下 ThreadLocal 是什么？9️⃣🥕
:::info
ThreadLocal 叫做线程变量，意思是 ThreadLocal 中填充的变量属于当前线程，该变量对其他线程而言是隔离的，也就是说该变量是当前线程独有的变量。ThreadLocal 为变量在每个线程中都创建了一个副本，那么每个线程可以访问自己内部的副本变量。

ThreadLoal 变量，线程局部变量，同一个 ThreadLocal 所包含的对象，在不同的 Thread 中有不同的副本。

因为每个 Thread 内有自己的实例副本，且该副本只能由当前 Thread 使用。这是也是 ThreadLocal 命名的由来。
既然每个 Thread 有自己的实例副本，且其它 Thread 不可访问，那就不存在多线程间共享的问题。
ThreadLocal 提供了线程本地的实例。它与普通变量的区别在于，每个使用该变量的线程都会初始化一个完全独立的实例副本。ThreadLocal 变量通常被private static修饰。当一个线程结束时，它所使用的所有 ThreadLocal 相对的实例副本都可被回收。

总的来说，ThreadLocal 适用于每个线程需要自己独立的实例且该实例需要在多个方法中被使用，也即变量在线程间隔离而在方法或类间共享的场景。
:::

## 16. Java 中 `++` 运算是线程安全的吗？7️⃣🌽
:::info 考点
`++` 运算方式：
1. 读取变量的值
2. 将值加 1
3. 然后将新值写回内存
多线程情况下，可能会出现这样的情况：
假设有两个线程 A 和 B，它们同时对同一个变量进行 `++` 操作。线程 A 读取了变量的值为 5，然后将其加 1 写回内存。同时，线程 B 也进行了相同的操作。最终，这个变量的值可能会被错误地增加两次，而不是预期的一次‌。
:::
::: tip 拓展
如何避免多线程下多次运算的情况？
* synchronized
```java
public class Counter {
    private int count = 0;
    public synchronized void increment() {
        count++;
    }
    public int getCount() {
        return count;
    }
}
```
* AtomicInteger
```java
public class Counter {
    private AtomicInteger count = new AtomicInteger(0);
    public void increment() {
        count.getAndIncrement();
    }
    public int getCount() {
        return count.get();
    }
}
```
:::