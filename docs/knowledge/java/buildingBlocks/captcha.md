# Captcha

## 前言
不出意外我们在很多网站上看到过验证码：图形验证码、左右滑动验证码、文字点击验证码等等。

这些不同类型的验证码可以根据实际需求和安全性要求进行选择和应用，但是他们的目的都是用来保护网站和用户免受恶意攻击。

今天我们来主要学习最基础的图形验证码。

## Hutool captcha
验证码的组件也比较多，这里我们去学习 `Hutool` 给我们提供的图形化验证码。

## 引入 Hutool captcha
### pom
这里引入有两种方式：
* 只引入 `hutool-captcha`
```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-captcha</artifactId>
    <version>5.8.26</version>
</dependency>
```
* 引入所有的 `hutool`
```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.26</version>
</dependency>
```
我为了图方便，一般都选择引入所有的。

### 创建控制器
我们创建一个 `CaptchaController` 控制器，用于提供服务访问。
```java
@RestController
@RequestMapping("/captcha")
public class CaptchaController {

	@RequestMapping("/getCaptcha")
	public void getCaptcha() throws Exception {
		
	}
}
```

接着，我们需要向 `getCaptcha` 方法中写入对应的代码即可。

## 使用 captcha

Hutool captcha 中给我们提供了很多种类型的验证码，我们这里都来学一下。

### 线段干扰验证码
我们先来看 Hutool captcha 给我们提供的文档
```java
// 定义图形验证码的长和宽
LineCaptcha lineCaptcha = CaptchaUtil.createLineCaptcha(200, 100);

// 图形验证码写出，可以写出到文件，也可以写出到流
lineCaptcha.write("d:/line.png");
```
```java
ICaptcha captcha = ...;
captcha.write(response.getOutputStream());
//Servlet的OutputStream记得自行关闭哦！
```
我们可以通过以上案例将代码整合到我们的方法中。
```java
@RequestMapping("/getCaptcha")
public void getCaptcha(HttpServletResponse response) throws Exception {
    AbstractCaptcha captcha = CaptchaUtil.createLineCaptcha(200, 100);
    ServletOutputStream outputStream = response.getOutputStream();
    captcha.write(outputStream);
    outputStream.close();
}
```

启动服务，我们来请求一下 http://localhost/captcha/getCaptcha

不出意外，我们可以在页面中看到一个背景是线条的 5 位数验证码。

### 圆圈干扰验证码
圆圈干扰验证码同线段干扰类似，背景从条线改为了圆圈。
```java
@RequestMapping("/getCaptcha")
public void getCaptcha(HttpServletResponse response) throws Exception {
    AbstractCaptcha captcha = CaptchaUtil.createCircleCaptcha(200, 100); // [!code focus]
    ServletOutputStream outputStream = response.getOutputStream();
    captcha.write(outputStream);
    outputStream.close();
}
```
### 扭曲干扰验证码
曲线干扰验证码背景只有一条直线，而文字是扭曲的。
```java
@RequestMapping("/getCaptcha")
public void getCaptcha(HttpServletResponse response) throws Exception {
    AbstractCaptcha captcha = CaptchaUtil.createShearCaptcha(200, 100); // [!code focus]
    ServletOutputStream outputStream = response.getOutputStream();
    captcha.write(outputStream);
    outputStream.close();
}
```

### 动画干扰验证码
动画干扰验证码背景为闪烁的圆圈，并且文字也是一闪一闪的。
```java
@RequestMapping("/getCaptcha")
public void getCaptcha(HttpServletResponse response) throws Exception {
    AbstractCaptcha captcha = CaptchaUtil.createGifCaptcha(200, 100); // [!code focus]
    ServletOutputStream outputStream = response.getOutputStream();
    captcha.write(outputStream);
    outputStream.close();
}
```

## 其他常用接口。
### 获取验证码
我们生成验证码之后，需要将验证码图片中的内容获取到，方便我们做校验，方法如下。
```java
String code = captcha.getCode()
```

### 创建验证码的重载方法
我们这里以“线段干扰验证码”的方法进行研究，圆圈、扭曲验证码同理类似。
```java
/**
 * width 长
 * height 高
 */
LineCaptcha createLineCaptcha(int width, int height)

/**
 * width 长
 * height 高
 * codeCount 验证码位数
 * lineCount 线条个数
 */
// 验证码 长、高、、
LineCaptcha createLineCaptcha(int width, int height, int codeCount, int lineCount)

/**
 * width 长
 * height 高
 * generator 验证码生成方式
 * lineCount 线条个数
 */
LineCaptcha createLineCaptcha(int width, int height, CodeGenerator generator, int lineCount)
```

### 验证码生成方式
Hutool captcha 允许我们自定义验证码，这里官网给我们提供了两个例子
* 自定义纯数字的验证码（随机4位数字，可重复）
```java
@RequestMapping("/getCaptcha")
public void getCaptcha(HttpServletResponse response) throws Exception {
    AbstractCaptcha captcha = CaptchaUtil.createLineCaptcha(200, 100);
    ServletOutputStream outputStream = response.getOutputStream();
    captcha.setGenerator(new RandomGenerator("0123456789", 4)); // [!code focus]
    captcha.write(outputStream);
    System.out.println(captcha.getCode());
    outputStream.close();
}
```
* 四则运算方式
```java
@RequestMapping("/getCaptcha")
public void getCaptcha(HttpServletResponse response) throws Exception {
    AbstractCaptcha captcha = CaptchaUtil.createLineCaptcha(200, 100);
    ServletOutputStream outputStream = response.getOutputStream();
    captcha.setGenerator(new MathGenerator()); // [!code focus]
    captcha.write(outputStream);
    System.out.println(captcha.getCode());
    outputStream.close();
}
```

如果我们想要自定义验证码，可以自己去实现 CodeGenerator 接口，并实现里面的方法
```java
public interface CodeGenerator extends Serializable{

    /**
     * 生成验证码
     */
	String generate();

    /**
     * 验证验证码
     */
	boolean verify(String code, String userInputCode);
}
```

## 集群、微服务环境下如何使用验证码
在用户请求登录页面时，异步请求获取验证码后，后端需要将验证码缓存到 redis 中（其他缓存也行），KEY 为 UUID，VALUE 为验证码。

我们将 KEY 与验证码的图片发给前端，用户在页面输入账号密码验证码后，将（账号、密码、验证码 KEY、验证码）发给后端，后端通过验证码 KEY 找到缓存中的 VALUE，并用该值去对比用户输入即可。

## 总结
很感谢 Hutool 给我们封装的验证码，如果我们下次再做验证码的功能时，不妨去试着使用一下。