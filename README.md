# 凯格尔训练 · HarmonyOS NEXT

手机竖屏训练应用原型，使用 ArkTS/ArkUI 构建，面向 DevEco Studio 6.1.1 / API 24。

功能：

- 默认 5 秒收紧 / 5 秒放松、10 次/组、每天 3 组；训练引导以椅子坐姿为主，提示会阴前后方一起向内、向上提起；
- 训练参数定制、视觉倒计时、暂停/继续；
- 中文、English 界面与独立语音语言选择；
- Material Design 3 风格的动态主题色（青绿色、蓝色、紫色、橙色、玫瑰、绿色预设），设置页另有可拖动的连续取色器（色彩区域 + 色相条）；调色盘与独立的暗色模式开关分离，明暗色阶和选择会持久化，并同步应用到按钮、卡片、进度条、训练环等页面组件；
- 设置页内可展开“训练介绍”，说明盆底肌、动作节奏、呼吸与安全提示；
- 训练页呼吸环 SVG/矢量装饰、倒计时脉冲与页面淡入上滑转场，按钮启用系统按压反馈；
- 底部主 Tab 使用统一的 Material 风格线性 SVG 图标（首页、计划、日历、介绍、设置），并根据选中状态和主题色动态着色；
- Preferences 本地训练记录、月历打卡；
- 系统代理提醒（最多 3 个每日时间）；设置页点击时间即可通过 24 小时制时间选择器编辑。该能力依赖 AGC 中为当前应用开通并审批“应用代理提醒 / Proxy Reminder”权益，同时需要用户允许系统通知；未获批时系统会返回 1700002，应用会保持 OFF 并显示原因，不会静默保存一个无效开关。
- 训练进行中申请 `audioPlayback` 长时任务，退到后台后保持训练计时与语音；页面生命周期不会在后台主动停止活动训练，重新回到前台时会按持久化时间戳恢复进度；支持 HarmonyOS Live View 实况窗/实况胶囊，点击系统入口可回到训练页，锁屏显示训练图标与倒计时；未开通实况窗权益时自动降级为可点击的持续通知。

语音说明：第 1 组播放完整的姿势、呼吸和动作教学；第 2 组起改用中英单词级短提示，避免重复长播报，3-2-1 倒计时仍保持简短。英文训练提示及倒计时已生成 MP3 并放入 `entry/src/main/resources/rawfile/voice/`，运行时通过 AVPlayer 优先播放，失败后回退 HarmonyOS TTS；后续组的短提示会直接使用 TTS，不复用较长的教学录音。原型音频来自 Google Translate TTS，上架前请确认再分发授权并按需替换。

构建：

```bash
/Applications/DevEco-Studio.app/Contents/tools/ohpm/bin/ohpm install
DEVECO_SDK_HOME=/Applications/DevEco-Studio.app/Contents/sdk \
  /Applications/DevEco-Studio.app/Contents/tools/hvigor/bin/hvigorw \
  --mode module -p module=entry@default assembleHap
```

签名产物：`entry/build/default/outputs/default/entry-default-signed.hap`（可直接安装）

Unsigned 产物：`entry/build/default/outputs/default/entry-default-unsigned.hap`

图标：`AppScope/resources/base/media/app_icon.png` 使用抽象的骨盆底/臀肌对称线条与呼吸弧线设计，深青绿色背景搭配薄荷绿、珊瑚色线条；原 Google Material Design Icons 参考资源与许可证仍保存在 entry/src/main/resources/rawfile/third_party/material_design_icons/。

上架前仍需补齐 AGC 签名、隐私政策、语音音频授权证明、应用截图与 CloudTest 验证。

提醒能力开通：在 AppGallery Connect 项目设置 → 开放能力中申请“应用代理提醒（Proxy Reminder）”，审批通过后重新生成 profile 并使用包含该能力的签名配置构建；安装到设备后在应用设置中允许通知，再打开每日提醒开关。模拟器/普通未审批应用的提醒配额可能为 0。
# kaigeer
