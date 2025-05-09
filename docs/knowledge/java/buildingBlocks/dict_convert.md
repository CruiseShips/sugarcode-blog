# Dict Convert

## 前言

日常企业开发时，我们会碰到字典值转换的问题，一般情况下我们有两种方式进行转换。

* 编写 SQL 时，关联字典表进行查询
* SQL 执行后，拿到结果进行循环，从缓存中进行查找赋值

方式一会让我们的SQL变的臃肿，而且会增加数据库的负担，但是会避免我们在 JAVA 中进行循环赋值。

方式二在 JAVA 代码中循环，会让我们的查询效率变低，但是数据库负担会减少。

两种方式各有各的优缺点，我们本篇使用的是第二种方式给大家带来一种使用注解的解决方式。

## 字典表

为了方便大家学习，字典表中的字段有删改，保留了核心字段。

| dict_id | dict_label | dict_value | dict_type |
| 1 | 女 | 0 | sys_user_sex |
| 2 | 男 | 1 | sys_user_sex |
| 3 | 未知 | 2 | sys_user_sex |

## 创建注解
这里我们创建一个注解，用于标记那些字段是需要被做字典转换的
```java
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Translation {

	String dictType();
	
	String suffix() default "Name";
}
```

dictType 为我们字典表中的 dict_type 字段，我们到时候需要根据该字段获取到缓存数据；

suffix 是我们查询到对应的字段值后，给对应字段 + Name 的字段赋值时用，后缀可以自己改变。

## 创建实体
```java
public class Pojo {

	private String id;
	
	@Translation(dictType = "status")
	private String status;
	private String statusName;
	
	public Pojo() {
		super();
	}
	public Pojo(String id, String status) {
		super();
		this.id = id;
		this.status = status;
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getStatusName() {
		return statusName;
	}
	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}
	
	@Override
	public String toString() {
		return "Pojo [id=" + id + ", status=" + status + ", statusName=" + statusName + "]";
	}
}
```

我们这里给 `status` 字段增加了 `@Translation` 注解，后期成功解析后，值会自动给 `statusName` 赋值。

## 模拟缓存
这里我没有连接数据库，使用了模拟缓存
```java
public class DictContants {

	public static Map<String, String> statusMaps = new HashMap<>();
	
	static {
		statusMaps.put("a", "正常");
		statusMaps.put("b", "异常");
	}
}
```
map 中的 key 是 id，value 是对应的字典值。

## 工具类
我们接下来需要做一个工具类，用于字典解析。
```java
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.sugarcode.annotation.Translation;
import com.sugarcode.contants.DictContants;

import cn.hutool.core.map.MapUtil;

public class TranslationDictUtil {

	public static <T> void convert(List<T> list) {
	    if (CollectionUtils.isEmpty(list)) {
	        return;
	    }
	    // 循环遍历数据
	    for (T t : list) {
	        Class<?> tClass = t.getClass();
            // 拿到所有 class 中所有的属性
	        List<Field> fields = new ArrayList<>();
	        fields.addAll(Arrays.asList(tClass.getDeclaredFields()));
            // 循环属性
	        for (Field field : fields) {
	            Translation trans = field.getAnnotation(Translation.class);
	            if (null == trans) {
	                continue;
	            }
	            // 字典翻译
	            setVal(t, field, trans);
	        }
	    }
	}
	
	private static <T> void setVal(T t, Field field, Translation trans) {
        try {
        	Class<?> clazz = t.getClass();
        	
            PropertyDescriptor sourceProperty = BeanUtils.getPropertyDescriptor(clazz, field.getName());
            Object value = sourceProperty.getReadMethod().invoke(t);
            if (null == value) {
                return;
            }
            
            // 这里原本是需要通过 trans.dictType() 去缓存中查询
            Map<String, String> dictMap = DictContants.statusMaps;
            if (MapUtil.isEmpty(dictMap)) {
                return;
            }
            
            // 获取到值，直接赋值给 原字段+Name 后缀的属性
            String val = dictMap.get(String.valueOf(value));
            PropertyDescriptor targetProperty = BeanUtils.getPropertyDescriptor(clazz, field.getName() + trans.suffix());
            if (StringUtils.hasLength(val) && null != targetProperty) {
                targetProperty.getWriteMethod().invoke(t, val);
            }
        } catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException | SecurityException e) {
            System.out.println(e);
        }
    }
}
```

具体可以看代码中的注解。

## 测试
```java
public static void main(String[] args) {
    List<Pojo> list = new ArrayList<>();
    list.add(new Pojo("1", "a"));
    list.add(new Pojo("2", "a"));
    list.add(new Pojo("3", "b"));
    list.add(new Pojo("4", "b"));
    
    TranslationDictUtil.convert(list);
    
    System.out.println(list);
}
```

输出：

```log
[Pojo [id=1, status=a, statusName=正常], Pojo [id=2, status=a, statusName=正常], Pojo [id=3, status=b, statusName=异常], Pojo [id=4, status=b, statusName=异常]]
```