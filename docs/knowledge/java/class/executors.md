# Executors

## Executors 介绍
`Executors` 是 Java 提供给我们的一个工具类，主要用于创建线程池，并返回一个 `ExecutorService` 的一个实现。

## 线程池介绍（JDK 17）
接下来我们就学习一下 `Executors` 可以创建的线程池。

### newCachedThreadPool
先来看一下源码
```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                    60L, TimeUnit.SECONDS,
                                    new SynchronousQueue<Runnable>());
}
```
`newCachedThreadPool` 创建了一个没有核心线程（corePoolSize 为 0）且最大线程数可以接近无限的线程池。而且使用了 `SynchronousQueue` 队列，该队列是一种线程安全，且容量为 0 的队列。

:::tip 拓展
SynchronousQueue 队列，是一个容量为 0 的队列。

所以没有一个地方来暂存元素，导致每次取数据都要先阻塞，直到有数据被放入。

同理，每次放数据的时候也会阻塞，直到有消费者来取。
:::

这种线程池可以根据任务量的增加动态地创建新线程，并且可以在任务执行完毕后回收空闲的线程。

:::warning 注意
如果主线程提交任务速度高于 maximumPool 中线程处理任务速度时，CachedThreadPool 会不断创建新线程。

极端情况下，CachedThreadPool 会因为创建过多线程而耗尽 CPU 和内存资源。
:::

### newFixedThreadPool
```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>());
}
```
`newFixedThreadPool` 创建一个固定大小的线程池。当有新的任务提交时，如果线程池中的所有线程都在执行任务，则新的任务会被放入等待队列中，直到有线程可用为止。
`LinkedBlockingQueue` 是一个无界的阻塞队列，它的大小是没有限制的，因此，当任务提交到线程池时，如果线程池中的线程正在执行任务，那么新提交的任务将被放入 LinkedBlockingQueue 中等待执行，直到有可用的线程来执行任务。

:::warning 注意
使用 `newFixedThreadPool()` 方法创建线程池时，队列的大小实际上是无限制的，但是需要注意的是，如果任务提交速度过快，队列可能会无限制地增长，导致内存溢出等问题。因此，在实际使用中需要根据具体的场景来合理设置线程池的大小和任务队列的容量，以充分利用系统资源并保证系统的稳定性。
:::

### newScheduledThreadPool
```java
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}

public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE,
            DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
            new DelayedWorkQueue());
}
```
`newScheduledThreadPool` 用于创建支持定时和周期性任务执行的线程池。可执行定时任务、周期性任务、延迟执行任务。
`DelayedWorkQueue` 是一种设计为定时任务的延迟队列，通过 `put(Runnable e)`、`add(Runnable e)`、`offer(Runnable e, long timeout, TimeUnit unit)` 三种方式添加元素，且队列可以扩容。

下面我们看一个示例代码
```java
public static void main(String[] args) {
    ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(5);
    scheduledExecutorService.schedule(() ->{
        System.out.println("3 秒后执行！");
    }, 3, TimeUnit.SECONDS);
    scheduledExecutorService.schedule(() ->{
        System.out.println("2 秒后执行！");
    }, 2, TimeUnit.SECONDS);
    scheduledExecutorService.schedule(() ->{
        System.out.println("1 秒后执行！");
    }, 1, TimeUnit.SECONDS);
    scheduledExecutorService.shutdown();
}
```

执行结果：
> 1 秒后执行！
> 
> 2 秒后执行！
> 
> 3 秒后执行！

### newSingleThreadExecutor
```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```
`newSingleThreadExecutor` 用于创建一个单线程的线程池。顾名思义，这个线程池中只有一个线程，所有提交到线程池的任务将按照提交的顺序依次执行。即使线程池中的唯一线程因某些原因意外终止，线程池也会创建一个新的线程来继续执行后续的任务，从而保证任务的顺序性和稳定性。

### newSingleThreadScheduledExecutor
```java
    public static ScheduledExecutorService newSingleThreadScheduledExecutor() {
        return new DelegatedScheduledExecutorService
            (new ScheduledThreadPoolExecutor(1));
    }
```

`newSingleThreadScheduledExecutor` 是一个调度线程池，它保证所有调度任务在单个线程中按顺序执行。

下面我们看一个示例代码
```java
public static void main(String[] args) {
    ScheduledExecutorService scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
    
    // 安排一个在特定延迟后执行一次的任务
    scheduledExecutorService.schedule(() -> {
        System.out.println("1秒后，执行一次的任务。");
    }, 1, TimeUnit.SECONDS);

    // 安排一个周期性执行的任务，每隔一定时间执行一次
    scheduledExecutorService.scheduleAtFixedRate(() -> {
        System.out.println("2秒后，每隔 1 秒执行一次的任务。");
    }, 2, 1, TimeUnit.SECONDS);

    // 安排一个周期性执行的任务，在上一个任务执行结束后一定延迟再次执行
    scheduledExecutorService.scheduleWithFixedDelay(() -> {
        System.out.println("在上一个任务结束后 1 秒，10 秒后再执行该任务。");
    }, 1, 10, TimeUnit.SECONDS);
}
```

执行结果：
> 1秒后，执行一次的任务。
> 
> 在上一个任务结束后 1 秒，10 秒后再执行该任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 在上一个任务结束后 1 秒，10 秒后再执行该任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 2秒后，每隔 1 秒执行一次的任务。
> 
> 在上一个任务结束后 1 秒，10 秒后再执行该任务。

### newWorkStealingPool
```java
public static ExecutorService newWorkStealingPool() {
    return new ForkJoinPool
        (Runtime.getRuntime().availableProcessors(),
            ForkJoinPool.defaultForkJoinWorkerThreadFactory,
            null, true);
}
```
`newWorkStealingPool` 是 Java 8 引入的一个新型线程池，该线程池使用 `工作窃取` 的算法，可用于可并行化且计算密集型的任务。

::: tip
* 工作窃取算法

当线程执行完自己队列中的任务后，它会尝试从其他线程的队列中“窃取”任务来执行，从而实现负载均衡。这种算法能够减少线程间的竞争，提高系统的整体性能。
:::

newWorkStealingPool 是基于 ForkJoinPool 实现的线程池，不同于 ThreadPoolExecutor 的基础架构。它通过任务拆分实现并行处理，尤其适合处理大任务。ForkJoinPool 会将大任务分解为多个小任务，由不同线程处理，而不是单一线程执行。

## 线程池常用方法 & 说明
- **submit()**：
线程池建立完毕之后，我们就需要往线程池提交任务。这里我们可以通过线程池的submit方法即可。
- **execute()**：
同 `submit()` 方法一样，都是向线程池提交任务的。

:::tip 拓展
`submit()` & `execute()` 差异
1. `submit()` 方法是定义在 ExecutorService 接口中，而 `execute()` 方法是定义在 Executor 接口中。
2. `submit()` 可提交实现 Callable 或 Runnable 的对象，而 `execute()` 只能提交 Runnable 的对象。
3. `submit()` 会抛出异常，而 `execute()` 异常不会被抛出，需要开发人员自己去处理。
4. `submit()` 执行完成后，会返回一个 Future 对象，而 `execute()` 不会返回任何内容。
:::

- **shutdown()**：
关闭线程池。