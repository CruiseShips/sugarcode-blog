# MySQL 索引设计原则

## 什么情况下适合使用索引

### 字段或字段组合存在唯一性
索引中有一种索引叫做：`主键索引`，这种索引是根据我们表的主键去创建的索引。

一个表中可以存在一个主键或者是多主键，也就是说通过 `主键` 我们可以找到唯一的值，像这样的字段去做索引是非常好的。

那除去这种 `主键` 字段，还有什么可以字段可以去做索引呢？

* 学生表 - 学号
* 人员档案表 - 手机号、证件号
* 订单表 - 订单编号

类似上面这些字段，我们可以创建 `唯一性索引`，一样可以加速我们的查找，提升性能。

### 具有关联性的字段
我们在写 SQL 语句的时候，经常会在 `WHERE` 或者 `关联查询` 中使用某些字段当做筛选条件或者是关联条件去做查询。

类似这样的字段我们可以去通过创建索引去提高查找速度。

:::tip 拓展
* 如果进行 `UPDATE` 操作的时候，要更新的字段是非索引字段，提升的效率会更明显，这是因为非索引字段更新不需要对索引进行维护。
* `UPDATE` 时，`WHERE` 条件中的过滤条件列，如果使用到了索引，锁行；无法用索引，锁表。按照索引规则，如果能使用索引，锁行，不能使用索引，锁表。
:::

### 经常使用 GROUP BY 或者 ORDER BY 的列
索引就是让数据按照某种顺序进行存储或检索，因此当我们使用 `GROUP BY` 对数据进行分组查询，或者使用 `ORDER BY` 对数据进行排序的时候，就需要对分组或者排序的字段进行索引 。如果待排序的列有多
个，那么可以在这些列上建立组合索引 。

### DISTINCT 字段
有的时候，我们也会用到 `DISTINCT` 进行去重，我们也可以对这些字段进行创建索引。

原理就是索引会对数据按照某种顺序进行排序，所以在去重的时候也会快很多。

:::warning 注意
一般情况下，我们很少会对 `DISTINCT` 的字段进行创建索引~，所以这里各位了解即可。
:::

### 数据范围小的列
我们在创建表的时候，可以有多种数据类型去修饰我们的列类型，好比：`INT`、`VARCHAR`、`DATE`、`DECIMAL` 等等，但是，在这其中还有一些比较 `大` 的数据类型，类似：`BIGINT`、`TINYBLOB`、`TEXT`。

这些比较 `大` 的数据类型，它们的占用空间太大了，如果创建了索引，索引也是非常大的，所以说，这些字段是不推荐被创建索引的。

:::tip
我们在设计表的时候，尽量去多考虑我们的数据结构，如果能使用 `小` 的数据类型，就尽量使用小的数据类型。

数据类型越 `小`，被创建出来的索引也就越小，而且我们在查找的时候，一个数据页就可以放下更多的记录，这对查找数据是绝对有利的！！！
:::

### 数据类型占有比大的
我们对于某一个字段是否要创建索引，其中一个很重要的参考点是：这个列的数据是否类型很多！

好比像学生表，我们要对性别这一列进行创建索引，但是我们可以思考一下，性别无非几种：男、女、未填写。

也就是说这一列数据只有三种数据类型，如果我们根据性别去查询数据，那么 `MySQL` 是大概率不会走索引，而是走全表查询。

而我们要是对学生学号、手机号、证件号这种字段去创建索引，这个相对性别这种字段会好的多得多。

:::info
联合索引中，尽量将“学号”、“手机号”、“证件号”放在索引的前面。
* 错误示例：CREATE INDEX I_INDEX_001 ON student(sex);
* 错误示例：CREATE INDEX I_INDEX_001 ON student(createDt, deleteFlag, studentNo);

* 正确示例：CREATE INDEX I_INDEX_001 ON student(studentNo, createDt);
:::

## 那些情况不适合使用索引

### WHERE 条件中用不到的字段
`WHERE` 后面跟的是筛选条件，如果说条件中不存在的字段，尽量不要去创建索引！

:::info
例如
```sql
SELECT id, no, name, age, birthday FROM student WHERE no = 1;
```
我们现在要去创建索引，则只需要对 `no` 字段创建索引即可，可以不需要对其他列进行创建。
:::

:::tip 拓展
但是！！！

要知道，索引除去它本身的作用，它也是可以提供一定量的数据。

有的时候我们经常将 SELECT 的列同 WHERE 中筛选条件的列一同创建联合索引，而 SELECT 的列之所以也一起创建到索引中，目的就是为了不读表，直接从索引中拿到数据。
:::

### 数据量少的表
当你的表中全量数据很少的时候，这里是不建议去创建索引，直接全表查即可。

:::tip 拓展
但如果说表中数量少，但是经常使用的，例如 ORG 表，建议还是增加索引，毕竟直接从索引查询数据的速度远远比从磁盘扫描更快。
:::

### 数据类型占有比小的
和上面占有比大的相对，就好比性别这种列，完全没有必要去为它单独创建索引。

## 创建索引的注意点

### 索引不要创建太多
索引本身也是需要占用一定量的空间，所以尽可能的不要创建太多的索引，最好是可以让程序运行一段时间，然后归纳整理好需要的列，然后统一创建索引。

### 尽量使用联合索引（多列索引）
使用联合索引可以让我们在查询的时候优化器更好的规划我们SQL的执行，毕竟这会关系到我们 SQL 执行的速度。

### 战略性索引
当我们表的数据量有很多，或者是经常被修改（添加、修改、删除）的表，尽量规划好索引，然后去创建，因为每次的修改操作，也会同步修改索引。

### 不要定义重复索引
我们在创建索引前，一定要去看我们的表中是否有类似的索引，如果有，就不要再去创建了。

## 总结
索引是一个双刃剑，用的好了，可以说是如虎添翼，用的不好，直接雪上加霜。

以上的所有文档是给你参考用的，实战中要灵活使用，不要太拘谨，程序是自由的。