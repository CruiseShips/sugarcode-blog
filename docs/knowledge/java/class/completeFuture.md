# CompleteFuture

## 前提说明
学之前，建议先学学 [Callable、Future、FutureTask](/docs/knowledge/java/class/callable_future_futureTask){target="_blank"} 这三个玩意。

## 什么是 CompleteFuture
`CompleteFuture` 是 Java 8 中引入的一个新功能，用于异步编程和并发处理。‌

它是 `Future` 的扩展版本，提供了更灵活和更强大的方法来处理异步操作的结果。`CompleteFuture` 允许在异步操作完成后执行回调函数和链式操作，弥补了 `Future` 没有相应的回调机制的缺陷‌。

## CompleteFuture 的线程池

CompletableFuture 在创建时，如果传入线程池，那么会使用传入的线程池进行工作。如果没传入，那么会去使用默认的 ForkJoinPool。

ForkJoinPool 的优势在于，可以充分利用多 cpu，多核 cpu 的优势，把一个任务拆分成多个小任务，把多个小任务放到多个处理器核心上并行执行；当多个小任务执行完成之后，再将这些执行结果合并起来即可。

:::tip 拓展
[ForkJoinPool 详情](/docs/knowledge/java/class/forkJoinPool){target="_blank"}
:::

## CompleteFuture 的方法介绍

:::info 看前统一说明
* 以 Async 结尾并且没有指定 Executor 的方法会使用 ForkJoinPool.commonPool() 作为线程池执行异步代码。
* 带有 Async 的方法为异步方法，可以使用其他的线程池执行异步任务，默认使用 ForkJoinPool，当然也可以自己指定线程池。没有 Async 的方法使用当前线程继续执行。
:::

### 创建
创建方式我们一共分为两种。

#### supplyAsync
* `supplyAsync` 方法用于`有返回值`的任务，以 Supplier 函数式接口类型为参数，并返回 U。
```java
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier) {
    return asyncSupplyStage(ASYNC_POOL, supplier);
}
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, 
                                                    Executor executor) {
    return asyncSupplyStage(screenExecutor(executor), supplier);
}
```

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture.supplyAsync(() -> {
        return 365;
    });
    
    ExecutorService executorService = Executors.newFixedThreadPool(5);
    CompletableFuture.supplyAsync(() -> {
        return 365;
    }, executorService);
}
```

#### runAsync
* `runAsync` 方法用于`没有返回值`的任务，它以 Runnable 函数式接口类型为参数，无返回值。
```java
public static CompletableFuture<Void> runAsync(Runnable runnable) {
    return asyncRunStage(ASYNC_POOL, runnable);
}
public static CompletableFuture<Void> runAsync(Runnable runnable,
                                                Executor executor) {
    return asyncRunStage(screenExecutor(executor), runnable);
}
```

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture.runAsync(() -> {
        System.out.println("无返回值");
    });
    
    ExecutorService executorService = Executors.newFixedThreadPool(5);
    CompletableFuture.runAsync(() -> {
        System.out.println("无返回值");
    }, executorService);
}
```

### 计算链
我们的任务有时会出现依赖关系，好比下一个任务需要上一个任务的结果，或者是上一个任务完成后，再调用下一个方法，这时候我们就可以依赖 `计算链`。

#### thenApply
* `thenApply` 是一种 `有参`、`有返回值` 的计算链。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Integer> completableFuture = CompletableFuture.supplyAsync(() -> {
        return 365;
    }).thenApply(x -> {
        return x + 1;
    });
    System.out.println(completableFuture.get());
}
```
解释：我们构建一个有返回值的任务，并返回 `Integer` 类型的值 365，接着调用 `thenApply`，这里传入了 `Lambda` 函数，而 x 就是代表着上一个任务的计算结果。

结果
> 366

#### thenAccept
* `thenAccept` 是一种 `有参`、`无返回值` 的计算链。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Void> completableFuture = CompletableFuture.supplyAsync(() -> {
        return 365;
    }).thenAccept(x -> {
        System.out.println("x 值为：" + x);
    });
    System.out.println(completableFuture.get());
}
```
解释：修改一下上方代码，因为 `thenAccept` 无返回值，所以我们只能最后用 `CompletableFuture<Void>` 进行接收。

