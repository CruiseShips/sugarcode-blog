# Callable & Future & FutureTask

## 前期说明
Java 是可以支持多线程并发处理的一种语言，但是多线程和并发属于一种很大的难题，但是一但掌握了，这可是提升性能的利器！

而我们下面要说的 Callable & Future & FutureTask 就是用来解决这些难题。

他们让复杂的异步任务变得简单，让代码既高效又易于管理，那下面来开始学习吧。

## Callable
我们最开始学习创建线程的时候也有说过，一种方式是继承 Thread 类，还有一种是实现 Runnable 接口，而且这两种方式都是我们常用的。

但是！这两种方式都是有一个相同的问题，没有返回值。

那这时候 Callable 出现了，它可以有返回值，还能抛出异常，可以说是一下子给我们带来了很多的灵活性。

来看一下他的源码。
```java
@FunctionalInterface
public interface Callable<V> {
    /**
     * Computes a result, or throws an exception if unable to do so.
     *
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```

## Future & FutureTask
- **Future**：表示异步计算的结果，提供了用于检查计算是否完成、等待计算完成、以及检索计算结果的方法。

- **FutureTask**：FutureTask 是 Java 中的一个类，实现了 Future 接口和 Runnable 接口，它表示一个异步计算任务。FutureTask 可以在多线程编程中非常方便地用于提交任务、获取任务结果、取消任务等操作。通过FutureTask，我们可以更加灵活地控制线程的执行流程。

## 实战
首先，我们定义一个类，并且让该类实现 `Callable` 接口。
```java
class TestCallable implements Callable<String> {

	@Override
	public String call() throws Exception {
		Thread.sleep(2000);
		return "OK";
	}
	
}
```

`call()` 方法就是需要我们实现的，这里我们因为定义了泛型为 String，所以需要返回一个 String。

接下来我们来创建一个 FutureTask。
```java
public static void main(String[] args) {
    FutureTask<String> futureTask = new FutureTask<>(new TestCallable());

    futureTask.run();
    
    try {
        String result = futureTask.get();
        System.out.println(result);
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (ExecutionException e) {
        e.printStackTrace();
    }
}
```
这里我们通过 FutureTask 下的 `run()` 方法启动任务，然后通过 `get()` 获取到我们的返回值。

运行一下程序：
> OK

当然，这个 OK 是在 2 秒之后才出现的，并不是执行之后就出现。也就是说我们的 `get()` 方法是阻塞方法，需要等待有返回值之后才可以执行。

## 线程池执行
我们可以除去使用上面的 FutureTask 去执行任务，也可以使用线程池，这里我们来使用一下。
```java
public static void main(String[] args) throws Exception {
    ExecutorService es = Executors.newFixedThreadPool(5);
    
    Future<String> result = es.submit(new TestCallable());

    System.out.println(result.get());

    es.shutdown();
}
```