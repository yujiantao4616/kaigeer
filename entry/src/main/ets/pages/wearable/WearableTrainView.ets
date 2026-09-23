import { TrainingPhase } from '../../model/AppModel';
import { CircleShape } from '@kit.ArkUI';

/** Watch-only training surface. All state transitions are supplied by the
 * parent so the phone and wearable use the same training clock and records. */
@Component
export struct WearableTrainView {
  @Prop phase: TrainingPhase = 'ready';
  @Prop remaining: number = 0;
  @Prop repetition: number = 0;
  @Prop repetitions: number = 10;
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
  @Prop finishLabel: string = 'Done';
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
    // The status layout and the stop action live in separate layers. This
    // keeps the ring/content geometry stable while the page-level action is
    // placed in the lower safe area of the round screen.
    Stack({ alignContent: Alignment.Center }) {
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
              } else if (this.phase === 'complete') {
                Text('✓').fontSize(48).fontWeight(FontWeight.Bold).fontColor(this.textColor)
                  .scale({ x: this.countdownScale, y: this.countdownScale });
                Text(this.completeLabel).fontSize(16).fontWeight(FontWeight.Medium)
                  .fontColor(this.primaryColor);
              } else {
                Text(`${this.remaining}`)
                  .fontSize(48).fontWeight(FontWeight.Bold).fontColor(this.textColor)
                  .scale({ x: this.countdownScale, y: this.countdownScale });
                Text(this.secondsLabel).fontSize(11).fontColor(this.mutedColor);
              }
              // The action cue remains visible while paused so the user knows
              // exactly what will resume next.
              if (this.phase !== 'complete') {
                Text(this.phaseLabel).fontSize(16).fontWeight(FontWeight.Medium)
                  .fontColor(this.primaryColor);
              }
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
        }
          .layoutWeight(1).width('100%');
      }.width('100%').height('100%');
      if (this.paused && this.phase !== 'complete') {
        Button({ type: ButtonType.Capsule }) {
          Stack({ alignContent: Alignment.Center }) {
            Text(this.confirmStopLabel)
              .fontSize(14).fontWeight(FontWeight.Bold)
              .fontColor(this.onPrimaryColor)
              .textAlign(TextAlign.Center);
          }
            .width('100%').height('100%');
        }
          .width('82%').height(58)
          .fontColor(this.onPrimaryColor).backgroundColor(this.primaryColor)
          // Keep the CTA in the lower safe area. The circular root clips the
          // lower edge just like a watch-native bottom action.
          .position({ x: '9%', y: '80%' })
          .zIndex(10)
          .onClick(() => this.onEnd());
      } else if (this.phase === 'complete') {
        Button({ type: ButtonType.Capsule }) {
          Stack({ alignContent: Alignment.Center }) {
            Text(this.finishLabel)
              .fontSize(14).fontWeight(FontWeight.Bold)
              .fontColor(this.onPrimaryColor)
              .textAlign(TextAlign.Center);
          }
            .width('100%').height('100%');
        }
          .width('82%').height(58)
          .fontColor(this.onPrimaryColor).backgroundColor(this.primaryColor)
          .position({ x: '9%', y: '80%' })
          .zIndex(10)
          .onClick(() => this.onCompleteAction());
      }
    }
      .width('100%').height('100%')
      .backgroundColor(this.pageBackground)
      .clipShape(new CircleShape({ width: '100%', height: '100%' }));
  }
}