结果
> x 值为：365
> 
> null

#### thenRun
* `thenRun` 是一种 `无参`、`无返回值` 的计算链。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Void> completableFuture = CompletableFuture.supplyAsync(() -> {
        return 365;
    }).thenRun(() -> {
        System.out.println("无参、无返回值");
    });
    System.out.println(completableFuture.get());
}
```
解释：修改一下上方代码，因为 `thenAccept` 无返回值，所以我们只能最后用 `CompletableFuture<Void>` 进行接收。

结果
> 无参、无返回值
> 
> null

### 任务组合
除去计算链，我们有可能还会遇到 A、B 两个任务都完成后，再去用他们的结果再进行计算的时候，或完成后做个日志记录等操作，这时候我们就可以依赖`任务组合`。

#### thenCombine
* `thenCombine` 是一种有输入参数，并返回结果的任务组合方法。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Integer> completableFuture1 = CompletableFuture.supplyAsync(() -> {
        return 1;
    });
    CompletableFuture<Integer> completableFuture2 = CompletableFuture.supplyAsync(() -> {
        return 2;
    });
    CompletableFuture<Integer> completableFuture3 = completableFuture1.thenCombine(completableFuture2, (x, y) -> {
        return x + y;
    });
    System.out.println(completableFuture3.get());
}
```
解释：同样，我们需要创建两个有返回值的任务，然后我们调用 `thenCombine()` 方法，这里我们去计算一下任务 1 和 任务 2 结果的和，并输出。

结果
> 3

#### thenAcceptBoth
* `thenAcceptBoth` 是一种有输入参数，但不返回结果的任务组合方法。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Integer> completableFuture1 = CompletableFuture.supplyAsync(() -> {
        return 1;
    });
    CompletableFuture<Integer> completableFuture2 = CompletableFuture.supplyAsync(() -> {
        return 2;
    });
    CompletableFuture<Void> completableFuture3 = completableFuture1.thenAcceptBoth(completableFuture2, (x, y) -> {
        System.out.println(x + y);
    });
    System.out.println(completableFuture3.get());
}
```
解释：直接调用 `thenAcceptBoth()` 方法，并去掉 `return`，修改返回值类型。

结果
> 3
> 
> null

#### runAfterBoth
* `runAfterBoth` 是一种 `无参`、`无返回值` 的计算链。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Void> completableFuture = CompletableFuture.supplyAsync(() -> {
        return 365;
    }).thenRun(() -> {
        System.out.println("无参、无返回值");
    });
    System.out.println(completableFuture.get());
}
```
解释：修改一下上方代码，因为 `thenAccept` 无返回值，所以我们只能最后用 `CompletableFuture<Void>` 进行接收。

结果
> 无参、无返回值
> 
> null

### 先到先得
其实先到先得是一种比喻，举例说明。我们也许会碰到等公交车，谁先来就上哪个公交，这时候就可以用到`先到先得`。

