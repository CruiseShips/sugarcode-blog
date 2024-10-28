# synchronized 关键字详解

## 背景介绍
我们在开发有并发量的程序时，往往会遇到一些重点问题：

1. 存在共享数据（也称临界资源）
2. 存在多条线程共同操作共享数据

因此为了解决这个问题，我们可能需要这样一个方案，当存在多个线程操作共享数据时，需要保证同一时刻有且只有一个线程在操作共享数据，其他线程必须等到该线程处理完数据后再进行。

这种方式有个高尚的名称叫互斥锁，即能达到互斥访问目的的锁，也就是说当一个共享数据被当前正在访问的线程加上互斥锁后，在同一个时刻，其他线程只能处于等待的状态，直到当前线程处理完毕释放该锁。

## 概念
synchronized 是 Java 语言中的一个关键字。

它可用来给对象和方法或者代码块加锁，当它锁定一个方法或者一个代码块的时候，同一时刻最多只有一个线程执行这段代码。当两个并发线程访问同一个对象 object 中的这个加锁同步代码块时，一个时间内只能有一个线程得到执行。另一个线程必须等待当前线程执行完这个代码块以后才能执行该代码块。

synchronized 关键字可以用在方法、代码块、静态方法和静态代码块上。

## 用法

### 方法锁
方法锁顾名思义，就是给方法上增加锁，我们来看一个例子。

首先，我们先去创建一个类，并让该类实现 Runnable 接口。
```java
class SynchronizedObjectMethod implements Runnable {
	@Override
	public void run() {
		method();
	}
	
	public void method() {
		String threadName = Thread.currentThread().getName();
		System.out.println("start" + threadName);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("end" + threadName);
	}
}
```

然后，我们启动两个线程。
```java
	public static void main(String[] args) {
		SynchronizedObjectMethod instance = new SynchronizedObjectMethod();
		Thread thread1 = new Thread(instance);
        Thread thread2 = new Thread(instance);
        thread1.start();
        thread2.start();
        while(thread1.isAlive()||thread2.isAlive()){
        }
        System.out.println("finish");
	}
```

来看一下结果。
startThread-0
startThread-1
endThread-0
endThread-1
finish

接下来我们使用一下 synchronized 关键字
```java
class SynchronizedObjectMethod implements Runnable {
	@Override
	public void run() {
		method();
	}
	
	public synchronized void method() { // [!code focus]
		String threadName = Thread.currentThread().getName();
		System.out.println("start" + threadName);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("end" + threadName);
	}
}
```

再来看一下结果。
startThread-0
endThread-0
startThread-1
endThread-1
finish

可以发现，当线程 0 结束之后，线程 1 才进入运行代码。

### 代码块锁
代码块锁就是常用的同步方法块，synchronized 锁住的是它里面的对象，作用域就是 synchonized 里面的代码。

再来修改一下程序
```java
class SynchronizedObjectMethod implements Runnable {
	@Override
	public void run() {
		String threadName = Thread.currentThread().getName();
        System.out.println("进入方法" + threadName);
		method(threadName);
	}
	
	public synchronized void method(String threadName) {
        synchronized(this) { // [!code focus]
            System.out.println("start" + threadName);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("end" + threadName);
        } // [!code focus]
	}
}
```

再来看一下结果。
进入方法Thread-0
startThread-0
进入方法Thread-1
endThread-0
startThread-1
endThread-1
finish

> [!IMPORTANT] 运行结果解释
> 线程 0 和 线程 1 启动后，首先是线程 0 进入方法，然后执行 “进入方法”、“start”，接着就开始进入休眠。
> 
> 同时 线程 1 也进入了方法，执行 “进入方法” 后，再向下执行时，发现线程 0 还在执行中，所以就开始等待，等线程 0 执行结束后，线程 1 继续开始执行。


### Class形式锁
synchronized() 括号里使用的锁是 Class 对象。

