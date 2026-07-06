import {
  siHtml5,
  siMarkdown,
  siOpenapiinitiative,
  siOpenjdk,
  siSpring,
  siSpringboot,
  siSqlite,
  siApachemaven,
  type SimpleIcon,
} from "simple-icons";

export interface ModuleItem {
  name: string;
  title: string;
  href: string;
  count?: string;
  icon: SimpleIcon;
}

export const modules: ModuleItem[] = [
  {
    name: "guide",
    title: "Guide",
    href: "/guide/start/introduction",
    count: "8 topics",
    icon: siMarkdown,
  },
  {
    name: "Springboot",
    title: "Spring Boot",
    href: "/Springboot/入门/1.QuickStart",
    count: "34 notes",
    icon: siSpringboot,
  },
  {
    name: "JAVA",
    title: "Java",
    href: "/JAVA/1.JAVA运行",
    count: "70+ notes",
    icon: siOpenjdk,
  },
  {
    name: "web应用",
    title: "Web APP",
    href: "/web应用/文件上传/简单上传",
    count: "22 notes",
    icon: siHtml5,
  },
  {
    name: "api",
    title: "API",
    href: "/api/",
    count: "2 pages",
    icon: siOpenapiinitiative,
  },
  {
    name: "Spring",
    title: "Spring",
    href: "/Spring/QuickStart",
    count: "40+ notes",
    icon: siSpring,
  },
  {
    name: "数据库",
    title: "数据库",
    href: "/数据库/Query",
    icon: siSqlite,
  },
  {
    name: "Maven",
    title: "Maven",
    href: "/Maven/基础/1.安装与配置",
    icon: siApachemaven,
  },
  {
    name: "SpringMVC",
    title: "SpringMVC",
    href: "/SpringMVC/响应设计",
    icon: siSpring,
  },
  {
    name: "web",
    title: "Web",
    href: "/web/安全/CORS",
    icon: siSpring,
  },
];
