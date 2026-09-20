/**
 * Watch-only landing pages.
 *
 * This component deliberately owns no business state. The phone/watch page
 * supplies a small snapshot and callbacks, while AppModel and
 * WearableSyncService remain in the ability layer. That keeps the wearable UI
 * independent from the phone's tabs and makes the data boundary explicit.
 */
import { WearableReminderView } from './WearableReminderView';

@Component
export struct WearableHomeView {
  @Prop locale: string = 'zh';
  @Prop wearableTab: number = 1;
  @Prop primaryColor: string = '#087F73';
  @Prop onPrimaryColor: string = '#FFFFFF';
  @Prop pageBackground: string = '#F7F9F8';
  @Prop pageBorder: string = '#D7E3E0';
  @Prop accentColor: string = '#E8F6F2';
  @Prop textColor: string = '#17312D';
  @Prop mutedColor: string = '#617571';
  @Prop completedSets: number = 0;
  @Prop targetSets: number = 3;
  @Prop completedRepetitions: number = 0;
  @Prop targetRepetitions: number = 10;
  @Prop remindersEnabled: boolean = false;
  @Prop reminderTimes: Array<string> = [];
  @Prop maxReminderCount: number = 3;
  @State revealOpacity: number = 0;
  // The first frame starts slightly smaller, then continues with a gentle
  // breathing pulse while the start page is visible.
  @State revealScale: number = 0.96;

  onStart: () => void = () => {};
  onChangeTab: (index: number) => void = (_index: number) => {};
  onToggleReminders: () => void = () => {};
  onEditReminder: (index: number) => void = (_index: number) => {};
  onSetReminder: (index: number, value: string) => void = (_index: number, _value: string) => {};
  onAddReminder: () => void = () => {};
  onRemoveReminder: (index: number) => void = (_index: number) => {};

  aboutToAppear(): void {
    // Own the first-frame animation inside the wearable component. A parent
    // page can be created before the watch surface is attached, which made a
    // parent-driven opacity change appear to be skipped on the emulator.
    this.revealOpacity = 0;
    this.revealScale = 0.96;
    setTimeout(() => {
      this.revealOpacity = 1;
      this.revealScale = 1;
    }, 90);
  }

  @Builder
  private summaryPage() {
    Column({ space: 9 }) {
      Text(this.locale === 'en' ? 'Today' : '今日辅助')
        .fontSize(16).fontWeight(FontWeight.Bold).fontColor(this.textColor);
      Text(this.locale === 'en' ? 'Progress from the phone plan' : '来自手机端计划的训练进度')
        .fontSize(9).fontColor(this.mutedColor);
      Row({ space: 20 }) {
        Column({ space: 2 }) {
          Text(`${this.completedSets} / ${this.targetSets}`)
            .fontSize(26).fontWeight(FontWeight.Bold).fontColor(this.primaryColor);
          Text(this.locale === 'en' ? 'sets' : '组').fontSize(10).fontColor(this.mutedColor);
        }
        Column({ space: 2 }) {
          Text(`${this.completedRepetitions}`)
            .fontSize(26).fontWeight(FontWeight.Bold).fontColor(this.primaryColor);
          Text(this.locale === 'en' ? 'reps' : '次').fontSize(10).fontColor(this.mutedColor);
        }
      }.justifyContent(FlexAlign.Center);
      Column({ space: 5 }) {
        Text(this.locale === 'en' ? 'Keep the front and back passages moving together.' : '会阴前后方一起向内、向上提。')
          .fontSize(10).fontColor(this.textColor).textAlign(TextAlign.Center);
        Text(this.locale === 'en' ? 'Keep your belly, thighs and glutes relaxed.' : '腹部、大腿和臀部保持放松。')
          .fontSize(10).fontColor(this.textColor).textAlign(TextAlign.Center);
        Text(this.locale === 'en' ? 'Breathe normally · never hold your breath.' : '保持自然呼吸 · 不要憋气。')
          .fontSize(10).fontColor(this.textColor).textAlign(TextAlign.Center);
      }.width('92%').padding(10).backgroundColor(this.accentColor).borderRadius(16);
      Text(this.locale === 'en' ? 'Swipe right to start' : '右滑回到开始')
        .fontSize(9).fontColor(this.mutedColor);
    }
      .width('100%').layoutWeight(1).justifyContent(FlexAlign.Center)
      .padding({ left: 14, right: 14, top: 8, bottom: 8 });
  }

  @Builder
  private startPage() {
    Stack({ alignContent: Alignment.Center }) {
      // Keep the reveal fade separate from the repeating pulse. This avoids
      // fading the button out on every loop while still giving the start
      // affordance a visible, low-amplitude breathing animation.
      Stack({ alignContent: Alignment.Center }) {
        Button(this.locale === 'en' ? 'Start' : '开始', { type: ButtonType.Circle })
          .width('100%').height('100%').fontSize(28).fontWeight(FontWeight.Bold)
          .fontColor(this.onPrimaryColor).backgroundColor(this.primaryColor)
          .stateEffect(true)
          .scale({ x: this.revealScale, y: this.revealScale })
          .animation({ duration: 1400, curve: Curve.EaseInOut,
            iterations: -1, playMode: PlayMode.Alternate })
          .onClick(() => this.onStart());
      }
        .width('100%').height('100%').opacity(this.revealOpacity)
        .animation({ duration: 420, curve: Curve.EaseOut });
      // Narrow edge hit targets keep the centre button fully tappable.
      Text('‹')
        .width(44).height(56).fontSize(38).fontColor(this.primaryColor)
        .textAlign(TextAlign.Center)
        .position({ x: '2%', y: '42%' })
        .onClick(() => this.onChangeTab(0));
      Text('›')
        .width(44).height(56).fontSize(38).fontColor(this.primaryColor)
        .textAlign(TextAlign.Center)
        .position({ x: '86%', y: '42%' })
        .onClick(() => this.onChangeTab(2));
    }.width('100%').height('100%');
  }

  @Builder
  private reminderPage() {
    WearableReminderView({
      locale: this.locale,
      primaryColor: this.primaryColor,
      onPrimaryColor: this.onPrimaryColor,
      pageBackground: this.pageBackground,
      pageBorder: this.pageBorder,
      accentColor: this.accentColor,
      textColor: this.textColor,
      mutedColor: this.mutedColor,
      remindersEnabled: this.remindersEnabled,
      reminderTimes: this.reminderTimes,
      maxReminderCount: this.maxReminderCount,
      onToggleReminders: () => this.onToggleReminders(),
      onSetReminder: (index: number, value: string) => this.onSetReminder(index, value),
      onAddReminder: () => this.onAddReminder(),
      onRemoveReminder: (index: number) => this.onRemoveReminder(index)
    });
  }

  build() {
    Column() {
      Swiper() {
        Column() { this.summaryPage(); }.width('100%').height('100%');
        Column() { this.startPage(); }.width('100%').height('100%');
        Column() { this.reminderPage(); }.width('100%').height('100%');
      }
        .index(this.wearableTab).loop(false).indicator(false)
        .onChange((index: number) => this.onChangeTab(index))
        .layoutWeight(1).width('100%');
    }.width('100%').height('100%').backgroundColor(this.pageBackground);
  }
}