再来修改一下程序
```java
class SynchronizedObjectMethod implements Runnable {
	@Override
	public void run() {
		String threadName = Thread.currentThread().getName();
        System.out.println("进入方法" + threadName);
		method(threadName);
	}
	
	public synchronized void method(String threadName) {
        synchronized(SynchronizedObjectMethod.class) { // [!code focus]
            System.out.println("start" + threadName);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("end" + threadName);
        } // [!code focus]
	}
}
```

启动方法
```java
public static void main(String[] args) {
    SynchronizedObjectMethod instance1 = new SynchronizedObjectMethod(); // [!code focus]
    SynchronizedObjectMethod instance2 = new SynchronizedObjectMethod(); // [!code focus]
    Thread thread1 = new Thread(instance1); // [!code focus]
    Thread thread2 = new Thread(instance2); // [!code focus]
    thread1.start();
    thread2.start();
    while(thread1.isAlive()||thread2.isAlive()){
    }
    System.out.println("finish");
}
```

再来看一下结果。
进入方法Thread-0
进入方法Thread-1
startThread-0
endThread-0
startThread-1
endThread-1
finish

> [!IMPORTANT] 运行结果解释
> 启动后运行结果和代码块锁类似，因为锁的东西一样。


### 静态方法锁
synchronized 可以用在静态方法上。

再来修改一下程序
```java
class SynchronizedObjectMethod implements Runnable {
	@Override
	public void run() {
		String threadName = Thread.currentThread().getName();
        System.out.println("进入方法" + threadName);
        
		method(threadName);
	}
	
	public synchronized static void method(String threadName) { // [!code focus]
		System.out.println("start" + threadName);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("end" + threadName);
	}
}
```

再来看一下结果。
进入方法Thread-0
进入方法Thread-1
startThread-0
endThread-0
startThread-1
endThread-1
finish

> [!IMPORTANT] 运行结果解释
> 
> 启动后运行结果和方法锁类似，因为锁的东西一样。只是多了一个 static

## synchronized 原理
我们可以将代码的 class 文件打开看一下，synchronized 到底是什么。

:::tip
反编译命令使用：
1. javac SynchronizedObjectMethod.java
2. javap -c -v SynchronizedObjectMethod
:::

```java
public class SynchronizedObjectMethod {
	public void method() {
		synchronized(this) {}
	}
}
```

反编译后
```
0: aload_0
1: dup
2: astore_1
3: monitorenter
4: aload_1
5: monitorexit
6: goto          14
9: astore_2
10: aload_1
11: monitorexit
12: aload_2
13: athrow
14: return
```
- **monitor**：
monitor（监视器），在 Java 中，每一个 Java 对象都会有一个 monitor。当我们拿到了这个对象的 monitor 时，就相当于给这个对象上了锁，其他人就无法再获取到该对象。
- **monitorenter**：
monitorenter 指令就是去获取 Java 对象的监视器，也就是 monitor。

> 当线程执行monitorenter指令时，它会尝试获取对象监视器的所有权。如果监视器没有被其他线程占用，则当前线程成为监视器的所有者，并将进入次数设置为1。
> 如果监视器已经被其他线程占用，则当前线程会被阻塞，直到监视器的进入次数变为0，然后线程间会竞争获取监视器的所有权。
- **monitorexit**：
monitorexit 指令是用于释放锁的指令‌。当执行 monitorenter 指令时，线程试图获取 monitor 的所有权，而 monitorexit 指令则用于释放这个锁。

> 每个 monitorenter 指令对应一个或多个 monitorexit 指令，以确保在同步代码块结束时正确释放锁‌。
monitorexit 指令与 monitorenter 指令一起工作，确保线程在进入同步代码块时获取锁，并在退出同步代码块时释放锁。

> 当执行 monitorenter 指令时，当前线程试图获取对象的 monitor 所有权，如果获取成功，则计数器加 1；执行 monitorexit 指令时，计数器减 1，当计数器为 0 时，锁被完全释放‌。

