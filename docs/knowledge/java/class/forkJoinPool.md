# ForkJoinPool

## 什么是Fork/Join
Fork/Join 是一个并行计算的框架，主要就是用来支持分治任务模型的，这个计算框架里的 Fork 对应的是分治任务模型里的任务分解，Join 对应的是结果合并。

它的核心思想是将一个大任务分成许多小任务，然后并行执行这些小任务，最终将它们的结果合并成一个大的结果。

一句话总价：多人合作完成一件事。

## 深入了解 Fork/Join
在Java 中，Fork/Join 框架的主要组成部分是 ForkJoinPool 和 ForkJoinTask。

ForkJoinPool 是一个线程池，它用于管理 ForkJoin 任务的执行。

ForkJoinTask 是一个抽象类，用于表示可以被分割成更小部分的任务。

### ForkJoinPool
ForkJoinPool 是 ExecutorService 的实现类，因此是一种特殊的线程池。

我们在使用 Executors 通过调用 newWorkStealingPool 方法即可创建一个线程池为 ForkJoinPool 的 ExecutorService 对象。

#### ForkJoinPool 核心参数
* `parallelism`：并行度级别。默认为 CPU 数，最小为 1。
* `factory`：工作线程工厂。
* `handler`：指定异常处理器，当任务在运行时出错时，将有设定的处理器处理。
* `asyncMode`：设置工作队列工作模式。true 表示先进先出，false 表示后进先出。默认：false。

#### 任务提交方式
* submit
方法描述：任务提交后，会返回一个 ForkJoinTask。
提交参数：Callable、ForkJoinTask、Runnable

* execute
方法描述：任务提交后，不会有返回值。
提交参数：ForkJoinTask、Runnable

* invoke
方法描述：任务提交后，会返回泛型结果。
提交参数：ForkJoinTask、Callable集合

:::tip
这些提交方式中的参数有 3 种，但是他们最后都会变成 ForkJoinTask 的任务类型。
:::

### ForkJoinTask
ForkJoinTask 是 ForkJoinPool 的核心，它是任务的实际载体，定义了任务执行时的具体逻辑和拆分逻辑。

ForkJoinTask 是一个抽象类，它还有两个抽象子类：RecusiveAction 和 RecusiveTask。其中 RecusiveTask 代表有返回值的任务，而 RecusiveAction 代表没有返回值的任务。

#### 核心方法
* fork()
用于向当前任务所运行的线程池中提交任务。如果当前线程是 ForkJoinWorkerThread 类型，将会放入该线程的工作队列，否则放入 common 线程池的工作队列中。

* join()
用于获取任务的执行结果。调用 join() 时，将阻塞当前线程直到对应的子任务完成运行并返回结果。

## 工作窃取算法
为了平衡各个工作线程之间的工作负载，ForkJoinPool 采用了工作窃取算法。

每个工作线程都有自己的任务队列，当某个线程完成了自己队列中的所有任务时，它会尝试从其他线程的队列中窃取任务来执行。

工作窃取算法的实现基于双端队列（Deque）。每个工作线程都有一个双端队列来存储待处理的任务。当线程需要执行新任务时，它会将任务放入队列的头部（top），并以 LIFO（后进先出）的顺序处理队列中的任务。这样，最近添加的任务会优先被执行。

同时，当某个线程尝试窃取其他线程的任务时，它会从目标线程的队列的尾部（base）窃取任务。这种窃取方式是 FIFO（先进先出）的，也就是说被窃取的任务是队列中等待时间最长的任务。这种机制有助于减少线程间的竞争，提高CPU的利用率。

## 任务的拆分与合并
在 ForkJoinPool 中，任务的拆分和合并是通过继承 RecursiveAction 或 RecursiveTask 自己去实现 compute 方法去解决的。

也就是说，我们需要在 compute 中解决如下几个问题：
1. 如何拆
2. 如何装

在这个过程中，其实是处于递归的，也就是说每个小任务还可以继续被拆分成更小的任务并行执行。这种递归拆分和合并的方式使得 ForkJoinPool 能够处理非常复杂和庞大的任务。

:::warning 注意
递归请注意深度，小心 OOM！
:::

## 实战
我们就计算从 1 加到 10,000,000。

### 创建任务
首先我们创建一个类，用于实现 RecusiveTask，泛型我们使用 Long 即可。
```java
class Task extends RecursiveTask<Long> {

	private static final long serialVersionUID = 1L;

	@Override
	protected Long compute() {
		
		return null;
	}
	
}
```

### 设定参数
我们需要知道几个点。
1. 什么时候进行拆分，拆分肯定得有一个阈值。
2. 从 1 加到 10,000,000，这个值怎么来？

