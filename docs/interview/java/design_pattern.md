# Java-设计模式（2）

## 1. 设计模式分为几类，分别是什么？🔟🍏
:::info 考点

Java 设计模式一共有 23 个，分为 3 大类。

<table>
    <thead>
        <th>模式分类</th>
        <th>设计模式名称</th>
        <th>是否必会</th>
    </thead>
    <tr>
        <td rowspan="5">创建型模式</td>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103840094" target=_blank>工厂方法模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103840407" target=_blank>抽象工厂模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/105190926" target=_blank>建造者模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103786893" target=_blank>原型模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103772844" target=_blank>单例模式</a></td>
        <td>是</td>
    </tr>
</table>


<table>
    <thead>
        <th>模式分类</th>
        <th>设计模式名称</th>
        <th>是否必会</th>
    </thead>
    <tr>
        <td rowspan="7">结构型模式</td>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103840094" target=_blank>适配器模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/106075815" target=_blank>桥接模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/106535520" target=_blank>装饰器模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/106559795" target=_blank>外观模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/106604773" target=_blank>享元模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/105574725" target=_blank>代理模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109319462" target=_blank>组合模式</a></td>
        <td>是</td>
    </tr>
</table>

<table>
    <thead>
        <th>模式分类</th>
        <th>设计模式名称</th>
        <th>是否必会</th>
    </thead>
    <tr>
        <td rowspan="11">行为型模式</td>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109335623" target=_blank>责任链模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109329323" target=_blank>命令模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109696919" target=_blank>解释器模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109667614" target=_blank>迭代器模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109657682" target=_blank>中介者模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109696413" target=_blank>备忘录模式</a></td>
        <td></td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109493397" target=_blank>观察者模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109492527" target=_blank>状态模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109328505" target=_blank>策略模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109327733" target=_blank>模板方法模式</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/109695711" target=_blank>访问者模式</a></td>
        <td>是</td>
    </tr>
</table>
:::

:::warning 注意
如果可以，尽量所有的设计模式都去学习，并且掌握他们！
:::

## 2. Java 有 7 大设计原则，请问是什么？🔟🍐
:::info 考点
<table>
    <thead>
        <th>模式分类</th>
        <th>设计模式名称</th>
        <th>是否必会</th>
    </thead>
    <tr>
        <td rowspan="7">结构型模式</td>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103756284" target=_blank>开闭原则</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103756611" target=_blank>里氏替换原则</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103764462" target=_blank>依赖倒置原则</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/103765164" target=_blank>单一职责原则</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/105190793" target=_blank>接口隔离原则</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/105190894" target=_blank>迪米特法则</a></td>
        <td>是</td>
    </tr>
    <tr>
        <td><a href="https://blog.csdn.net/weixin_45908370/article/details/105190908" target=_blank>合成复用原则</a></td>
        <td>是</td>
    </tr>
</table>
:::