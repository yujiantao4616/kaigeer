import { common } from '@kit.AbilityKit';
import { media } from '@kit.MediaKit';
import { textToSpeech } from '@kit.CoreSpeechKit';
import { VoiceLanguage } from '../model/AppModel';

export type VoiceCue = 'ready' | 'tighten' | 'relax' | 'breathe' | 'finish' | 'pause';
export type CompactVoiceCue = 'ready' | 'tighten' | 'relax' | 'finish' | 'pause';
type PlaybackResult = 'played' | 'failed' | 'cancelled';

function cueText(cue: VoiceCue, language: VoiceLanguage): string {
  if (cue === 'ready') {
    return language === 'zh-CN' ? '坐在椅子前半段，双脚踩地，肩膀放松。准备让会阴前后方一起向内、向上提起，腹部和臀部放松。' : 'Sit near the front of a chair with both feet grounded and your shoulders relaxed. Prepare to lift the front and back of your pelvic floor together. Keep your belly and glutes soft.';
  }
  if (cue === 'tighten') {
    return language === 'zh-CN' ? '轻轻收紧会阴前后方，向内、向上提起。保持自然呼吸，腹部、臀部和大腿放松。' : 'Gently draw the front and back passages inward and up. Keep breathing normally, with your belly, glutes, and thighs relaxed.';
  }
  if (cue === 'relax') {
    return language === 'zh-CN' ? '完全放松会阴前后方，感受它回到自然状态，继续呼吸。' : 'Release the front and back of your pelvic floor completely. Let everything return to neutral and keep breathing.';
  }
  if (cue === 'breathe') {
    return language === 'zh-CN' ? '不要憋气。腹部、臀部和大腿保持放松，只让盆底肌工作。' : 'Do not hold your breath. Keep your belly, glutes, and thighs relaxed; let only the pelvic floor work.';
  }
  if (cue === 'finish') {
    return language === 'zh-CN' ? '本组完成，做得很好。' : 'Set complete. Nice work.';
  }
  return language === 'zh-CN' ? '已暂停。准备好后继续。' : 'Paused. Continue when you are ready.';
}

function compactCueText(cue: CompactVoiceCue, language: VoiceLanguage): string {
  if (cue === 'ready') {
    return language === 'zh-CN' ? '坐姿准备' : 'Ready';
  }
  if (cue === 'tighten') {
    return language === 'zh-CN' ? '前后提起' : 'Tighten';
  }
  if (cue === 'relax') {
    return language === 'zh-CN' ? '完全放松' : 'Relax';
  }
  if (cue === 'finish') {
    return language === 'zh-CN' ? '完成' : 'Done';
  }
  return language === 'zh-CN' ? '暂停' : 'Pause';
}

function bundledAsset(cue: VoiceCue, language: VoiceLanguage): string | undefined {
  if (language === 'en-US') {
    return `voice/${language}/${cue}.mp3`;
  }
  return undefined;
}

function bundledCountAsset(count: number, language: VoiceLanguage): string | undefined {
  if (count >= 1 && count <= 3 && language === 'en-US') {
    return `voice/${language}/count-${count}.mp3`;
  }
  return undefined;
}

function bundledCompactAsset(cue: CompactVoiceCue, language: VoiceLanguage): string | undefined {
  if (language === 'en-US') {
    return `voice/${language}/compact-${cue}.mp3`;
  }
  return undefined;
}

export class VoiceService {
  private static engine: textToSpeech.TextToSpeechEngine | undefined;
  private static activeLanguage: VoiceLanguage | undefined;
  private static activePlayer: media.AVPlayer | undefined;
  private static activePlaybackDone: (() => void) | undefined;
  private static requestSequence: number = 0;

  static async speakCue(cue: VoiceCue, language: VoiceLanguage, context?: common.UIAbilityContext): Promise<void> {
    const asset: string | undefined = bundledAsset(cue, language);
    if (asset !== undefined && context !== undefined) {
      const result: PlaybackResult = await VoiceService.playBundled(asset, context);
      if (result === 'played' || result === 'cancelled') {
        return;
      }
    }
    const text: string = cueText(cue, language);
    await VoiceService.speak(text, language);
  }

  /**
   * Plays a deliberately compact cue for sets after the first one. These cues
   * bypass the longer bundled lesson recordings and use a single short TTS
   * word/phrase, so repeated sets stay calm and unobtrusive.
   */
  static async speakCompactCue(cue: CompactVoiceCue, language: VoiceLanguage, context?: common.UIAbilityContext): Promise<void> {
    const asset: string | undefined = bundledCompactAsset(cue, language);
    if (asset !== undefined && context !== undefined) {
      const result: PlaybackResult = await VoiceService.playBundled(asset, context);
      if (result === 'played' || result === 'cancelled') {
        return;
      }
    }
    await VoiceService.speak(compactCueText(cue, language), language);
  }