> 在异常情况下，即使发生异常，也需要执行 monitorexit 指令来释放锁，以确保不会因为异常而导致锁无法释放。这通过在字节码中插入异常处理逻辑来实现，确保即使在异常情况下也能正确释放锁‌。


## synchronized 优化
JDK 1.5 版本之后，官方对 synchronized 做了各种优化，经过优化之后的 synchronized 速度变的越来越快了，这也是官方为什么建议使用 synchronized 的原因。

### 锁粗化
互斥的临界区范围应该尽可能小，这样做的目的是为了使同步的操作数量尽可能缩小，缩短阻塞时间，如果存在锁竞争，那么等待锁的线程也能尽快拿到锁。

但是加锁解锁也需要消耗资源，如果存在一系列的连续加锁解锁操作，可能会导致不必要的性能损耗，锁粗化就是将「多个连续的加锁、解锁操作连接在一起」，扩展成一个范围更大的锁，避免频繁的加锁解锁操作。

```java
int result = 0;
for(int i = 0; i< 100000000; i++) {
    synchronized(this) {
        result++;
    }
}
```
我们看上述代码，JVM 会检测到一连串的操作都对同一个对象加锁，此时 JVM 就会将加锁的范围粗化到这一连串操作的外部，使得这一连串操作只需要加一次锁即可。
```java
int result = 0;
synchronized(this) {
    for(int i = 0; i< 100000000; i++) {
        result++;
    }
}
```

### 锁消除
JVM 在运行时对于被 synchronized 关键字修饰的同步代码块进行优化，当确定同步块不存在竞争条件时，消除掉 synchronized 的使用，以提高代码执行的效率。

这种优化通常是由 JIT（Just-In-Time）编译器在运行时基于对程序的深入分析进行的。

由于这个过程是由JVM自动完成的，因此不需要程序员手动干预。
```java
public class SynchronizedExample {
    private Object lock = new Object();
 
    public void doSynchronized() {
        synchronized (lock) {
            // 同步代码块内容
        }
    }
}
```
在这个例子中，synchronized (lock) 实现了对 lock 对象的同步，防止多个线程同时执行同步代码块内的代码。

JVM 可能会在运行时分析这段代码，并判断出 lock 对象不会被其他线程访问，这种情况下，JVM 可能会进行锁消除优化，消除掉 synchronized 关键字的使用，从而提高代码执行的效率。
:::warning
锁消除是一种编译期的优化，它可能会影响程序的执行结果，因此确保在进行分析和调优时，对JVM的行为有足够的理解。
:::

### 锁升级
synchronized 锁是一个重量级锁，在 Java 1.6 之后引入了各种锁优化机制，如偏向锁、轻量级锁、自旋锁、重量级锁，这些锁机制的目的是减少同步操作对系统性能的影响。

:::tip
synchronized 锁的升级顺序是 「无锁-->偏向锁-->轻量级锁-->重量级锁，只会升级不会降级」
:::

* 偏向锁

当一个线程访问同步代码块并且这个线程是第一个访问的线程时，偏向锁会尝试将这个线程的ID记录在对象头中，后续该线程进入和退出同步块时不需要任何同步操作。

* 轻量级锁

如果在代码块中没有发生线程竞争，那么JVM就会把对象锁替换为轻量级锁。轻量级锁使用CAS操作来实现，如果一个线程在获取锁时，发现锁标记为偏向锁，并且这个锁没有被其他线程竞争，那么这个线程就会把锁的标志位更新为自己的线程ID，然后就可以直接进入同步代码块。

* 自旋锁

如果CAS操作失败，那么线程可能会自旋（空转）等待，而不是阻塞。这就是自旋锁。自旋锁在多处理器和多核心处理器下效果更好，因为它可以减少线程上下文切换的开销。

* 重量级锁

如果自旋锁自旋了很长时间还没有获得锁，或者自旋次数太多，那么JVM就会把轻量级锁升级为重量级锁，也就是说，当前线程会被挂起，进入阻塞状态，等待解锁后再恢复。