接下来，我们去改造这个 Task 类。
```java
class Task extends RecursiveTask<Long> {
	
	private Integer start = null; // [!code focus]
	private Integer end = null; // [!code focus]
	
	private Integer DISASSEMBLE = 1000000; // [!code focus]
	
	public Task(Integer start, Integer end) { // [!code focus]
		this.start = start; // [!code focus]
		this.end = end; // [!code focus]
	} // [!code focus]

	private static final long serialVersionUID = 1L;

	@Override
	protected Long compute() {
		Long result = 0l; // [!code focus]
		if((end - start) <= DISASSEMBLE) { // [!code focus]
			for(int i = start; i <= end; i++) { // [!code focus]
				result += i; // [!code focus]
			}
		} else {
			
		}
		System.out.println(start + "+" + end + "=" + result); // [!code focus]
		return result; // [!code focus]
	}
}
```

解释：
1. 我们设定了阈值 `DISASSEMBLE`，当超过该阈值时，走 `compute()` 方法里的 else，否则就直接走 if。判断依据就是根据我们 end - start 的差值进行判断。
2. 加到多少，我们可以通过构造方法传递进来。如果值太大，我们就走 else 进行拆分任务即可。

### 任务拆分 & 合并
接下来，我们就需要向 `else` 里编写任务的拆分与合并了。
```java
class Task extends RecursiveTask<Long> {
	
	private Integer start = null;
	private Integer end = null;
	
	private Integer DISASSEMBLE = 1000000;
	
	public Task(Integer start, Integer end) {
		this.start = start;
		this.end = end;
	}

	private static final long serialVersionUID = 1L;

	@Override
	protected Long compute() {
		Long result = 0l;
		if((end - start) <= DISASSEMBLE) {
			for(int i = start; i <= end; i++) {
				result += i;
			}
		} else {
			int middle = (start + end) / 2; // [!code focus]
			Task leftTask = new Task(start, middle); // [!code focus]
			Task rightTask = new Task(middle + 1, end); // [!code focus]

			leftTask.fork(); // [!code focus]
			rightTask.fork(); // [!code focus]

			result = leftTask.join() + rightTask.join(); // [!code focus]
		}
		System.out.println(start + "+" + end + "=" + result);
		return result;
	}
}
```

解释：
1. 拆分，我们就利用二分法进行拆分就好，从开始到中间，中间 + 1 至 结束。拆分好任务后，调用 `fork()` 方法提交任务。
2. 接着我们调用 `join()` 方法等待返回即可。

### 测试
接着我们弄个 main 方法测试一下。
```java
public static void main(String[] args) throws Exception {
    ForkJoinPool forkjoinPool = new ForkJoinPool();

    Task task = new Task(0, 10000000);

    Future<Long> result = forkjoinPool.submit(task);

    try {
        System.out.println("result：" + result.get());
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

运行结果：
> 0+625000=195312812500
> 
> 625001+1250000=585937812500
> 
> 0+1250000=781250625000
> 
> 1250001+1875000=976562812500
> 
> 1875001+2500000=1367187812500
> 
> 1250001+2500000=2343750625000
> 
> 0+2500000=3125001250000
> 
> 2500001+3125000=1757812812500
> 
> 3125001+3750000=2148437812500
> 
> 2500001+3750000=3906250625000
> 
> 3750001+4375000=2539062812500
> 
> 4375001+5000000=2929687812500
> 
> 3750001+5000000=5468750625000
> 
> 2500001+5000000=9375001250000
> 
> 0+5000000=12500002500000
> 
> 5000001+5625000=3320312812500
> 
> 8125001+8750000=5273437812500
> 
> 6875001+7500000=4492187812500
> 
> 7500001+8125000=4882812812500
> 
> 7500001+8750000=10156250625000
> 
> 6250001+6875000=4101562812500
> 
> 5625001+6250000=3710937812500
> 
> 9375001+10000000=6054687812500
> 
> 6250001+7500000=8593750625000
> 
> 8750001+9375000=5664062812500
> 
> 5000001+6250000=7031250625000
> 
> 8750001+10000000=11718750625000
> 
> 5000001+7500000=15625001250000
> 
> 7500001+10000000=21875001250000
> 
> 5000001+10000000=37500002500000
> 
> 0+10000000=50000005000000
> 
> result：50000005000000

## ForkJoinPool 的优势
- **高效**：
ForkJoinPool 通过工作窃取算法和并行处理机制，能够充分利用多核处理器的性能，提高程序的并发处理能力。

- **简化**：
使用 ForkJoinPool 可以简化并发编程的复杂性，开发者只需要关注任务的拆分和合并逻辑，而无需关心线程的创建、管理和调度等细节。

- **分治**：
ForkJoinPool 特别适合于处理可以被拆分成较小子任务的大任务，如递归算法、排序算法、图算法等。

:::warning 注意
千万小心递归算法，尽量多测试算法，保证不会出现深度递归的情况。
:::