  static async speakCount(count: number, language: VoiceLanguage, context?: common.UIAbilityContext): Promise<void> {
    const asset: string | undefined = bundledCountAsset(count, language);
    if (asset !== undefined && context !== undefined) {
      const result: PlaybackResult = await VoiceService.playBundled(asset, context);
      if (result === 'played' || result === 'cancelled') {
        return;
      }
    }
    const phrase: Record<VoiceLanguage, string> = {
      'zh-CN': `${count}`,
      'en-US': `${count}`
    };
    await VoiceService.speak(phrase[language], language);
  }

  static stop(): void {
    if (VoiceService.engine) {
      VoiceService.engine.stop();
    }
    if (VoiceService.activePlaybackDone) {
      const cancel: () => void = VoiceService.activePlaybackDone;
      VoiceService.activePlaybackDone = undefined;
      cancel();
    } else if (VoiceService.activePlayer) {
      const player: media.AVPlayer = VoiceService.activePlayer;
      VoiceService.activePlayer = undefined;
      player.release().catch((error: Object) => console.error(`Voice player release failed: ${JSON.stringify(error)}`));
    }
  }

  private static async playBundled(asset: string, context: common.UIAbilityContext): Promise<PlaybackResult> {
    VoiceService.stop();
    try {
      const player: media.AVPlayer = await media.createAVPlayer();
      VoiceService.activePlayer = player;
      return await new Promise<PlaybackResult>((resolve: (result: PlaybackResult) => void) => {
        let settled: boolean = false;
        const finish = (result: PlaybackResult): void => {
          if (settled) {
            return;
          }
          settled = true;
          if (VoiceService.activePlayer === player) {
            VoiceService.activePlayer = undefined;
            VoiceService.activePlaybackDone = undefined;
          }
          player.release().catch((error: Object) => console.error(`Voice player release failed: ${JSON.stringify(error)}`));
          resolve(result);
        };
        VoiceService.activePlaybackDone = (): void => finish('cancelled');
        player.on('stateChange', async (state: string, _reason: media.StateChangeReason) => {
          if (state === 'initialized') {
            try {
              await player.prepare();
            } catch (error) {
              console.error(`Voice player prepare failed: ${JSON.stringify(error)}`);
              finish('failed');
            }
          } else if (state === 'prepared') {
            try {
              await player.play();
            } catch (error) {
              console.error(`Voice player play failed: ${JSON.stringify(error)}`);
              finish('failed');
            }
          } else if (state === 'completed' || state === 'stopped' || state === 'error') {
            finish(state === 'completed' ? 'played' : 'failed');
          }
        });
        player.on('error', (_error: Object) => finish('failed'));
        context.resourceManager.getRawFd(asset).then((descriptor) => {
          player.fdSrc = descriptor;
        }).catch((error: Object) => {
          console.error(`Voice asset unavailable: ${asset} ${JSON.stringify(error)}`);
          finish('failed');
        });
      });
    } catch (error) {
      console.error(`Bundled voice unavailable for ${asset}: ${JSON.stringify(error)}`);
      return 'failed';
    }
  }

  private static async speak(text: string, language: VoiceLanguage): Promise<void> {
    try {
      const person: number = 0;
      if (!VoiceService.engine || VoiceService.activeLanguage !== language) {
        if (VoiceService.engine) {
          VoiceService.engine.shutdown();
        }
        VoiceService.engine = await textToSpeech.createEngine({
          language,
          person,
          online: 1,
          extraParams: {
            style: 'interaction-broadcast',
            locate: 'CN',
            name: 'KaigeerTraining',
            isBackStage: true
          }
        });
        VoiceService.activeLanguage = language;
        VoiceService.engine.setListener({
          onStart: (): void => {},
          onComplete: (): void => {},
          onStop: (): void => {},
          onError: (_requestId: string, code: number, message: string): void => {
            console.error(`VoiceService error ${code}: ${message}`);
          }
        });
      }
      VoiceService.requestSequence += 1;
      VoiceService.engine.speak(text, {
        requestId: `cue-${VoiceService.requestSequence}`,
        extraParams: {
          queueMode: 1,
          speed: 1,
          volume: 1,
          pitch: 1,
          languageContext: language,
          audioType: 'pcm',
          soundChannel: 3,
          playType: 1
        }
      });
    } catch (error) {
      console.error(`VoiceService unavailable for ${language}: ${JSON.stringify(error)}`);
    }
  }
}
