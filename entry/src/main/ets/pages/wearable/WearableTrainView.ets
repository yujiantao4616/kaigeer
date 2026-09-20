import { TrainingPhase } from '../../model/AppModel';

/** Watch-only training surface. All state transitions are supplied by the
 * parent so the phone and wearable use the same training clock and records. */
@Component
export struct WearableTrainView {
  @Prop phase: TrainingPhase = 'ready';
  @Prop remaining: number = 0;
  @Prop repetition: number = 0;
  @Prop repetitions: number = 10;
  @Prop finishedSets: number = 0;
  @Prop setsPerDay: number = 3;
  @Prop paused: boolean = false;
  @Prop countdownScale: number = 1;
  @Prop breathingScale: number = 1;
  @Prop breathingOffsetX: number = 0;
  @Prop breathingOffsetY: number = 0;
  @Prop progressPercent: number = 0;
  @Prop phaseLabel: string = '';
  @Prop primaryColor: string = '#087F73';
  @Prop onPrimaryColor: string = '#FFFFFF';
  @Prop pageBackground: string = '#F7F9F8';
  @Prop accentColor: string = '#E8F6F2';
  @Prop textColor: string = '#17312D';
  @Prop mutedColor: string = '#617571';
  @Prop ringTrackColor: string = '#D7E3E0';
  @Prop completeLabel: string = 'Set complete';
  @Prop secondsLabel: string = 'sec';
  @Prop confirmStopLabel: string = 'End session';
  @Prop homeLabel: string = "Today's practice";
  @Prop startLabel: string = 'Start training';
  @Prop locale: string = 'zh';

  onTogglePause: () => void = () => {};
  onEnd: () => void = () => {};
  onCompleteAction: () => void = () => {};

  private primaryFilter(): ColorFilter {
    const hex: string = this.primaryColor.substring(1);
    const red: number = parseInt(hex.substring(0, 2), 16) / 255;
    const green: number = parseInt(hex.substring(2, 4), 16) / 255;
    const blue: number = parseInt(hex.substring(4, 6), 16) / 255;
    return new ColorFilter([
      0, 0, 0, 0, red,
      0, 0, 0, 0, green,
      0, 0, 0, 0, blue,
      0, 0, 0, 1, 0
    ]);
  }

  build() {
    Column() {
      Stack({ alignContent: Alignment.Center }) {
        Stack({ alignContent: Alignment.Center }) {
          Circle().width('98%').height('98%').fillOpacity(0).strokeWidth(2)
            .stroke(this.primaryColor).strokeOpacity(0.18);
          Progress({ value: this.progressPercent, total: 100, type: ProgressType.Ring })
            .width('94%').height('94%').color(this.primaryColor)
            .backgroundColor(this.ringTrackColor).style({ strokeWidth: 14 })
            .animation({ duration: 220, curve: Curve.EaseInOut });
          Circle().width('72%').height('72%').fill(this.accentColor);
          Column({ space: 2 }) {
            // Keep the paused state structurally identical to the active state:
            // only the countdown value/label becomes a play affordance.
            if (this.paused && this.phase !== 'complete') {
              Image($rawfile('icons/play.svg')).width(56).height(56)
                .objectFit(ImageFit.Contain).colorFilter(this.primaryFilter())
                .onClick(() => this.onTogglePause());
            } else {
              Text(this.phase === 'complete' ? '✓' : `${this.remaining}`)
                .fontSize(48).fontWeight(FontWeight.Bold).fontColor(this.textColor)
                .scale({ x: this.countdownScale, y: this.countdownScale });
              Text(this.phase === 'complete' ? this.completeLabel : this.secondsLabel)
                .fontSize(11).fontColor(this.mutedColor);
            }
            // The action cue remains visible while paused so the user knows
            // exactly what will resume next.
            Text(this.phaseLabel).fontSize(16).fontWeight(FontWeight.Medium)
              .fontColor(this.primaryColor);
            Text(`${this.repetition} / ${this.repetitions}`)
              .fontSize(12).fontColor(this.mutedColor);
          }
        }
          .width('100%').height('100%')
          .scale({ x: this.breathingScale, y: this.breathingScale })
          .offset({ x: this.breathingOffsetX, y: this.breathingOffsetY })
          .animation({ duration: 120, curve: Curve.EaseInOut })
          .gesture(TapGesture({ count: 1 }).onAction(() => {
            if (this.phase !== 'complete') {
              this.onTogglePause();
            }
          }));
        if (this.paused && this.phase !== 'complete') {
          // Keep the end action outside the animated content layer. This
          // preserves the capsule/irregular shape while the ring breathes.
          Button(this.confirmStopLabel, { type: ButtonType.Capsule })
            .width('82%').height(40).fontSize(12)
            .fontColor(this.onPrimaryColor).backgroundColor(this.primaryColor)
            // Anchor the action to the outer, non-animated Stack. It stays
            // flush with the bottom edge while the training ring breathes.
            .align(Alignment.Bottom)
            .zIndex(10)
            .onClick(() => this.onEnd());
        }
      }
        .layoutWeight(1).width('100%');
      if (this.phase === 'complete') {
        Button(this.finishedSets >= this.setsPerDay ? this.homeLabel : this.startLabel, { type: ButtonType.Capsule })
          .width('82%').height(40).fontSize(12)
          .fontColor(this.onPrimaryColor).backgroundColor(this.primaryColor)
          .onClick(() => this.onCompleteAction());
      }
    }.width('100%').height('100%').backgroundColor(this.pageBackground);
  }
}
