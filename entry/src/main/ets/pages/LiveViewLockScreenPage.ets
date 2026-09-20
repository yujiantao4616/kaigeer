@Entry
@Component
struct LiveViewLockScreenPage {
  private storage: LocalStorage | undefined = this.getUIContext().getSharedLocalStorage();
  @State phase: string = this.storage?.get<string>('phase') ?? '训练进行中';
  @State progress: string = this.storage?.get<string>('progress') ?? '训练进度';
  @State remaining: string = this.storage?.get<string>('remaining') ?? '';
  @State hint: string = this.storage?.get<string>('hint') ?? '保持自然呼吸 · 腹部和臀部放松';

  build() {
    Stack({ alignContent: Alignment.Center }) {
      Column({ space: 18 }) {
        Text('凯格尔训练')
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFFFF');
        Text(this.phase)
          .fontSize(46)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFFFF');
        Text(this.progress)
          .fontSize(18)
          .fontColor('#D9FFFFFF');
        if (this.remaining.length > 0) {
          Text(`${this.remaining} 秒`)
            .fontSize(16)
            .fontColor('#D9FFFFFF');
        }
        Text(this.hint)
          .fontSize(14)
          .fontColor('#B3FFFFFF');
      }
      .alignItems(HorizontalAlign.Center)
      .padding({ left: 28, right: 28, top: 36, bottom: 36 })
      .backgroundColor('#E6087F73')
      .borderRadius(28)
      .width('86%');
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#E6081715');
  }
}