#### applyToEither
`applyToEither` 会判断两个任务谁先完成，好比 A B 任务，A 先完成，那么就会去接着 A 之后处理，当然如果是 B 先完成就接着 B 之后去处理。
`applyToEither` 是一个有 `入参`、`出参` 的任务方法。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Integer> completableFuture1 = CompletableFuture.supplyAsync(() -> {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return 365;
    });
    CompletableFuture<Integer> completableFuture2 = CompletableFuture.supplyAsync(() -> {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return 366;
    });
    
    CompletableFuture<Integer> completableFuture = completableFuture1.applyToEither(completableFuture2, x -> {
        System.out.println("结果是：" + x);
        return x;
    });
    
    System.out.println(completableFuture.get());
}
```
解释：我们创建两个任务，修改任务里面的返回值，并增加休眠方法。

结果
> 结果是：365
> 
> 365

#### acceptEither
`acceptEither` 和上面的 `applyToEither` 类似，都是根据任务执行速度进行判断，不同点是 `acceptEither` 是一个有 `入参`，但没有 `出参` 的任务方法。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Integer> completableFuture1 = CompletableFuture.supplyAsync(() -> {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return 365;
    });
    CompletableFuture<Integer> completableFuture2 = CompletableFuture.supplyAsync(() -> {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return 366;
    });
    
    CompletableFuture<Void> completableFuture = completableFuture1.acceptEither(completableFuture2, x -> {
        System.out.println("结果是：" + x);
    });
    
    System.out.println(completableFuture.get());
}
```
解释：还是刚刚那两个任务，然后我们这次调用 `acceptEither`，只是没有结果值返回。

结果
> 结果是：365
> 
> null

#### runAfterEither
`runAfterEither` 同样是根据速度进行判断，但是它是一个没有 `入参`，也没有 `出参` 的任务方法。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Integer> completableFuture1 = CompletableFuture.supplyAsync(() -> {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return 365;
    });
    CompletableFuture<Integer> completableFuture2 = CompletableFuture.supplyAsync(() -> {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return 366;
    });
    
    CompletableFuture<Void> completableFuture = completableFuture1.runAfterEither(completableFuture2, () -> {
        System.out.println("有任务执行完成");
    });
    
    System.out.println(completableFuture.get());
}
```
解释：还是刚刚那两个任务，然后我们这次调用 `runAfterEither`。

结果
> 有任务执行完成
> 
> null

### 多任务组合
现实生活中我们可能会遇到多任务的问题，好比说我们计算菜钱，白菜 2.6 / 斤，黄瓜 3.2 / 斤，西红柿 6.7 / 斤，我们都采购 5 斤，计算总价，这时候我们就可以使用 `多任务组合`。

#### allOf
`allOf` 可以解决我们上述的问题，来看一下代码示例。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Double> cucumber = CompletableFuture.supplyAsync(() -> {
        return 2.6 * 5;
    });
    CompletableFuture<Double> cabbage = CompletableFuture.supplyAsync(() -> {
        return 3.2 * 5;
    });
    CompletableFuture<Double> tomato = CompletableFuture.supplyAsync(() -> {
        return 6.7 * 5;
    });
    
    CompletableFuture<Void> all =  CompletableFuture.allOf(cucumber, cabbage, tomato);
    
    System.out.println(all.get());
}
```
解释：我们创建这三个任务，并且最后调用 allOf 进行组合，然后我们获取一下结果。

结果
> null

不难发现，我们最后获取到的是一个 null，因为 `allOf` 返回的是一个 Void（因为每个传入的 CompletableFuture 的返回值都可能不同，所以组合的结果是 无法用某种类型来表示的，索性返回 Void 类型），那么我们怎么去获取值呢？

一个一个加。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Double> cucumber = CompletableFuture.supplyAsync(() -> {
        return 2.6 * 5;
    });
    CompletableFuture<Double> cabbage = CompletableFuture.supplyAsync(() -> {
        return 3.2 * 5;
    });
    CompletableFuture<Double> tomato = CompletableFuture.supplyAsync(() -> {
        return 6.7 * 5;
    });
    
    CompletableFuture.allOf(cucumber, cabbage, tomato);
    
    System.out.println(cucumber.get() + cabbage.get() + tomato.get());
}
```

结果
> 62.5

#### anyOf
`anyOf` 和 `allOf` 类似，但是 `anyOf` 是只要有一个执行完成，就可以继续向下执行。而且 `anyOf` 有返回值，但是同样的问题，因为不知道传入进来是什么任务，所以这里返回的是一个 Object。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Double> cucumber = CompletableFuture.supplyAsync(() -> {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return 2.6 * 5;
    });
    CompletableFuture<Double> cabbage = CompletableFuture.supplyAsync(() -> {
        return 3.2 * 5;
    });
    CompletableFuture<Double> tomato = CompletableFuture.supplyAsync(() -> {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return 6.7 * 5;
    });
    
    CompletableFuture<Object> one = CompletableFuture.anyOf(cucumber, cabbage, tomato);
    
    System.out.println(one.get());
}
```

