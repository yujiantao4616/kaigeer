import { CircleShape } from '@kit.ArkUI';

/**
 * Reminder settings designed for the compact wearable surface.
 *
 * This is intentionally not a miniature copy of the phone settings page:
 * each saved reminder is shown as a compact list row, and tapping a row
 * opens a watch-only hour/minute picker layer.
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

  @State editingIndex: number = -1;
  @State pickerTime: Date = new Date();
  @State reminderScrollOffset: number = 0;
  private reminderScroller: Scroller = new Scroller();

  onToggleReminders: () => void = () => {};
  onSetReminder: (index: number, value: string) => void = (_index: number, _value: string) => {};
  onAddReminder: (onCreated: (index: number, value: string) => void) => void = (_onCreated: (index: number, value: string) => void) => {};
  onRemoveReminder: (index: number) => void = (_index: number) => {};

  aboutToAppear(): void {
    this.reminderScrollOffset = 0;
    setTimeout((): void => {
      this.reminderScroller.scrollTo({ xOffset: 0, yOffset: 0 });
    }, 0);
  }

  private openPicker(index: number, initialTime?: string): void {
    if (index < 0 || index >= this.reminderTimes.length) {
      return;
    }
    const value: string = initialTime === undefined ? this.reminderTimes[index] : initialTime;
    const parts: Array<string> = value.split(':');
    const next: Date = new Date();
    next.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
    this.pickerTime = next;
    this.editingIndex = index;
  }

  private pickerValue(): string {
    return `${String(this.pickerTime.getHours()).padStart(2, '0')}:${String(this.pickerTime.getMinutes()).padStart(2, '0')}`;
  }

  private closePicker(save: boolean): void {
    if (save && this.editingIndex >= 0) {
      this.onSetReminder(this.editingIndex, this.pickerValue());
    }
    this.editingIndex = -1;
  }

  private handleAddReminder(): void {
    this.onAddReminder((index: number, value: string) => this.openPicker(index, value));
  }

  /**
   * Cards near the visual centre of the round screen are larger. The scale is
   * derived from the accumulated scroll delta, so the list feels like a
   * wearable carousel instead of a phone list squeezed into a circle.
   */
  private reminderCardScale(index: number): number {
    const rowHeight: number = this.reminderRowHeight();
    const itemCenter: number = rowHeight / 2 + index * (rowHeight + 6) - this.reminderScrollOffset;
    const distance: number = Math.abs(itemCenter - 105);
    return Math.max(0.92, Math.min(1.02, 1.02 - distance / 300));
  }

  /**
   * Use the available round-screen list area instead of leaving large phone
   * style gaps. With up to three alarms each row gets a watch-sized target.
   */
  private reminderRowHeight(): number {
    if (this.reminderTimes.length <= 1) {
      return 44;
    }
    if (this.reminderTimes.length === 2) {
      return 38;
    }
    return 32;
  }

  private updateReminderScroll(yOffset: number): void {
    // Scroll.onDidScroll reports the current offset, not a delta.
    this.reminderScrollOffset = Math.max(0, Math.min(112, yOffset));
  }

  build() {
    Stack({ alignContent: Alignment.Center }) {
      Column() {
        Scroll(this.reminderScroller) {
          Column({ space: 6 }) {
            ForEach(this.reminderTimes, (time: string, index: number) => {
              Row({ space: 6 }) {
                Button(time, { type: ButtonType.Capsule })
                  .layoutWeight(1).height('100%').fontSize(20)
                  .fontWeight(FontWeight.Bold).fontColor(this.primaryColor)
                  .backgroundColor(this.accentColor)
                  .onClick(() => this.openPicker(index));
                if (this.reminderTimes.length > 1) {
                  Button('×', { type: ButtonType.Circle })
                    .width('14%').height('100%').fontSize(18)
                    .fontWeight(FontWeight.Medium)
                    .fontColor(this.textColor).backgroundColor(this.pageBackground)
                    .border({ width: 1, color: this.pageBorder })
                    .onClick(() => this.onRemoveReminder(index));
                }
              }
                .width('88%').height(this.reminderRowHeight())
                .scale({ x: this.reminderCardScale(index), y: this.reminderCardScale(index) });
            }, (time: string) => time);
            if (this.reminderTimes.length < this.maxReminderCount) {
              Button('+', { type: ButtonType.Circle })
                .width(48).height(48).fontSize(28).fontWeight(FontWeight.Bold)
                .fontColor(this.onPrimaryColor).backgroundColor(this.primaryColor)
                .stateEffect(true)
                .onClick(() => this.handleAddReminder());
            }
          }
            .width('100%')
            .height('100%')
            .padding({ top: 12, bottom: 12 })
            .alignItems(HorizontalAlign.Center)
            .justifyContent(FlexAlign.Center);
        }
          .width('100%').height('100%')
          .scrollable(ScrollDirection.Vertical)
          .scrollBar(BarState.Off)
          .edgeEffect(EdgeEffect.None)
          .onDidScroll((_xOffset: number, yOffset: number, _state: ScrollState) => this.updateReminderScroll(yOffset));
      }
        .width('100%').height('100%')
        .alignItems(HorizontalAlign.Center)
        .backgroundColor(this.pageBackground);

      if (this.editingIndex >= 0) {
        Column({ space: 10 }) {
          TimePicker({ selected: this.pickerTime })
            .useMilitaryTime(true)
            // Keep the native wearable wheel, but override its default dark
            // surface so it belongs to the same light/teal watch theme as the
            // reminder list instead of appearing as a black rectangle.
            .disappearTextStyle({ color: this.mutedColor, font: { size: 22, weight: FontWeight.Medium } })
            .textStyle({ color: this.mutedColor, font: { size: 26, weight: FontWeight.Medium } })
            .selectedTextStyle({ color: this.primaryColor, font: { size: 32, weight: FontWeight.Bold } })
            .backgroundColor(this.accentColor)
            .borderRadius(28)
            .width('86%').height('62%')
            .onChange((value: TimePickerResult) => {
              const next: Date = new Date(this.pickerTime.getTime());
              next.setHours(value.hour, value.minute, 0, 0);
              this.pickerTime = next;
            });
          Row({ space: 8 }) {
            Button('取消', { type: ButtonType.Capsule })
              .layoutWeight(1).height('100%').fontSize(12)
              .fontColor(this.primaryColor).backgroundColor(this.pageBackground)
              .border({ width: 1, color: this.pageBorder })
              .onClick(() => this.closePicker(false));
            Button('确定', { type: ButtonType.Capsule })
              .layoutWeight(1).height('100%').fontSize(12)
              .fontColor(this.onPrimaryColor).backgroundColor(this.primaryColor)
              .onClick(() => this.closePicker(true));
          }.width('78%').height('14%');
        }
          .width('100%').height('100%')
          .alignItems(HorizontalAlign.Center)
          .justifyContent(FlexAlign.Center)
          .backgroundColor(this.pageBackground)
          .zIndex(20);
      }
    }
      .width('100%').height('100%')
      .backgroundColor(this.pageBackground)
      .clipShape(new CircleShape({ width: '100%', height: '100%' }));
  }
}
