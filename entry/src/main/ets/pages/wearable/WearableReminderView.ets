/**
 * Reminder settings designed for the compact wearable surface.
 *
 * This is intentionally not a miniature copy of the phone settings page:
 * one reminder is focused at a time, horizontal arrows switch reminders,
 * and the time is nudged with large, touch-friendly controls instead of a
 * scrolling list or a phone-style time picker dialog.
 */
@Component
export struct WearableReminderView {
  @Prop locale: string = 'zh';
  @Prop primaryColor: string = '#087F73';
  @Prop onPrimaryColor: string = '#FFFFFF';
  @Prop pageBackground: string = '#F7F9F8';
  @Prop pageBorder: string = '#D7E3E0';
  @Prop accentColor: string = '#E8F6F2';
  @Prop textColor: string = '#17312D';
  @Prop mutedColor: string = '#617571';
  @Prop remindersEnabled: boolean = false;
  @Prop reminderTimes: Array<string> = [];
  @Prop maxReminderCount: number = 3;

  @State selectedIndex: number = 0;
  @State selectedTime: string = '';
  @State revealOpacity: number = 0;
  @State revealScale: number = 0.96;

  onToggleReminders: () => void = () => {};
  onSetReminder: (index: number, value: string) => void = (_index: number, _value: string) => {};
  onAddReminder: () => void = () => {};
  onRemoveReminder: (index: number) => void = (_index: number) => {};

  aboutToAppear(): void {
    this.selectedIndex = 0;
    this.selectedTime = this.reminderTimes.length > 0 ? this.reminderTimes[0] : '';
    this.revealOpacity = 0;
    this.revealScale = 0.96;
    setTimeout(() => {
      this.revealOpacity = 1;
      this.revealScale = 1;
    }, 80);
  }

  private currentIndex(): number {
    if (this.reminderTimes.length === 0) {
      return 0;
    }
    if (this.selectedTime !== '') {
      const matchingIndex: number = this.reminderTimes.indexOf(this.selectedTime);
      if (matchingIndex >= 0) {
        return matchingIndex;
      }
    }
    return Math.min(this.selectedIndex, this.reminderTimes.length - 1);
  }

  private currentTime(): string {
    const index: number = this.currentIndex();
    return index >= 0 && index < this.reminderTimes.length ? this.reminderTimes[index] : '--:--';
  }

  private selectReminder(offset: number): void {
    if (this.reminderTimes.length === 0) {
      return;
    }
    const length: number = this.reminderTimes.length;
    const nextIndex: number = (this.currentIndex() + offset + length) % length;
    this.selectedIndex = nextIndex;
    this.selectedTime = this.reminderTimes[nextIndex];
  }