结果
> 16.0

### 异常
我们不难避免在编程的时候遇到异常，CompletableFuture 给我们提供了很多方法来处理这些异常。

#### handle
`handle` 会将异常隐藏起来，不会向外抛出，就好比增加了一个 try catch 一样。任务正确返回值，还可以在 `handle` 里进行下一步操作。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Double> completableFuture = CompletableFuture.supplyAsync(() -> {
        Random random = new Random();
        if(random.nextBoolean()) {
            throw new RuntimeException();
        }
        return 1.0;
    }).handle((result, ex) -> {
        if (null != ex) {
            System.out.println(ex.getMessage());
            return -1.0;
        } else {
            return result + 1;
        }
    });
    
    System.out.println(completableFuture.get());
}
```

结果 1
> 2.0

结果 2
> java.lang.RuntimeException
> 
> -1.0

#### whenComplete
`whenComplete` 会将异常对外抛出，需要开发者进行解决，并且无法返回默认值或其他数据。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Double> completableFuture = CompletableFuture.supplyAsync(() -> {
        Random random = new Random();
        if(random.nextBoolean()) {
            throw new RuntimeException();
        }
        return 1.0;
    }).whenComplete((result, ex) -> {
        System.out.println(result);
        if (null != ex) {
            System.out.println(ex.getMessage());
        }
    });
    
    System.out.println(completableFuture.get());
}
```

结果 1
> 1.0
> 
> 1.0

结果 2
> null
> 
> java.lang.RuntimeException
> 
> Exception in thread "main" java.util.concurrent.ExecutionException: java.lang.RuntimeException
> 
>   at java.base/java.util.concurrent.CompletableFuture.reportGet(CompletableFuture.java:396)
> 
>   at java.base/java.util.concurrent.CompletableFuture.get(CompletableFuture.java:2073)
> 
>   at com.sugarcode.SugarcodeApplicationTests.main(SugarcodeApplicationTests.java:22)
> 
> Caused by: java.lang.RuntimeException
> 
>   at com.sugarcode.SugarcodeApplicationTests.lambda$0(SugarcodeApplicationTests.java:12)
> 
>   at java.base/java.util.concurrent.CompletableFuture$AsyncSupply.run(CompletableFuture.java:1768)
> 
>   at java.base/java.util.concurrent.CompletableFuture$AsyncSupply.exec(CompletableFuture.java:1760)
> 
>   at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:373)
> 
>   at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1182)
> 
>   at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1655)
> 
>   at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1622)
> 
>   at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:165)

#### exceptionally
`exceptionally` 和 `handle` 一样，也会隐藏异常，不会向外抛出，并且也可以有返回值。但是如果任务正确返回，它却无法像 `handle` 一样拿到任务的值。

代码示例
```java
public static void main(String[] args) throws Exception {
    CompletableFuture<Double> completableFuture = CompletableFuture.supplyAsync(() -> {
        Random random = new Random();
        if(random.nextBoolean()) {
            throw new RuntimeException();
        }
        return 1.0;
    }).exceptionally(ex -> {
        System.out.println(ex.getMessage());
        return -1.0;
    });
    
    System.out.println(completableFuture.get());
}
```

结果 1
> 1.0

结果 2
> java.lang.RuntimeException
> 
> -1.0
