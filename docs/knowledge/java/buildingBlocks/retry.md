# Retry

## 前言
我们在日常开发中，不免有时会用到 http 进行请求调用其他服务的时候，但是这种请求会随着网络不稳定、网络故障等造成请求失败。

所以我们就需要用到重试这个操作。

按照之前以往的经验来看，大多数的人都是使用个循环，然后进行操作，很明显，这种做法太 2 了，来看一下 spring 给我们带来的一个组件 `spring-retry`。

## Spring Retry
Spring Retry 是从 Spring Batch 2.2.0 版本独立出来的一个功能，主要实现了重试和熔断。

在 Spring Retry 需要指定触发重试的异常类型，并设置每次重试的间隔以及如果重试失败是继续重试还是熔断（停止重试）。

:::tip
我们可以通过配置来设置全局的最大重试策略、延迟时间、间隔时间等。

也可以通过注解对指定方法进行设置。
:::

## 引入 Retry

### pom
Spring Boot 版本：3.3.4，我们在 pom 中引入 retry。
```xml
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```
这里需要注意，我们除去 retry 之外，还需要将 aop 引入进来，不引入会报错的！

### 创建 RetryTemplate
我们去创建一个 RetryTemplate 的 Bean。
```java
@Configuration
public class CustomRetryConfig {

	@Bean
    RetryTemplate retryTemplate() {
		RetryTemplate template = new RetryTemplate();

        // 设置重试策略：最大重试次数为5次
        SimpleRetryPolicy policy = new SimpleRetryPolicy();
        policy.setMaxAttempts(5);
        
        // 设置延迟策略：初始延迟时间为1000毫秒，每次重试间隔时间乘以2
        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(1000);
        backOffPolicy.setMultiplier(2.0);

        template.setRetryPolicy(policy);
        template.setBackOffPolicy(backOffPolicy);

        return template;
	}
}
```

### 打开 Retry
在启动类上面加上，不然不能用
```java
@EnableRetry
```

## 使用 Retry
创建一个 `RetryController` 的类，我们在类中创建一个 retry 的方法，具体如下：
```java
@RequestMapping("retry")
@Retryable(retryFor = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 3000))
public Map<String, String> retry() throws Exception{
    Map<String, String> result = new HashMap<>();
    
    double random = Math.random();
    System.out.println(random);
    if(random < 0.3) {
        result.put("code", "000000");
        return result;
    } else {
        throw new Exception("全部失败！");
    }
}
```
来看上方代码，当请求进入到方法后，会随机生成一个随机数，当随机数小于 0.3 的时候，我们就返回 code：000000，如果失败则抛出异常。

这里我们使用了 `@Retryable` 注解，该注解可以给方法或者类添加重试功能。
:::tip
@Retryable注解中常用属性

* retryFor

    抛出指定异常才会重试，其他异常则不管。
* maxAttempts

    最大重试次数，默认3次。
* backoff

    重试等待策略，默认使用 @Backoff，@Backoff 的 value（delay） 默认为 1000L，我们设置为 3000L；multiplier（指定延迟倍数）默认为0，表示固定暂停1秒后进行重试，如果把 multiplier 设置为1.5，则第一次重试为2秒，第二次为3秒，第三次为4.5秒。
* listeners

    用于添加监听
:::

启动项目，我们请求一下。
```log
0.8659541334207072
0.32347509929309637
0.9263111677706798

java.lang.Exception: 全部失败！
```
可以看到啊，三次都失败，然后直接抛出异常。

## @Recover
`@Recover` 注解是为了配合 `@Retryable` 一起使用的，主要用来做兜底。

我们在 `RetryController` 类里面再定义一个 `recover` 的方法，并添加 `@Recover` 注解
```java
@Recover
public Map<String, String> recover(Exception ex) {
    ex.printStackTrace();
    
    Map<String, String> result = new HashMap<>();
    result.put("code", "999999");
    return result;
}
```

重启项目，并再次请求。
```log
0.42413079404906784
0.7168733622995673
0.8061733705858771

java.lang.Exception: 全部失败！
```
可以看到，三次还是都失败，但是，我们再来看接口返回内容。
```json
// 20250106155130
// http://localhost/retry/retry

{
  "code": "999999"
}
```
和之前的报错页面不同，这次虽然还是失败，但是是有返回值的。

## 加入监听
我们可以对重试的整个生命周期增加一个监听。

### 创建监听
```java
public class DefaultRetryListenerSupport implements RetryListener {

	@Override
	public <T, E extends Throwable> boolean open(RetryContext context, RetryCallback<T, E> callback) {
		System.out.println("open");
		return RetryListener.super.open(context, callback);
	}

	@Override
	public <T, E extends Throwable> void close(RetryContext context, RetryCallback<T, E> callback,
			Throwable throwable) {
		System.out.println("close");
		RetryListener.super.close(context, callback, throwable);
	}

	@Override
	public <T, E extends Throwable> void onSuccess(RetryContext context, RetryCallback<T, E> callback, T result) {
		System.out.println("onSuccess");
		RetryListener.super.onSuccess(context, callback, result);
	}

	@Override
	public <T, E extends Throwable> void onError(RetryContext context, RetryCallback<T, E> callback,
			Throwable throwable) {
		System.out.println("onError");
		RetryListener.super.onError(context, callback, throwable);
	}
	
}
```
这里需要注意，之前版本是需要继承 `RetryListenerSupport` 类进行实现监听，现在我所使用的是通过实现 `RetryListener`，并重写里面的方法进行实现的。

### 引入监听
这里引入监听有两种方式，一种是引入到全局中，一种是配置到 `@Retryable` 中。

* 全局
```java
@Bean
RetryTemplate retryTemplate() {
    RetryTemplate template = new RetryTemplate();

    template.setListeners(new DefaultRetryListenerSupport());

    return template;
}
```

* 配置至注解中

如果我们需要配置到注解中，我们需要将我们刚刚创建的监听类，添加到 Spring 中（这里自己去添加一个 `@Component` 去）

然后我们在 `RetryController` 类中的 `@Retryable` 注解中添加我们的监听。
```java
@Retryable(retryFor = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 3000), listeners = "defaultRetryListenerSupport")
```

重新启动服务，重新请求
```log
open
0.4935400834477286
onError
0.944903992447952
onError
0.33384875353055565
onError
java.lang.Exception: 全部失败！
close
```
可以看到，在我们的 console 窗口打印出我们刚刚在监听中配置输出的内容。

## 总结
我们主要体验了一个 Retry 的功能，具体怎么用什么场景下能用还是需要我们自己去选择哈，以及我们的业务量大的话会不会堆积呢，都是我们要考虑的事情，还需要深入探索的哈，本节就到这里哈，有理解不对的地方欢迎指正哈。