  private shiftTime(value: string, deltaMinutes: number): string {
    const parts: Array<string> = value.split(':');
    let minutes: number = Number(parts[0]) * 60 + Number(parts[1]) + deltaMinutes;
    while (minutes < 0) {
      minutes += 24 * 60;
    }
    minutes = minutes % (24 * 60);
    const hour: number = Math.floor(minutes / 60);
    const minute: number = minutes % 60;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  private adjustTime(deltaMinutes: number): void {
    if (this.reminderTimes.length === 0) {
      return;
    }
    const index: number = this.currentIndex();
    const nextTime: string = this.shiftTime(this.currentTime(), deltaMinutes);
    for (let itemIndex: number = 0; itemIndex < this.reminderTimes.length; itemIndex++) {
      if (itemIndex !== index && this.reminderTimes[itemIndex] === nextTime) {
        return;
      }
    }
    this.selectedIndex = index;
    this.selectedTime = nextTime;
    this.onSetReminder(index, nextTime);
  }

  private removeCurrent(): void {
    if (this.reminderTimes.length <= 1) {
      return;
    }
    const index: number = this.currentIndex();
    const nextIndex: number = index < this.reminderTimes.length - 1 ? index + 1 : index - 1;
    this.selectedIndex = nextIndex;
    this.selectedTime = this.reminderTimes[nextIndex];
    this.onRemoveReminder(index);
  }

  @Builder
  private reminderToggle() {
    Button(this.remindersEnabled ? 'ON' : 'OFF', { type: ButtonType.Capsule })
      .width(48).height(26).fontSize(10)
      .fontColor(this.remindersEnabled ? this.onPrimaryColor : this.mutedColor)
      .backgroundColor(this.remindersEnabled ? this.primaryColor : this.pageBorder)
      .onClick(() => this.onToggleReminders());
  }

  @Builder
  private adjustButton(label: string, deltaMinutes: number) {
    Button(label, { type: ButtonType.Capsule })
      .width(78).height(32).fontSize(11)
      .fontColor(this.textColor).backgroundColor(this.accentColor)
      .onClick(() => this.adjustTime(deltaMinutes));
  }

  build() {
    Column({ space: 6 }) {
      Row() {
        Text(this.locale === 'en' ? 'Reminders' : '训练提醒')
          .fontSize(16).fontWeight(FontWeight.Bold).fontColor(this.textColor)
          .layoutWeight(1);
        this.reminderToggle();
      }.width('100%');

      Text(this.locale === 'en' ? 'One reminder at a time' : '一次只调整一个提醒')
        .fontSize(9).fontColor(this.mutedColor);

      Stack({ alignContent: Alignment.Center }) {
        Circle().width(190).height(190).fill(this.accentColor);
        Column({ space: 2 }) {
          Text(this.currentTime()).fontSize(42).fontWeight(FontWeight.Bold).fontColor(this.primaryColor);
          Text(this.reminderTimes.length > 0
            ? `${this.currentIndex() + 1} / ${this.reminderTimes.length}`
            : '0 / 0').fontSize(11).fontColor(this.mutedColor);
          Text(this.locale === 'en' ? 'daily' : '每天').fontSize(10).fontColor(this.mutedColor);
        }
      }
        .width('100%').height(194)
        .opacity(this.revealOpacity).scale({ x: this.revealScale, y: this.revealScale })
        .animation({ duration: 380, curve: Curve.EaseOut });

      Row({ space: 26 }) {
        Text('‹').width(42).height(36).fontSize(34).fontColor(this.primaryColor)
          .textAlign(TextAlign.Center).onClick(() => this.selectReminder(-1));
        Text(this.locale === 'en' ? 'Switch reminder' : '切换提醒')
          .fontSize(10).fontColor(this.mutedColor);
        Text('›').width(42).height(36).fontSize(34).fontColor(this.primaryColor)
          .textAlign(TextAlign.Center).onClick(() => this.selectReminder(1));
      }.justifyContent(FlexAlign.Center).width('100%');

      Row({ space: 8 }) {
        this.adjustButton(this.locale === 'en' ? '−15 min' : '−15 分', -15);
        this.adjustButton(this.locale === 'en' ? '+15 min' : '+15 分', 15);
      }.justifyContent(FlexAlign.Center).width('100%');
      Row({ space: 8 }) {
        this.adjustButton(this.locale === 'en' ? '−1 min' : '−1 分', -1);
        this.adjustButton(this.locale === 'en' ? '+1 min' : '+1 分', 1);
      }.justifyContent(FlexAlign.Center).width('100%');

      Row({ space: 8 }) {
        if (this.reminderTimes.length > 1) {
          Button(this.locale === 'en' ? 'Remove' : '删除当前', { type: ButtonType.Capsule })
            .width(92).height(30).fontSize(10)
            .fontColor(this.primaryColor).backgroundColor(this.pageBackground)
            .border({ width: 1, color: this.pageBorder })
            .onClick(() => this.removeCurrent());
        }
        if (this.reminderTimes.length < this.maxReminderCount) {
          Button(this.locale === 'en' ? '+ Add' : '+ 添加', { type: ButtonType.Capsule })
            .width(92).height(30).fontSize(10)
            .fontColor(this.onPrimaryColor).backgroundColor(this.primaryColor)
            .onClick(() => this.onAddReminder());
        }
      }.justifyContent(FlexAlign.Center).width('100%');

      Text(this.locale === 'en'
        ? 'Use the large controls to adjust time. Swipe left to return.'
        : '用大按钮调整时间；向左滑返回开始')
        .fontSize(8).fontColor(this.mutedColor).maxLines(2).textAlign(TextAlign.Center)
        .width('94%');
    }
      .width('100%').height('100%').padding({ left: 10, right: 10, top: 8, bottom: 8 })
      .backgroundColor(this.pageBackground);
  }
}
