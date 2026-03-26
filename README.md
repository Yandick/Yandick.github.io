# GitHub 个人主页

这是一个基于 [Astro](https://astro.build/) 的 GitHub 个人主页项目。

## 模板来源

本项目模板参考自 [Axi-Theme](https://github.com/Axi404/Axi-Theme?tab=readme-ov-file#)。

## 上线前建议优先修改

- `src/site.config.ts`
  修改站点标题、作者名、描述、GitHub 用户名、邮箱、域名等全局信息。
- `src/pages/index.astro`
  修改首页自我介绍、教育经历等默认占位内容。
- `src/pages/about/index.astro`
  修改个人简介、镜像站、版权说明、主题说明等模板文案。
- `src/pages/projects/index.astro`
  替换默认项目、赞助二维码和赞助者示例数据。
- `src/pages/academic/index.astro`
  如果你不做学术主页，建议删除或隐藏；如果保留，需要替换全部示例内容。
- `src/content/blogs/*` 与 `src/content/collection/docs.md`
  当前仍是模板说明文档和示例文章，建议删除或改成你自己的内容。
- `public/avatar/*`、`public/favicon/*`、`public/images/social-card.webp`、`public/cv.pdf`
  替换成你自己的头像、图标、社交分享图和简历文件。

## 备注

这个模板目前更接近“主题演示站”，不是直接可上线的个人主页。正式部署到 GitHub Pages 前，建议先把默认作者信息、示例文章和占位页面清理干净。
