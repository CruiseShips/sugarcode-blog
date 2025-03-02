# 配置文件加密

## 前言
很多公司愿意将代码数据提交至 Git、Gitee 等代码托管的系统中，但是不免配置文件中一些核心数据也会被提交上去。

例如：数据库 ip 地址、账号、密码；Redis ip 地址、账号、密码等。

一旦这些数据提交到开放式 Git 上，不免会有其他人拉取代码，并且通过账号密码登录至服务器进行操作。

所以为了应对这样的情况，我们来介绍一下一种技术：`jasypt`。

## jasypt
Jasypt（Java Simplified Encryption）是一个专注于简化Java加密操作的开源工具。它提供了一种简单而强大的方式来处理数据的加密和解密，使开发者能够轻松地保护应用程序中的敏感信息，如数据库密码、API密钥等。

Jasypt的设计理念是简化加密操作，使其对开发者更加友好。它采用密码学强度的加密算法，支持多种加密算法，从而平衡了性能和安全性。其中，Jasypt的核心思想之一是基于密码的加密（Password Based Encryption，PBE），通过用户提供的密码生成加密密钥，然后使用该密钥对数据进行加密和解密。此外，Jasypt还引入了盐（Salt）的概念，通过添加随机生成的盐值，提高了加密的安全性，防止相同的原始数据在不同的加密过程中产生相同的结果，有效抵御彩虹表攻击。

Jasypt的功能非常丰富，包括加密属性文件、Spring Framework集成、加密Hibernate数据源配置、URL加密的Apache Wicket集成等。它还可以与Acegi Security（即Spring Security）整合，用于加密任务与应用程序，如加密密码、敏感信息和数据通信，以及创建完整检查数据的sums等。此外，Jasypt还提供了一个开放的API，使得任何Java Cryptography Extension都可以使用它。

在Spring Boot应用中，Jasypt Spring Boot Starter是一个方便的集成工具，可以简化加密功能的配置。它支持多种加密算法，包括对称加密和非对称加密，可以根据实际需求选择合适的加密方式。通过使用Jasypt Spring Boot Starter，可以轻松地将加密功能集成到Spring Boot应用中，无需手动配置复杂的加密相关的代码和配置文件。

## 使用
* 先去弄个 springboot 的项目，方便我们学习。
### pom
首先在 pom 中引入 `jasypt-spring-boot-starter`
```xml
<dependency>
    <groupId>com.github.ulisesbocchio</groupId>
    <artifactId>jasypt-spring-boot-starter</artifactId>
    <version>3.0.5</version>
</dependency>
```

### 添加配置
```yml
jasypt:
  encryptor:
    password: chen2024
```
这里的 password 指的是盐，可以自己拟定，我这里使用 `chen2024`。

### 生成密文
我们在测试类中，引入 `StringEncryptor`，然后通过调用 `encrypt()`、`decrypt()` 来进行创建密文和解密密文。
```java
@Autowired
private StringEncryptor stringEncryptor;

@Test
void contextLoads() throws IOException {
    String str = "123456";
    String secretStr = stringEncryptor.encrypt(str);
    String restoreSrt = stringEncryptor.decrypt(secretStr);

    System.out.println(secretStr);
    System.out.println(restoreSrt);
}
```

第一次输出：
> 4DuRhP6aZh4gs3CJ8QVq6tiw5AyLNwMy8qnt+qn4qMnnoTwkl+UOMUsKAHaAlsYY
> 
> 123456

第二次输出：
> /pSenuO+zuOtJaYt+dBMzmCnEugCb/8su04piPS9EJ6FfsI7igA9bqhuLO1JlgQ7
>
> 123456

结果分析：可以看到，虽然我们是同样的盐，同样的原文，但是最后输出的密文是两种。

### 替换配置
接着我们将生成的密文，直接替换我们之前的配置文件。
```yml
spring:
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    url: jdbc:mysql://localhost:3306/kingpassword-individual?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf-8&autoReconnect=true
    username: root
    password: ENC(3na+lCZEsXUbi0XSWKxq4CMo9MCfklQOE9ZrfychqRztbLG5VIbJ8/vGHgh9cMs8)
    driver-class-name: com.mysql.cj.jdbc.Driver
```
这里我们需要在要配置的地方使用 `ENC()` 将密文括起来，然后我们启动一下项目试试看。

### 更换 ENC 名称
我们这里也可以不使用 ENC 这个名称，我们也可以通过修改配置文件自定义这个配置。
```yml
jasypt:
    property:
      prefix: Sugar(
      suffix: )Code
```
prefix 为前缀，suffix 为后缀，然后我们修改一下我们之前的配置文件。
```yml
spring:
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    url: jdbc:mysql://localhost:3306/kingpassword-individual?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf-8&autoReconnect=true
    username: root
    password: Sugar(3na+lCZEsXUbi0XSWKxq4CMo9MCfklQOE9ZrfychqRztbLG5VIbJ8/vGHgh9cMs8)Code
    driver-class-name: com.mysql.cj.jdbc.Driver
```
重启一下服务，可以发现一样是可以使用的。

### 部署
如果我们将上述代码进行提交的时候，切记，不要提交我们的盐，因为有了盐，通过调用 `decrypt()` 就可以知道你的原文了。
所以在部署的时候，我们需要在启动命令中增加参数。

```
java -jar xxx.jar --jasypt.encryptor.password=chen2024 &
```