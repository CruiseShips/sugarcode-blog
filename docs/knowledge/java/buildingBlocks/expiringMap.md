# ExpiringMap

## 前言
我们在做后端服务的时候，经常会碰到使用缓存的情况。

但是现在大部分的解决办法是引入 Redis 中间件，或者使用 Ehcache、Guava Cache、Caffeine 等服务。

如果我们只是搭建一个比较简单的项目，其实没有必要引入他们，一是大材小用，二是增加系统复杂性，三是还要去学习他们的配置文件等等。

:::tip
类似 Ehcache、Guava Cache、Caffeine 这些框架服务，其实也是很不错的，之所以没有用，是因为我这里的服务是需要集成 Springboot，但是我不想使用注解，我也百度过不使用注解的方法，但是并未找到合适的文章，所以就放弃他们，而 Redis 是因为我还要去单独启动一个 Redis 服务，我不想增加服务器成本，所以也就没有使用，最后兜兜转转的，发现了 ExpiringMap。
:::

所以有没有什么比较简单，而且比较轻量化的缓存服务呢？ExpiringMap 来了！

## ExpiringMap 地址
GitHub地址：https://github.com/jhalterman/expiringmap/tree/master

## ExpiringMap 特点
* 高性能和低开销

ExpiringMap 通过使用线程安全的 ConcurrentMap 实现，提供了高性能和低开销的特性。
* ‌零依赖

它不依赖于其他库，使得使用更加简单。
* ‌支持多种过期策略

支持 ACCESSED（根据上次访问时间过期）和 CREATED（根据创建时间过期）两种过期策略。
* ‌可变过期时间

支持可变过期时间，即条目可以在不同的时间点过期。
* ‌最大容量限制

当达到最大容量时，新的条目会替换掉最旧的条目。
* ‌‌过期监听事件‌

可以在条目过期时触发监听事件。
* ‌‌懒加载

在调用 get() 方法时才创建对象，减少内存占用‌。

## ExpiringMap 使用
### 引入 ExpiringMap
```xml
<dependency>
    <groupId>net.jodah</groupId>
    <artifactId>expiringmap</artifactId>
    <version>0.5.11</version>
</dependency>
```

### 测试用例
#### 基础用法1：设置过期时间
```java
ExpiringMap<String, String> map = ExpiringMap.builder()
        // 设置过期时间和过期时间单位
        .expiration(5, TimeUnit.SECONDS)
        .build();
map.put("1", "测试1");
map.put("2", "测试2");
System.out.println(map);
```
给当前 ExpiringMap 对象设置一个总的过期时间：5 秒。

#### 基础用法2：给每个 KEY 设置过期时间
```java
ExpiringMap<String, String> map = ExpiringMap.builder()
        .variableExpiration()
        .expiration(2, TimeUnit.SECONDS)
        .build();
map.put("1", "测试1", ExpirationPolicy.CREATED, 1, TimeUnit.SECONDS);
map.put("2", "测试2", ExpirationPolicy.CREATED, 2, TimeUnit.SECONDS);
while(true) {
    System.out.println(map);
}
```
给当前 ExpiringMap 对象设置总的过期时间：5 秒，并给每个 KEY 也设置过期时间。（优先会判断 KEY 的过期时间）

#### 基础用法3：设置 ExpiringMap 最多缓存 KEY 数
```java
ExpiringMap<String, String> map = ExpiringMap.builder()
        .maxSize(3)
        .expiration(2, TimeUnit.SECONDS)
        .build();
map.put("1", "测试1");
map.put("2", "测试2");
map.put("3", "测试3");
System.out.println(map);
map.put("4", "测试4");
System.out.println(map);
```
给当前 ExpiringMap 对象中设置最多可缓存的 KEY 数量：3 个，当第四个 KEY 被缓存进入，优先会将第一个要过期的 KEY 清除。

#### 高级用法1：过期侦听器
```java
public static void main(String[] args) throws Exception {
    ExpiringMap<String, String> map = ExpiringMap.builder()
            // 同步过期提醒
            .expirationListener((key, value) -> remindExpiration(key, value))
            // 异步过期提醒
            .asyncExpirationListener((key, value) -> remindAsyncExpiration(key, value))
            .expiration(2, TimeUnit.SECONDS)
            .build();
    map.put("1", "测试1");
    while (true){}
}

/**
 * 过期提醒
 *
 * @param key
 * @param value
 */
private static void remindExpiration(Object key, Object value) {
    System.out.println("过期提醒, key: " + key + " value: " + value);
}

/**
 * 异步过期提醒
 *
 * @param key
 * @param value
 */
private static void remindAsyncExpiration(Object key, Object value) {
    System.out.println("异步过期提醒, key: " + key + " value: " + value);
}
```
当 ExpiringMap 中的 KEY 要过期时，可以设置异步/同步过期提醒。

#### 常用 API
```java
ExpiringMap<String, String> map = ExpiringMap.builder()
        .expiration(2, TimeUnit.SECONDS)
        .build();
map.put("1", "测试1");

Thread.sleep(1000l);

// 查看剩余过期时间：
long remainExpiration = map.getExpectedExpiration("1");
System.out.println("查看剩余过期时间：" + remainExpiration);

// 重置过期时间
map.resetExpiration("1");
System.out.println("查看剩余过期时间：" + map.getExpectedExpiration("1"));
```

## 总结
ExpiringMap 可以说是不使用第三方中间件中一个非常完美的缓存件，下次你可以在你的单体项目中使用它。