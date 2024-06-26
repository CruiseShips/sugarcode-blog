import { defineConfig } from "vitepress";

import navRoute from "./route/navIndex";
import sidebarRoute from "./route/sidebarIndex";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "SugarCode Blog",
    description:
        "一门永不过时的编程语言——Java 。Java 编程语言占比：据官方数据统计，在全球编程语言工程师的数量上，Java 编程语言以 1000 万的程序员数量位居首位。而且很多软件的开发都离不开 Java 编程，因此其程序员的数量最多。而在以 Java 编程为核心的开发领域中，Java 程序员的需求量 10 年来一直居于首位！ 关注我，带你走进 Java 的世界！",
    // https://vitepress.dev/reference/default-theme-config
    themeConfig: {
        logo: "/images/system/logo.jpg",

        nav: navRoute,

        socialLinks: [
            { icon: "github", link: "https://github.com/vuejs/vitepress" },
        ],

        sidebar: sidebarRoute,

        outline: {
            label: "当前页导航",
            level: [1, 6],
        },

        docFooter: {
            prev: "上一页",
            next: "下一页",
        },

        footer: {
            copyright: "Copyright © 2024 suagecode.cn 版权所有",
        },

        search: {
            provider: "local",
        },
    },
});

// SEO https://blog.csdn.net/qq_41340258/article/details/136244607
